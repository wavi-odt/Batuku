import { useState, useRef, useEffect } from 'react'
import { API, getToken } from '../../../../utils/auth.js'

function Avatar({ name, avatarUrl }) {
    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    }
    return (
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'var(--color-ink-mute)' }}>
            {name.charAt(0).toUpperCase()}
        </div>
    )
}

export default function FollowingSuggestions({ artists, onFollowed }) {
    const [loading,   setLoading]   = useState(new Set())
    const [exitingId, setExitingId] = useState(null)
    const [ready,     setReady]     = useState(false)
    const seenIds = useRef(new Set())

    // Aguarda um tick antes de activar animações de entrada,
    // para os itens iniciais não animarem ao montar.
    useEffect(() => {
        const t = setTimeout(() => setReady(true), 60)
        return () => clearTimeout(t)
    }, [])

    const visible = artists.slice(0, 5)

    // Regista os ids já vistos depois de cada render.
    useEffect(() => {
        visible.forEach(a => seenIds.current.add(a.id))
    })

    async function handleFollow(a) {
        if (loading.has(a.id) || exitingId != null) return
        setLoading(prev => new Set([...prev, a.id]))
        try {
            const res = await fetch(`${API}/api/artist-follows/${a.id}`, {
                method:  'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (res.ok) {
                setExitingId(a.id)
                setTimeout(() => {
                    setExitingId(null)
                    onFollowed(a.id)
                }, 350)
            }
        } finally {
            setLoading(prev => { const s = new Set(prev); s.delete(a.id); return s })
        }
    }

    return (
        <div className="flw__suggest-card">
            <div className="flw__roster-head">
                <span className="flw__roster-heading">Podes também gostar de</span>
            </div>

            <div className="flw__suggest-list">
                {visible.map(a => {
                    const isExiting  = exitingId === a.id
                    const isEntering = ready && !seenIds.current.has(a.id)
                    const cls = [
                        'flw__suggest-row',
                        isExiting  ? 'flw__suggest-row--exit'  : '',
                        isEntering ? 'flw__suggest-row--enter' : '',
                    ].filter(Boolean).join(' ')

                    return (
                        <div key={a.id} className={cls}>
                            <div className="flw__suggest-avatar">
                                <Avatar name={a.name} avatarUrl={a.avatarUrl} />
                            </div>
                            <div className="flw__suggest-info">
                                <div className="flw__suggest-name">{a.name}</div>
                                <div className="flw__suggest-reason">{a.genre ?? 'Artista'}</div>
                            </div>
                            <button
                                type="button"
                                className={`flw__suggest-btn${isExiting ? ' flw__suggest-btn--following' : ''}`}
                                disabled={loading.has(a.id) || exitingId != null}
                                onClick={() => handleFollow(a)}
                            >
                                {loading.has(a.id) ? '…' : '+ Seguir'}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
