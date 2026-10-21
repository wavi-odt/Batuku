/* ─────────────────────────────────────────────────────────────────
   DiscoverReleases.jsx, Novos lançamentos recentes.
   ───────────────────────────────────────────────────────────────── */

import { Link }   from 'react-router-dom'
import ArtistArtwork from '../../../../components/PublicComponents/ArtistArtwork.jsx'
import { usePlayer }  from '../../../../context/PlayerContext.jsx'
import TrackMenu      from '../../../../components/TrackMenu.jsx'
import NowPlayingEq   from '../../../../components/NowPlayingEq.jsx'

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
    const { track: currentTrack, setTrack, togglePlayRef } = usePlayer()

    function handlePlay(t) {
        if (!t.audioUrl) return
        if (currentTrack?.id === t.id) {
            togglePlayRef.current?.()
            return
        }
        setTrack(
            { ...t, name: t.title, playContext: 'discover' },
            queue.map(q => ({ ...q, name: q.title, playContext: 'discover' }))
        )
    }

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Novos lançamentos</h2>
                    <div className="home__section-sub">O que saiu recentemente em Cabo Verde</div>
                </div>
            </div>

            <div className="disc__releases">
                {tracks.map(t => {
                    const active = currentTrack?.id === t.id
                    return (
                    <div key={t.id} className="track-card">
                        <div className={`track-card__cover${active ? ' track-card__cover--active' : ''}`} onClick={() => handlePlay(t)}>
                            <ArtistArtwork
                                shape={shapeFromId(t.id)}
                                hue={hueFromId(t.id)}
                                image={t.coverUrl ?? null}
                                rounded={10}
                            />
                            {active && <span className="track-card__eq-wrap"><NowPlayingEq /></span>}
                        </div>
                        <div className="track-card__bottom" onClick={() => handlePlay(t)}>
                            <div className="track-card__title-row">
                                <div className="track-card__title">{t.title}</div>
                                <div onClick={e => e.stopPropagation()}>
                                    <TrackMenu trackId={t.id} artistProfileId={t.artistProfileId} />
                                </div>
                            </div>
                            <Link
                                to={`/artists/${t.artistProfileId}`}
                                className="track-card__artist"
                                onClick={e => e.stopPropagation()}
                            >{t.artistName}</Link>
                        </div>
                        {t.createdAt && (
                            <div className="disc__release-date">{daysLabel(t.createdAt)}</div>
                        )}
                    </div>
                    )
                })}
            </div>
        </section>
    )
}
