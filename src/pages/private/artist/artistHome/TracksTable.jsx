/* ─────────────────────────────────────────────────────────────────
   TracksTable.jsx, Tabela das faixas do artista com métricas.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import './TracksTable.css'

export default function TracksTable({ tracks }) {
    return (
        <section className="dash__section">
            <div className="dash__head">
                <div>
                    <h2 className="dash__head-title">As tuas faixas com melhor desempenho</h2>
                    <div className="dash__head-sub">Ordenadas por reproduções esta semana</div>
                </div>
                <a href="#" className="dash__head-link">Ver todas →</a>
            </div>

            <div className="tracks-table">
                <div className="tracks-row tracks-row--head">
                    <div></div>
                    <div>Faixa</div>
                    <div className="tracks-row__r">Reproduções</div>
                    <div className="tracks-row__r">Likes</div>
                    <div className="tracks-row__r">Comentários</div>
                    <div className="tracks-row__r">Tendência</div>
                </div>

                {tracks.map((t, i) => (
                    <div key={i} className="tracks-row">
                        <div className="tracks-row__cover">
                            <ArtistArtwork shape={t.shape} hue={t.hue} image={t.image} rounded={0} />
                        </div>
                        <div>
                            <div className="tracks-row__title">{t.title}</div>
                            <div className="tracks-row__sub">
                                Publicada há {i + 1} {i === 0 ? 'semana' : 'semanas'}
                            </div>
                        </div>
                        <div className="tracks-row__num">{t.plays.toLocaleString('pt-PT')}</div>
                        <div className="tracks-row__num">{t.likes}</div>
                        <div className="tracks-row__num">{t.comments}</div>
                        <div className={'tracks-row__trend ' + (t.trend.startsWith('-') ? 'tracks-row__trend--down' : 'tracks-row__trend--up')}>
                            {t.trend}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
