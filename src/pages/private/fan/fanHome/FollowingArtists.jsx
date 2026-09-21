import { Link }       from 'react-router-dom'
import './FollowingArtists.css'

function Avatar({ name, avatarUrl }) {
    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    }
    return (
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'var(--color-ink-mute)' }}>
            {name.charAt(0).toUpperCase()}
        </div>
    )
}

export default function FollowingArtists({ artists }) {
    return (
        <div>
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Quem segues</h2>
                    <div className="home__section-sub">
                        {artists.length} {artists.length === 1 ? 'artista' : 'artistas'}
                    </div>
                </div>
                <Link to="/following" className="home__section-link">Ver novidades →</Link>
            </div>

            <div className="following">
                {artists.map(a => (
                    <Link key={a.id} to={`/artists/${a.id}`} className="follow-card" style={{ textDecoration: 'none' }}>
                        <div className="follow-card__avatar">
                            <Avatar name={a.name} avatarUrl={a.avatarUrl} />
                        </div>
                        <div className="follow-card__name">{a.name}</div>
                        <div className="follow-card__genre">{a.genre ?? 'Artista'}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
