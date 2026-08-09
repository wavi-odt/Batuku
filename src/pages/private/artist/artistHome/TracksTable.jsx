import { Link } from 'react-router-dom'
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

                {tracks.map(t => (
                    <div key={t.id} className="tracks-row">
                        <div className="tracks-row__cover">
                            <Cover coverUrl={t.coverUrl} title={t.title} />
                        </div>
                        <div className="tracks-row__title">{t.title}</div>
                        <div className="tracks-row__num">{t.plays.toLocaleString('pt-PT')}</div>
                        <div className="tracks-row__num">{t.likes.toLocaleString('pt-PT')}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}
