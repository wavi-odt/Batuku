import { FaPlay } from 'react-icons/fa'
import { Link }            from 'react-router-dom'
import { usePlayQueue }    from '../../../../hooks/usePlayQueue'
import ClickableName       from '../../../../components/ClickableName'
import TrackMenu           from '../../../../components/TrackMenu.jsx'
import NowPlayingEq        from '../../../../components/NowPlayingEq.jsx'
import CoverImg            from '../../../../components/CoverImg.jsx'
import './ContinueListening.css'

export default function ContinueListening({ tracks }) {
    const { currentTrack, playRecent } = usePlayQueue()

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
                {tracks.map(t => {
                    const active = currentTrack?.id === t.trackId
                    return (
                    <div key={t.trackId} className="track-card">
                        <div className={`track-card__cover${active ? ' track-card__cover--active' : ''}`} onClick={() => playRecent(t, tracks, 'home')}>
                            <CoverImg src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} iconSize={20} />
                            {active
                                ? <span className="track-card__eq-wrap"><NowPlayingEq /></span>
                                : <span className="track-card__play" aria-hidden="true"><FaPlay size={12} /></span>
                            }
                        </div>
                        <div className="track-card__bottom" onClick={() => playRecent(t, tracks, 'home')}>
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
                    )
                })}
            </div>
        </section>
    )
}
