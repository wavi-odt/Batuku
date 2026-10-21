import { Link } from 'react-router-dom'
import UserAvatar from '../../../../components/UserAvatar.jsx'

function fmt(n) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

export default function FollowingRoster({ artists }) {
    if (artists.length === 0) {
        return (
            <div className="flw__roster-card">
                <div className="flw__roster-head">
                    <span className="flw__roster-heading">Artistas que segues</span>
                    <span className="flw__roster-count">0</span>
                </div>
                <p style={{ padding: '12px 0', color: 'var(--color-ink-mute)', fontSize: 13 }}>
                    Ainda não segues nenhum artista.
                </p>
            </div>
        )
    }

    return (
        <div className="flw__roster-card">
            <div className="flw__roster-head">
                <span className="flw__roster-heading">Artistas que segues</span>
                <span className="flw__roster-count">{artists.length}</span>
            </div>

            <div className="flw__roster-list">
                {artists.slice(0, 5).map(a => (
                    <Link key={a.id} to={`/artists/${a.id}`} className="flw__roster-row" style={{ textDecoration: 'none' }}>
                        <div className="flw__roster-avatar">
                            <UserAvatar name={a.name} imageUrl={a.avatarUrl} style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div className="flw__roster-info">
                            <div className="flw__roster-name">{a.name}</div>
                            <div className="flw__roster-genre">{a.genre ?? 'Artista'} · {fmt(a.followerCount)} seg.</div>
                        </div>
                    </Link>
                ))}
            </div>

            <Link to="/library?filter=artists" className="flw__roster-manage">Gerir artistas →</Link>
        </div>
    )
}
