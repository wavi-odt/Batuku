import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import UserAvatar from '../../../../components/UserAvatar.jsx'

function ArtistCard({ a }) {
    return (
        <Link to={`/artists/${a.id}`} className="lib__artist-card">
            <div className="lib__artist-avatar">
                <UserAvatar name={a.name} imageUrl={a.avatarUrl} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="lib__artist-name">{a.name}</div>
            {a.genre && <div className="lib__artist-genre">{a.genre}</div>}
            <div className="lib__artist-followers">
                {(a.followerCount ?? 0).toLocaleString('pt-PT')} seguidores
            </div>
        </Link>
    )
}

export default function LibraryArtists({ artists, loading }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Artistas seguidos</h2>
                    <div className="home__section-sub">
                        {loading ? '…' : `${artists.length} ${artists.length === 1 ? 'artista' : 'artistas'}`}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="lib__tracks-empty">A carregar artistas…</div>
            ) : artists.length === 0 ? (
                <div className="lib__saved-empty">
                    <FaUser size={18} />
                    <span>Ainda não segues nenhum artista.</span>
                </div>
            ) : (
                <div className="lib__artist-grid">
                    {artists.map(a => (
                        <ArtistCard key={a.id} a={a} />
                    ))}
                </div>
            )}
        </section>
    )
}
