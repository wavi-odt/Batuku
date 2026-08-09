import { FaCompactDisc, FaPlay, FaHeart } from 'react-icons/fa'

export default function AnalyticsTopTracks({ tracks }) {
    const maxPlays = Math.max(...(tracks.map(t => t.plays ?? 0)), 1)

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

            {tracks.map((t, i) => (
                <div key={t.id ?? t.title} className="anl__top-row">
                    <div className="anl__top-rank">{i + 1}</div>

                    <div className="anl__top-cover">
                        {t.coverUrl
                            ? <img src={t.coverUrl} alt={t.title} />
                            : <div className="anl__top-cover-empty"><FaCompactDisc size={13} /></div>
                        }
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
            ))}
        </div>
    )
}
