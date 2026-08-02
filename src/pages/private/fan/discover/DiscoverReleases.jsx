/* ─────────────────────────────────────────────────────────────────
   DiscoverReleases.jsx, Novos lançamentos recentes.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

function daysLabel(n) {
    if (n <= 1) return 'Hoje';
    if (n < 7)  return `Há ${n} dias`;
    return `Há ${Math.floor(n / 7)} semana${n >= 14 ? 's' : ''}`;
}

export default function DiscoverReleases({ releases }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Novos lançamentos</h2>
                    <div className="home__section-sub">O que saiu recentemente em Cabo Verde</div>
                </div>
                <a href="#" className="home__section-link">Ver tudo →</a>
            </div>

            <div className="disc__releases">
                {releases.map(r => (
                    <button key={r.id} type="button" className="track-card">
                        <div className="track-card__cover">
                            <ArtistArtwork shape={r.shape} hue={r.hue} image={r.image} rounded={10} />
                            <span className="track-card__play" aria-hidden="true">
                                <FaPlay size={12} />
                            </span>
                            <span className="disc__release-badge">{r.type}</span>
                        </div>
                        <div className="track-card__title">{r.title}</div>
                        <div className="track-card__artist">{r.artist}</div>
                        <div className="disc__release-date">{daysLabel(r.daysAgo)}</div>
                    </button>
                ))}
            </div>
        </section>
    );
}
