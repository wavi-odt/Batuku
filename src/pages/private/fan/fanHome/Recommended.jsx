/* ─────────────────────────────────────────────────────────────────
   Recommended.jsx — Faixas recomendadas pela IA (com motivo).
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import './Recommended.css'

export default function Recommended({ tracks }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">
                        Recomendado para ti
                        <span className="home__ai-badge">IA</span>
                    </h2>
                    <div className="home__section-sub">Curadoria com base no que ouves</div>
                </div>
                <a href="#" className="home__section-link">Atualizar →</a>
            </div>

            <div className="reco">
                {tracks.map((t, i) => (
                    <button key={i} type="button" className="reco__card">
                        <ArtistArtwork shape={t.shape} hue={t.hue} rounded={10} />
                        <div>
                            <h3 className="reco__title">{t.title}</h3>
                            <div className="reco__artist">{t.artist}</div>
                        </div>
                        <div className="reco__reason">↳ {t.reason}</div>
                    </button>
                ))}
            </div>
        </section>
    );
}
