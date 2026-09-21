import { useState, useEffect } from 'react'
import ArtistArtwork           from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { API, getToken }       from '../../../../utils/auth.js'
import './MarketplaceProducerOffers.css'

const STATUS_LABEL = { PENDING: 'Pendente', ACCEPTED: 'Aceite', REJECTED: 'Recusada' }
const STATUS_COLOR = {
    PENDING:  'var(--color-mustard)',
    ACCEPTED: 'var(--color-green)',
    REJECTED: '#f87171',
}

function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MarketplaceProducerOffers() {
    const [offers,  setOffers]  = useState([])
    const [loading, setLoading] = useState(true)
    const [replies, setReplies] = useState({})
    const [pending, setPending] = useState({})

    useEffect(() => {
        fetch(`${API}/api/marketplace/offers/received`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setOffers(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const respond = async (offerId, status) => {
        setPending(prev => ({ ...prev, [offerId]: true }))
        try {
            const res = await fetch(`${API}/api/marketplace/offers/${offerId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, reply: replies[offerId]?.trim() || null }),
            })
            if (res.ok) {
                const updated = await res.json()
                setOffers(prev => prev.map(o => o.id === offerId ? updated : o))
            }
        } catch (e) { console.error(e) }
        setPending(prev => ({ ...prev, [offerId]: false }))
    }

    if (loading) return <p style={{ color: 'var(--color-ink-mute)', padding: '20px 0' }}>A carregar…</p>

    if (offers.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-ink-mute)' }}>
                <p style={{ fontSize: 16, marginBottom: 6 }}>Ainda não recebeste nenhuma proposta.</p>
                <p style={{ fontSize: 13 }}>Activa a negociação nos teus beats exclusivos.</p>
            </div>
        )
    }

    return (
        <div className="mkt-prod-offers">
            {offers.map(o => (
                <div key={o.id} className="mkt-prod-offer">
                    <div className="mkt-prod-offer__top">
                        <div className="mkt-prod-offer__cover">
                            <ArtistArtwork
                                shape="circles"
                                hue={o.beatHue ?? 200}
                                image={o.beatCoverUrl}
                                rounded={0}
                                showGloss={false}
                            />
                        </div>

                        <div className="mkt-prod-offer__main">
                            <div className="mkt-prod-offer__beat">{o.beatTitle}</div>
                            <div className="mkt-prod-offer__fan">
                                de <strong>{o.fanName}</strong> <span>{o.fanHandle}</span>
                            </div>
                            {o.message && (
                                <div className="mkt-prod-offer__message">"{o.message}"</div>
                            )}
                            <div className="mkt-prod-offer__date">{formatDate(o.createdAt)}</div>
                        </div>

                        <div className="mkt-prod-offer__side">
                            <span className="mkt-prod-offer__amount">
                                €{Number(o.amount).toFixed(2)}
                            </span>
                            <span
                                className="mkt-prod-offer__status"
                                style={{ '--status-color': STATUS_COLOR[o.status] ?? 'var(--color-ink-mute)' }}
                            >
                                {STATUS_LABEL[o.status] ?? o.status}
                            </span>
                        </div>
                    </div>

                    {o.status === 'PENDING' && (
                        <div className="mkt-prod-offer__actions">
                            <textarea
                                className="mkt-prod-offer__reply-input"
                                placeholder="Mensagem de resposta (opcional)"
                                rows={2}
                                maxLength={500}
                                value={replies[o.id] ?? ''}
                                onChange={e => setReplies(prev => ({ ...prev, [o.id]: e.target.value }))}
                            />
                            <div className="mkt-prod-offer__btns">
                                <button
                                    type="button"
                                    className="mkt-prod-offer__btn mkt-prod-offer__btn--reject"
                                    disabled={pending[o.id]}
                                    onClick={() => respond(o.id, 'REJECTED')}
                                >
                                    Recusar
                                </button>
                                <button
                                    type="button"
                                    className="mkt-prod-offer__btn mkt-prod-offer__btn--accept"
                                    disabled={pending[o.id]}
                                    onClick={() => respond(o.id, 'ACCEPTED')}
                                >
                                    {pending[o.id]
                                        ? 'A processar…'
                                        : `Aceitar · €${Number(o.amount).toFixed(2)}`}
                                </button>
                            </div>
                        </div>
                    )}

                    {o.status !== 'PENDING' && o.producerReply && (
                        <div className="mkt-prod-offer__replied">
                            A tua resposta: {o.producerReply}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
