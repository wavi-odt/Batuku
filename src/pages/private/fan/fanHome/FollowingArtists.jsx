/* ─────────────────────────────────────────────────────────────────
   FollowingArtists.jsx, Grelha dos artistas que o fã segue.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { ARTISTS } from '../../../../data/batuku.js'
import './FollowingArtists.css'

const IMG_BY_NAME = Object.fromEntries(ARTISTS.map(a => [a.name, a.image]));

export default function FollowingArtists({ artists, followingCount }) {
    return (
        <div>
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Quem segues</h2>
                    <div className="home__section-sub">
                        {followingCount} artistas · novos lançamentos esta semana
                    </div>
                </div>
                <a href="#" className="home__section-link">Gerir →</a>
            </div>

            <div className="following">
                {artists.map((a, i) => (
                    <button key={i} type="button" className="follow-card">
                        <div className="follow-card__avatar">
                            <ArtistArtwork shape={a.shape} hue={a.hue} image={IMG_BY_NAME[a.name]} rounded={0} />
                            {a.isLive && <span className="follow-card__live">● Ao vivo</span>}
                        </div>
                        <div className="follow-card__name">{a.name}</div>
                        <div className="follow-card__genre">{a.genre}</div>
                        {a.newTracks > 0
                            ? <span className="follow-card__new">+{a.newTracks} novas</span>
                            : <span className="follow-card__none">Sem novidades</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}
