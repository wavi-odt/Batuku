import { useState, useEffect } from 'react'
import ArtistArtwork           from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { API, getToken }       from '../../../../utils/auth.js'
import './MarketplaceOffers.css'

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

export default function MarketplaceOffers() {
    const [offers,  setOffers]  = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API}/api/marketplace/offers/mine`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setOffers(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p style={{ color: 'var(--color-ink-mute)', padding: '20px 0' }}>A carregar…</p>

    if (offers.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-ink-mute)' }}>
                <p style={{ fontSize: 16, marginBottom: 6 }}>Ainda não fizeste nenhuma proposta.</p>
                <p style={{ fontSize: 13 }}>Explora beats com licença exclusiva negociável.</p>
            </div>
        )
    }

    return (
        <div className="mkt-offers">
            {offers.map(o => (
                <div key={o.id} className="mkt-offers__item">
                    <div className="mkt-offers__cover">
                        <ArtistArtwork
                            shape="circles"
                            hue={o.beatHue ?? 200}
                            image={o.beatCoverUrl}
                            rounded={0}
                            showGloss={false}
                        />
                    </div>

                    <div className="mkt-offers__info">
                        <div className="mkt-offers__beat-title">{o.beatTitle}</div>
                        <div className="mkt-offers__producer">{o.producerName}</div>
                        <div className="mkt-offers__date">{formatDate(o.createdAt)}</div>
                    </div>

                    <div className="mkt-offers__amount">
                        <span className="mkt-offers__amount-val">€{Number(o.amount).toFixed(2)}</span>
                        <span className="mkt-offers__amount-label">proposta</span>
                    </div>

                    <span
                        className="mkt-offers__status"
                        style={{ '--status-color': STATUS_COLOR[o.status] ?? 'var(--color-ink-mute)' }}
                    >
                        {STATUS_LABEL[o.status] ?? o.status}
                    </span>

                    {o.producerReply && (
                        <div className={`mkt-offers__reply${o.status === 'ACCEPTED' ? ' mkt-offers__reply--ok' : ''}`}>
                            <span className="mkt-offers__reply-label">Produtor:</span> {o.producerReply}
                        </div>
                    )}
                    {o.status === 'ACCEPTED' && !o.producerReply && (
                        <div className="mkt-offers__reply mkt-offers__reply--ok">
                            Beat adquirido — podes vê-lo em Minhas Compras.
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
