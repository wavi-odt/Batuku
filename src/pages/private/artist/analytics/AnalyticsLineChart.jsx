/* ─────────────────────────────────────────────────────────────────
   AnalyticsLineChart.jsx, Gráfico SVG de reproduções ao longo do
   tempo. Sem dependências externas — puro SVG calculado em JS.
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'

const PERIOD_DAYS = { '7d': 7, '30d': 30, '90d': 90 };

export default function AnalyticsLineChart({ dailyPlays, period }) {
    const [hover, setHover] = useState(null);

    const slice = dailyPlays.slice(-PERIOD_DAYS[period]);

    const W = 700, H = 200;
    const pad = { t: 14, r: 14, b: 26, l: 44 };
    const innerW = W - pad.l - pad.r;
    const innerH = H - pad.t - pad.b;

    const max = Math.max(...slice.map(d => d.plays));
    const min = Math.min(...slice.map(d => d.plays));
    const range = max - min || 1;

    const xOf = (i) => pad.l + (i / (slice.length - 1)) * innerW;
    const yOf = (v) => pad.t + (1 - (v - min) / range) * innerH;

    const linePath = slice.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i).toFixed(1)} ${yOf(d.plays).toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L ${xOf(slice.length - 1).toFixed(1)} ${(pad.t + innerH).toFixed(1)} L ${xOf(0).toFixed(1)} ${(pad.t + innerH).toFixed(1)} Z`;

    const total = slice.reduce((s, d) => s + d.plays, 0);

    /* X-axis ticks */
    const tickCount  = slice.length <= 7 ? slice.length : 6;
    const tickStep   = Math.floor((slice.length - 1) / (tickCount - 1));
    const xTicks     = Array.from({ length: tickCount }, (_, i) =>
        i === tickCount - 1 ? slice.length - 1 : i * tickStep
    );

    /* Y-axis ticks */
    const yTicks = 4;

    return (
        <div className="anl__line-card">
            <div className="anl__line-head">
                <div>
                    <h3 className="anl__line-title">Reproduções ao longo do tempo</h3>
                    <p className="anl__line-sub">Últimos {PERIOD_DAYS[period]} dias</p>
                </div>
                <div className="anl__line-total">
                    <div className="anl__line-total-val">{total.toLocaleString('pt-PT')}</div>
                    <div className="anl__line-total-label">reproduções no período</div>
                </div>
            </div>

            <svg
                className="anl__svg"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                onMouseLeave={() => setHover(null)}
            >
                <defs>
                    <linearGradient id="anl-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%"   stopColor="var(--color-coral)" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="var(--color-coral)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Y grid + labels */}
                {Array.from({ length: yTicks + 1 }).map((_, i) => {
                    const yi  = pad.t + (i / yTicks) * innerH;
                    const val = Math.round(max - (i / yTicks) * range);
                    return (
                        <g key={i}>
                            <line x1={pad.l} y1={yi} x2={W - pad.r} y2={yi}
                                  stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            <text x={pad.l - 8} y={yi + 4} textAnchor="end"
                                  fontSize="10" fill="var(--color-ink-mute)"
                                  fontFamily="ui-monospace,monospace">
                                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                            </text>
                        </g>
                    );
                })}

                {/* X labels */}
                {xTicks.map(idx => (
                    <text key={idx}
                          x={xOf(idx)} y={H - 6}
                          textAnchor="middle"
                          fontSize="10" fill="var(--color-ink-mute)"
                          fontFamily="ui-monospace,monospace">
                        {`${idx + 1}d`}
                    </text>
                ))}

                {/* Area + line */}
                <path d={areaPath} fill="url(#anl-grad)" />
                <path d={linePath} fill="none"
                      stroke="var(--color-coral)" strokeWidth="2"
                      strokeLinejoin="round" strokeLinecap="round" />

                {/* Hover targets (invisible wide columns) */}
                {slice.map((d, i) => (
                    <rect
                        key={i}
                        x={xOf(i) - innerW / slice.length / 2}
                        y={pad.t}
                        width={innerW / slice.length}
                        height={innerH}
                        fill="transparent"
                        onMouseEnter={() => setHover({ i, d })}
                    />
                ))}

                {/* Dot on last point */}
                <circle cx={xOf(slice.length - 1)} cy={yOf(slice[slice.length - 1].plays)}
                        r="4" fill="var(--color-coral)" />
                <circle cx={xOf(slice.length - 1)} cy={yOf(slice[slice.length - 1].plays)}
                        r="9" fill="var(--color-coral)" opacity="0.18" />

                {/* Tooltip on hover */}
                {hover && (() => {
                    const cx = xOf(hover.i);
                    const cy = yOf(hover.d.plays);
                    const tw = 72, th = 30;
                    const tx = Math.min(cx - tw / 2, W - pad.r - tw);
                    const ty = Math.max(pad.t, cy - th - 10);
                    return (
                        <g className="anl__tooltip">
                            <line x1={cx} y1={pad.t} x2={cx} y2={pad.t + innerH}
                                  stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
                            <circle cx={cx} cy={cy} r="4" fill="var(--color-coral)" />
                            <rect x={tx} y={ty} width={tw} height={th}
                                  rx="5" fill="var(--color-surface)"
                                  stroke="var(--color-border)" strokeWidth="1" />
                            <text x={tx + tw / 2} y={ty + 12}
                                  textAnchor="middle" fontSize="10"
                                  fill="var(--color-ink-mute)"
                                  fontFamily="ui-monospace,monospace">
                                Dia {hover.d.day}
                            </text>
                            <text x={tx + tw / 2} y={ty + 24}
                                  textAnchor="middle" fontSize="11"
                                  fontWeight="600" fill="var(--color-ink)"
                                  fontFamily="ui-monospace,monospace">
                                {hover.d.plays.toLocaleString('pt-PT')}
                            </text>
                        </g>
                    );
                })()}
            </svg>
        </div>
    );
}
