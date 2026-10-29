import { FaPlay, FaPause } from 'react-icons/fa'
import NowPlayingEq from '../../../../components/NowPlayingEq.jsx'
import { usePlayer }  from '../../../../context/PlayerContext.jsx'
import LikeButton     from '../../../../components/LikeButton.jsx'
import TrackMenu      from '../../../../components/TrackMenu.jsx'
import CoverImg       from '../../../../components/CoverImg.jsx'
import { fmtMs } from '../../../../utils/formatters'

export default function LibraryTracks({ tracks, loading }) {
    const { track: currentTrack, setTrack, togglePlayRef } = usePlayer()

    const queue = tracks.map(t => ({
        id: t.id, name: t.title, coverUrl: t.coverUrl,
        artistName: t.artistName, artistProfileId: t.artistProfileId ?? null,
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
                                onClick={() => {
                                    if (!t.audioUrl) return
                                    if (isPlaying) { togglePlayRef.current?.(); return }
                                    setTrack(queue[i], queue)
                                }}
                            >
                                <span className="lib__track-num">
                                    {isPlaying ? <NowPlayingEq /> : i + 1}
                                </span>

                                <div className="lib__track-thumb cover-hover">
                                    <CoverImg src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} iconSize={13} />
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
                                    <TrackMenu trackId={t.id} artistProfileId={t.artistProfileId} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
