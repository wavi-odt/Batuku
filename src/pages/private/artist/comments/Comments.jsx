/* ─────────────────────────────────────────────────────────────────
   pages/artist/comments/Comments.jsx  ·  Comentários
   ───────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react'
import { FaCommentAlt, FaClock, FaThumbtack, FaSearch } from 'react-icons/fa'
import AppShell      from '../../../../components/HomeComponents/AppShell.jsx'
import CommentCard   from './CommentCard.jsx'
import { commentsData } from '../../../../data/comments.js'
import './Comments.css'

const { summary } = commentsData;

const STATUS_TABS = [
    { key: 'all',     label: 'Todos'     },
    { key: 'pending', label: 'Pendentes' },
    { key: 'replied', label: 'Respondidos' },
    { key: 'pinned',  label: 'Fixados'   },
];

const KPI_META = [
    { label: 'Total',          value: summary.total,   icon: FaCommentAlt, accent: 'coral',   sub: 'comentários recebidos'  },
    { label: 'Pendentes',      value: summary.pending, icon: FaClock,      accent: 'mustard', sub: 'aguardam resposta'      },
    { label: 'Hoje',           value: summary.today,   icon: FaCommentAlt, accent: 'ocean',   sub: 'novos nas últimas 24h'  },
    { label: 'Fixados',        value: summary.pinned,  icon: FaThumbtack,  accent: 'green',   sub: 'comentários em destaque'},
];

export default function Comments() {
    const [query,     setQuery]     = useState('');
    const [status,    setStatus]    = useState('all');
    const [track,     setTrack]     = useState('Todas');
    const [sort,      setSort]      = useState('recent');
    const [deleted,   setDeleted]   = useState(new Set());

    function handleDelete(id) {
        setDeleted(prev => new Set([...prev, id]));
    }

    const filtered = useMemo(() => {
        let list = commentsData.comments.filter(c => !deleted.has(c.id));

        if (track !== 'Todas')
            list = list.filter(c => c.track === track);

        if (status === 'pending')
            list = list.filter(c => !c.reply);
        else if (status === 'replied')
            list = list.filter(c => !!c.reply);
        else if (status === 'pinned')
            list = list.filter(c => c.isPinned);

        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(c =>
                c.text.toLowerCase().includes(q) ||
                c.user.toLowerCase().includes(q) ||
                c.handle.toLowerCase().includes(q)
            );
        }

        if (sort === 'popular')
            return [...list].sort((a, b) => b.likes - a.likes);
        if (sort === 'pending')
            return [...list].sort((a, b) => {
                const ap = !a.reply ? 0 : 1;
                const bp = !b.reply ? 0 : 1;
                return ap - bp;
            });

        return list; /* 'recent' — ordem do array */
    }, [query, status, track, sort, deleted]);

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
                        <div className="cmt__kpi-val">{value}</div>
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
                    {commentsData.trackFilter.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
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
                    {commentsData.sortOptions.map(o => (
                        <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* ── List ───────────────────────────────────────────── */}
            {filtered.length === 0
                ? <div className="cmt__empty">Nenhum comentário encontrado.</div>
                : (
                    <div className="cmt__list">
                        {filtered.map(c => (
                            <CommentCard
                                key={c.id}
                                comment={c}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )
            }

        </AppShell>
    );
}
