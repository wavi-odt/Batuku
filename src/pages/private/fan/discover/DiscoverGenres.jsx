/* ─────────────────────────────────────────────────────────────────
   DiscoverGenres.jsx, Grelha de géneros musicais cabo-verdianos.
   ───────────────────────────────────────────────────────────────── */

export default function DiscoverGenres({ genres }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Géneros</h2>
                    <div className="home__section-sub">Explora a música de Cabo Verde por estilo</div>
                </div>
            </div>

            <div className="disc__genres">
                {genres.map(g => (
                    <button
                        key={g.id}
                        type="button"
                        className="disc__genre"
                        style={{ '--genre-hue': g.hue }}
                    >
                        <span className="disc__genre-name">{g.label}</span>
                        <span className="disc__genre-count">{g.tracks.toLocaleString('pt-PT')} faixas</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
