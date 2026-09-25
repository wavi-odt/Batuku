/* ─────────────────────────────────────────────────────────────────
   DiscoverReleases.jsx, Novos lançamentos recentes.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { usePlayer }  from '../../../../context/PlayerContext.jsx'

const SHAPES = ['circles', 'orbit', 'arch', 'sun', 'triangles', 'wave', 'stripes', 'split']
const shapeFromId = id => SHAPES[Number(id) % SHAPES.length]
const hueFromId   = id => (Number(id) * 137) % 360

function daysLabel(iso) {
    if (!iso) return ''
    const n = Math.floor((Date.now() - new Date(iso)) / 86400000)
    if (n <= 0) return 'Hoje'
    if (n === 1) return 'Há 1 dia'
    if (n < 7)  return `Há ${n} dias`
    const w = Math.floor(n / 7)
    return `Há ${w} semana${w > 1 ? 's' : ''}`
}

export default function DiscoverReleases({ tracks, queue }) {
    const { setTrack } = usePlayer()

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Novos lançamentos</h2>
                    <div className="home__section-sub">O que saiu recentemente em Cabo Verde</div>
                </div>
            </div>

            <div className="disc__releases">
                {tracks.map(t => (
                    <button
                        key={t.id}
                        type="button"
                        className="track-card"
                        onClick={() => t.audioUrl && setTrack({ ...t, name: t.title }, queue.map(q => ({ ...q, name: q.title })))}
                    >
                        <div className="track-card__cover">
                            <ArtistArtwork
                                shape={shapeFromId(t.id)}
                                hue={hueFromId(t.id)}
                                image={t.coverUrl ?? null}
                                rounded={10}
                            />
                            <span className="track-card__play" aria-hidden="true">
                                <FaPlay size={12} />
                            </span>
                        </div>
                        <div className="track-card__title">{t.title}</div>
                        <div className="track-card__artist">{t.artistName}</div>
                        <div className="disc__release-date">{daysLabel(t.createdAt)}</div>
                    </button>
                ))}
            </div>
        </section>
    )
}
