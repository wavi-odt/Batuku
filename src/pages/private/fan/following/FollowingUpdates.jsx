import { FaPlay, FaMusic }  from 'react-icons/fa'
import { Link }             from 'react-router-dom'
import { usePlayer }        from '../../../../context/PlayerContext'
import { toPlayerTrack }    from '../../../../utils/toPlayerTrack'
import TimeAgo              from '../../../../components/TimeAgo.jsx'

export default function FollowingUpdates({ tracks }) {
    const { setTrack } = usePlayer()
    const queue = tracks.map(toPlayerTrack)

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Novidades</h2>
                    <div className="home__section-sub">O que saiu recentemente de quem segues</div>
                </div>
            </div>

            <div className="continue">
                {tracks.map((t, i) => (
                    <div key={t.id} className="track-card">
                        <div
                            className="track-card__cover"
                            onClick={() => setTrack(queue[i], queue)}
                            style={{ cursor: 'pointer' }}
                        >
                            {t.coverUrl
                                ? <img src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                                : <div style={{ width: '100%', height: '100%', borderRadius: 10, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaMusic size={20} style={{ color: 'var(--color-ink-mute)' }} />
                                  </div>
                            }
                            <span className="track-card__play" aria-hidden="true"><FaPlay size={12} /></span>
                            <span className="flw__update-type">Faixa</span>
                        </div>
                        <div
                            className="track-card__title"
                            onClick={() => setTrack(queue[i], queue)}
                            style={{ cursor: 'pointer' }}
                        >
                            {t.title}
                        </div>
                        <Link
                            to={`/artists/${t.artistProfileId}`}
                            className="track-card__artist"
                            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                        >
                            {t.artistName}
                        </Link>
                        <TimeAgo isoStr={t.createdAt} className="flw__update-time" />
                    </div>
                ))}
            </div>
        </section>
    )
}
