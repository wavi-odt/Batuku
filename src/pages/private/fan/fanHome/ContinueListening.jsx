import { FaPlay, FaMusic } from 'react-icons/fa'
import { Link }            from 'react-router-dom'
import './ContinueListening.css'

export default function ContinueListening({ tracks }) {
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
                    <Link key={t.trackId} to={`/artists/${t.artistId}`} className="track-card" style={{ textDecoration: 'none' }}>
                        <div className="track-card__cover">
                            {t.coverUrl
                                ? <img src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                                : <div style={{ width: '100%', height: '100%', borderRadius: 10, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaMusic size={20} style={{ color: 'var(--color-ink-mute)' }} />
                                  </div>
                            }
                            <span className="track-card__play" aria-hidden="true"><FaPlay size={12} /></span>
                        </div>
                        <div className="track-card__title">{t.title}</div>
                        <div className="track-card__artist">{t.artistName}</div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
