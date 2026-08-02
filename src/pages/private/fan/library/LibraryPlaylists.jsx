/* ─────────────────────────────────────────────────────────────────
   LibraryPlaylists.jsx, Grelha de playlists criadas e guardadas.
   ───────────────────────────────────────────────────────────────── */

import { Link }                    from 'react-router-dom'
import { FaPlay, FaLock, FaHeart } from 'react-icons/fa'
import ArtistArtwork               from '../../../../components/PublicComponets/ArtistArtwork.jsx'

function FavoritosCard({ likedCount }) {
    return (
        <Link to="/playlists/favoritos" className="lib__pl-card lib__pl-card--fav">
            <div className="lib__pl-cover lib__pl-cover--fav">
                <FaHeart className="lib__pl-fav-icon" />
                <span className="lib__pl-play" aria-hidden="true">
                    <FaPlay size={11} />
                </span>
            </div>
            <div className="lib__pl-title">Favoritos</div>
            <div className="lib__pl-meta">
                <FaLock size={9} /> Privada · {likedCount} faixas
            </div>
        </Link>
    );
}

function PlaylistCard({ pl, savedBy }) {
    return (
        <Link to={`/playlists/${pl.id}`} className="lib__pl-card">
            <div className="lib__pl-cover">
                <ArtistArtwork shape={pl.shape} hue={pl.hue} image={pl.image} rounded={10} />
                <span className="lib__pl-play" aria-hidden="true">
                    <FaPlay size={11} />
                </span>
            </div>
            <div className="lib__pl-title">{pl.title}</div>
            <div className="lib__pl-meta">
                {savedBy
                    ? `@${savedBy} · ${pl.trackIds.length} faixas`
                    : (
                        <>
                            {!pl.isPublic && <FaLock size={9} />}
                            {pl.isPublic ? 'Pública' : 'Privada'} · {pl.trackIds.length} faixas
                        </>
                    )
                }
            </div>
        </Link>
    );
}

export default function LibraryPlaylists({ myPlaylists, savedPlaylists, likedCount }) {
    return (
        <>
            <section className="home__section">
                <div className="home__section-head">
                    <div>
                        <h2 className="home__section-title">As minhas playlists</h2>
                        <div className="home__section-sub">{myPlaylists.length + 1} playlists criadas</div>
                    </div>
                    <Link to="/playlists/new" className="home__section-link">Nova +</Link>
                </div>
                <div className="lib__playlist-grid">
                    {/* Favoritos é sempre a primeira e não pode ser eliminada */}
                    <FavoritosCard likedCount={likedCount} />
                    {myPlaylists.map(pl => (
                        <PlaylistCard key={pl.id} pl={pl} savedBy={null} />
                    ))}
                </div>
            </section>

            <section className="home__section">
                <div className="home__section-head">
                    <div>
                        <h2 className="home__section-title">Playlists guardadas</h2>
                        <div className="home__section-sub">{savedPlaylists.length} playlists de outros utilizadores</div>
                    </div>
                    <a href="#" className="home__section-link">Ver tudo →</a>
                </div>
                <div className="lib__playlist-grid">
                    {savedPlaylists.map(pl => (
                        <PlaylistCard key={pl.id} pl={pl} savedBy={pl.owner} />
                    ))}
                </div>
            </section>
        </>
    );
}
