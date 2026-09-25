/* ─────────────────────────────────────────────────────────────────
   DiscoverFeatured.jsx, Faixa em destaque no topo da página.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { usePlayer }  from '../../../../context/PlayerContext.jsx'

const SHAPES = ['circles', 'orbit', 'arch', 'sun', 'triangles', 'wave', 'stripes', 'split']
const shapeFromId = id => SHAPES[Number(id) % SHAPES.length]
const hueFromId   = id => (Number(id) * 137) % 360

function fmt(n) {
    return (n ?? 0) >= 1000 ? `${((n ?? 0) / 1000).toFixed(1)}K` : (n ?? 0).toString()
}

export default function DiscoverFeatured({ track: t, allTracks }) {
    const { setTrack } = usePlayer()
    if (!t) return null

    const hue = hueFromId(t.id)

    return (
        <div className="disc__hero" style={{ '--hero-hue': hue }}>
            <div className="disc__hero-body">
                <span className="disc__hero-badge">Em destaque</span>
                <h1 className="disc__hero-title">{t.title}</h1>
                <p className="disc__hero-artist">{t.artistName}</p>
                {t.genreName && <p className="disc__hero-desc">{t.genreName}</p>}
                <div className="disc__hero-stats">
                    <span>{fmt(t.likeCount)} gostos</span>
                </div>
                <button
                    type="button"
                    className="btn btn--primary btn--sm disc__hero-cta"
                    onClick={() => t.audioUrl && setTrack({ ...t, name: t.title }, allTracks.map(q => ({ ...q, name: q.title })))}
                    disabled={!t.audioUrl}
                >
                    <FaPlay size={11} /> Ouvir agora
                </button>
            </div>

            <div className="disc__hero-art">
                <ArtistArtwork
                    shape={shapeFromId(t.id)}
                    hue={hue}
                    image={t.coverUrl ?? null}
                    rounded={16}
                />
            </div>
        </div>
    )
}
