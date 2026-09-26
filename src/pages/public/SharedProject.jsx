import { useState, useEffect } from 'react'
import { useParams, Link }    from 'react-router-dom'
import { API }                from '../../utils/auth.js'
import './SharedProject.css'

export default function SharedProject() {
    const { token } = useParams()
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [invalid, setInvalid] = useState(false)

    useEffect(() => {
        // Endpoint público, sem Authorization header
        fetch(`${API}/api/shared-project/${token}`)
            .then(r => {
                if (r.status === 404 || r.status === 410) return null
                if (!r.ok) return null
                return r.json()
            })
            .then(d => {
                if (!d) setInvalid(true)
                else    setData(d)
            })
            .catch(() => setInvalid(true))
            .finally(() => setLoading(false))
    }, [token])

    if (loading) {
        return (
            <div className="sp">
                <p className="sp__loading">A carregar…</p>
            </div>
        )
    }

    if (invalid) {
        return (
            <div className="sp">
                <div className="sp__invalid">
                    <div className="sp__invalid-icon">🔗</div>
                    <h1 className="sp__invalid-title">Link indisponível</h1>
                    <p className="sp__invalid-msg">Este link já não está disponível.</p>
                    <Link to="/" className="sp__home-link">← Batuku</Link>
                </div>
            </div>
        )
    }

    const tracks = Array.isArray(data.tracks) ? data.tracks : []

    return (
        <div className="sp">
            <div className="sp__page">

                {/* ─── Hero ──────────────────────────────────────── */}
                <div className="sp__hero">
                    <div className="sp__cover-wrap">
                        {data.coverUrl
                            ? <img src={data.coverUrl} alt={data.name} className="sp__cover" />
                            : <div className="sp__cover sp__cover--empty">◈</div>
                        }
                    </div>
                    <div className="sp__hero-info">
                        <span className="sp__label">Projeto partilhado por</span>
                        <p className="sp__sharedby">{data.sharedBy}</p>
                        <h1 className="sp__title">{data.name}</h1>
                        <p className="sp__track-count">
                            {tracks.length} {tracks.length === 1 ? 'faixa' : 'faixas'}
                        </p>
                    </div>
                </div>

                {/* ─── Track list ─────────────────────────────────── */}
                <div className="sp__tracks">
                    {tracks.length === 0 && (
                        <p className="sp__empty">Este projeto ainda não tem faixas.</p>
                    )}
                    {tracks.map((track, idx) => (
                        <div key={track.id ?? idx} className="sp__track">
                            <span className="sp__track-num">{String(idx + 1).padStart(2, '0')}</span>
                            <div className="sp__track-main">
                                <span className="sp__track-title">{track.title}</span>
                                {track.audioUrl
                                    ? <audio controls className="sp__audio" src={track.audioUrl} preload="metadata" />
                                    : <p className="sp__no-audio">Áudio não disponível.</p>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── Footer ─────────────────────────────────────── */}
                <Link to="/" className="sp__footer-link">Feito com Batuku</Link>
            </div>
        </div>
    )
}
