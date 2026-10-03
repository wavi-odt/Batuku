import { Link } from 'react-router-dom'
import { FaPlay, FaPause } from 'react-icons/fa'
import { usePlayer } from '../../../../context/PlayerContext.jsx'
import './TracksTable.css'

function Cover({ coverUrl, title }) {
    if (coverUrl) {
        return <img src={coverUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
    }
    const hue = (title?.charCodeAt(0) ?? 0) * 37 % 360
    return (
        <div style={{
            width: '100%', height: '100%', borderRadius: 4,
            background: `hsl(${hue} 45% 30%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 18,
        }}>
            ♪
        </div>
    )
}

export default function TracksTable({ tracks }) {
    const { track: currentTrack, setTrack } = usePlayer()

    const queue = tracks
        .filter(t => t.audioUrl)
        .map(t => ({
            id: t.id, name: t.title, coverUrl: t.coverUrl,
            audioUrl: t.audioUrl, source: 'upload', playContext: 'direct',
        }))

    return (
        <section className="dash__section">
            <div className="dash__head">
                <div>
                    <h2 className="dash__head-title">As tuas faixas com melhor desempenho</h2>
                    <div className="dash__head-sub">Ordenadas por reproduções no período</div>
                </div>
                <Link to="/tracks" className="dash__head-link">Ver todas →</Link>
            </div>

            <div className="tracks-table">
                <div className="tracks-row tracks-row--head">
                    <div></div>
                    <div>Faixa</div>
                    <div className="tracks-row__r">Reproduções</div>
                    <div className="tracks-row__r">Likes</div>
                </div>

                {tracks.map(t => {
                    const isPlaying = currentTrack?.audioUrl === t.audioUrl && !!t.audioUrl
                    const queueEntry = queue.find(q => q.id === t.id)
                    return (
                        <div key={t.id} className={'tracks-row' + (isPlaying ? ' tracks-row--playing' : '')}>
                            <div
                                className="tracks-row__cover"
                                onClick={() => queueEntry && setTrack(queueEntry, queue)}
                                style={{ cursor: queueEntry ? 'pointer' : 'default', position: 'relative' }}
                            >
                                <Cover coverUrl={t.coverUrl} title={t.title} />
                                {queueEntry && (
                                    <div className="tracks-row__play-overlay">
                                        {isPlaying ? <FaPause size={11} /> : <FaPlay size={11} />}
                                    </div>
                                )}
                            </div>
                            <div className="tracks-row__title">{t.title}</div>
                            <div className="tracks-row__num">{t.plays.toLocaleString('pt-PT')}</div>
                            <div className="tracks-row__num">{t.likes.toLocaleString('pt-PT')}</div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
