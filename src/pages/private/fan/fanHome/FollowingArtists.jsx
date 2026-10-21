import { Link }       from 'react-router-dom'
import UserAvatar     from '../../../../components/UserAvatar.jsx'
import './FollowingArtists.css'

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
                            <UserAvatar name={a.name} imageUrl={a.avatarUrl} style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div className="follow-card__name">{a.name}</div>
                        <div className="follow-card__genre">{a.genre ?? 'Artista'}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
