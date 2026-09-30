import { useState, useEffect, useRef } from 'react'
import { BsStars } from 'react-icons/bs'
import { API, getToken } from '../../../../utils/auth.js'
import './Analytics.css'
import './AnalyticsForecast.css'

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

const TREND_LABELS = { CRESCENTE: '↑ Crescente', ESTAVEL: '→ Estável', DECRESCENTE: '↓ Decrescente' }
const TREND_CSS    = { CRESCENTE: 'fcst__trend--up', ESTAVEL: 'fcst__trend--flat', DECRESCENTE: 'fcst__trend--down' }

export default function AnalyticsForecast() {
    const containerRef = useRef(null)
    const [W, setW]         = useState(700)
    const [hover, setHover] = useState(null)
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')

    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [loading])

    useEffect(() => {
        setLoading(true)
        setError('')
        fetch(`${API}/api/stats/me/forecast?historyDays=30&forecastDays=7`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : Promise.reject(new Error(`Erro ${r.status}`)))
            .then(d => { setData(d); setLoading(false) })
            .catch(e => { setError(e.message); setLoading(false) })
    }, [])

    if (loading) return (
        <div className="fcst__card">
            <div className="fcst__head"><h3 className="fcst__title">Previsão de reproduções</h3></div>
            <div className="fcst__state">A carregar…</div>
        </div>
    )

    const historical = data?.historical ?? []
    const forecast   = data?.forecast   ?? []

    if (error || historical.length === 0) return (
        <div className="fcst__card">
            <div className="fcst__head"><h3 className="fcst__title">Previsão de reproduções</h3></div>
            <div className="fcst__state">Ainda não há dados suficientes para uma previsão.</div>
        </div>
    )

    const trend   = data.trend
    const insight = data.insight
    const allData   = [...historical, ...forecast]
    const histCount = historical.length

    const innerW = W - PAD.l - PAD.r
    const innerH = H - PAD.t - PAD.b
    const botY   = PAD.t + innerH

    const max   = Math.max(...allData.map(d => d.plays), 1)
    const min   = Math.min(...allData.map(d => d.plays))
    const range = max - min || 1

    const xOf = i => PAD.l + (i / Math.max(allData.length - 1, 1)) * innerW
    const yOf = v => PAD.t + (1 - (v - min) / range) * innerH

    const allPts  = allData.map((d, i) => ({ x: xOf(i), y: yOf(d.plays) }))
    const histPts = allPts.slice(0, histCount)
    const fcstPts = allPts.slice(histCount - 1)

    const histLine = smoothPath(histPts)
    const fcstLine = smoothPath(fcstPts)
    const areaPath = histPts.length >= 2
        ? `${histLine} L ${histPts[histPts.length - 1].x.toFixed(1)} ${botY} L ${histPts[0].x.toFixed(1)} ${botY} Z`
        : ''

    const tickCount = Math.min(allData.length, allData.length <= 7 ? allData.length : 7)
    const xTicks = tickCount <= 1
        ? [0]
        : Array.from({ length: tickCount }, (_, k) =>
            k === tickCount - 1 ? allData.length - 1 : Math.round(k * (allData.length - 1) / (tickCount - 1))
          )

    const yGridVals = Array.from({ length: 5 }, (_, i) => Math.round(max - (i / 4) * range))
    const boundX    = histCount > 0 ? xOf(histCount - 1) : null

    return (
        <div className="fcst__card">
            <div className="fcst__head">
                <div>
                    <h3 className="fcst__title">Previsão de reproduções</h3>
                    <p className="fcst__sub">
                        {fmtDate(historical[0]?.day)} a {fmtDate(
                            forecast.length > 0 ? forecast[forecast.length - 1]?.day : historical[historical.length - 1]?.day
                        )}
                    </p>
                </div>
                {trend && (
                    <span className={`fcst__trend ${TREND_CSS[trend] ?? ''}`}>
                        {TREND_LABELS[trend] ?? trend}
                    </span>
                )}
            </div>

            <div ref={containerRef} className="anl__svg-wrap" style={{ position: 'relative' }}>
                <svg
                    width={W} height={H} viewBox={`0 0 ${W} ${H}`}
                    className="anl__svg"
                    onMouseLeave={() => setHover(null)}
                >
                    <defs>
                        <linearGradient id="fcst-area-grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%"   stopColor="var(--color-coral)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--color-coral)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="fcst-line-grad" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%"   stopColor="var(--color-coral)"   stopOpacity="0.7" />
                            <stop offset="100%" stopColor="var(--color-mustard)" stopOpacity="1" />
                        </linearGradient>
                    </defs>

                    {yGridVals.map((val, i) => {
                        const yi = PAD.t + (i / 4) * innerH
                        return (
                            <g key={i}>
                                <line x1={PAD.l} y1={yi} x2={W - PAD.r} y2={yi} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                <text x={PAD.l - 8} y={yi + 4} textAnchor="end" fontSize="10" fill="var(--color-ink-mute)" fontFamily="var(--font-mono, ui-monospace, monospace)">
                                    {fmtNum(val)}
                                </text>
                            </g>
                        )
                    })}

                    {areaPath && <path d={areaPath} fill="url(#fcst-area-grad)" />}

                    {histLine && (
                        <path d={histLine} fill="none" stroke="url(#fcst-line-grad)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    )}

                    {fcstLine && forecast.length > 0 && (
                        <path d={fcstLine} fill="none" stroke="var(--color-ocean)" strokeWidth="2" strokeDasharray="5 3" strokeLinejoin="round" strokeLinecap="round" opacity="0.65" />
                    )}

                    {boundX != null && forecast.length > 0 && (
                        <line x1={boundX} y1={PAD.t} x2={boundX} y2={botY} stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="4 4" />
                    )}

                    {xTicks.map(idx => (
                        <text key={idx} x={xOf(idx)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--color-ink-mute)" fontFamily="var(--font-mono, ui-monospace, monospace)">
                            {fmtDate(allData[idx]?.day)}
                        </text>
                    ))}

                    {histPts.length > 0 && (() => {
                        const last = histPts[histPts.length - 1]
                        return (
                            <g>
                                <circle cx={last.x} cy={last.y} r="10" fill="var(--color-coral)" opacity="0.12" />
                                <circle cx={last.x} cy={last.y} r="4"  fill="var(--color-coral)" />
                            </g>
                        )
                    })()}

                    {fcstPts.length > 1 && forecast.length > 0 && (() => {
                        const last = fcstPts[fcstPts.length - 1]
                        return (
                            <g>
                                <circle cx={last.x} cy={last.y} r="8" fill="var(--color-ocean)" opacity="0.2" />
                                <circle cx={last.x} cy={last.y} r="3" fill="var(--color-ocean)" opacity="0.8" />
                            </g>
                        )
                    })()}

                    {allData.map((d, i) => (
                        <rect
                            key={i}
                            x={xOf(i) - innerW / allData.length / 2}
                            y={PAD.t}
                            width={innerW / allData.length}
                            height={innerH}
                            fill="transparent"
                            onMouseEnter={() => setHover({ i, d, isForecast: i >= histCount })}
                        />
                    ))}

                    {hover && (() => {
                        const cx = xOf(hover.i)
                        const cy = yOf(hover.d.plays)
                        const dotColor = hover.isForecast ? 'var(--color-ocean)' : 'var(--color-coral)'
                        return (
                            <g pointerEvents="none">
                                <line x1={cx} y1={PAD.t} x2={cx} y2={botY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
                                <circle cx={cx} cy={cy} r="5" fill={dotColor} />
                                <circle cx={cx} cy={cy} r="9" fill={dotColor} opacity="0.2" />
                            </g>
                        )
                    })()}
                </svg>

                {hover && (() => {
                    const cx   = xOf(hover.i)
                    const cy   = yOf(hover.d.plays)
                    const flip = cx > W * 0.75
                    return (
                        <div
                            className="anl__tooltip-html"
                            style={{
                                left:          flip ? 'auto' : cx + 10,
                                right:         flip ? W - cx + 10 : 'auto',
                                top:           Math.max(PAD.t, cy - 52),
                                pointerEvents: 'none',
                            }}
                        >
                            <div className="anl__tooltip-date">
                                {fmtDate(hover.d.day)}{hover.isForecast ? ' (previsão)' : ''}
                            </div>
                            <div className="anl__tooltip-val">
                                {hover.d.plays.toLocaleString('pt-PT')} rep.
                            </div>
                        </div>
                    )
                })()}
            </div>

            {forecast.length > 0 && (
                <div className="fcst__legend">
                    <span className="fcst__legend-item">
                        <span className="fcst__legend-line" />
                        Histórico
                    </span>
                    <span className="fcst__legend-item">
                        <span className="fcst__legend-line fcst__legend-line--dashed" />
                        Previsão
                    </span>
                </div>
            )}

            {insight && (
                <div className="fcst__insight">
                    <BsStars className="fcst__insight-icon" size={14} />
                    <p className="fcst__insight-text">{insight}</p>
                </div>
            )}
        </div>
    )
}
