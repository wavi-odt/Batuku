import { Link } from 'react-router-dom'

function fmt(n) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

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
                            <Avatar name={a.name} avatarUrl={a.avatarUrl} />
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
