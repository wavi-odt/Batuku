/* ─────────────────────────────────────────────────────────────────
   DiscoverFeatured.jsx, Spotlight do artista/álbum em destaque.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

function fmt(n) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
}

export default function DiscoverFeatured({ featured: f }) {
    return (
        <div
            className="disc__hero"
            style={{ '--hero-hue': f.hue }}
        >
            <div className="disc__hero-body">
                <span className="disc__hero-badge">{f.badge}</span>
                <h1 className="disc__hero-title">{f.title}</h1>
                <p className="disc__hero-artist">{f.artist}</p>
                <p className="disc__hero-desc">{f.description}</p>
                <div className="disc__hero-stats">
                    <span>{fmt(f.listeners)} ouvintes</span>
                    <span className="disc__hero-dot">·</span>
                    <span>{fmt(f.plays)} reproduções esta semana</span>
                </div>
                <button type="button" className="btn btn--primary btn--sm disc__hero-cta">
                    <FaPlay size={11} /> Ouvir agora
                </button>
            </div>

            <div className="disc__hero-art">
                <ArtistArtwork shape={f.shape} hue={f.hue} image={f.image} rounded={16} />
            </div>
        </div>
    );
}
