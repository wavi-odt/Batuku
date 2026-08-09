import { useState, useEffect, useRef } from 'react'

const H   = 200
const PAD = { t: 20, r: 20, b: 36, l: 52 }

function fmtDate(iso) {
    if (!iso) return ''
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}

function fmtNum(n) {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}

function stepPath(pts) {
    if (pts.length < 2) return pts.length === 1 ? `M ${pts[0].x} ${pts[0].y}` : ''
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 1; i < pts.length; i++) {
        d += ` H ${pts[i].x.toFixed(1)} V ${pts[i].y.toFixed(1)}`
    }
    return d
}

export default function AnalyticsStepChart({ dailyFollowers }) {
    const containerRef = useRef(null)
    const [W, setW]    = useState(700)
    const [hover, setHover] = useState(null)

    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])

    if (!dailyFollowers || dailyFollowers.length === 0) return null

    const innerW = W - PAD.l - PAD.r
    const innerH = H - PAD.t - PAD.b
    const botY   = PAD.t + innerH

    const max   = Math.max(...dailyFollowers.map(d => d.followers), 1)
    const min   = Math.min(...dailyFollowers.map(d => d.followers))
    const range = max - min || 1

    const xOf = i => PAD.l + (i / Math.max(dailyFollowers.length - 1, 1)) * innerW
    const yOf = v => PAD.t + (1 - (v - min) / range) * innerH

    const pts      = dailyFollowers.map((d, i) => ({ x: xOf(i), y: yOf(d.followers) }))
    const linePath = stepPath(pts)
    const areaPath = pts.length >= 2
        ? `${linePath} V ${botY} H ${pts[0].x.toFixed(1)} Z`
        : ''

    const total     = dailyFollowers[dailyFollowers.length - 1]?.followers ?? 0
    const allFlat   = range === 0

    const tickCount = Math.min(dailyFollowers.length, dailyFollowers.length <= 7 ? dailyFollowers.length : 7)
    const xTicks    = tickCount <= 1 ? [0] : Array.from({ length: tickCount }, (_, k) =>
        k === tickCount - 1 ? dailyFollowers.length - 1 : Math.round(k * (dailyFollowers.length - 1) / (tickCount - 1))
    )

    const yGridVals = Array.from({ length: 5 }, (_, i) => Math.round(max - (i / 4) * range))

    return (
        <div className="anl__line-card">
            <div className="anl__line-head">
                <div>
                    <h3 className="anl__line-title">Crescimento de seguidores</h3>
                    <p className="anl__line-sub">
                        {fmtDate(dailyFollowers[0]?.day)} — {fmtDate(dailyFollowers[dailyFollowers.length - 1]?.day)}
                    </p>
                </div>
                <div className="anl__line-total">
                    <div className="anl__line-total-val">{total.toLocaleString('pt-PT')}</div>
                    <div className="anl__line-total-label">seguidores no total</div>
                </div>
            </div>

            <div ref={containerRef} className="anl__svg-wrap" style={{ position: 'relative' }}>
                {allFlat && (
                    <div className="anl__chart-empty">Sem novos seguidores neste período</div>
                )}

                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="anl__svg"
                    onMouseLeave={() => setHover(null)}>
                    <defs>
                        <linearGradient id="anl-step-grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%"   stopColor="var(--color-ocean)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="var(--color-ocean)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {yGridVals.map((val, i) => {
                        const yi = PAD.t + (i / 4) * innerH
                        return (
                            <g key={i}>
                                <line x1={PAD.l} y1={yi} x2={W - PAD.r} y2={yi}
                                    stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                <text x={PAD.l - 8} y={yi + 4} textAnchor="end" fontSize="10"
                                    fill="var(--color-ink-mute)"
                                    fontFamily="var(--font-mono, ui-monospace, monospace)">
                                    {fmtNum(val)}
                                </text>
                            </g>
                        )
                    })}

                    {!allFlat && <path d={areaPath} fill="url(#anl-step-grad)" />}

                    {!allFlat && (
                        <path d={linePath} fill="none"
                            stroke="var(--color-ocean)" strokeWidth="2.5"
                            strokeLinejoin="miter" strokeLinecap="square" />
                    )}

                    {xTicks.map(idx => (
                        <text key={idx}
                            x={xOf(idx)} y={H - 6}
                            textAnchor="middle" fontSize="10"
                            fill="var(--color-ink-mute)"
                            fontFamily="var(--font-mono, ui-monospace, monospace)">
                            {fmtDate(dailyFollowers[idx]?.day)}
                        </text>
                    ))}

                    {dailyFollowers.map((d, i) => (
                        <rect key={i}
                            x={xOf(i) - innerW / dailyFollowers.length / 2}
                            y={PAD.t}
                            width={innerW / dailyFollowers.length}
                            height={innerH}
                            fill="transparent"
                            onMouseEnter={() => setHover({ i, d })}
                        />
                    ))}

                    {hover && (() => {
                        const cx = xOf(hover.i)
                        const cy = yOf(hover.d.followers)
                        return (
                            <g pointerEvents="none">
                                <line x1={cx} y1={PAD.t} x2={cx} y2={botY}
                                    stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
                                <circle cx={cx} cy={cy} r="5" fill="var(--color-ocean)" />
                                <circle cx={cx} cy={cy} r="9" fill="var(--color-ocean)" opacity="0.2" />
                            </g>
                        )
                    })()}
                </svg>

                {hover && (() => {
                    const cx   = xOf(hover.i)
                    const cy   = yOf(hover.d.followers)
                    const flip = cx > W * 0.75
                    return (
                        <div className="anl__tooltip-html" style={{
                            left:  flip ? 'auto' : cx + 10,
                            right: flip ? W - cx + 10 : 'auto',
                            top:   Math.max(PAD.t, cy - 52),
                        }}>
                            <div className="anl__tooltip-date">{fmtDate(hover.d.day)}</div>
                            <div className="anl__tooltip-val">{hover.d.followers.toLocaleString('pt-PT')} seg.</div>
                        </div>
                    )
                })()}
            </div>
        </div>
    )
}
