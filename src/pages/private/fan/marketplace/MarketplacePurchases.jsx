import { useState, useEffect } from 'react'
import { FaDownload }          from 'react-icons/fa'
import ArtistArtwork           from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { API, getToken }       from '../../../../utils/auth.js'

const LIC_LABELS  = { LEASE: 'Lease', PREMIUM: 'Premium', EXCLUSIVE: 'Exclusiva' }
const LIC_COLORS  = { LEASE: '#6366f1', PREMIUM: '#f59e0b', EXCLUSIVE: '#10b981' }

function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function downloadBeat(audioUrl, title) {
    try {
        const res  = await fetch(audioUrl)
        const blob = await res.blob()
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = `${title}.mp3`
        a.click()
        URL.revokeObjectURL(url)
    } catch {
        window.open(audioUrl, '_blank')
    }
}

export default function MarketplacePurchases() {
    const [purchases, setPurchases] = useState([])
    const [loading,   setLoading]   = useState(true)

    useEffect(() => {
        fetch(`${API}/api/marketplace/my-purchases`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setPurchases(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p style={{ color: 'var(--color-ink-mute)', padding: '20px 0' }}>A carregar…</p>

    if (purchases.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-ink-mute)' }}>
                <p style={{ fontSize: 16, marginBottom: 6 }}>Ainda não compraste nenhum beat.</p>
                <p style={{ fontSize: 13 }}>Explora o marketplace e adiciona ao carrinho.</p>
            </div>
        )
    }

    return (
        <div className="mkt-lib">
            <div className="mkt-lib__list">
                {purchases.map(p => (
                    <div key={p.id} className="mkt-lib__item">
                        <div className="mkt-lib__cover">
                            <ArtistArtwork
                                shape="circles"
                                hue={p.hue ?? 200}
                                image={p.coverUrl}
                                rounded={0}
                                showGloss={false}
                            />
                        </div>

                        <div className="mkt-lib__info">
                            <div className="mkt-lib__title">{p.title}</div>
                            <div className="mkt-lib__producer">{p.producer}</div>
                            {p.genre && <div className="mkt-lib__genre">{p.genre}</div>}
                        </div>

                        <span
                            className="mkt-lib__lic"
                            style={{ '--lic-color': LIC_COLORS[p.licenseType] ?? '#6366f1' }}
                        >
                            {LIC_LABELS[p.licenseType] ?? p.licenseType}
                        </span>

                        <div className="mkt-lib__meta">
                            <span className="mkt-lib__price">€{Number(p.price).toFixed(2)}</span>
                            <span className="mkt-lib__date">{formatDate(p.purchasedAt)}</span>
                        </div>

                        {p.audioUrl && (
                            <button
                                type="button"
                                className="mkt-lib__download"
                                aria-label="Descarregar beat"
                                onClick={() => downloadBeat(p.audioUrl, p.title)}
                            >
                                <FaDownload />
                                <span>Baixar</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
