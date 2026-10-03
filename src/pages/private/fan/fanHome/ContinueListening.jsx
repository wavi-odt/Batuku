import { FaPlay, FaMusic } from 'react-icons/fa'
import { Link }            from 'react-router-dom'
import { usePlayer }       from '../../../../context/PlayerContext'
import ClickableName       from '../../../../components/ClickableName'
import TrackMenu           from '../../../../components/TrackMenu.jsx'
import './ContinueListening.css'

export default function ContinueListening({ tracks }) {
    const { setTrack } = usePlayer()

    function handlePlay(t, list) {
        if (!t.audioUrl && !t.spotifyId) return
        const toTrack = x => ({
            id:              x.trackId,
            name:            x.title,
            artistName:      x.artistName,
            artistProfileId: x.artistId ?? null,
            coverUrl:        x.coverUrl ?? null,
            audioUrl:        x.audioUrl ?? null,
            spotifyId:       x.spotifyId ?? null,
            playContext:     'home',
        })
        setTrack(toTrack(t), list.filter(x => x.audioUrl || x.spotifyId).map(toTrack))
    }

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Ouvido recentemente</h2>
                    <div className="home__section-sub">As últimas faixas que ouviste</div>
                </div>
                <Link to="/following" className="home__section-link">Ver novidades →</Link>
            </div>

            <div className="continue">
                {tracks.map(t => (
                    <div key={t.trackId} className="track-card">
                        <div className="track-card__cover" onClick={() => handlePlay(t, tracks)}>
                            {t.coverUrl
                                ? <img src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                                : <div style={{ width: '100%', height: '100%', borderRadius: 10, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaMusic size={20} style={{ color: 'var(--color-ink-mute)' }} />
                                  </div>
                            }
                            <span className="track-card__play" aria-hidden="true"><FaPlay size={12} /></span>
                        </div>
                        <div className="track-card__bottom" onClick={() => handlePlay(t, tracks)}>
                            <div className="track-card__title-row">
                                <div className="track-card__title">{t.title}</div>
                                <div onClick={e => e.stopPropagation()}>
                                    <TrackMenu trackId={t.trackId} artistProfileId={t.artistId} />
                                </div>
                            </div>
                            <div className="track-card__artist">
                                <ClickableName artistProfileId={t.artistId} name={t.artistName} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
