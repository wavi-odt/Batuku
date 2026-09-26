/* ─────────────────────────────────────────────────────────────────
   AuthSide, Coluna esquerda partilhada nas páginas de auth.
   Mostra um painel visual com headline + paredeo de capas + citação.
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArtistArtwork from '../PublicComponets/ArtistArtwork.jsx'
import logo from '../../assets/batuku.png'
import './auth.css'

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

export default function AuthSide({ title, accent, lede, page }) {
    const [artists, setArtists] = useState(null);
    const [quote, setQuote]     = useState(null); // null = a carregar, false = sem quote

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/artists/hero`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setArtists(Array.isArray(data) && data.length >= 3 ? data : []))
            .catch(() => setArtists([]));

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/auth-quote/${page}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => setQuote(data || false))
            .catch(() => setQuote(false));
    }, [page]);

    const hasWall = artists && artists.length >= 3;

    const cols = hasWall ? [
        artists.slice(0, 4),
        artists.slice(2, 6),
        artists.slice(4, 8),
    ] : [];

    return (
        <aside className="auth__side" aria-hidden="false">

            {hasWall && (
                <div className="auth__side-grid" aria-hidden="true">
                    {cols.map((col, i) => (
                        <div key={i} className="auth__side-col">
                            <div className={'auth__side-col-track' + (i === 1 ? ' is-reverse' : '')}>
                                {[...col, ...col].map((a, j) => (
                                    <ArtistArtwork
                                        key={j}
                                        {...artistToProps(a)}
                                        image={a.imageUrl || null}
                                        rounded={12}
                                        showGloss={false}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="auth__side-content">
                <Link to="/" className="auth__brand">
                    <img src={logo} alt="" />
                    <span>Batuku</span>
                </Link>
                <h2 className="auth__side-title">
                    {title} <span className="auth__side-title-accent">{accent}</span>
                </h2>
                <p className="auth__side-lede">{lede}</p>
            </div>

            {quote && (
                <blockquote className="auth__quote">
                    <p>"{quote.quote}"</p>
                    {quote.artistName && (
                        <div className="auth__quote-author">
                            {[quote.artistName, quote.genre, quote.location]
                                .filter(Boolean).join(' · ')}
                        </div>
                    )}
                </blockquote>
            )}
        </aside>
    );
}
