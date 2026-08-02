/* ─────────────────────────────────────────────────────────────────
   AnalyticsTopTracks.jsx, Tabela detalhada das top 5 faixas.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

export default function AnalyticsTopTracks({ tracks }) {
    return (
        <div className="anl__top-table">
            <div className="anl__top-head">
                <span className="anl__top-title">Detalhes por faixa</span>
            </div>

            <div className="anl__top-row anl__top-row--head">
                <div>#</div>
                <div />
                <div>Faixa</div>
                <div style={{ textAlign: 'right' }}>Reproduções</div>
                <div style={{ textAlign: 'right' }}>Ouvintes</div>
                <div style={{ textAlign: 'right' }}>Likes</div>
                <div style={{ textAlign: 'right' }}>Saves</div>
                <div style={{ textAlign: 'right' }}>Conclusão</div>
            </div>

            {tracks.map((t, i) => (
                <div key={t.title} className="anl__top-row">
                    <div className="anl__top-rank">{i + 1}</div>

                    <div className="anl__top-cover">
                        <ArtistArtwork
                            shape="circles"
                            hue={t.hue}
                            image={t.image}
                            rounded={0}
                            showGloss={false}
                        />
                    </div>

                    <div className="anl__top-title-text">{t.title}</div>

                    <div className="anl__top-num">{t.plays.toLocaleString('pt-PT')}</div>
                    <div className="anl__top-num">{t.listeners.toLocaleString('pt-PT')}</div>
                    <div className="anl__top-num">{t.likes}</div>
                    <div className="anl__top-num">{t.saves}</div>

                    <div className="anl__top-completion">
                        <div className="anl__top-comp-bar">
                            <div
                                className="anl__top-comp-fill"
                                style={{ width: `${t.completion}%` }}
                            />
                        </div>
                        <div className="anl__top-comp-val">{t.completion}%</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
