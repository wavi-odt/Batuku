import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FaEllipsisH, FaCheck, FaMusic, FaPlus, FaTrash } from 'react-icons/fa'
import { API, getToken } from '../utils/auth'
import { useToast } from '../context/ToastContext'
import PlaylistCreateModal from '../pages/private/playlist/PlaylistCreateModal'
import './TrackMenu.css'

export default function TrackMenu({ trackId, playlistId, onRemove, popoverAlign = 'right' }) {
    const { showToast } = useToast()
    const [open,        setOpen]        = useState(false)
    const [playlists,   setPlaylists]   = useState(null)
    const [loading,     setLoading]     = useState(false)
    const [added,       setAdded]       = useState(null)
    const [showCreate,  setShowCreate]  = useState(false)
    const [removing,    setRemoving]    = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        function handle(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [open])

    function handleOpen(e) {
        e.stopPropagation()
        setOpen(v => !v)
        if (playlists === null && !loading) {
            setLoading(true)
            fetch(`${API}/api/playlists/my`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
                .then(r => r.ok ? r.json() : [])
                .then(data => setPlaylists(Array.isArray(data) ? data.filter(p => !p.systemGenerated) : []))
                .catch(() => setPlaylists([]))
                .finally(() => setLoading(false))
        }
    }

    async function addToPlaylist(e, pid) {
        e.stopPropagation()
        try {
            const res = await fetch(`${API}/api/playlists/${pid}/tracks`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({ trackId }),
            })
            if (!res.ok) throw new Error()
            const plName = playlists?.find(p => p.id === pid)?.name ?? 'playlist'
            showToast(`Adicionado a "${plName}"`)
            setAdded(pid)
            setTimeout(() => { setAdded(null); setOpen(false) }, 900)
        } catch {
            showToast('Erro ao adicionar à playlist', 'error')
        }
    }

    async function handleRemove(e) {
        e.stopPropagation()
        if (removing) return
        setRemoving(true)
        try {
            const res = await fetch(`${API}/api/playlists/${playlistId}/tracks/${trackId}`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            setOpen(false)
            onRemove?.()
            showToast('Faixa removida da playlist')
        } catch {
            showToast('Erro ao remover faixa', 'error')
        } finally {
            setRemoving(false)
        }
    }

    async function handleCreated(newPlaylist) {
        try {
            await fetch(`${API}/api/playlists/${newPlaylist.id}/tracks`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({ trackId }),
            })
            showToast(`Adicionado a "${newPlaylist.name}"`)
        } catch {
            showToast('Erro ao adicionar à playlist', 'error')
        }
        setPlaylists(prev => prev ? [newPlaylist, ...prev] : [newPlaylist])
        setAdded(newPlaylist.id)
        setTimeout(() => setAdded(null), 1200)
    }

    return (
        <div className="trk-menu" ref={ref}>
            <button
                type="button"
                className={'trk-menu__btn' + (open ? ' trk-menu__btn--open' : '')}
                onClick={handleOpen}
                aria-label="Mais opções"
                title="Mais opções"
            >
                <FaEllipsisH size={13} />
            </button>

            {open && (
                <div className={'trk-menu__popover' + (popoverAlign === 'left' ? ' trk-menu__popover--left' : '')} onClick={e => e.stopPropagation()}>
                    <div className="trk-menu__header">Adicionar a playlist</div>

                    {loading && <div className="trk-menu__loading">A carregar…</div>}

                    {!loading && playlists?.length === 0 && (
                        <div className="trk-menu__empty">
                            <FaMusic size={12} />
                            <span>Ainda não tens playlists.</span>
                        </div>
                    )}

                    {playlists?.map(pl => (
                        <button
                            key={pl.id}
                            type="button"
                            className={'trk-menu__item' + (added === pl.id ? ' trk-menu__item--added' : '')}
                            onClick={e => addToPlaylist(e, pl.id)}
                            disabled={added !== null}
                        >
                            {pl.coverUrl
                                ? <img src={pl.coverUrl} alt={pl.name} className="trk-menu__pl-cover" />
                                : <div className="trk-menu__pl-cover trk-menu__pl-cover--empty" />
                            }
                            <span className="trk-menu__pl-name">{pl.name}</span>
                            {added === pl.id && <FaCheck size={11} className="trk-menu__check" />}
                        </button>
                    ))}

                    <div className="trk-menu__divider" />

                    <button
                        type="button"
                        className="trk-menu__item trk-menu__item--create"
                        onClick={e => { e.stopPropagation(); setOpen(false); setShowCreate(true) }}
                    >
                        <div className="trk-menu__pl-cover trk-menu__create-icon">
                            <FaPlus size={11} />
                        </div>
                        <span className="trk-menu__pl-name">Nova playlist</span>
                    </button>

                    {playlistId && onRemove && (
                        <>
                            <div className="trk-menu__divider" />
                            <button
                                type="button"
                                className="trk-menu__item trk-menu__item--remove"
                                onClick={handleRemove}
                                disabled={removing}
                            >
                                <div className="trk-menu__pl-cover trk-menu__remove-icon">
                                    <FaTrash size={10} />
                                </div>
                                <span className="trk-menu__pl-name">
                                    {removing ? 'A remover…' : 'Remover da playlist'}
                                </span>
                            </button>
                        </>
                    )}
                </div>
            )}

            {showCreate && createPortal(
                <PlaylistCreateModal
                    onClose={() => setShowCreate(false)}
                    onCreated={handleCreated}
                />,
                document.body
            )}
        </div>
    )
}
