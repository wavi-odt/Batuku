/* ─────────────────────────────────────────────────────────────────
   DiscoverFeatured.jsx, Faixa em destaque no topo da página.
   ───────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { FaPlay } from 'react-icons/fa'
import { Link }   from 'react-router-dom'
import ArtistArtwork from '../../../../components/PublicComponents/ArtistArtwork.jsx'
import { usePlayer }  from '../../../../context/PlayerContext.jsx'
import NowPlayingEq   from '../../../../components/NowPlayingEq.jsx'

const SHAPES = ['circles', 'orbit', 'arch', 'sun', 'triangles', 'wave', 'stripes', 'split']
const shapeFromId = id => SHAPES[Number(id) % SHAPES.length]
const hueFromId   = id => (Number(id) * 137) % 360

function fmt(n) {
    return (n ?? 0) >= 1000 ? `${((n ?? 0) / 1000).toFixed(1)}K` : (n ?? 0).toString()
}

function rgbToHue(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    if (max === min) return 0
    const d = max - min
    let h = 0
    if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else                h = ((r - g) / d + 4) / 6
    return Math.round(h * 360)
}

function useDominantHue(imageUrl, fallback) {
    const [hue, setHue] = useState(fallback)

    useEffect(() => {
        setHue(fallback)
        if (!imageUrl) return
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas')
                canvas.width = 10; canvas.height = 10
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, 10, 10)
                const { data } = ctx.getImageData(0, 0, 10, 10)
                let r = 0, g = 0, b = 0
                const n = data.length / 4
                for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i+1]; b += data[i+2] }
                setHue(rgbToHue(r / n, g / n, b / n))
            } catch {
                setHue(fallback)
            }
        }
        img.onerror = () => setHue(fallback)
        img.src = imageUrl
    }, [imageUrl, fallback])

    return hue
}

export default function DiscoverFeatured({ track: t, allTracks }) {
    const { track: currentTrack, isPlaying, setTrack, togglePlayRef } = usePlayer()
    const fallbackHue = t ? hueFromId(t.id) : 0
    const hue = useDominantHue(t?.coverUrl ?? null, fallbackHue)

    if (!t) return null

    const active = currentTrack?.id === t.id

    return (
        <div className="disc__hero" style={{ '--hero-hue': hue }}>
            <div className="disc__hero-body">
                <span className="disc__hero-badge">Em destaque</span>
                <div className="disc__hero-main">
                    <div className="disc__hero-text">
                        <h1 className="disc__hero-title">{t.title}</h1>
                        <Link to={`/artists/${t.artistProfileId}`} className="disc__hero-artist">{t.artistName}</Link>
                    </div>
                    <div className="disc__hero-actions">
                        <button
                            type="button"
                            className="btn btn--primary btn--sm disc__hero-cta"
                            onClick={() => {
                                if (!t.audioUrl) return
                                if (active) { togglePlayRef.current?.(); return }
                                setTrack({ ...t, name: t.title, playContext: 'discover' }, allTracks.map(q => ({ ...q, name: q.title, playContext: 'discover' })))
                            }}
                            disabled={!t.audioUrl}
                        >
                            {active && isPlaying
                                ? <><NowPlayingEq className="eq--white" /> A tocar</>
                                : active
                                    ? <><FaPlay size={11} /> Continuar</>
                                    : <><FaPlay size={11} /> Ouvir agora</>
                            }
                        </button>
                        <div className="disc__hero-stats">
                            <span>{fmt(t.likeCount)} gostos</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="disc__hero-art">
                <ArtistArtwork
                    shape={shapeFromId(t.id)}
                    hue={hue}
                    image={t.coverUrl ?? null}
                    rounded={16}
                    priority
                />
            </div>
        </div>
    )
}
