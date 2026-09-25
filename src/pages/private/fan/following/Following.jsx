import { useState, useEffect } from 'react'
import AppShell             from '../../../../components/HomeComponents/AppShell.jsx'
import { API, getToken }    from '../../../../utils/auth.js'
import { useNotifications } from '../../../../context/NotificationsContext.jsx'
import FollowingUpdates     from './FollowingUpdates.jsx'
import FollowingFeed        from './FollowingFeed.jsx'
import FollowingRoster      from './FollowingRoster.jsx'
import FollowingSuggestions from './FollowingSuggestions.jsx'
import FollowingSpotlight   from './FollowingSpotlight.jsx'
import '../fanHome/ContinueListening.css'
import './Following.css'

export default function Following() {
    const [roster,      setRoster]      = useState([])
    const [tracks,      setTracks]      = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [loading,     setLoading]     = useState(true)
    const { clearRouteNotifications } = useNotifications()

    useEffect(() => { clearRouteNotifications('/following') }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const headers = { Authorization: `Bearer ${getToken()}` }
        Promise.all([
            fetch(`${API}/api/artist-follows/my`,  { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/tracks/following`,   { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/artists/suggested`,  { headers }).then(r => r.ok ? r.json() : []),
        ]).then(([artistData, trackData, suggestData]) => {
            setRoster(Array.isArray(artistData)   ? artistData   : [])
            setTracks(Array.isArray(trackData)    ? trackData    : [])
            setSuggestions(Array.isArray(suggestData) ? suggestData : [])
        }).catch(console.error)
          .finally(() => setLoading(false))
    }, [])

    function handleFollowed(artistId) {
        setSuggestions(prev => prev.filter(a => a.id !== artistId))
    }

    if (loading) {
        return (
            <AppShell role="fan">
                <div style={{ padding: 40, color: 'var(--color-ink-mute)' }}>A carregar…</div>
            </AppShell>
        )
    }

    return (
        <AppShell role="fan">
            <div className="flw__page">

                {/* ─── Coluna principal (scroll) ────────────────────── */}
                <div className="flw__main">
                    {tracks.length > 0 && <FollowingUpdates tracks={tracks} />}

                    <section className="home__section">
                        {tracks.length > 0
                            ? <FollowingFeed tracks={tracks} />
                            : (
                                <div className="flw__empty">
                                    <p className="flw__empty-title">Sem novidades ainda</p>
                                    <p className="flw__empty-sub">
                                        {roster.length === 0
                                            ? 'Segue artistas para ver as novidades deles aqui.'
                                            : 'Os artistas que segues ainda não publicaram faixas.'}
                                    </p>
                                </div>
                            )
                        }
                    </section>
                </div>

                {/* ─── Sidebar fixa (direita) ───────────────────────── */}
                <aside className="flw__sidebar">
                    <FollowingRoster artists={roster} />
                    {suggestions.length > 0 && (
                        <FollowingSuggestions
                            artists={suggestions}
                            onFollowed={handleFollowed}
                        />
                    )}
                    <FollowingSpotlight
                        track={tracks.length > 0
                            ? [...tracks].sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0))[0]
                            : null}
                        roster={roster}
                    />
                </aside>

            </div>
        </AppShell>
    )
}
