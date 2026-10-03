import { FaCompactDisc, FaPlay, FaHeart, FaPause } from 'react-icons/fa'
import { usePlayer } from '../../../../context/PlayerContext.jsx'

export default function AnalyticsTopTracks({ tracks }) {
    const { track: currentTrack, setTrack } = usePlayer()
    const maxPlays = Math.max(...(tracks.map(t => t.plays ?? 0)), 1)

    const queue = (tracks ?? [])
        .filter(t => t.audioUrl)
        .map(t => ({
            id: t.id, name: t.title, coverUrl: t.coverUrl,
            audioUrl: t.audioUrl, source: 'upload', playContext: 'direct',
        }))

    if (!tracks || tracks.length === 0) {
        return (
            <div className="anl__top-table">
                <div className="anl__top-head">
                    <span className="anl__top-title">Detalhes por faixa</span>
                </div>
                <p className="anl__top-empty">
                    Sem dados de reprodução ainda. As faixas aparecerão aqui assim que forem reproduzidas.
                </p>
            </div>
        )
    }

    return (
        <div className="anl__top-table">
            <div className="anl__top-head">
                <span className="anl__top-title">Detalhes por faixa</span>
            </div>

            <div className="anl__top-row anl__top-row--head">
                <div>#</div>
                <div />
                <div>Faixa</div>
                <div className="anl__top-num"><FaPlay size={9} /></div>
                <div className="anl__top-num"><FaHeart size={9} /></div>
            </div>

            {tracks.map((t, i) => {
                const isPlaying = currentTrack?.audioUrl === t.audioUrl && !!t.audioUrl
                const queueEntry = queue.find(q => q.id === t.id)
                return (
                    <div key={t.id ?? t.title} className={'anl__top-row' + (isPlaying ? ' anl__top-row--playing' : '')}>
                        <div className="anl__top-rank">{i + 1}</div>

                        <div
                            className="anl__top-cover"
                            onClick={() => queueEntry && setTrack(queueEntry, queue)}
                            style={{ cursor: queueEntry ? 'pointer' : 'default' }}
                        >
                            {t.coverUrl
                                ? <img src={t.coverUrl} alt={t.title} />
                                : <div className="anl__top-cover-empty"><FaCompactDisc size={13} /></div>
                            }
                            {queueEntry && (
                                <div className="anl__top-cover-overlay">
                                    {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
                                </div>
                            )}
                        </div>

                        <div className="anl__top-info">
                            <div className="anl__top-title-text">{t.title}</div>
                            <div className="anl__top-bar-wrap">
                                <div
                                    className="anl__top-bar-fill"
                                    style={{ width: `${((t.plays ?? 0) / maxPlays) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="anl__top-num">{(t.plays ?? 0).toLocaleString('pt-PT')}</div>
                        <div className="anl__top-num">{(t.likes ?? 0).toLocaleString('pt-PT')}</div>
                    </div>
                )
            })}
        </div>
    )
}
