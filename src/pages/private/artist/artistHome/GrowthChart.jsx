/* ─────────────────────────────────────────────────────────────────
   GrowthChart.jsx, Gráfico de linha (SVG) das reproduções, 30 dias.
   Sem libs externas, desenha path + área a partir dos dados.
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import './GrowthChart.css'

export default function GrowthChart({ data }) {
    const [range, setRange] = useState('30d');

    const W = 600, H = 200;
    const pad = { t: 14, r: 14, b: 22, l: 36 };
    const innerW = W - pad.l - pad.r;
    const innerH = H - pad.t - pad.b;

    const max = Math.max(...data.map(d => d.plays));
    const min = Math.min(...data.map(d => d.plays));
    const x = (i) => pad.l + (i / (data.length - 1)) * innerW;
    const y = (v) => pad.t + (1 - (v - min) / (max - min)) * innerH;

    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.plays)}`).join(' ');
    const areaPath = `${linePath} L ${x(data.length - 1)} ${pad.t + innerH} L ${x(0)} ${pad.t + innerH} Z`;
    const yTicks = 4;
    const last = data[data.length - 1];

    return (
        <div className="chart-card">
            <div className="chart-card__head">
                <div>
                    <h3 className="chart-card__title">Crescimento de reproduções</h3>
                    <p className="chart-card__sub">Últimos 30 dias · com previsão IA</p>
                </div>
                <div className="chart-card__pills">
                    {['7d', '30d', '90d'].map((r) => (
                        <button
                            key={r}
                            type="button"
                            className={'chart-card__pill' + (range === r ? ' is-active' : '')}
                            onClick={() => setRange(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <svg className="chart-card__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                <defs>
                    <linearGradient id="batuku-chart-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%"   stopColor="var(--color-coral)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--color-coral)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Y grid + labels */}
                {Array.from({ length: yTicks + 1 }).map((_, i) => {
                    const yi = pad.t + (i / yTicks) * innerH;
                    const val = Math.round(max - (i / yTicks) * (max - min));
                    return (
                        <g key={i}>
                            <line x1={pad.l} y1={yi} x2={W - pad.r} y2={yi}
                                  stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            <text x={pad.l - 8} y={yi + 4} textAnchor="end"
                                  fontSize="10" fill="var(--color-ink-mute)"
                                  fontFamily="ui-monospace, monospace">{val}</text>
                        </g>
                    );
                })}

                {/* X labels (a cada 5 dias) */}
                {data.filter((_, i) => i % 5 === 0).map((d) => (
                    <text key={d.day} x={x(d.day - 1)} y={H - 6} textAnchor="middle"
                          fontSize="10" fill="var(--color-ink-mute)"
                          fontFamily="ui-monospace, monospace">{d.day}d</text>
                ))}

                <path d={areaPath} fill="url(#batuku-chart-grad)" />
                <path d={linePath} fill="none" stroke="var(--color-coral)"
                      strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx={x(data.length - 1)} cy={y(last.plays)} r="4" fill="var(--color-coral)" />
                <circle cx={x(data.length - 1)} cy={y(last.plays)} r="9" fill="var(--color-coral)" opacity="0.2" />
            </svg>
        </div>
    );
}
