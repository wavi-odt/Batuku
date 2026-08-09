import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaSearch, FaCompactDisc, FaTrash } from 'react-icons/fa'
import AppShell from '../../../../components/HomeComponents/AppShell.jsx'
import { usePublish } from '../../../../context/PublishContext.jsx'
import { useCurrentUser } from '../../../../hooks/useCurrentUser.js'
import { useMyTracks } from '../../../../hooks/useMyTracks.js'
import { useMyReleases } from '../../../../hooks/useMyReleases.js'
import { useToast } from '../../../../context/ToastContext.jsx'
import ConfirmModal from '../../../../components/ConfirmModal.jsx'
import { API, getToken } from '../../../../utils/auth.js'
import TracksList from './TracksList.jsx'
import './Tracks.css'

const TYPE_LABEL  = { ALBUM: 'Álbum', EP: 'EP', MIXTAPE: 'Mixtape', SINGLE: 'Single' };

const STATUS_TABS = [
    { key: 'all',       label: 'Todas'      },
    { key: 'PUBLISHED', label: 'Publicadas'  },
    { key: 'SCHEDULED', label: 'Agendadas'   },
];

const SORT_OPTIONS = [
    { key: 'recent', label: 'Mais recentes' },
    { key: 'plays',  label: 'Mais ouvidas'  },
    { key: 'likes',  label: 'Mais curtidas'  },
    { key: 'oldest', label: 'Mais antigas'   },
];

