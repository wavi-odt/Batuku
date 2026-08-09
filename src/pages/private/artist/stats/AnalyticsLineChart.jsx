import { useState, useEffect, useRef } from 'react'
import './Analytics.css'

const H   = 220
const PAD = { t: 20, r: 20, b: 36, l: 52 }

function fmtDate(iso) {
    if (!iso) return ''
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}

function fmtNum(n) {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}

/* Catmull-Rom → cúbicas Bézier suavizadas */
function smoothPath(pts) {
    if (pts.length < 2) return pts.length === 1 ? `M ${pts[0].x} ${pts[0].y}` : ''
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 1; i < pts.length; i++) {
        const p0 = pts[Math.max(0, i - 2)]
        const p1 = pts[i - 1]
        const p2 = pts[i]
        const p3 = pts[Math.min(pts.length - 1, i + 1)]
        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
}

export default function AnalyticsLineChart({ dailyPlays, period, onPeriodChange }) {
    const containerRef = useRef(null)
    const [W, setW]    = useState(700)
    const [hover, setHover] = useState(null)

    /* Ajusta largura real do contentor para evitar distorção de texto */
    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])

    const innerW = W - PAD.l - PAD.r
    const innerH = H - PAD.t - PAD.b
    const botY   = PAD.t + innerH

    const max   = Math.max(...dailyPlays.map(d => d.plays), 1)
    const min   = Math.min(...dailyPlays.map(d => d.plays))
    const range = max - min || 1

    const xOf = i  => PAD.l + (i / Math.max(dailyPlays.length - 1, 1)) * innerW
    const yOf = v  => PAD.t + (1 - (v - min) / range) * innerH

    const pts      = dailyPlays.map((d, i) => ({ x: xOf(i), y: yOf(d.plays) }))
    const linePath = smoothPath(pts)
    const areaPath = pts.length >= 2
        ? `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${botY} L ${pts[0].x.toFixed(1)} ${botY} Z`
        : ''

    const total = dailyPlays.reduce((s, d) => s + d.plays, 0)

    /* Ticks eixo X: máx 7 labels, sempre inclui primeiro e último */
    const tickCount = Math.min(dailyPlays.length, dailyPlays.length <= 7 ? dailyPlays.length : 7)
    const xTicks = tickCount <= 1 ? [0] : Array.from({ length: tickCount }, (_, k) =>
        k === tickCount - 1 ? dailyPlays.length - 1 : Math.round(k * (dailyPlays.length - 1) / (tickCount - 1))
    )

    /* Ticks eixo Y: 4 linhas */
    const yGridVals = Array.from({ length: 5 }, (_, i) => Math.round(max - (i / 4) * range))

    const allZero = max === 0

    return (
        <div className="anl__line-card">
            <div className="anl__line-head">
                <div>
                    <h3 className="anl__line-title">Reproduções ao longo do tempo</h3>
                    <p className="anl__line-sub">
                        {fmtDate(dailyPlays[0]?.day)} — {fmtDate(dailyPlays[dailyPlays.length - 1]?.day)}
                    </p>
                </div>
                {onPeriodChange ? (
                    <div className="anl__period-tabs">
                        {['7d', '30d', '90d'].map(r => (
                            <button
                                key={r}
                                type="button"
                                className={`anl__period-tab${period === r ? ' anl__period-tab--active' : ''}`}
                                onClick={() => onPeriodChange(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="anl__line-total">
                        <div className="anl__line-total-val">{total.toLocaleString('pt-PT')}</div>
                        <div className="anl__line-total-label">reproduções no período</div>
                    </div>
                )}
            </div>

            {/* Container para medir largura real */}
            <div ref={containerRef} className="anl__svg-wrap" style={{ position: 'relative' }}>

                {allZero && (
                    <div className="anl__chart-empty">
                        Sem reproduções neste período
                    </div>
                )}

                <svg
                    width={W}
                    height={H}
                    viewBox={`0 0 ${W} ${H}`}
                    className="anl__svg"
                    onMouseLeave={() => setHover(null)}
                >
                    <defs>
                        <linearGradient id="anl-area-grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%"   stopColor="var(--color-coral)" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="var(--color-coral)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="anl-line-grad" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%"   stopColor="var(--color-coral)"   stopOpacity="0.7" />
                            <stop offset="100%" stopColor="var(--color-mustard)" stopOpacity="1" />
                        </linearGradient>
                    </defs>

                    {/* Linhas de grelha Y */}
                    {yGridVals.map((val, i) => {
                        const yi = PAD.t + (i / 4) * innerH
                        return (
                            <g key={i}>
                                <line
                                    x1={PAD.l} y1={yi} x2={W - PAD.r} y2={yi}
                                    stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                                />
                                <text
                                    x={PAD.l - 8} y={yi + 4}
                                    textAnchor="end" fontSize="10"
                                    fill="var(--color-ink-mute)"
                                    fontFamily="var(--font-mono, ui-monospace, monospace)"
                                >
                                    {fmtNum(val)}
                                </text>
                            </g>
                        )
                    })}

                    {/* Área preenchida */}
                    {!allZero && <path d={areaPath} fill="url(#anl-area-grad)" />}

                    {/* Linha */}
                    {!allZero && (
                        <path
                            d={linePath}
                            fill="none"
                            stroke="url(#anl-line-grad)"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Labels eixo X */}
                    {xTicks.map(idx => (
                        <text
                            key={idx}
                            x={xOf(idx)} y={H - 6}
                            textAnchor="middle" fontSize="10"
                            fill="var(--color-ink-mute)"
                            fontFamily="var(--font-mono, ui-monospace, monospace)"
                        >
                            {fmtDate(dailyPlays[idx]?.day)}
                        </text>
                    ))}

                    {/* Ponto final */}
                    {!allZero && pts.length > 0 && (() => {
                        const last = pts[pts.length - 1]
                        return (
                            <g>
                                <circle cx={last.x} cy={last.y} r="10" fill="var(--color-coral)" opacity="0.12" />
                                <circle cx={last.x} cy={last.y} r="4"  fill="var(--color-coral)" />
                            </g>
                        )
                    })()}

                    {/* Linhas de captura de hover */}
                    {dailyPlays.map((d, i) => (
                        <rect
                            key={i}
                            x={xOf(i) - innerW / dailyPlays.length / 2}
                            y={PAD.t}
                            width={innerW / dailyPlays.length}
                            height={innerH}
                            fill="transparent"
                            onMouseEnter={() => setHover({ i, d })}
                        />
                    ))}

                    {/* Linha e ponto de hover */}
                    {hover && (() => {
                        const cx = xOf(hover.i)
                        const cy = yOf(hover.d.plays)
                        return (
                            <g pointerEvents="none">
                                <line
                                    x1={cx} y1={PAD.t} x2={cx} y2={botY}
                                    stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3"
                                />
                                <circle cx={cx} cy={cy} r="5" fill="var(--color-coral)" />
                                <circle cx={cx} cy={cy} r="9" fill="var(--color-coral)" opacity="0.2" />
                            </g>
                        )
                    })()}
                </svg>

                {/* Tooltip HTML (tipografia correcta, sem distorção) */}
                {hover && (() => {
                    const cx = xOf(hover.i)
                    const cy = yOf(hover.d.plays)
                    const flip = cx > W * 0.75
                    return (
                        <div
                            className="anl__tooltip-html"
                            style={{
                                left:      flip ? 'auto' : cx + 10,
                                right:     flip ? W - cx + 10 : 'auto',
                                top:       Math.max(PAD.t, cy - 52),
                                pointerEvents: 'none',
                            }}
                        >
                            <div className="anl__tooltip-date">{fmtDate(hover.d.day)}</div>
                            <div className="anl__tooltip-val">{hover.d.plays.toLocaleString('pt-PT')} rep.</div>
                        </div>
                    )
                })()}
            </div>
        </div>
    )
}
