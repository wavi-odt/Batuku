/* ─────────────────────────────────────────────────────────────────
   ContinueListening.jsx — Carrossel das faixas onde o fã parou.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import './ContinueListening.css'

export default function ContinueListening({ tracks }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Continua a ouvir</h2>
                    <div className="home__section-sub">Faixas onde paraste</div>
                </div>
                <a href="#" className="home__section-link">Ver tudo →</a>
            </div>

            <div className="continue">
                {tracks.map((t, i) => (
                    <button key={i} type="button" className="track-card">
                        <div className="track-card__cover">
                            <ArtistArtwork shape={t.shape} hue={t.hue} rounded={10} />
                            <span className="track-card__play" aria-hidden="true">
                                <FaPlay size={12} />
                            </span>
                        </div>
                        <div className="track-card__title">{t.title}</div>
                        <div className="track-card__artist">{t.artist}</div>
                        <div className="track-card__progress">
                            <div className="track-card__progress-fill"
                                 style={{ width: `${t.progress}%` }} />
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
