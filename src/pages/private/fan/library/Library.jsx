import { useState, useEffect }   from 'react'
import AppShell                  from '../../../../components/HomeComponents/AppShell.jsx'
import { API, getToken }         from '../../../../utils/auth.js'
import { useToast }              from '../../../../context/ToastContext.jsx'
import ConfirmModal              from '../../../../components/ConfirmModal.jsx'
import LibraryPlaylists          from './LibraryPlaylists.jsx'
import LibraryTracks             from './LibraryTracks.jsx'
import LibraryArtists            from './LibraryArtists.jsx'
import PlaylistCreateModal       from '../../playlist/PlaylistCreateModal.jsx'
import './Library.css'

const FILTERS = [
    { key: 'all',       label: 'Tudo'      },
    { key: 'playlists', label: 'Playlists' },
    { key: 'tracks',    label: 'Faixas'    },
    { key: 'artists',   label: 'Artistas'  },
];

export default function Library() {
    const { showToast } = useToast();
    const [filter,          setFilter]          = useState('all');
    const [playlists,       setPlaylists]       = useState([]);
    const [tracks,          setTracks]          = useState([]);
    const [artists,         setArtists]         = useState([]);
    const [loadingPl,       setLoadingPl]       = useState(true);
    const [loadingTr,       setLoadingTr]       = useState(true);
    const [loadingAr,       setLoadingAr]       = useState(true);
    const [showCreate,      setShowCreate]      = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [confirmPlaylist, setConfirmPlaylist] = useState(null);
    const [deleting,        setDeleting]        = useState(false);

    useEffect(() => {
        fetch(`${API}/api/playlists/my`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setPlaylists(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoadingPl(false));
    }, []);

    useEffect(() => {
        fetch(`${API}/api/playlists/my/tracks`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setTracks(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoadingTr(false));
    }, []);

    useEffect(() => {
        fetch(`${API}/api/artist-follows/my`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setArtists(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoadingAr(false));
    }, []);

    function handleCreated(newPlaylist) {
        setPlaylists(prev => [...prev, newPlaylist]);
    }

    function handleUpdated(updated) {
        setPlaylists(prev => prev.map(p => p.id === updated.id ? updated : p));
    }

    async function handleToggleVisibility(pl) {
        try {
            const res = await fetch(`${API}/api/playlists/${pl.id}/visibility`, {
                method:  'PATCH',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            const updated = await res.json();
            setPlaylists(prev => prev.map(p => p.id === updated.id ? updated : p));
            showToast(updated.isPublic ? 'Playlist tornada pública' : 'Playlist tornada privada');
        } catch {
            showToast('Erro ao alterar visibilidade', 'error');
        }
    }

    async function handleUnsavePlaylist(pl) {
        try {
            const res = await fetch(`${API}/api/playlists/${pl.id}/save`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            setPlaylists(prev => prev.filter(p => p.id !== pl.id));
            showToast('Playlist removida da biblioteca');
        } catch {
            showToast('Erro ao remover playlist da biblioteca', 'error');
        }
    }

    function handleDeletePlaylist(pl) {
        setConfirmPlaylist(pl);
    }

    async function confirmDelete() {
        setDeleting(true);
        try {
            const res = await fetch(`${API}/api/playlists/${confirmPlaylist.id}`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            setPlaylists(prev => prev.filter(p => p.id !== confirmPlaylist.id));
            setConfirmPlaylist(null);
            showToast('Playlist removida');
        } catch {
            showToast('Erro ao remover a playlist', 'error');
        } finally {
            setDeleting(false);
        }
    }

    const show = (key) => filter === 'all' || filter === key;

    return (
        <AppShell role="fan">

            {/* ─── Header ──────────────────────────────────────────── */}
            <div className="lib__header">
                <div>
                    <h1 className="lib__title">Biblioteca</h1>
                    <p className="lib__subtitle">
                        {loadingPl ? '…' : `${playlists.length} ${playlists.length === 1 ? 'playlist' : 'playlists'}`}
                    </p>
                </div>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowCreate(true)}>
                    + Nova playlist
                </button>
            </div>

            {/* ─── Filtros ─────────────────────────────────────────── */}
            <div className="lib__filters">
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        type="button"
                        className={`lib__filter${filter === f.key ? ' lib__filter--active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* ─── Secções ─────────────────────────────────────────── */}
            {show('playlists') && (
                <LibraryPlaylists
                    playlists={playlists}
                    loading={loadingPl}
                    onNew={() => setShowCreate(true)}
                    onEdit={pl => setEditingPlaylist(pl)}
                    onDelete={handleDeletePlaylist}
                    onToggleVisibility={handleToggleVisibility}
                    onUnsave={handleUnsavePlaylist}
                />
            )}

            {show('tracks') && (
                <LibraryTracks
                    tracks={tracks}
                    loading={loadingTr}
                />
            )}

            {show('artists') && (
                <LibraryArtists
                    artists={artists}
                    loading={loadingAr}
                />
            )}

            {/* ─── Modal criar playlist ─────────────────────────────── */}
            {showCreate && (
                <PlaylistCreateModal
                    onClose={() => setShowCreate(false)}
                    onCreated={handleCreated}
                />
            )}

            {/* ─── Modal editar playlist ────────────────────────────── */}
            {editingPlaylist && (
                <PlaylistCreateModal
                    playlist={editingPlaylist}
                    onClose={() => setEditingPlaylist(null)}
                    onUpdated={handleUpdated}
                />
            )}

            {/* ─── Modal confirmar remoção ──────────────────────────── */}
            {confirmPlaylist && (
                <ConfirmModal
                    title="Remover playlist"
                    message={`Tens a certeza que queres remover "${confirmPlaylist.name}"? Esta acção não pode ser desfeita.`}
                    confirmLabel="Remover"
                    loading={deleting}
                    onConfirm={confirmDelete}
                    onClose={() => setConfirmPlaylist(null)}
                />
            )}

        </AppShell>
    );
}
