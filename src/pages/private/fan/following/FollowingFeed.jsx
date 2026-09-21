import { FaMusic }          from 'react-icons/fa'
import { Link }             from 'react-router-dom'
import { usePlayer }        from '../../../../context/PlayerContext'
import { toPlayerTrack }    from '../../../../utils/toPlayerTrack'
import TimeAgo              from '../../../../components/TimeAgo.jsx'

function ArtistAvatar({ name }) {
    return (
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'var(--color-ink-mute)' }}>
            {name.charAt(0).toUpperCase()}
        </div>
    )
}

export default function FollowingFeed({ tracks }) {
    const { setTrack } = usePlayer()
    const queue = tracks.map(toPlayerTrack)

    return (
        <div>
            <div className="home__section-head" style={{ marginBottom: 16 }}>
                <div>
                    <h2 className="home__section-title">Atividade recente</h2>
                    <div className="home__section-sub">O que os teus artistas andaram a fazer</div>
                </div>
            </div>

            <div className="flw__feed">
                {tracks.map((t, i) => (
                    <div key={t.id} className="flw__feed-item">

                        <div className="flw__feed-avatar">
                            <ArtistAvatar name={t.artistName} />
                        </div>

                        <div className="flw__feed-body">
                            <div className="flw__feed-header">
                                <Link to={`/artists/${t.artistProfileId}`} className="flw__feed-artist" style={{ textDecoration: 'none' }}>
                                    {t.artistName}
                                </Link>
                                <span className="flw__feed-action">lançou uma nova faixa</span>
                                <span className="flw__feed-tag flw__feed-tag--release">Lançamento</span>
                                <TimeAgo isoStr={t.createdAt} className="flw__feed-time" />
                            </div>

                            <button
                                type="button"
                                className="flw__feed-content"
                                onClick={() => setTrack(queue[i], queue)}
                            >
                                <div className="flw__feed-content-thumb">
                                    {t.coverUrl
                                        ? <img src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                                        : <div style={{ width: '100%', height: '100%', borderRadius: 6, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaMusic size={14} style={{ color: 'var(--color-ink-mute)' }} />
                                          </div>
                                    }
                                </div>
                                <span className="flw__feed-content-title">{t.title}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
