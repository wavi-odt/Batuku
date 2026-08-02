/* ─────────────────────────────────────────────────────────────────
   DiscoverSpotlight.jsx, Artistas em destaque para descobrir.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

function fmt(n) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
}

export default function DiscoverSpotlight({ artists }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Artistas em destaque</h2>
                    <div className="home__section-sub">Descobre novos artistas cabo-verdianos</div>
                </div>
            </div>

            <div className="disc__spotlight">
                {artists.map((a, i) => (
                    <button key={i} type="button" className="disc__spot-card">
                        <div className="disc__spot-avatar">
                            <ArtistArtwork shape={a.shape} hue={a.hue} image={a.image} rounded={0} />
                        </div>
                        <div className="disc__spot-name">
                            {a.name}
                            {a.isVerified && <span className="disc__spot-tick" title="Verificado">✓</span>}
                        </div>
                        <div className="disc__spot-genre">{a.genre}</div>
                        <div className="disc__spot-listeners">{fmt(a.listeners)} ouvintes</div>
                        {a.newRelease
                            ? <span className="disc__spot-new">↳ {a.newRelease}</span>
                            : <span className="disc__spot-gap" />
                        }
                        <button type="button" className="btn btn--ghost btn--sm disc__spot-follow">
                            Seguir
                        </button>
                    </button>
                ))}
            </div>
        </section>
    );
}
