import { Link }             from 'react-router-dom'
import { usePlayer }        from '../../../../context/PlayerContext'
import { toPlayerTrack }    from '../../../../utils/toPlayerTrack'
import TimeAgo              from '../../../../components/TimeAgo.jsx'
import TrackMenu            from '../../../../components/TrackMenu.jsx'
import UserAvatar           from '../../../../components/UserAvatar.jsx'
import NowPlayingEq         from '../../../../components/NowPlayingEq.jsx'
import CoverImg             from '../../../../components/CoverImg.jsx'

export default function FollowingFeed({ tracks }) {
    const { setTrack, track: currentTrack, togglePlayRef } = usePlayer()
    const queue = tracks.map(t => toPlayerTrack(t, 'following'))

    return (
        <div>
            <div className="home__section-head" style={{ marginBottom: 16 }}>
                <div>
                    <h2 className="home__section-title">Atividade recente</h2>
                    <div className="home__section-sub">O que os teus artistas andaram a fazer</div>
                </div>
            </div>

            <div className="flw__feed">
                {tracks.map((t, i) => {
                    const isActive = currentTrack?.id === t.id
                    return (
                    <div key={t.id} className="flw__feed-item">

                        <div className="flw__feed-avatar">
                            <UserAvatar name={t.artistName} imageUrl={t.artistAvatarUrl} style={{ width: '100%', height: '100%' }} />
                        </div>

                        <div className="flw__feed-body">
                            <div className="flw__feed-header">
                                <Link to={`/artists/${t.artistProfileId}`} className="flw__feed-artist" style={{ textDecoration: 'none' }}>
                                    {t.artistName}
                                </Link>
                                <span className="flw__feed-action">lançou uma nova faixa</span>
                                <TimeAgo isoStr={t.createdAt} className="flw__feed-time" />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button
                                    type="button"
                                    className="flw__feed-content"
                                    style={{ flex: 1, minWidth: 0 }}
                                    onClick={() => {
                                        if (isActive) { togglePlayRef.current?.(); return }
                                        setTrack(queue[i], queue)
                                    }}
                                >
                                    <div className={`flw__feed-content-thumb${isActive ? ' flw__feed-content-thumb--active' : ''}`}>
                                        <CoverImg src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                                        {isActive && <span className="track-card__eq-wrap"><NowPlayingEq /></span>}
                                    </div>
                                    <span className="flw__feed-content-title">{t.title}</span>
                                </button>
                                <div onClick={e => e.stopPropagation()}>
                                    <TrackMenu trackId={t.id} artistProfileId={t.artistProfileId} />
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}
