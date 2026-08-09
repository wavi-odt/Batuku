import { FaPlay, FaPause, FaMusic } from 'react-icons/fa'
import { usePlayer }  from '../../../../context/PlayerContext.jsx'
import LikeButton     from '../../../../components/LikeButton.jsx'
import TrackMenu      from '../../../../components/TrackMenu.jsx'

function fmtMs(ms) {
    if (!ms) return '—'
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function LibraryTracks({ tracks, loading }) {
    const { track: currentTrack, setTrack } = usePlayer()

    const queue = tracks.map(t => ({
        id: t.id, name: t.title, coverUrl: t.coverUrl,
        durationMs: t.durationMs, audioUrl: t.audioUrl, source: 'upload',
        playContext: 'library',
    }))

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">As minhas faixas</h2>
                    <div className="home__section-sub">
                        {loading ? '…' : `${tracks.length} ${tracks.length === 1 ? 'faixa' : 'faixas'} nas tuas playlists`}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="lib__tracks-empty">A carregar faixas…</div>
            ) : tracks.length === 0 ? (
                <div className="lib__tracks-empty">
                    Ainda não tens faixas. Dá like ou adiciona músicas a uma playlist.
                </div>
            ) : (
                <div className="lib__track-list">
                    {tracks.map((t, i) => {
                        const isPlaying = currentTrack?.id === t.id
                        return (
                            <div
                                key={t.id}
                                className={'lib__track-row' + (isPlaying ? ' lib__track-row--active' : '')}
                                onClick={() => t.audioUrl && setTrack(queue[i], queue)}
                            >
                                <span className="lib__track-num">
                                    {isPlaying
                                        ? <FaPause size={10} />
                                        : i + 1
                                    }
                                </span>

                                <div className="lib__track-thumb">
                                    {t.coverUrl
                                        ? <img src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <div className="lib__track-thumb-empty"><FaMusic size={13} /></div>
                                    }
                                    {t.audioUrl && (
                                        <button type="button" className="lib__track-play" aria-label={isPlaying ? 'A reproduzir' : 'Reproduzir'}>
                                            {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
                                        </button>
                                    )}
                                </div>

                                <div className="lib__track-info">
                                    <div className="lib__track-title">{t.title}</div>
                                    <div className="lib__track-artist">{t.artistName}</div>
                                </div>

                                <div onClick={e => e.stopPropagation()}>
                                    <LikeButton trackId={t.id} />
                                </div>

                                <div className="lib__track-duration">{fmtMs(t.durationMs)}</div>

                                <div onClick={e => e.stopPropagation()}>
                                    <TrackMenu trackId={t.id} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
