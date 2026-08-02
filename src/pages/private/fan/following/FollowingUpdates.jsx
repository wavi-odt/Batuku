/* ─────────────────────────────────────────────────────────────────
   FollowingUpdates.jsx, Novos lançamentos dos artistas que segues.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

export default function FollowingUpdates({ releases }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Novidades</h2>
                    <div className="home__section-sub">O que saiu recentemente de quem segues</div>
                </div>
                <a href="#" className="home__section-link">Ver tudo →</a>
            </div>

            <div className="continue">
                {releases.map(r => (
                    <button key={r.id} type="button" className="track-card">
                        <div className="track-card__cover">
                            <ArtistArtwork shape={r.shape} hue={r.hue} image={r.image} rounded={10} />
                            <span className="track-card__play" aria-hidden="true">
                                <FaPlay size={12} />
                            </span>
                            <span className="flw__update-type">{r.type}</span>
                        </div>
                        <div className="track-card__title">{r.title}</div>
                        <div className="track-card__artist">{r.artist}</div>
                        <div className="flw__update-time">{r.timeAgo}</div>
                    </button>
                ))}
            </div>
        </section>
    );
}
