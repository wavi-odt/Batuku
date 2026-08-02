/* ─────────────────────────────────────────────────────────────────
   LibraryArtists.jsx, Grelha de artistas seguidos pelo fã.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

export default function LibraryArtists({ artists }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Artistas seguidos</h2>
                    <div className="home__section-sub">{artists.length} artistas</div>
                </div>
                <a href="/following" className="home__section-link">Gerir →</a>
            </div>

            <div className="lib__artist-grid">
                {artists.map((a, i) => (
                    <button key={i} type="button" className="lib__artist-card">
                        <div className="lib__artist-avatar">
                            <ArtistArtwork shape={a.shape} hue={a.hue} image={a.image} rounded={0} />
                            {a.isLive && <span className="follow-card__live">● Ao vivo</span>}
                        </div>
                        <div className="lib__artist-name">{a.name}</div>
                        <div className="lib__artist-genre">{a.genre}</div>
                        <div className="lib__artist-followers">
                            {a.followers.toLocaleString('pt-PT')} seguidores
                        </div>
                        {a.newTracks > 0
                            ? <span className="follow-card__new">+{a.newTracks} novas</span>
                            : <span className="lib__artist-nonew">Sem novidades</span>
                        }
                    </button>
                ))}
            </div>
        </section>
    );
}
