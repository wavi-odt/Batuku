/* ─────────────────────────────────────────────────────────────────
   Hero, Headline editorial + parede de artistas animada à direita.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ArtistArtwork from './ArtistArtwork.jsx'
import useReveal from '../../hooks/useReveal.js'
import './hero.css'

const SHAPE_KEYS = ['circles', 'arch', 'stripes', 'split', 'orbit', 'wave', 'sun', 'triangles'];

function strHash(s) {
    let h = 0;
    for (const c of s) h = ((h * 31) + c.charCodeAt(0)) >>> 0;
    return h;
}

function artistToProps(artist) {
    const h = strHash(artist.name);
    return { hue: h % 360, shape: SHAPE_KEYS[h % SHAPE_KEYS.length] };
}

export default function Hero() {
    const [artists, setArtists] = useState(null); // null = a carregar
    const ref = useReveal();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/artists/hero`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setArtists(Array.isArray(data) && data.length >= 3 ? data : []))
            .catch(() => setArtists([]));
    }, []);

    const hasWall = artists && artists.length >= 3;

    return (
        <section className="hero">
            <div className="hero__bg" aria-hidden="true" />
            <div className="container">
                <div ref={ref} className={`hero__grid reveal${hasWall ? '' : ' hero__grid--full'}`}>

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
                            ganha pontos por cada interação. Tudo num só lugar, feito por nós, para nós.
                        </p>
                        <div className="hero__actions">
                            <Link to="/register" className="btn btn--primary">Começar grátis →</Link>
                        </div>
                    </div>

                    {hasWall && <HeroWall artists={artists} />}
                </div>
            </div>
        </section>
    );
}

function HeroWall({ artists }) {
    const cols = [
        artists.slice(0, 4),
        artists.slice(2, 6),
        artists.slice(4, 8),
    ];

    return (
        <div className="hero__wall" aria-hidden="true">
            {cols.map((col, i) => (
                <div key={i} className="hero__wall-col">
                    <div className={'hero__wall-track' + (i === 1 ? ' is-reverse' : '')}>
                        {[...col, ...col].map((a, j) => (
                            <div key={j} className="hero__wall-item">
                                <ArtistArtwork
                                    {...artistToProps(a)}
                                    image={a.imageUrl || null}
                                    name={a.name}
                                    rounded={14}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
