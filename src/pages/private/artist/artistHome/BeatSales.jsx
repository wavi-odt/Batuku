/* ─────────────────────────────────────────────────────────────────
   BeatSales.jsx, Receita do mês + últimas vendas de beats.
   ───────────────────────────────────────────────────────────────── */

import './BeatSales.css'

export default function BeatSales({ sales, revenue }) {
    return (
        <div className="sales-card">
            <h3 className="sales-card__title">
                Vendas de beats
                <a href="#" className="dash__head-link">Marketplace →</a>
            </h3>

            <div className="sales-card__revenue">
                <div className="sales-card__revenue-label">Receita do mês</div>
                <div className="sales-card__revenue-value">
                    €{revenue.value.toFixed(2).replace('.', ',')}
                </div>
                <div className="sales-card__revenue-delta">↑ {revenue.delta} vs mês passado</div>
            </div>

            {sales.map((s, i) => (
                <div key={i} className="sales-row">
                    <div className="sales-row__info">
                        <div className="sales-row__title">{s.title}</div>
                        <div className="sales-row__sub">@{s.buyer} · {s.time}</div>
                    </div>
                    <div className="sales-row__price">+€{s.price.toFixed(2).replace('.', ',')}</div>
                </div>
            ))}
        </div>
    );
}
