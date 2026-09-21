import { useState, useEffect }  from 'react'
import AppShell           from '../../../../components/HomeComponents/AppShell.jsx'
import { API, getToken }  from '../../../../utils/auth.js'
import { useCurrentUser } from '../../../../hooks/useCurrentUser.js'
import BecomeArtistBanner from './BecomeArtistBanner.jsx'
import ContinueListening  from './ContinueListening.jsx'
import FollowingArtists   from './FollowingArtists.jsx'
import DiscordCard        from './DiscordCard.jsx'
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
    const realUser = useCurrentUser()
    const firstName = (realUser?.name || 'Utilizador').split(' ')[0]

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
                            Vai à página <a href="/following" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>A seguir</a> para ver novidades.
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

            {/* ─── Banner: tornar-se artista verificado ──────────── */}
            <BecomeArtistBanner />

            {/* ─── Ouvido recentemente ────────────────────────────── */}
            {!loading && recentTracks.length > 0 && (
                <ContinueListening tracks={recentTracks} />
            )}

            {/* ─── Artistas seguidos + Discord ────────────────────── */}
            {!loading && followedArtists.length > 0 && (
                <section className="home__section">
                    <div className="home__split">
                        <FollowingArtists artists={followedArtists} />
                        <div className="home__side">
                            <DiscordCard />
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Sem dados ainda ─────────────────────────────────── */}
            {!loading && recentTracks.length === 0 && followedArtists.length === 0 && (
                <div style={{ padding: '40px 0', color: 'var(--color-ink-mute)', textAlign: 'center' }}>
                    <p style={{ fontSize: 16, marginBottom: 8 }}>Ainda não há actividade</p>
                    <p style={{ fontSize: 13 }}>Descobre artistas e começa a ouvir música.</p>
                </div>
            )}

            {!loading && followedArtists.length === 0 && (
                <div className="home__side" style={{ maxWidth: 400 }}>
                    <DiscordCard />
                </div>
            )}

        </AppShell>
    )
}
