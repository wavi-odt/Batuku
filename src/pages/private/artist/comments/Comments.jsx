import { useState, useMemo, useEffect } from 'react'
import { FaCommentAlt, FaClock, FaThumbtack, FaSearch } from 'react-icons/fa'
import AppShell   from '../../../../components/HomeComponents/AppShell.jsx'
import CommentCard from './CommentCard.jsx'
import { API, getToken } from '../../../../utils/auth.js'
import { usePendingComments } from '../../../../context/PendingCommentsContext.jsx'
import './Comments.css'

const STATUS_TABS = [
    { key: 'all',     label: 'Todos'        },
    { key: 'pending', label: 'Pendentes'    },
    { key: 'replied', label: 'Respondidos'  },
    { key: 'pinned',  label: 'Fixados'      },
]

const SORT_OPTIONS = [
    { key: 'recent',  label: 'Mais recentes'       },
    { key: 'pending', label: 'Pendentes primeiro'   },
]

function isToday(iso) {
    if (!iso) return false
    const d = new Date(iso), n = new Date()
    return d.getFullYear() === n.getFullYear()
        && d.getMonth()    === n.getMonth()
        && d.getDate()     === n.getDate()
}

export default function Comments() {
    const { decrement } = usePendingComments()
    const [comments, setComments] = useState([])
    const [loading,  setLoading]  = useState(true)
    const [error,    setError]    = useState('')
    const [query,    setQuery]    = useState('')
    const [status,   setStatus]   = useState('all')
    const [track,    setTrack]    = useState('Todas')
    const [sort,     setSort]     = useState('recent')

    useEffect(() => {
        fetch(`${API}/api/comments/artist`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : Promise.reject(`Erro ${r.status}`))
            .then(setComments)
            .catch(err => setError(String(err)))
            .finally(() => setLoading(false))
    }, [])

    /* ── KPIs calculados em runtime ─────────────────────────────── */
    const kpis = useMemo(() => ({
        total:   comments.length,
        pending: comments.filter(c => !c.reply).length,
        today:   comments.filter(c => isToday(c.createdAt)).length,
        pinned:  comments.filter(c => c.pinned).length,
    }), [comments])

    const KPI_META = [
        { label: 'Total',     value: kpis.total,   icon: FaCommentAlt, accent: 'coral',   sub: 'comentários recebidos' },
        { label: 'Pendentes', value: kpis.pending, icon: FaClock,      accent: 'mustard', sub: 'aguardam resposta'     },
        { label: 'Hoje',      value: kpis.today,   icon: FaCommentAlt, accent: 'ocean',   sub: 'novos nas últimas 24h' },
        { label: 'Fixados',   value: kpis.pinned,  icon: FaThumbtack,  accent: 'green',   sub: 'em destaque'           },
    ]

    /* ── Filtro de faixas derivado dos dados ────────────────────── */
    const trackFilter = useMemo(() => {
        const titles = [...new Set(comments.map(c => c.trackTitle).filter(Boolean))].sort()
        return ['Todas', ...titles]
    }, [comments])

    /* ── Lista filtrada ─────────────────────────────────────────── */
    const filtered = useMemo(() => {
        let list = [...comments]

        if (track !== 'Todas')
            list = list.filter(c => c.trackTitle === track)

        if (status === 'pending')
            list = list.filter(c => !c.reply)
        else if (status === 'replied')
            list = list.filter(c => !!c.reply)
        else if (status === 'pinned')
            list = list.filter(c => c.pinned)

        if (query.trim()) {
            const q = query.toLowerCase()
            list = list.filter(c =>
                c.content.toLowerCase().includes(q) ||
                (c.authorName ?? '').toLowerCase().includes(q) ||
                (c.authorHandle ?? '').toLowerCase().includes(q)
            )
        }

        if (sort === 'pending')
            return [...list].sort((a, b) => (!a.reply ? 0 : 1) - (!b.reply ? 0 : 1))

        return list
    }, [comments, query, status, track, sort])

    /* ── Mutações ───────────────────────────────────────────────── */
    async function handleDelete(id) {
        try {
            const res = await fetch(`${API}/api/comments/${id}`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            setComments(prev => prev.filter(c => c.id !== id))
        } catch { }
    }

    async function handleReply(id, content, isEdit = false) {
        const res = await fetch(`${API}/api/comments/${id}/reply`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body:    JSON.stringify({ content }),
        })
        if (!res.ok) throw new Error('Erro ao publicar resposta')
        const reply = await res.json()
        setComments(prev => prev.map(c => c.id === id ? { ...c, reply } : c))
        if (!isEdit) decrement()
        return reply
    }

    async function handlePin(id, pinned) {
        try {
            await fetch(`${API}/api/comments/${id}/pin`, {
                method:  'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({ pinned }),
            })
            setComments(prev => prev.map(c => c.id === id ? { ...c, pinned } : c))
        } catch { }
    }

    return (
        <AppShell role="artist">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="cmt__header">
                <div>
                    <h1 className="cmt__title">Comentários</h1>
                    <p className="cmt__subtitle">Responde aos teus fãs e gere o feedback</p>
                </div>
            </div>

            {/* ── KPIs ───────────────────────────────────────────── */}
            <div className="cmt__kpis">
                {KPI_META.map(({ label, value, icon: Icon, accent, sub }) => (
                    <div key={label} className="cmt__kpi">
                        <div className="cmt__kpi-label">
                            <span className={`cmt__kpi-icon cmt__kpi-icon--${accent}`}>
                                <Icon size={11} />
                            </span>
                            {label}
                        </div>
                        <div className="cmt__kpi-val">{loading ? '—' : value}</div>
                        <div className="cmt__kpi-sub">{sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Toolbar ────────────────────────────────────────── */}
            <div className="cmt__toolbar">
                <div className="cmt__search-wrap">
                    <FaSearch className="cmt__search-icon" />
                    <input
                        className="cmt__search"
                        placeholder="Pesquisar comentários…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>

                <select
                    className="cmt__track-select"
                    value={track}
                    onChange={e => setTrack(e.target.value)}
                >
                    {trackFilter.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <div className="cmt__status-tabs">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`cmt__status-tab${status === tab.key ? ' cmt__status-tab--active' : ''}`}
                            onClick={() => setStatus(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <select
                    className="cmt__track-select"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
            </div>

            {/* ── Lista ──────────────────────────────────────────── */}
            {loading && (
                <div className="cmt__empty">A carregar comentários…</div>
            )}
            {!loading && error && (
                <div className="cmt__empty cmt__empty--error">{error}</div>
            )}
            {!loading && !error && filtered.length === 0 && (
                <div className="cmt__empty">Nenhum comentário encontrado.</div>
            )}
            {!loading && !error && filtered.length > 0 && (
                <div className="cmt__list">
                    {filtered.map(c => (
                        <CommentCard
                            key={c.id}
                            comment={c}
                            onDelete={handleDelete}
                            onReply={handleReply}
                            onPin={handlePin}
                        />
                    ))}
                </div>
            )}

        </AppShell>
    )
}
