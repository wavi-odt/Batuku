/* ─────────────────────────────────────────────────────────────────
   AuthSide — Coluna esquerda partilhada nas páginas de auth.
   Mostra um painel visual com headline + paredeo de capas + citação.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { ARTISTS } from '../../data/batuku.js'
import ArtistArtwork from '../PublicComponets/ArtistArtwork.jsx'
import logo from '../../assets/batuku.png'
import './auth.css'

export default function AuthSide({ title, accent, lede, quote, author }) {
    const cols = [
        ARTISTS.slice(0, 4),
        ARTISTS.slice(2, 6),
        ARTISTS.slice(4, 8),
    ];

    return (
        <aside className="auth__side" aria-hidden="false">

            <div className="auth__side-grid" aria-hidden="true">
                {cols.map((col, i) => (
                    <div key={i} className="auth__side-col">
                        <div className={'auth__side-col-track' + (i === 1 ? ' is-reverse' : '')}>
                            {[...col, ...col].map((a, j) => (
                                <ArtistArtwork key={j} shape={a.shape} hue={a.hue} rounded={12} showGloss={false} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

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

            <blockquote className="auth__quote">
                <p>"{quote}"</p>
                <div className="auth__quote-author">{author}</div>
            </blockquote>
        </aside>
    );
}
