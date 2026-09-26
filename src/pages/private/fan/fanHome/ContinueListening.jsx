import { FaPlay, FaMusic } from 'react-icons/fa'
import { Link }            from 'react-router-dom'
import { usePlayer }       from '../../../../context/PlayerContext'
import { API, getToken }   from '../../../../utils/auth'
import ClickableName       from '../../../../components/ClickableName'
import './ContinueListening.css'

export default function ContinueListening({ tracks }) {
    const { setTrack } = usePlayer()

    async function handlePlay(t) {
        // recently-played não inclui audioUrl, buscar as tracks do artista (que já incluem)
        const res = await fetch(`${API}/api/tracks/artist/${t.artistId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) return
        const artistTracks = await res.json()
        const full = artistTracks.find(tr => tr.id === t.trackId)
        if (!full?.audioUrl) return

        setTrack({
            id:              full.id,
            name:            full.title,
            artistName:      full.artistName,
            artistProfileId: full.artistProfileId ?? null,
            coverUrl:        full.coverUrl ?? t.coverUrl ?? null,
            audioUrl:        full.audioUrl,
            durationMs:      full.durationMs ?? null,
            source:          'upload',
        })
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
                    <button
                        key={t.trackId}
                        type="button"
                        className="track-card"
                        onClick={() => handlePlay(t)}
                    >
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
                        <div className="track-card__artist">
                            <ClickableName artistProfileId={t.artistId} name={t.artistName} />
                        </div>
                    </button>
                ))}
            </div>
        </section>
    )
}
