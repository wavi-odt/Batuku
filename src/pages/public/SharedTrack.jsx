import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API } from '../../utils/auth.js'
import './SharedTrack.css'

export default function SharedTrack() {
    const { token } = useParams()
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [invalid, setInvalid] = useState(false)

    useEffect(() => {
        // Endpoint público — sem Authorization header
        fetch(`${API}/api/shared/${token}`)
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
            <div className="st">
                <p className="st__loading">A carregar…</p>
            </div>
        )
    }

    if (invalid) {
        return (
            <div className="st">
                <div className="st__center">
                    <div className="st__gone-icon">🔗</div>
                    <h1 className="st__gone-title">Link indisponível</h1>
                    <p className="st__gone-msg">Este link já não está disponível.</p>
                    <Link to="/" className="st__home-link">← Batuku</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="st">
            <div className="st__card">
                <p className="st__shared-by">
                    Partilhado por <strong>{data.sharedBy}</strong>
                </p>
                <h1 className="st__track-title">{data.title}</h1>
                {data.audioUrl ? (
                    <audio
                        controls
                        className="st__audio"
                        src={data.audioUrl}
                        preload="metadata"
                    >
                        O teu browser não suporta o elemento de áudio.
                    </audio>
                ) : (
                    <p className="st__no-audio">Áudio não disponível.</p>
                )}
                <Link to="/" className="st__footer-link">Feito com Batuku</Link>
            </div>
        </div>
    )
}
