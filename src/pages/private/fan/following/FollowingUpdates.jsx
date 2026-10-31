import { FaPlay }           from 'react-icons/fa'
import { Link }             from 'react-router-dom'
import { usePlayer }        from '../../../../context/PlayerContext'
import { toPlayerTrack }    from '../../../../utils/toPlayerTrack'
import TimeAgo              from '../../../../components/TimeAgo.jsx'
import TrackMenu            from '../../../../components/TrackMenu.jsx'
import NowPlayingEq         from '../../../../components/NowPlayingEq.jsx'
import CoverImg             from '../../../../components/CoverImg.jsx'

export default function FollowingUpdates({ tracks }) {
    const { track: currentTrack, setTrack, togglePlayRef } = usePlayer()
    const queue = tracks.map(t => toPlayerTrack(t, 'following'))

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Novidades</h2>
                    <div className="home__section-sub">O que saiu recentemente de quem segues</div>
                </div>
            </div>

            <div className="continue">
                {tracks.map((t, i) => {
                    const active = currentTrack?.id === t.id
                    return (
                    <div key={t.id} className="track-card">
                        <div
                            className={`track-card__cover${active ? ' track-card__cover--active' : ''}`}
                            onClick={() => { if (active) { togglePlayRef.current?.(); return } setTrack(queue[i], queue) }}
                            style={{ cursor: 'pointer' }}
                        >
                            <CoverImg src={t.coverUrl} alt={t.title} priority={i === 0} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} iconSize={20} />
                            {active
                                ? <span className="track-card__eq-wrap"><NowPlayingEq /></span>
                                : <span className="track-card__play" aria-hidden="true"><FaPlay size={12} /></span>
                            }
                            <span className="flw__update-type">Faixa</span>
                        </div>
                        <div
                            className="track-card__bottom"
                            onClick={() => { if (active) { togglePlayRef.current?.(); return } setTrack(queue[i], queue) }}
                            style={{ cursor: 'pointer' }}
                        >
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
                            >
                                {t.artistName}
                            </Link>
                            <TimeAgo isoStr={t.createdAt} className="flw__update-time" />
                        </div>
                    </div>
                    )
                })}
            </div>
        </section>
    )
}
