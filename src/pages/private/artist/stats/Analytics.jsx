import { useState, useEffect } from 'react'
import { FaPlay, FaUsers, FaHeart, FaCheckCircle } from 'react-icons/fa'
import AppShell from '../../../../components/HomeComponents/AppShell.jsx'
import { API, getToken } from '../../../../utils/auth.js'
import AnalyticsLineChart from './AnalyticsLineChart.jsx'
import AnalyticsBarChart   from './AnalyticsBarChart.jsx'
import AnalyticsStepChart  from './AnalyticsStepChart.jsx'
import AnalyticsDonut      from './AnalyticsDonut.jsx'
import AnalyticsTopTracks  from './AnalyticsTopTracks.jsx'
import AnalyticsBreakdown  from './AnalyticsBreakdown.jsx'
import './Analytics.css'

const PERIODS = ['7d', '30d', '90d']

const KPI_META = [
    { key: 'plays',     icon: FaPlay,        accent: 'coral'   },
    { key: 'likes',     icon: FaHeart,       accent: 'green'   },
    { key: 'followers', icon: FaUsers,       accent: 'mustard' },
    { key: 'completion', icon: FaCheckCircle, accent: 'ocean'  },
]

export default function Analytics() {
    const [period,  setPeriod]  = useState('30d')
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')

    useEffect(() => {
        setLoading(true)
        setError('')
        fetch(`${API}/api/stats/me?period=${period}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : Promise.reject(new Error(`Erro ${r.status}`)))
            .then(d => { setData(d); setLoading(false) })
            .catch(e => { setError(e.message); setLoading(false) })
    }, [period])

    const completionKpi = data ? {
        value: data.completionRate,
        delta: 0,
        label: 'Taxa de conclusão',
    } : null

    const kpis = data ? [
        ...KPI_META.slice(0, 3).map(m => ({ ...m, kpi: data.kpis[m.key] })).filter(m => m.kpi),
        ...(completionKpi && data.completionRate > 0
            ? [{ ...KPI_META[3], kpi: completionKpi }]
            : []),
    ] : []

    const dailyPlays     = (data?.dailyPlays     ?? []).map(d => ({ day: d.day, plays: d.plays }))
    const dailyLikes     = (data?.dailyLikes     ?? []).map(d => ({ day: d.day, likes: d.likes }))
    const dailyFollowers = (data?.dailyFollowers ?? []).map(d => ({ day: d.day, followers: d.followers }))
    const topTracks      = data?.topTracks ?? []
    const sources        = data?.sources   ?? []
    const locations      = data?.locations ?? []

    return (
        <AppShell role="artist">

            {/* ─── Header ───────────────────────────────────────── */}
            <div className="anl__header">
                <div>
                    <h1 className="anl__title">Analytics</h1>
                    <p className="anl__subtitle">Métricas detalhadas do teu catálogo</p>
                </div>
                <div className="anl__period-tabs">
                    {PERIODS.map(p => (
                        <button
                            key={p}
                            type="button"
                            className={`anl__period-tab${period === p ? ' anl__period-tab--active' : ''}`}
                            onClick={() => setPeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-ink-mute)' }}>
                    A carregar…
                </div>
            )}

            {error && !loading && (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-danger)' }}>
                    {error}
                </div>
            )}

            {!loading && !error && data && (
                <>
                    {/* ─── KPIs ─────────────────────────────────────── */}
                    <div className="anl__kpis">
                        {kpis.map(({ key, icon: Icon, accent, kpi }) => {
                            const isUp = kpi.delta > 0
                            return (
                                <div key={key} className="anl__kpi">
                                    <div className="anl__kpi-label">
                                        <span className={`anl__kpi-icon anl__kpi-icon--${accent}`}>
                                            <Icon size={12} />
                                        </span>
                                        {kpi.label}
                                    </div>
                                    <div className="anl__kpi-val">
                                        {key === 'completion'
                                            ? `${kpi.value.toLocaleString('pt-PT')}%`
                                            : kpi.value.toLocaleString('pt-PT')}
                                    </div>
                                    {kpi.delta !== 0 && (
                                        <div className={`anl__kpi-delta anl__kpi-delta--${isUp ? 'up' : 'down'}`}>
                                            {isUp ? '↑' : '↓'} {Math.abs(kpi.delta)}%
                                            <span className="anl__kpi-period"> vs período anterior</span>
                                        </div>
                                    )}
                                    {kpi.delta === 0 && (
                                        <div className="anl__kpi-delta" style={{ color: 'var(--color-ink-mute)' }}>
                                            — sem dados anteriores
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* ─── Reproduções ──────────────────────────────── */}
                    <AnalyticsLineChart dailyPlays={dailyPlays} period={period} />

                    {/* ─── Donut + Likes ───────────────────────────── */}
                    <div className="anl__row-2">
                        <AnalyticsDonut completionRate={data.completionRate} />
                        <AnalyticsBarChart dailyLikes={dailyLikes} />
                    </div>

                    {/* ─── Seguidores ────────────────────────────────── */}
                    <AnalyticsStepChart dailyFollowers={dailyFollowers} />

                    {/* ─── Tabela top faixas ────────────────────────── */}
                    <AnalyticsTopTracks tracks={topTracks} />

                    {/* ─── Breakdown: fontes + localizações ─────────── */}
                    {(sources.length > 0 || locations.length > 0) && (
                        <AnalyticsBreakdown
                            sources={sources}
                            locations={locations}
                            topTracks={topTracks}
                        />
                    )}
                </>
            )}

        </AppShell>
    )
}
