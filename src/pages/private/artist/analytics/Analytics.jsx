/* ─────────────────────────────────────────────────────────────────
   pages/artist/analytics/Analytics.jsx, Dashboard de analytics.
   ───────────────────────────────────────────────────────────────── */

import { useState }           from 'react'
import { FaPlay, FaUsers, FaBookmark, FaHeadphones } from 'react-icons/fa'
import AppShell               from '../../../../components/HomeComponents/AppShell.jsx'
import { analyticsData }      from '../../../../data/analytics.js'
import AnalyticsLineChart     from './AnalyticsLineChart.jsx'
import AnalyticsBreakdown     from './AnalyticsBreakdown.jsx'
import AnalyticsTopTracks     from './AnalyticsTopTracks.jsx'
import './Analytics.css'

const d = analyticsData;

const PERIODS = ['7d', '30d', '90d'];

const KPI_META = [
    { key: 'plays',     icon: FaPlay,        accent: 'coral'   },
    { key: 'listeners', icon: FaHeadphones,  accent: 'ocean'   },
    { key: 'followers', icon: FaUsers,        accent: 'mustard' },
    { key: 'saves',     icon: FaBookmark,     accent: 'green'   },
];

export default function Analytics() {
    const [period, setPeriod] = useState('30d');

    const kpis = d.kpis[period];

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

            {/* ─── KPIs ─────────────────────────────────────────── */}
            <div className="anl__kpis">
                {KPI_META.map(({ key, icon: Icon, accent }) => {
                    const kpi  = kpis[key];
                    const isUp = kpi.delta > 0;
                    return (
                        <div key={key} className="anl__kpi">
                            <div className="anl__kpi-label">
                                <span className={`anl__kpi-icon anl__kpi-icon--${accent}`}>
                                    <Icon size={12} />
                                </span>
                                {kpi.label}
                            </div>
                            <div className="anl__kpi-val">
                                {kpi.value.toLocaleString('pt-PT')}
                            </div>
                            <div className={`anl__kpi-delta anl__kpi-delta--${isUp ? 'up' : 'down'}`}>
                                {isUp ? '↑' : '↓'} {Math.abs(kpi.delta)}%
                                <span className="anl__kpi-period"> vs período anterior</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ─── Gráfico de linha ─────────────────────────────── */}
            <AnalyticsLineChart dailyPlays={d.dailyPlays} period={period} />

            {/* ─── Breakdown: fontes + localização + top faixas ── */}
            <AnalyticsBreakdown
                sources={d.sources}
                locations={d.locations}
                topTracks={d.topTracks}
            />

            {/* ─── Engagement ───────────────────────────────────── */}
            <div className="anl__engage">
                {d.engagement.map(e => (
                    <div key={e.key} className="anl__eng-card">
                        <div className="anl__eng-val">{e.value}{e.unit}</div>
                        <div className="anl__eng-label">{e.label}</div>
                        <div className="anl__eng-sub">{e.sub}</div>
                    </div>
                ))}
            </div>

            {/* ─── Tabela top faixas ────────────────────────────── */}
            <AnalyticsTopTracks tracks={d.topTracks} />

        </AppShell>
    );
}
