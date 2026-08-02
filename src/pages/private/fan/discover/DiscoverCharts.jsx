/* ─────────────────────────────────────────────────────────────────
   DiscoverCharts.jsx, Top 10 semanal em dois painéis lado a lado.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

function delta(rank, prev) {
    if (prev === 0)    return { cls: 'new',  label: 'NEW' };
    if (prev > rank)   return { cls: 'up',   label: `▲${prev - rank}` };
    if (prev < rank)   return { cls: 'down', label: `▼${rank - prev}` };
    return               { cls: 'same', label: '—' };
}

function ChartRow({ entry }) {
    const d = delta(entry.rank, entry.prevRank);
    return (
        <div className="disc__chart-row">
            <span className="disc__chart-rank">{entry.rank}</span>
            <span className={`disc__chart-delta disc__chart-delta--${d.cls}`}>{d.label}</span>
            <div className="disc__chart-thumb">
                <ArtistArtwork shape={entry.shape} hue={entry.hue} image={entry.image} rounded={6} />
                <button type="button" className="lib__track-play" aria-label="Reproduzir">
                    <FaPlay size={9} />
                </button>
            </div>
            <div className="disc__chart-info">
                <div className="disc__chart-title">{entry.title}</div>
                <div className="disc__chart-artist">{entry.artist}</div>
            </div>
            <div className="disc__chart-plays">{entry.plays}</div>
        </div>
    );
}

export default function DiscoverCharts({ charts }) {
    const top5    = charts.slice(0, 5);
    const rest5   = charts.slice(5, 10);

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Charts</h2>
                    <div className="home__section-sub">Top 10 desta semana em Cabo Verde</div>
                </div>
                <a href="#" className="home__section-link">Ver tudo →</a>
            </div>

            <div className="disc__chart-split">
                <div className="disc__chart-panel">
                    {top5.map(e => <ChartRow key={e.rank} entry={e} />)}
                </div>
                <div className="disc__chart-panel">
                    {rest5.map(e => <ChartRow key={e.rank} entry={e} />)}
                </div>
            </div>
        </section>
    );
}
