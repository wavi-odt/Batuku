import { useState, useEffect }  from 'react'
import { useLocation, Link } from 'react-router-dom'
import AppShell           from '../../../../components/HomeComponents/AppShell.jsx'
import { API, getToken }  from '../../../../utils/auth.js'
import { useCurrentUser } from '../../../../hooks/useCurrentUser.js'
import { useToast }       from '../../../../context/ToastContext.jsx'
import ContinueListening  from './ContinueListening.jsx'
import FollowingArtists   from './FollowingArtists.jsx'
import LevelCard          from './LevelCard.jsx'
import './Home.css'
import './LevelCard.css'

function greeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
}

export default function Home() {
    const { user: realUser, isLoading: userLoading } = useCurrentUser()
    const { showToast } = useToast()
    const location  = useLocation()
    const firstName = (realUser?.name || 'Utilizador').split(' ')[0]

    useEffect(() => {
        if (location.state?.notice) {
            showToast(location.state.notice, 'info')
            window.history.replaceState({}, '')
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const [recentTracks,    setRecentTracks]    = useState([])
    const [followedArtists, setFollowedArtists] = useState([])
    const [gamification,    setGamification]    = useState(null)
    const [loading,         setLoading]         = useState(true)

    useEffect(() => {
        const headers = { Authorization: `Bearer ${getToken()}` }
        Promise.all([
            fetch(`${API}/api/users/me/recently-played`, { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/artist-follows/my`,        { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/gamification/me`,          { headers }).then(r => r.ok ? r.json() : null),
        ]).then(([tracks, artists, gami]) => {
            setRecentTracks(Array.isArray(tracks)   ? tracks   : [])
            setFollowedArtists(Array.isArray(artists) ? artists : [])
            setGamification(gami)
        }).catch(console.error)
          .finally(() => setLoading(false))
    }, [])

    return (
        <AppShell role="fan">

            {/* ─── Greeting ──────────────────────────────────────── */}
            <div className="home__greet">
                <div className="home__hello">
                    <h1 className="home__hello-title">{greeting()}, {firstName}.</h1>
                    {followedArtists.length > 0 && (
                        <p className="home__hello-sub">
                            Segues <strong>{followedArtists.length} artistas</strong>.
                            Vai à página <Link to="/following" style={{ color: 'var(--color-coral)', textDecoration: 'none' }}>A seguir</Link> para ver novidades.
                        </p>
                    )}
                </div>

                {gamification && (
                    <LevelCard user={{
                        level:      gamification.level,
                        points:     gamification.totalPoints,
                        nextLevelAt: gamification.totalPoints + (gamification.pointsToNextLevel || 0),
                        rank:       gamification.rank,
                        badges:     (gamification.badges ?? []).length,
                        following:  followedArtists.length,
                    }} />
                )}
            </div>

            {/* ─── Ouvido recentemente ────────────────────────────── */}
            {!loading && recentTracks.length > 0 && (
                <ContinueListening tracks={recentTracks} />
            )}

            {/* ─── Artistas seguidos ──────────────────────────────── */}
            {!loading && followedArtists.length > 0 && (
                <section className="home__section">
                    <FollowingArtists artists={followedArtists} />
                </section>
            )}

            {/* ─── Sem dados ainda ─────────────────────────────────── */}
            {!loading && recentTracks.length === 0 && followedArtists.length === 0 && (
                <div style={{ padding: '40px 0', color: 'var(--color-ink-mute)', textAlign: 'center' }}>
                    <p style={{ fontSize: 16, marginBottom: 8 }}>Ainda não há actividade</p>
                    <p style={{ fontSize: 13, marginBottom: 24 }}>Descobre artistas e começa a ouvir música.</p>
                    <a href="/discover" className="btn btn--primary">Descobrir</a>
                </div>
            )}


        </AppShell>
    )
}
