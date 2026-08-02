/* ─────────────────────────────────────────────────────────────────
   pages/artist/fans/Fans.jsx  ·  Os meus fãs
   ───────────────────────────────────────────────────────────────── */

import { FaUsers, FaUserPlus, FaHeart, FaBolt } from 'react-icons/fa'
import AppShell    from '../../../../components/HomeComponents/AppShell.jsx'
import FansTable   from './FansTable.jsx'
import FansSidebar from './FansSidebar.jsx'
import { fansData } from '../../../../data/fans.js'
import './Fans.css'

const { summary } = fansData;

const KPI_META = [
    { key: 'total',       label: 'Total de fãs',      value: summary.total,       icon: FaUsers,    accent: 'coral',   sub: 'seguidores activos'    },
    { key: 'newThisWeek', label: 'Novos esta semana',  value: summary.newThisWeek, icon: FaUserPlus, accent: 'ocean',   sub: 'vs semana anterior'    },
    { key: 'active',      label: 'Activos (30 dias)',  value: summary.active,      icon: FaBolt,     accent: 'mustard', sub: 'ouviram este mês'      },
    { key: 'retention',   label: 'Retenção',           value: `${summary.retention}%`, icon: FaHeart, accent: 'green', sub: 'voltaram no último mês' },
];

export default function Fans() {
    return (
        <AppShell role="artist">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="fns__header">
                <div>
                    <h1 className="fns__title">Os meus fãs</h1>
                    <p className="fns__subtitle">Conhece a tua audiência e acompanha o crescimento</p>
                </div>
            </div>

            {/* ── KPIs ───────────────────────────────────────────── */}
            <div className="fns__kpis">
                {KPI_META.map(({ key, label, value, icon: Icon, accent, sub }) => (
                    <div key={key} className="fns__kpi">
                        <div className="fns__kpi-label">
                            <span className={`fns__kpi-icon fns__kpi-icon--${accent}`}>
                                <Icon size={11} />
                            </span>
                            {label}
                        </div>
                        <div className="fns__kpi-val">
                            {typeof value === 'number' ? value.toLocaleString('pt-PT') : value}
                        </div>
                        <div className="fns__kpi-sub">{sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Body ───────────────────────────────────────────── */}
            <div className="fns__body">
                <FansTable />
                <FansSidebar />
            </div>

        </AppShell>
    );
}
