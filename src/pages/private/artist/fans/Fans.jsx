import { useState, useEffect, useMemo } from 'react'
import { FaUsers, FaUserPlus, FaHeart, FaBolt } from 'react-icons/fa'
import AppShell  from '../../../../components/HomeComponents/AppShell.jsx'
import FansTable from './FansTable.jsx'
import FansSidebar from './FansSidebar.jsx'
import { API, getToken } from '../../../../utils/auth.js'
import './Fans.css'

function isWithinDays(isoStr, days) {
    if (!isoStr) return false
    return (Date.now() - new Date(isoStr).getTime()) < days * 86_400_000
}

export default function Fans() {
    const [fans,    setFans]    = useState([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')

    useEffect(() => {
        fetch(`${API}/api/artist-follows/fans`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : Promise.reject(`Erro ${r.status}`))
            .then(setFans)
            .catch(err => setError(String(err)))
            .finally(() => setLoading(false))
    }, [])

    const summary = useMemo(() => ({
        total:       fans.length,
        newThisWeek: fans.filter(f => isWithinDays(f.followedAt, 7)).length,
        active:      fans.filter(f => isWithinDays(f.lastPlayedAt, 30)).length,
        retention:   fans.length > 0
            ? Math.round((fans.filter(f => isWithinDays(f.lastPlayedAt, 30)).length / fans.length) * 100)
            : 0,
    }), [fans])

    const KPI_META = [
        { key: 'total',       label: 'Total de fãs',      value: summary.total,           icon: FaUsers,    accent: 'coral',   sub: 'seguidores activos'     },
        { key: 'newThisWeek', label: 'Novos esta semana',  value: summary.newThisWeek,     icon: FaUserPlus, accent: 'ocean',   sub: 'vs semana anterior'     },
        { key: 'active',      label: 'Activos (30 dias)',  value: summary.active,          icon: FaBolt,     accent: 'mustard', sub: 'ouviram este mês'       },
        { key: 'retention',   label: 'Retenção',           value: `${summary.retention}%`, icon: FaHeart,    accent: 'green',   sub: 'voltaram no último mês' },
    ]

    return (
        <AppShell role="artist">

            <div className="fns__header">
                <div>
                    <h1 className="fns__title">Os meus fãs</h1>
                    <p className="fns__subtitle">Conhece a tua audiência e acompanha o crescimento</p>
                </div>
            </div>

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
                            {loading ? '—' : (typeof value === 'number' ? value.toLocaleString('pt-PT') : value)}
                        </div>
                        <div className="fns__kpi-sub">{sub}</div>
                    </div>
                ))}
            </div>

            {error && <p style={{ color: 'var(--color-danger)', marginBottom: 16 }}>{error}</p>}

            <div className="fns__body">
                <FansTable fans={fans} loading={loading} />
                <FansSidebar fans={fans} loading={loading} />
            </div>

        </AppShell>
    )
}
