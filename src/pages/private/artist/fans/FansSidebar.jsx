import { useMemo } from 'react'
import { timeAgo } from '../../../../utils/timeAgo.js'
import UserAvatar from '../../../../components/UserAvatar.jsx'

const TIERS = [
    { key: 'superfan', label: 'Superfãs',   desc: 'Fãs muito activos e leais',      color: 'coral'   },
    { key: 'regular',  label: 'Regulares',  desc: 'Fãs com interação frequente',    color: 'ocean'   },
    { key: 'casual',   label: 'Ocasionais', desc: 'Fãs com baixa interação',        color: 'mustard' },
]

export default function FansSidebar({ fans, loading }) {
    const tierCounts = useMemo(() => {
        const map = { superfan: 0, regular: 0, casual: 0 }
        fans.forEach(f => { if (map[f.tier] !== undefined) map[f.tier]++ })
        return map
    }, [fans])

    const topLocations = useMemo(() => {
        const map = {}
        fans.forEach(f => {
            if (f.location) map[f.location] = (map[f.location] ?? 0) + 1
        })
        return Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 7)
            .map(([label, value]) => ({ label, value }))
    }, [fans])

    const maxLoc = topLocations.length > 0 ? topLocations[0].value : 1

    const recentFollowers = useMemo(() => (
        [...fans]
            .sort((a, b) => new Date(b.followedAt) - new Date(a.followedAt))
            .slice(0, 6)
    ), [fans])

    return (
        <aside className="fns__sidebar">

            {/* ── Tier breakdown ─────────────────────────────────── */}
            <div className="fns__card">
                <div className="fns__card-title">Distribuição de fãs</div>
                {loading ? (
                    <div style={{ color: 'var(--color-ink-mute)', fontSize: 13 }}>A carregar…</div>
                ) : (
                    <div className="fns__tier-list">
                        {TIERS.map(t => (
                            <div key={t.key} className="fns__tier-item">
                                <div className={`fns__tier-dot fns__tier-dot--${t.color}`} />
                                <div className="fns__tier-text">
                                    <div className="fns__tier-label">{t.label}</div>
                                    <div className="fns__tier-desc">{t.desc}</div>
                                </div>
                                <div className="fns__tier-count">{tierCounts[t.key].toLocaleString('pt-PT')}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Top localizações ───────────────────────────────── */}
            {topLocations.length > 0 && (
                <div className="fns__card">
                    <div className="fns__card-title">Top localizações</div>
                    <div className="fns__hbar-list">
                        {topLocations.map(loc => (
                            <div key={loc.label} className="fns__hbar-row">
                                <div className="fns__hbar-label">{loc.label}</div>
                                <div className="fns__hbar-track">
                                    <div
                                        className="fns__hbar-fill"
                                        style={{ width: `${(loc.value / maxLoc) * 100}%` }}
                                    />
                                </div>
                                <div className="fns__hbar-val">{loc.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Seguidores recentes ────────────────────────────── */}
            {recentFollowers.length > 0 && (
                <div className="fns__card">
                    <div className="fns__card-title">Seguiram recentemente</div>
                    <div className="fns__activity-list">
                        {recentFollowers.map(fan => (
                            <div key={fan.id} className="fns__activity-item">
                                <div className="fns__activity-avatar">
                                    <UserAvatar id={fan.id} name={fan.name} imageUrl={fan.avatarUrl} style={{ width: '100%', height: '100%' }} />
                                </div>
                                <div className="fns__activity-body">
                                    <div className="fns__activity-text">
                                        <strong>{fan.handle}</strong> começou a seguir-te
                                    </div>
                                    <div className="fns__activity-time">{timeAgo(fan.followedAt)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </aside>
    )
}
