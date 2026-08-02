/* ─────────────────────────────────────────────────────────────────
   AnalyticsBreakdown.jsx, Três cards: fontes, localização, top faixas
   (barras horizontais reutilizáveis, sem libs externas).
   ───────────────────────────────────────────────────────────────── */

function HBar({ items, unit = '', maxOverride }) {
    const max = maxOverride ?? Math.max(...items.map(i => i.value));
    return (
        <div className="anl__hbar-list">
            {items.map((item, i) => (
                <div key={i} className="anl__hbar-row">
                    <div className="anl__hbar-label">{item.label}</div>
                    <div className="anl__hbar-track">
                        <div
                            className={`anl__hbar-fill anl__hbar-fill--${item.color ?? 'default'}`}
                            style={{ width: `${(item.value / max) * 100}%` }}
                        />
                    </div>
                    <div className="anl__hbar-val">
                        {typeof item.value === 'number' && item.value >= 1000
                            ? `${(item.value / 1000).toFixed(1)}k`
                            : item.value}{unit}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsBreakdown({ sources, locations, topTracks }) {
    return (
        <div className="anl__breakdown">

            {/* ─── Fontes de descoberta ─────────────────────────── */}
            <div className="anl__card">
                <div className="anl__card-title">Fontes de descoberta</div>
                <HBar items={sources} unit="%" />
            </div>

            {/* ─── Top localizações ─────────────────────────────── */}
            <div className="anl__card">
                <div className="anl__card-title">Top localizações</div>
                <HBar items={locations.map(l => ({ ...l, color: 'ocean' }))} />
            </div>

            {/* ─── Top faixas (mini) ────────────────────────────── */}
            <div className="anl__card">
                <div className="anl__card-title">Top faixas</div>
                <HBar
                    items={topTracks.map(t => ({ label: t.title, value: t.plays, color: 'coral' }))}
                />
            </div>

        </div>
    );
}
