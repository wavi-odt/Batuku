import { useState, useEffect, useRef } from 'react'

const H   = 200
const PAD = { t: 20, r: 20, b: 36, l: 52 }
const GAP = 3

function fmtDate(iso) {
    if (!iso) return ''
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}

function fmtNum(n) {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}

export default function AnalyticsBarChart({ dailyLikes }) {
    const containerRef = useRef(null)
    const [W, setW]    = useState(700)
    const [hover, setHover] = useState(null)

    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])

    const innerW = W - PAD.l - PAD.r
    const innerH = H - PAD.t - PAD.b
    const botY   = PAD.t + innerH

    const n      = dailyLikes.length
    const max    = Math.max(...dailyLikes.map(d => d.likes), 1)
    const barW   = Math.max(2, (innerW - (n - 1) * GAP) / n)
    const xOf    = i => PAD.l + i * (barW + GAP)
    const yOf    = v => PAD.t + (1 - v / max) * innerH
    const total  = dailyLikes.reduce((s, d) => s + d.likes, 0)
    const allZero = max === 1 && total === 0

    const yGridVals = Array.from({ length: 5 }, (_, i) => Math.round(max * (1 - i / 4)))
    const tickCount = Math.min(n, n <= 7 ? n : 7)
    const xTicks    = tickCount <= 1 ? [0] : Array.from({ length: tickCount }, (_, k) =>
        k === tickCount - 1 ? n - 1 : Math.round(k * (n - 1) / (tickCount - 1))
    )

    return (
        <div className="anl__bar-card">
            <div className="anl__line-head">
                <div>
                    <h3 className="anl__line-title">Likes ao longo do tempo</h3>
                    <p className="anl__line-sub">
                        {fmtDate(dailyLikes[0]?.day)} — {fmtDate(dailyLikes[n - 1]?.day)}
                    </p>
                </div>
                <div className="anl__line-total">
                    <div className="anl__line-total-val">{total.toLocaleString('pt-PT')}</div>
                    <div className="anl__line-total-label">likes no período</div>
                </div>
            </div>

            <div ref={containerRef} className="anl__svg-wrap" style={{ position: 'relative' }}>
                {allZero && (
                    <div className="anl__chart-empty">Sem likes neste período</div>
                )}

                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="anl__svg"
                    onMouseLeave={() => setHover(null)}>
                    <defs>
                        <linearGradient id="anl-bar-grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%"   stopColor="var(--color-green)" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="var(--color-ocean)" stopOpacity="0.55" />
                        </linearGradient>
                        <linearGradient id="anl-bar-hover" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%"   stopColor="var(--color-green)" />
                            <stop offset="100%" stopColor="var(--color-ocean)" />
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

                    {!allZero && dailyLikes.map((d, i) => {
                        const bh = Math.max((d.likes / max) * innerH, d.likes > 0 ? 2 : 0)
                        return (
                            <rect key={i}
                                x={xOf(i)} y={botY - bh}
                                width={barW} height={bh}
                                fill={hover?.i === i ? 'url(#anl-bar-hover)' : 'url(#anl-bar-grad)'}
                                rx="2"
                                onMouseEnter={() => setHover({ i, d })}
                            />
                        )
                    })}

                    {xTicks.map(idx => (
                        <text key={idx}
                            x={xOf(idx) + barW / 2} y={H - 6}
                            textAnchor="middle" fontSize="10"
                            fill="var(--color-ink-mute)"
                            fontFamily="var(--font-mono, ui-monospace, monospace)">
                            {fmtDate(dailyLikes[idx]?.day)}
                        </text>
                    ))}
                </svg>

                {hover && (() => {
                    const cx   = xOf(hover.i) + barW / 2
                    const cy   = yOf(hover.d.likes)
                    const flip = cx > W * 0.75
                    return (
                        <div className="anl__tooltip-html" style={{
                            left:  flip ? 'auto' : cx + 10,
                            right: flip ? W - cx + 10 : 'auto',
                            top:   Math.max(PAD.t, cy - 52),
                        }}>
                            <div className="anl__tooltip-date">{fmtDate(hover.d.day)}</div>
                            <div className="anl__tooltip-val">{hover.d.likes.toLocaleString('pt-PT')} likes</div>
                        </div>
                    )
                })()}
            </div>
        </div>
    )
}
