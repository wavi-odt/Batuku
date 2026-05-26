/* ─────────────────────────────────────────────────────────────────
   Artists — Grelha 4×2 com artistas em destaque.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { ARTISTS } from '../../data/batuku.js'
import ArtistArtwork from './ArtistArtwork.jsx'
import useReveal from '../../hooks/useReveal.js'
import './artists.css'

export default function Artists() {
    const ref = useReveal();
    return (
        <section className="artists section" id="artistas">
            <div className="container" ref={ref}>
                <div className="artists__head reveal">
                    <div>
                        <div className="label-eyebrow">Artistas em destaque</div>
                        <h2 className="artists__title">Descobre talentos cabo-verdianos.</h2>
                    </div>
                    <Link to="/artists" className="btn btn--ghost btn--sm">Ver todos →</Link>
                </div>

                <div className="artists__grid reveal">
                    {ARTISTS.map((a, i) => (
                        <Link key={i} to={`/artist/${i}`} className="artists__card">
                            <ArtistArtwork shape={a.shape} hue={a.hue} rounded={14} />
                            <div className="artists__meta">
                                <div>
                                    <div className="artists__name">{a.name}</div>
                                    <div className="artists__sub">{a.city} · {a.genre}</div>
                                </div>
                                <FaHeart className="artists__heart" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
