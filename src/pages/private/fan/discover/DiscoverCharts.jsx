/* ─────────────────────────────────────────────────────────────────
   DiscoverCharts.jsx, Top 10 por gostos em dois painéis.
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

function delta(track, rank) {
    if (track.prevRank == null) return <span className="disc__chart-delta" />
    if (track.prevRank === 0)   return <span className="disc__chart-delta disc__chart-delta--new">NEW</span>
    const diff = track.prevRank - rank
    if (diff > 0) return <span className="disc__chart-delta disc__chart-delta--up">▲{diff}</span>
    if (diff < 0) return <span className="disc__chart-delta disc__chart-delta--down">▼{Math.abs(diff)}</span>
    return <span className="disc__chart-delta disc__chart-delta--same">—</span>
}

function ChartRow({ track, rank, queue }) {
    const { track: currentTrack, setTrack } = usePlayer()
    const active = currentTrack?.id === track.id
    return (
        <div className={`disc__chart-row${active ? ' disc__chart-row--active' : ''}`}>
            <span className="disc__chart-rank">{rank}</span>
            {delta(track, rank)}
            <div className="disc__chart-thumb">
                <ArtistArtwork
                    shape={shapeFromId(track.id)}
                    hue={hueFromId(track.id)}
                    image={track.coverUrl ?? null}
                    rounded={6}
                />
                <button
                    type="button"
                    className="lib__track-play"
                    aria-label="Reproduzir"
                    onClick={() => track.audioUrl && setTrack({ ...track, name: track.title }, queue.map(q => ({ ...q, name: q.title })))}
                >
                    <FaPlay size={9} />
                </button>
            </div>
            <div className="disc__chart-info">
                <div className="disc__chart-title">{track.title}</div>
                <div className="disc__chart-artist">{track.artistName}</div>
            </div>
            <div className="disc__chart-plays">{fmt(track.likeCount)} ♥</div>
        </div>
    )
}

export default function DiscoverCharts({ tracks }) {
    const top5  = tracks.slice(0, 5)
    const rest5 = tracks.slice(5, 10)

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Charts</h2>
                    <div className="home__section-sub">Top 10 mais gostados em Cabo Verde</div>
                </div>
            </div>

            <div className="disc__chart-split">
                <div className="disc__chart-panel">
                    {top5.map((t, i) => <ChartRow key={t.id} track={t} rank={i + 1} queue={tracks} />)}
                </div>
                <div className="disc__chart-panel">
                    {rest5.map((t, i) => <ChartRow key={t.id} track={t} rank={i + 6} queue={tracks} />)}
                </div>
            </div>
        </section>
    )
}
