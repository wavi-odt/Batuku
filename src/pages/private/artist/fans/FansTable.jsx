import { useState, useMemo } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link }     from 'react-router-dom'

const TIER_TABS = [
    { key: 'all',      label: 'Todos'      },
    { key: 'superfan', label: 'Superfãs'   },
    { key: 'regular',  label: 'Regulares'  },
    { key: 'casual',   label: 'Ocasionais' },
]

const TIER_LABELS = { superfan: 'Superfã', regular: 'Regular', casual: 'Ocasional' }

const SORT_OPTIONS = [
    { key: 'plays',    label: 'Mais reproduções' },
    { key: 'likes',    label: 'Mais likes'        },
    { key: 'comments', label: 'Mais comentários'  },
    { key: 'recent',   label: 'Mais recentes'     },
]

function hueFromId(id) {
    return (id * 83) % 360
}

function timeAgo(isoStr) {
    if (!isoStr) return '—'
    const m = Math.floor((Date.now() - new Date(isoStr)) / 60000)
    if (m < 1)   return 'agora mesmo'
    if (m < 60)  return `há ${m} min`
    const h = Math.floor(m / 60)
    if (h < 24)  return `há ${h}h`
    const d = Math.floor(h / 24)
    if (d < 30)  return `há ${d} dia${d > 1 ? 's' : ''}`
    return new Date(isoStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isWithinDays(isoStr, days) {
    if (!isoStr) return false
    return (Date.now() - new Date(isoStr).getTime()) < days * 86_400_000
}

function Avatar({ fan }) {
    if (fan.avatarUrl) {
        return <img src={fan.avatarUrl} alt={fan.name} className="fns__avatar-img" />
    }
    const hue = hueFromId(fan.id)
    return (
        <div
            className="fns__avatar-placeholder"
            style={{ background: `hsl(${hue} 55% 42%)` }}
        >
            {fan.name?.[0]?.toUpperCase() ?? '?'}
        </div>
    )
}

export default function FansTable({ fans, loading }) {
    const [query, setQuery] = useState('')
    const [tier,  setTier]  = useState('all')
    const [sort,  setSort]  = useState('plays')

    const filtered = useMemo(() => {
        let list = fans

        if (tier !== 'all')
            list = list.filter(f => f.tier === tier)

        if (query.trim()) {
            const q = query.toLowerCase()
            list = list.filter(f =>
                f.name.toLowerCase().includes(q) ||
                f.handle.toLowerCase().includes(q)
            )
        }

        return [...list].sort((a, b) => {
            if (sort === 'plays')    return b.plays    - a.plays
            if (sort === 'likes')    return b.likes    - a.likes
            if (sort === 'comments') return b.comments - a.comments
            if (sort === 'recent')   return new Date(b.followedAt) - new Date(a.followedAt)
            return 0
        })
    }, [fans, query, tier, sort])

    return (
        <div>
            <div className="fns__toolbar">
                <div className="fns__search-wrap">
                    <FaSearch className="fns__search-icon" />
                    <input
                        className="fns__search"
                        placeholder="Pesquisar fã..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>

                <div className="fns__tier-tabs">
                    {TIER_TABS.map(t => (
                        <button
                            key={t.key}
                            type="button"
                            className={`fns__tier-tab${tier === t.key ? ' fns__tier-tab--active' : ''}`}
                            onClick={() => setTier(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <select className="fns__sort" value={sort} onChange={e => setSort(e.target.value)}>
                    {SORT_OPTIONS.map(o => (
                        <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                </select>
            </div>

            <div className="fns__table">
                <div className="fns__row fns__row--head">
                    <div />
                    <div className="fns__col fns__col--left">Fã</div>
                    <div className="fns__col fns__col--left">Tier</div>
                    <div className="fns__col">Reprod.</div>
                    <div className="fns__col">❤</div>
                    <div className="fns__col">💬</div>
                    <div className="fns__col">Ativo</div>
                </div>

                {loading && (
                    <div className="fns__empty">A carregar fãs…</div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="fns__empty">Nenhum fã encontrado.</div>
                )}

                {filtered.map(fan => {
                    const isNew = isWithinDays(fan.followedAt, 7)
                    const lastActive = fan.lastPlayedAt
                        ? timeAgo(fan.lastPlayedAt)
                        : 'Sem plays'

                    return (
                        <div key={fan.id} className="fns__row">
                            <div className="fns__avatar">
                                <Avatar fan={fan} />
                            </div>

                            <div className="fns__fan-info">
                                <div className="fns__fan-name">
                                    <Link to={`/users/${fan.id}`} className="fns__fan-link">
                                        {fan.name}
                                    </Link>
                                    {isNew && <span className="fns__new-badge">novo</span>}
                                </div>
                                <div className="fns__fan-handle">{fan.handle}</div>
                            </div>

                            <div>
                                <span className={`fns__tier fns__tier--${fan.tier}`}>
                                    {TIER_LABELS[fan.tier]}
                                </span>
                            </div>

                            <div className="fns__col">{fan.plays.toLocaleString('pt-PT')}</div>
                            <div className="fns__col">{fan.likes.toLocaleString('pt-PT')}</div>
                            <div className="fns__col">{fan.comments.toLocaleString('pt-PT')}</div>

                            <div className="fns__active">{lastActive}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
