/* ─────────────────────────────────────────────────────────────────
   pages/private/playlist/PlaylistDetail.jsx, Playlist — conteúdo +
   gestão (renomear, remover/adicionar faixas) quando playlist.isOwner.
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaTrash, FaPlus, FaPen, FaCheck } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import '../DetailPage.css'
import './PlaylistDetail.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api`
const DEBOUNCE_MS = 350;

function AddTrackBox({ playlistId, onAdded }) {
    const [query, setQuery]     = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    function handleChange(e) {
        const q = e.target.value;
        setQuery(q);
        clearTimeout(timerRef.current);
        if (q.length < 2) { setResults([]); return; }
        setLoading(true);
        timerRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`${API}/tracks/search?q=${encodeURIComponent(q)}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setResults(res.ok ? await res.json() : []);
            } catch { setResults([]); } finally { setLoading(false); }
        }, DEBOUNCE_MS);
    }

    async function handleAdd(track) {
        try {
            const res = await fetch(`${API}/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ trackId: track.id }),
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            onAdded(track);
            setResults(prev => prev.filter(r => r.id !== track.id));
        } catch (err) { alert(err.message); }
    }

    return (
        <div className="pl-add">
            <input className="input" placeholder="Procurar faixas para adicionar…" value={query} onChange={handleChange} />
            {loading && <div className="pl-add__hint">A procurar…</div>}
            {results.length > 0 && (
                <ul className="pl-add__list">
                    {results.map(t => (
                        <li key={t.id} className="pl-add__item">
                            <span>{t.title}{t.artist ? ` · ${t.artist}` : ''}</span>
                            <button type="button" className="pl-add__btn" onClick={() => handleAdd(t)}><FaPlus size={10} /> Adicionar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function PlaylistDetail() {
    const { id } = useParams();
    const role = getRole() === 'artist' ? 'artist' : 'fan';

    const [playlist, setPlaylist] = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft]     = useState('');
    const [showAdd, setShowAdd]         = useState(false);

    useEffect(() => {
        fetch(`${API}/playlists/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(data => { setPlaylist(data); setNameDraft(data.name); })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleRename() {
        try {
            const res = await fetch(`${API}/playlists/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name: nameDraft }),
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            setPlaylist(prev => ({ ...prev, name: nameDraft }));
            setEditingName(false);
        } catch (err) { alert(err.message); }
    }

    async function handleRemoveTrack(trackId) {
        try {
            const res = await fetch(`${API}/playlists/${id}/tracks/${trackId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            setPlaylist(prev => ({ ...prev, tracks: prev.tracks.filter(t => t.id !== trackId) }));
        } catch (err) { alert(err.message); }
    }

    function handleTrackAdded(track) {
        setPlaylist(prev => ({ ...prev, tracks: [...(prev.tracks || []), track], trackCount: (prev.trackCount || 0) + 1 }));
    }

    return (
        <AppShell role={role}>
            <div className="detail-page">
                {loading && <div className="detail-loading">A carregar…</div>}
                {error   && <div className="detail-error">{error}</div>}
                {playlist && (
                    <>
                        <div className="detail-hero">
                            {playlist.imageUrl
                                ? <img src={playlist.imageUrl} alt={playlist.name} className="detail-hero__img" />
                                : <div className="detail-hero__img" />
                            }
                            <div className="detail-hero__info">
                                <div className="label-eyebrow">Playlist</div>
                                {editingName ? (
                                    <div className="pl-rename">
                                        <input className="input" value={nameDraft} onChange={e => setNameDraft(e.target.value)} autoFocus />
                                        <button type="button" className="btn-primary" style={{ padding: '8px 12px' }} onClick={handleRename}><FaCheck size={12} /></button>
                                    </div>
                                ) : (
                                    <h1 className="detail-hero__name">
                                        {playlist.name}
                                        {playlist.isOwner && (
                                            <button type="button" className="pl-rename__edit" onClick={() => setEditingName(true)} aria-label="Renomear"><FaPen size={12} /></button>
                                        )}
                                    </h1>
                                )}
                                {playlist.description && (
                                    <p className="detail-hero__bio">{playlist.description}</p>
                                )}
                                <div className="detail-stats">
                                    {playlist.trackCount != null && (
                                        <div>
                                            <div className="detail-stat__value">{playlist.trackCount}</div>
                                            <div className="detail-stat__label">Faixas</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {playlist.isOwner && (
                            <div className="pl-manage">
                                <button type="button" className="btn-ghost" onClick={() => setShowAdd(v => !v)}>
                                    <FaPlus size={12} /> {showAdd ? 'Fechar' : 'Adicionar faixas'}
                                </button>
                                {showAdd && <AddTrackBox playlistId={id} onAdded={handleTrackAdded} />}
                            </div>
                        )}

                        {playlist.tracks?.length > 0 && (
                            <section>
                                <h2 className="detail-section__title">Faixas</h2>
                                <ul className="detail-track-list">
                                    {playlist.tracks.map((t, i) => (
                                        <li key={t.id ?? i} className="detail-track-item">
                                            <span className="detail-track-item__num">{i + 1}</span>
                                            {t.imageUrl && <img src={t.imageUrl} alt={t.title} className="detail-track-item__img" />}
                                            <div className="detail-track-item__info">
                                                <div className="detail-track-item__title">
                                                    {t.id
                                                        ? <Link to={`/tracks/${t.id}`} className="link">{t.title}</Link>
                                                        : t.title
                                                    }
                                                </div>
                                                {t.artist && <div className="detail-track-item__artist">{t.artist}</div>}
                                            </div>
                                            {t.duration && <span className="detail-track-item__dur">{t.duration}</span>}
                                            {playlist.isOwner && (
                                                <button type="button" className="pl-track-remove" onClick={() => handleRemoveTrack(t.id)} aria-label="Remover da playlist">
                                                    <FaTrash size={11} />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </>
                )}
            </div>
        </AppShell>
    );
}
