/* ─────────────────────────────────────────────────────────────────
   pages/artist/tracks/Tracks.jsx, Gestão do catálogo do artista.
   ───────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react'
import { FaPlus, FaSearch }  from 'react-icons/fa'
import AppShell              from '../../../../components/HomeComponents/AppShell.jsx'
import { tracksData }        from '../../../../data/tracks.js'
import { usePublish }        from '../../../../context/PublishContext.jsx'
import TracksList            from './TracksList.jsx'
import './Tracks.css'

const d = tracksData;

const STATUS_TABS = [
    { key: 'all',       label: 'Todas'     },
    { key: 'published', label: 'Publicadas' },
    { key: 'draft',     label: 'Rascunhos'  },
    { key: 'scheduled', label: 'Agendadas'  },
];

export default function Tracks() {
    const { openPublish } = usePublish();
    const [query,   setQuery]   = useState('');
    const [status,  setStatus]  = useState('all');
    const [sort,    setSort]    = useState('recent');
    const [playing, setPlaying] = useState(null);

    const filtered = useMemo(() => {
        let list = d.tracks;

        if (status !== 'all') {
            list = list.filter(t => t.status === status);
        }
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(t =>
                t.title.toLowerCase().includes(q) ||
                (t.album ?? '').toLowerCase().includes(q) ||
                t.genre.toLowerCase().includes(q)
            );
        }

        return [...list].sort((a, b) => {
            switch (sort) {
                case 'plays':  return b.plays.total - a.plays.total;
                case 'likes':  return b.likes - a.likes;
                case 'oldest': return 0; /* mantém ordem inversa — simplificação */
                default:       return 0; /* 'recent' — ordem do array */
            }
        });
    }, [query, status, sort]);

    const s = d.summary;

    return (
        <AppShell role="artist">

            {/* ─── Header ───────────────────────────────────────── */}
            <div className="trk__header">
                <div>
                    <h1 className="trk__title">As minhas faixas</h1>
                    <p className="trk__subtitle">
                        {s.total} faixas · {s.totalPlays.toLocaleString('pt-PT')} reproduções · {s.totalLikes.toLocaleString('pt-PT')} likes
                    </p>
                </div>
                <button type="button" className="trk__new-btn" onClick={openPublish}>
                    <FaPlus size={13} />
                    Nova faixa
                </button>
            </div>

            {/* ─── Stats ────────────────────────────────────────── */}
            <div className="trk__stats">
                <div className="trk__stat">
                    <div className="trk__stat-val trk__stat-val--published">{s.published}</div>
                    <div className="trk__stat-label">Publicadas</div>
                </div>
                <div className="trk__stat">
                    <div className="trk__stat-val trk__stat-val--draft">{s.drafts}</div>
                    <div className="trk__stat-label">Rascunhos</div>
                </div>
                <div className="trk__stat">
                    <div className="trk__stat-val trk__stat-val--scheduled">{s.scheduled}</div>
                    <div className="trk__stat-label">Agendadas</div>
                </div>
                <div className="trk__stat">
                    <div className="trk__stat-val">{s.totalPlays.toLocaleString('pt-PT')}</div>
                    <div className="trk__stat-label">Reproduções totais</div>
                </div>
            </div>

            {/* ─── Filtros ──────────────────────────────────────── */}
            <div className="trk__filters">
                <div className="trk__search-wrap">
                    <FaSearch className="trk__search-icon" />
                    <input
                        type="search"
                        className="trk__search"
                        placeholder="Pesquisar faixas…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>

                <div className="trk__status-tabs">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`trk__status-tab${status === tab.key ? ' trk__status-tab--active' : ''}`}
                            onClick={() => setStatus(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <select
                    className="trk__sort"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    {d.sortOptions.map(o => (
                        <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* ─── Lista ────────────────────────────────────────── */}
            <TracksList
                tracks={filtered}
                playing={playing}
                onPlay={setPlaying}
            />

        </AppShell>
    );
}
