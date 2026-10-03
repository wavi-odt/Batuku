import { useState, useMemo, useEffect, useRef } from 'react'
import { FaSearch, FaChevronDown, FaCheck } from 'react-icons/fa'
import { Link, useSearchParams } from 'react-router-dom'

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

function SortDropdown({ value, onChange, options }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const current = options.find(o => o.key === value)
    useEffect(() => {
        if (!open) return
        function onDown(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
        function onScroll() { setOpen(false) }
        document.addEventListener('mousedown', onDown)
        window.addEventListener('scroll', onScroll, true)
        return () => {
            document.removeEventListener('mousedown', onDown)
            window.removeEventListener('scroll', onScroll, true)
        }
    }, [open])
    return (
        <div className="fns__sort-wrap" ref={ref}>
            <button
                type="button"
                className={'fns__sort-btn' + (open ? ' fns__sort-btn--open' : '')}
                onClick={() => setOpen(o => !o)}
            >
                {current?.label}
                <FaChevronDown size={8} className={'fns__sort-chevron' + (open ? ' fns__sort-chevron--open' : '')} />
            </button>
            {open && (
                <div className="fns__sort-menu">
                    {options.map(o => (
                        <button
                            key={o.key}
                            type="button"
                            className={'fns__sort-option' + (o.key === value ? ' fns__sort-option--active' : '')}
                            onClick={() => { onChange(o.key); setOpen(false) }}
                        >
                            <span className="fns__sort-option-check">
                                {o.key === value && <FaCheck size={8} />}
                            </span>
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function hueFromId(id) {
    return (id * 83) % 360
}

function timeAgo(isoStr) {
    if (!isoStr) return ''
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
    const [searchParams, setSearchParams] = useSearchParams()
    const tier    = searchParams.get('tier') ?? 'all'
    const sort    = searchParams.get('sort') ?? 'plays'
    const sp = (key, val) => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set(key, val); return p })
    const setTier = (val) => sp('tier', val)
    const setSort = (val) => sp('sort', val)

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

                <SortDropdown value={sort} onChange={setSort} options={SORT_OPTIONS} />
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