export default function Tracks() {
    const { openPublish, publishVersion, notifyPublished } = usePublish();
    const { showToast } = useToast();
    const realUser = useCurrentUser();
    const aid = realUser?.artistProfileId ?? null;

    /* ─── Faixas ─────────────────────────────────────────────── */
    const { tracks: rawTracks, loading: tracksLoading, setTracks } = useMyTracks(aid, publishVersion);
    const [query,  setQuery]  = useState('');
    const [status, setStatus] = useState('all');
    const [sort,   setSort]   = useState('recent');

    /* ─── Lançamentos ────────────────────────────────────────── */
    const { releases, loading: relLoading } = useMyReleases(aid, publishVersion);
    const [confirmRelease,  setConfirmRelease]  = useState(null);
    const [deletingRelease, setDeletingRelease] = useState(false);
    const [relQuery,  setRelQuery]  = useState('');
    const [relStatus, setRelStatus] = useState('all');

    const filtered = useMemo(() => {
        let list = rawTracks;
        if (status !== 'all') list = list.filter(t => t.status === status);
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(t => t.title.toLowerCase().includes(q));
        }
        return [...list].sort((a, b) => {
            if (sort === 'plays')  return (b.playCount ?? 0) - (a.playCount ?? 0);
            if (sort === 'likes')  return (b.likeCount ?? 0) - (a.likeCount ?? 0);
            if (sort === 'oldest') return (a.id ?? 0) - (b.id ?? 0);
            return (b.id ?? 0) - (a.id ?? 0);
        });
    }, [rawTracks, query, status, sort]);

    const releaseTrackIds   = new Set(releases.flatMap(r => r.tracks?.map(t => t.id) ?? []));
    const published         = rawTracks.filter(t => t.status === 'PUBLISHED');
    const scheduled         = rawTracks.filter(t => t.status === 'SCHEDULED' && !releaseTrackIds.has(t.id));
    const totalLikes        = rawTracks.reduce((acc, t) => acc + (t.likeCount ?? 0), 0);
    const totalPlays        = rawTracks.reduce((acc, t) => acc + (t.playCount ?? 0), 0);
    const publishedReleases = releases.filter(r => r.status === 'PUBLISHED');
    const draftReleases     = releases.filter(r => r.status === 'DRAFT');

    const filteredReleases = useMemo(() => {
        let list = releases;
        if (relStatus === 'PUBLISHED') list = list.filter(r => r.status === 'PUBLISHED');
        if (relStatus === 'DRAFT')     list = list.filter(r => r.status === 'DRAFT');
        if (relQuery.trim()) {
            const q = relQuery.toLowerCase();
            list = list.filter(r => r.title.toLowerCase().includes(q));
        }
        return list;
    }, [releases, relStatus, relQuery]);

    function handleUpdateTrack(updated) {
        setTracks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t))
    }

    async function handleDeleteTrack(trackId) {
        const res = await fetch(`${API}/api/tracks/${trackId}`, {
            method:  'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error();
        notifyPublished();
    }

    async function handleDeleteRelease() {
        setDeletingRelease(true);
        try {
            const res = await fetch(`${API}/api/releases/${confirmRelease.id}`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            notifyPublished();
            setConfirmRelease(null);
        } catch {
            showToast('Erro ao eliminar o lançamento. Tenta novamente.', 'error');
            setConfirmRelease(null);
        } finally {
            setDeletingRelease(false);
        }
    }

    /* ─── Tab ────────────────────────────────────────────────── */
    const [activeTab, setActiveTab] = useState('tracks');

    return (
        <AppShell role="artist">

            {/* ─── Header ───────────────────────────────────── */}
            <div className="trk__header">
                <div>
                    <h1 className="trk__title">As minhas faixas</h1>
                    <p className="trk__subtitle">
                        {activeTab === 'tracks'
                            ? (tracksLoading ? '…' : `${rawTracks.length} ${rawTracks.length === 1 ? 'faixa' : 'faixas'}${totalLikes > 0 ? ` · ${totalLikes.toLocaleString('pt-PT')} likes` : ''}`)
                            : (relLoading    ? '…' : `${releases.length} ${releases.length === 1 ? 'lançamento' : 'lançamentos'}`)
                        }
                    </p>
                </div>
                <button type="button" className="trk__new-btn" onClick={openPublish}>
                    <FaPlus size={13} />
                    {activeTab === 'tracks' ? 'Nova faixa' : 'Novo lançamento'}
                </button>
            </div>

            {/* ─── Tabs ─────────────────────────────────────── */}
            <div className="trk__page-tabs">
                <button
                    type="button"
                    className={'trk__page-tab' + (activeTab === 'tracks' ? ' trk__page-tab--active' : '')}
                    onClick={() => setActiveTab('tracks')}
                >
                    Faixas
                    {rawTracks.length > 0 && <span className="trk__page-tab-count">{rawTracks.length}</span>}
                </button>
                <button
                    type="button"
                    className={'trk__page-tab' + (activeTab === 'releases' ? ' trk__page-tab--active' : '')}
                    onClick={() => setActiveTab('releases')}
                >
                    Lançamentos
                    {releases.length > 0 && <span className="trk__page-tab-count">{releases.length}</span>}
                </button>
            </div>

            {/* ─── Faixas ───────────────────────────────────── */}
            {activeTab === 'tracks' && (
                <>
                    <div className="trk__stats">
                        <div className="trk__stat">
                            <div className="trk__stat-val trk__stat-val--published">
                                {tracksLoading ? '…' : published.length}
                            </div>
                            <div className="trk__stat-label">Publicadas</div>
                        </div>
                        <div className="trk__stat">
                            <div className="trk__stat-val trk__stat-val--scheduled">
                                {tracksLoading ? '…' : scheduled.length}
                            </div>
                            <div className="trk__stat-label">Agendadas</div>
                        </div>
                        <div className="trk__stat">
                            <div className="trk__stat-val">{tracksLoading ? '…' : totalPlays.toLocaleString('pt-PT')}</div>
                            <div className="trk__stat-label">Reproduções</div>
                        </div>
                        <div className="trk__stat">
                            <div className="trk__stat-val">{tracksLoading ? '…' : totalLikes.toLocaleString('pt-PT')}</div>
                            <div className="trk__stat-label">Likes totais</div>
                        </div>
                    </div>

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
                        <select className="trk__sort" value={sort} onChange={e => setSort(e.target.value)}>
                            {SORT_OPTIONS.map(o => (
                                <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <TracksList
                        tracks={filtered}
                        loading={tracksLoading}
                        onDelete={handleDeleteTrack}
                        onUpdate={handleUpdateTrack}
                    />
                </>
            )}

            {/* ─── Lançamentos ──────────────────────────────── */}
            {activeTab === 'releases' && (
                <>
                    <div className="trk__stats">
                        <div className="trk__stat">
                            <div className="trk__stat-val trk__stat-val--published">
                                {relLoading ? '…' : publishedReleases.length}
                            </div>
                            <div className="trk__stat-label">Publicados</div>
                        </div>
                        <div className="trk__stat">
                            <div className="trk__stat-val trk__stat-val--scheduled">
                                {relLoading ? '…' : draftReleases.length}
                            </div>
                            <div className="trk__stat-label">Agendados</div>
                        </div>
                        <div className="trk__stat">
                            <div className="trk__stat-val">
                                {relLoading ? '…' : releases.reduce((a, r) => a + (r.tracks?.length ?? 0), 0)}
                            </div>
                            <div className="trk__stat-label">Faixas totais</div>
                        </div>
                    </div>

                    <div className="trk__filters">
                        <div className="trk__search-wrap">
                            <FaSearch className="trk__search-icon" />
                            <input
                                type="search"
                                className="trk__search"
                                placeholder="Pesquisar lançamentos…"
                                value={relQuery}
                                onChange={e => setRelQuery(e.target.value)}
                            />
                        </div>
                        <div className="trk__status-tabs">
                            {[
                                { key: 'all',       label: 'Todos'      },
                                { key: 'PUBLISHED', label: 'Publicados' },
                                { key: 'DRAFT',     label: 'Agendados'  },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    className={`trk__status-tab${relStatus === tab.key ? ' trk__status-tab--active' : ''}`}
                                    onClick={() => setRelStatus(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {relLoading ? (
                        <div className="trk__table">
                            <div className="trk__empty"><div className="trk__empty-sub">A carregar lançamentos…</div></div>
                        </div>
                    ) : filteredReleases.length === 0 ? (
                        <div className="trk__table">
                            <div className="trk__empty">
                                <div className="trk__empty-icon">💿</div>
                                <div className="trk__empty-title">
                                    {releases.length === 0 ? 'Sem lançamentos' : 'Sem resultados'}
                                </div>
                                <div className="trk__empty-sub">
                                    {releases.length === 0
                                        ? 'Publica o teu primeiro álbum, EP ou mixtape.'
                                        : 'Tenta outro filtro ou pesquisa.'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rel-mgmt-grid">
                            {filteredReleases.map(r => {
                                const label = TYPE_LABEL[r.albumType] ?? r.albumType;
                                const count = r.tracks?.length ?? 0;
                                const isDraft = r.status === 'DRAFT';
                                return (
                                    <div key={r.id} className={'rel-mgmt-card' + (isDraft ? ' rel-mgmt-card--draft' : '')}>
                                        <Link to={`/releases/${r.id}`} className="rel-mgmt-card__cover">
                                            {r.coverUrl
                                                ? <img src={r.coverUrl} alt={r.title} />
                                                : <div className="rel-mgmt-card__placeholder"><FaCompactDisc size={32} /></div>
                                            }
                                            <span className="rel-card__badge">{label}</span>
                                            {isDraft && <span className="rel-mgmt-card__status-badge">Rascunho</span>}
                                        </Link>
                                        <div className="rel-mgmt-card__footer">
                                            <div className="rel-mgmt-card__info">
                                                <Link to={`/releases/${r.id}`} className="rel-mgmt-card__title">{r.title}</Link>
                                                <span className="rel-mgmt-card__sub">{count} {count === 1 ? 'faixa' : 'faixas'}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="trk__action-btn trk__action-btn--delete"
                                                title="Eliminar lançamento"
                                                onClick={() => setConfirmRelease(r)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {confirmRelease && (
                <ConfirmModal
                    title="Eliminar lançamento"
                    message={`Tens a certeza que queres eliminar «${confirmRelease.title}»? Esta ação não pode ser desfeita.`}
                    confirmLabel="Eliminar"
                    loading={deletingRelease}
                    onConfirm={handleDeleteRelease}
                    onClose={() => setConfirmRelease(null)}
                />
            )}

        </AppShell>
    );
}
