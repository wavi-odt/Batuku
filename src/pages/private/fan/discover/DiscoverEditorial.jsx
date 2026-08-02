/* ─────────────────────────────────────────────────────────────────
   DiscoverEditorial.jsx, Playlists editoriais curadas pelo Batuku.
   ───────────────────────────────────────────────────────────────── */

import { Link }    from 'react-router-dom'
import { FaPlay }  from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

export default function DiscoverEditorial({ playlists }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Playlists do Batuku</h2>
                    <div className="home__section-sub">Curadoria da equipa editorial</div>
                </div>
                <a href="#" className="home__section-link">Ver todas →</a>
            </div>

            <div className="disc__editorial">
                {playlists.map(pl => (
                    <Link key={pl.id} to={`/playlists/${pl.id}`} className="disc__ed-card">
                        <div className="disc__ed-cover">
                            <ArtistArtwork shape={pl.shape} hue={pl.hue} image={pl.image} rounded={12} />
                            <span className="lib__pl-play" aria-hidden="true">
                                <FaPlay size={11} />
                            </span>
                        </div>
                        <div className="disc__ed-info">
                            <div className="disc__ed-title">{pl.title}</div>
                            <div className="disc__ed-desc">{pl.description}</div>
                            <div className="disc__ed-meta">{pl.tracks} faixas · {pl.updatedAt}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
