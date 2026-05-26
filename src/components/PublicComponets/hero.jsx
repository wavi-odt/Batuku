/* ─────────────────────────────────────────────────────────────────
   Hero — Headline editorial + parede de artistas animada à direita.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'
import { ARTISTS } from '../../data/batuku.js'
import ArtistArtwork from './ArtistArtwork.jsx'
import useReveal from '../../hooks/useReveal.js'
import './hero.css'

export default function Hero() {
    const ref = useReveal();

    return (
        <section className="hero">
            <div className="hero__bg" aria-hidden="true" />
            <div className="container">
                <div ref={ref} className="hero__grid reveal">

                    <div className="hero__copy">
                        <span className="pill">
                            <span className="pill__dot" />
                            Cabo Verde · Plataforma musical
                        </span>
                        <h1 className="hero__title">
                            A casa dos artistas <span className="hero__title-accent">independentes</span> de Cabo Verde.
                        </h1>
                        <p className="hero__lede">
                            Descobre música cabo-verdiana, acompanha os teus artistas favoritos e
                            ganha pontos por cada interação. Tudo num só lugar — feito por nós, para nós.
                        </p>
                        <div className="hero__actions">
                            <Link to="/register" className="btn btn--primary">Começar grátis →</Link>
                            <a href="#demo" className="btn btn--ghost"><FaPlay size={12} /> Ver demo (2 min)</a>
                        </div>
                        <div className="hero__social">
                            <div className="hero__avatars">
                                {ARTISTS.slice(0, 4).map((a, i) => (
                                    <div key={i} className="hero__avatar">
                                        <ArtistArtwork shape={a.shape} hue={a.hue} rounded={0} showGloss={false} />
                                    </div>
                                ))}
                            </div>
                            <div className="hero__social-text">
                                <strong>1.200+ artistas</strong> já estão a publicar
                            </div>
                        </div>
                    </div>

                    <HeroWall />
                </div>
            </div>
        </section>
    );
}

function HeroWall() {
    const cols = [
        ARTISTS.slice(0, 4),
        ARTISTS.slice(2, 6),
        ARTISTS.slice(4, 8),
    ];

    return (
        <div className="hero__wall" aria-hidden="true">
            {cols.map((col, i) => (
                <div key={i} className="hero__wall-col">
                    <div className={'hero__wall-track' + (i === 1 ? ' is-reverse' : '')}>
                        {[...col, ...col].map((a, j) => (
                            <div key={j} className="hero__wall-item">
                                <ArtistArtwork shape={a.shape} hue={a.hue} name={a.name} rounded={14} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
