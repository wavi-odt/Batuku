import { useEffect, useState, useRef, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import ClickableName from '../../../components/ClickableName'
import { FaPlay, FaArrowLeft, FaHeart, FaMusic, FaPen, FaCheck, FaRegComment, FaEllipsisH, FaGlobe, FaLock, FaTrash, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import { usePlayer } from '../../../context/PlayerContext'
import { useToast } from '../../../context/ToastContext'
import TrackMenu from '../../../components/TrackMenu'
import PlaylistLikeButton from '../../../components/PlaylistLikeButton'
import TrackComments from '../../../components/TrackComments'
import PlaylistCreateModal from './PlaylistCreateModal'
import ConfirmModal from '../../../components/ConfirmModal'
import '../DetailPage.css'
import '../release/ReleaseDetail.css'
import './PlaylistDetail.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api`

function fmtMs(ms) {
    if (!ms) return ''
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function fmtTotalMs(ms) {
    if (!ms) return null
    const min = Math.floor(ms / 60000)
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60); const m = min % 60
    return m > 0 ? `${h} h ${m} min` : `${h} h`
}


/* ── Página ─────────────────────────────────────────────────────── */
export default function PlaylistDetail() {
    const { id }   = useParams()
    const navigate = useNavigate()
    const role     = getRole() === 'artist' ? 'artist' : 'fan'
    const { track: currentTrack, setTrack } = usePlayer()

    const { showToast } = useToast()
    const [playlist,         setPlaylist]         = useState(null)
    const [loading,          setLoading]          = useState(true)
    const [error,            setError]            = useState('')
    const [editingName,      setEditingName]      = useState(false)
    const [nameDraft,        setNameDraft]        = useState('')
    const [openCommentTrack, setOpenCommentTrack] = useState(null)
    const [menuOpen,         setMenuOpen]         = useState(false)
    const [menuStyle,        setMenuStyle]        = useState({})
    const [showEdit,         setShowEdit]         = useState(false)
    const [showConfirmDel,   setShowConfirmDel]   = useState(false)
    const [deleting,         setDeleting]         = useState(false)
    const menuBtnRef  = useRef(null)
    const menuRef     = useRef(null)

    useEffect(() => {
        fetch(`${API}/playlists/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json() })
            .then(data => { setPlaylist(data); setNameDraft(data.name) })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    async function handleRename() {
        try {
            const fd = new FormData()
            fd.append('name', nameDraft.trim())
            const res = await fetch(`${API}/playlists/${id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${getToken()}` },
                body: fd,
            })
            if (!res.ok) throw new Error(`Erro ${res.status}`)
            const updated = await res.json()
            setPlaylist(prev => ({ ...prev, name: updated.name }))
            setEditingName(false)
            showToast('Playlist renomeada')
        } catch (err) { showToast(err.message, 'error') }
    }

    async function handleRemoveTrack(trackId) {
        try {
            const res = await fetch(`${API}/playlists/${id}/tracks/${trackId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error(`Erro ${res.status}`)
            setPlaylist(prev => ({
                ...prev,
                tracks: prev.tracks.filter(t => t.id !== trackId),
                trackCount: (prev.trackCount ?? 1) - 1,
            }))
        } catch (err) { showToast(err.message, 'error') }
    }


    useEffect(() => {
        if (!menuOpen) return
        function handleClick(e) {
            if (
                menuBtnRef.current && !menuBtnRef.current.contains(e.target) &&
                menuRef.current    && !menuRef.current.contains(e.target)
            ) setMenuOpen(false)
        }
        function handleScroll() { setMenuOpen(false) }
        document.addEventListener('mousedown', handleClick)
        window.addEventListener('scroll', handleScroll, true)
        return () => {
            document.removeEventListener('mousedown', handleClick)
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [menuOpen])

    function handleMenuOpen(e) {
        e.stopPropagation()
        if (!menuOpen) {
            const rect     = menuBtnRef.current.getBoundingClientRect()
            const minWidth = 200
            const gap      = 6
            const style    = { position: 'fixed', zIndex: 9999, top: rect.bottom + gap }
            if (rect.right - minWidth >= 8) {
                style.right = window.innerWidth - rect.right
            } else {
                style.left = Math.max(8, rect.left)
            }
            setMenuStyle(style)
        }
        setMenuOpen(v => !v)
    }

    async function handleToggleVisibility() {
        try {
            const res = await fetch(`${API}/playlists/${id}/visibility`, {
                method:  'PATCH',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setPlaylist(prev => ({ ...prev, isPublic: updated.isPublic }))
            showToast(updated.isPublic ? 'Playlist tornada pública' : 'Playlist tornada privada')
        } catch {
            showToast('Erro ao alterar visibilidade', 'error')
        }
    }

    async function handleSaveToggle() {
        const wasSaved = playlist.saved
        try {
            const res = await fetch(`${API}/playlists/${id}/save`, {
                method:  wasSaved ? 'DELETE' : 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            setPlaylist(prev => ({ ...prev, saved: !wasSaved }))
            showToast(wasSaved ? 'Playlist removida da biblioteca' : 'Playlist guardada na biblioteca')
        } catch {
            showToast('Erro ao guardar playlist', 'error')
        }
    }

    async function handleDelete() {
        setDeleting(true)
        try {
            const res = await fetch(`${API}/playlists/${id}`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            showToast('Playlist removida')
            navigate(-1)
        } catch {
            showToast('Erro ao remover a playlist', 'error')
        } finally {
            setDeleting(false)
        }
    }

    function toggleComments(e, trackId) {
        e.stopPropagation()
        setOpenCommentTrack(prev => prev === trackId ? null : trackId)
    }

    if (loading) return <AppShell role={role}><div className="detail-loading">A carregar…</div></AppShell>
    if (error)   return <AppShell role={role}><div className="detail-error">{error}</div></AppShell>
    if (!playlist) return null

    const tracks   = playlist.tracks ?? []
    const isFav    = playlist.systemGenerated
    const canEdit  = playlist.owner && !isFav
    const totalMs  = tracks.reduce((acc, t) => acc + (t.durationMs ?? 0), 0)

    const queue = tracks
        .filter(t => t.audioUrl)
        .map(t => ({
            id:              t.id,
            name:            t.title,
            artistName:      t.artistName ?? '',
            artistProfileId: t.artistProfileId ?? null,
            coverUrl:        t.coverUrl ?? null,
            durationMs:      t.durationMs,
            audioUrl:        t.audioUrl,
            source:          'upload',
            playContext:     'playlist',
        }))

    return (
        <AppShell role={role}>
            <div className="rel-detail">

                <button type="button" className="rel-detail__back" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={14} /> Voltar
                </button>

                {/* ── Hero ──────────────────────────────────────────── */}
                <div className="rel-detail__hero">
                    {/* fundo: imagem da capa (desfocada) ou gradiente Favoritos */}
                    {isFav
                        ? <div className="pl-detail__hero-fav-bg" />
                        : playlist.coverUrl
                            ? <div className="rel-detail__hero-bg" style={{ backgroundImage: `url(${playlist.coverUrl})` }} />
                            : <div className="pl-detail__hero-plain-bg" />
                    }
                    <div className="rel-detail__hero-overlay" />

                    <div className="rel-detail__hero-content">
                        {/* capa */}
                        <div className="rel-detail__cover">
                            {isFav
                                ? <div className="pl-detail__cover-fav"><FaHeart size={52} /></div>
                                : playlist.coverUrl
                                    ? <img src={playlist.coverUrl} alt={playlist.name} />
                                    : <div className="pl-detail__cover-empty"><FaMusic size={52} /></div>
                            }
                        </div>

                        {/* meta */}
                        <div className="rel-detail__meta">
                            <span className="rel-detail__type">Playlist</span>

                            {/* título (editável se owner e não Favoritos) */}
                            {editingName ? (
                                <div className="pl-rename">
                                    <input
                                        className="pl-rename__input"
                                        value={nameDraft}
                                        onChange={e => setNameDraft(e.target.value)}
                                        autoFocus
                                        onKeyDown={e => { if (e.key === 'Enter') handleRename() }}
                                    />
                                    <button type="button" className="pl-rename__edit" onClick={handleRename} aria-label="Confirmar">
                                        <FaCheck size={12} />
                                    </button>
                                </div>
                            ) : (
                                <h1 className="rel-detail__title">
                                    {playlist.name}
                                    {canEdit && (
                                        <button type="button" className="pl-rename__edit" onClick={() => setEditingName(true)} aria-label="Renomear">
                                            <FaPen size={13} />
                                        </button>
                                    )}
                                </h1>
                            )}

                            {playlist.description && (
                                <p className="rel-detail__sub" style={{ marginTop: 4, fontStyle: 'italic', opacity: 0.75 }}>
                                    {playlist.description}
                                </p>
                            )}

                            <div className="rel-detail__sub" style={{ marginTop: 8 }}>
                                <span>{tracks.length} {tracks.length === 1 ? 'faixa' : 'faixas'}</span>
                                {totalMs > 0 && <><span className="rel-detail__dot" /><span>{fmtTotalMs(totalMs)}</span></>}
                            </div>

                            <div className="rel-detail__actions">
                                {queue.length > 0 && (
                                    <button type="button" className="rel-detail__play-btn" onClick={() => setTrack(queue[0], queue)}>
                                        <FaPlay size={16} /> Reproduzir
                                    </button>
                                )}
                                {!playlist.owner && !playlist.systemGenerated && (
                                    <PlaylistLikeButton playlistId={playlist.id} size={15} />
                                )}
                            </div>
                        </div>
                    </div>

                    {(canEdit || playlist.isPublic) && (
                        <div className="trk-menu" style={{ position: 'absolute', top: 12, right: 12, zIndex: 20 }}>
                            <button
                                type="button"
                                ref={menuBtnRef}
                                className={'trk-menu__btn' + (menuOpen ? ' trk-menu__btn--open' : '')}
                                onClick={handleMenuOpen}
                                aria-label="Mais opções"
                            >
                                <FaEllipsisH size={13} />
                            </button>
                            {menuOpen && createPortal(
                                <div ref={menuRef} className="trk-menu__popover" style={menuStyle} onClick={e => e.stopPropagation()}>
                                    {canEdit ? (
                                        <>
                                            <button type="button" className="trk-menu__item"
                                                onClick={() => { setMenuOpen(false); setShowEdit(true) }}>
                                                <div className="trk-menu__pl-cover trk-menu__create-icon"><FaPen size={10} /></div>
                                                <span className="trk-menu__pl-name">Editar playlist</span>
                                            </button>
                                            <button type="button" className="trk-menu__item"
                                                onClick={() => { setMenuOpen(false); handleToggleVisibility() }}>
                                                <div className="trk-menu__pl-cover trk-menu__create-icon">
                                                    {playlist.isPublic ? <FaLock size={10} /> : <FaGlobe size={10} />}
                                                </div>
                                                <span className="trk-menu__pl-name">
                                                    {playlist.isPublic ? 'Tornar privada' : 'Tornar pública'}
                                                </span>
                                            </button>
                                            <div className="trk-menu__divider" />
                                            <button type="button" className="trk-menu__item trk-menu__item--remove"
                                                onClick={() => { setMenuOpen(false); setShowConfirmDel(true) }}>
                                                <div className="trk-menu__pl-cover trk-menu__remove-icon"><FaTrash size={10} /></div>
                                                <span className="trk-menu__pl-name">Remover playlist</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button type="button" className="trk-menu__item"
                                            onClick={() => { setMenuOpen(false); handleSaveToggle() }}>
                                            <div className="trk-menu__pl-cover trk-menu__create-icon">
                                                {playlist.saved ? <FaBookmark size={10} /> : <FaRegBookmark size={10} />}
                                            </div>
                                            <span className="trk-menu__pl-name">
                                                {playlist.saved ? 'Remover da biblioteca' : 'Guardar na biblioteca'}
                                            </span>
                                        </button>
                                    )}
                                </div>,
                                document.body
                            )}
                        </div>
                    )}
                </div>

                {/* ── Lista de faixas ────────────────────────────────── */}
                <div className="rel-detail__body">
                    {tracks.length === 0 ? (
                        <p className="detail-loading">
                            {isFav ? 'Ainda não deste like a nenhuma faixa.' : 'Sem faixas nesta playlist.'}
                        </p>
                    ) : (
                        <>
                            <div className="rel-detail__list-head">
                                <span className="rel-detail__list-num">#</span>
                                <span />
                                <span>Título</span>
                                <span />
                                <span />
                                <span />
                                <span className="rel-detail__list-dur">Duração</span>
                            </div>
                            <ul className="strack-list">
                                {tracks.map((t, i) => {
                                    const queueItem    = { id: t.id, name: t.title, artistName: t.artistName ?? '', artistProfileId: t.artistProfileId ?? null, coverUrl: t.coverUrl ?? null, durationMs: t.durationMs, audioUrl: t.audioUrl, source: 'upload', playContext: 'playlist' }
                                    const isActive     = currentTrack?.audioUrl && currentTrack.audioUrl === t.audioUrl
                                    const commentsOpen = openCommentTrack === t.id

                                    return (
                                        <Fragment key={t.id ?? i}>
                                            <li
                                                className={'strack' + (t.audioUrl ? ' strack--playable' : '') + (isActive ? ' is-playing' : '') + (commentsOpen ? ' strack--comments-open' : '')}
                                                onClick={() => t.audioUrl && setTrack(queueItem, queue)}
                                            >
                                                <div className="strack__num-wrap">
                                                    <span className="strack__num">{i + 1}</span>
                                                    {t.audioUrl && <span className="strack__play-icon"><FaPlay size={11} /></span>}
                                                </div>
                                                {t.coverUrl
                                                    ? <img src={t.coverUrl} alt={t.title} className="strack__cover" />
                                                    : <div className="strack__cover strack__cover--placeholder" />
                                                }
                                                <div className="strack__info">
                                                    <div className="strack__title">{t.title}</div>
                                                    <div className="strack__sub">
                                                    {isActive ? 'A reproduzir…' : (
                                                        <ClickableName artistProfileId={t.artistProfileId} name={t.artistName ?? ''} />
                                                    )}
                                                </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={'rel-comment-btn' + (commentsOpen ? ' rel-comment-btn--active' : '')}
                                                    onClick={e => toggleComments(e, t.id)}
                                                    aria-label="Comentários"
                                                >
                                                    <FaRegComment size={13} />
                                                </button>
                                                <TrackMenu
                                                    trackId={t.id}
                                                    artistProfileId={t.artistProfileId}
                                                    playlistId={playlist.owner ? playlist.id : undefined}
                                                    onRemove={playlist.owner ? () => handleRemoveTrack(t.id) : undefined}
                                                />
                                                <span className="strack__dur">{fmtMs(t.durationMs)}</span>
                                            </li>
                                            {commentsOpen && (
                                                <li className="strack-comments-row">
                                                    <TrackComments trackId={t.id} trackTitle={t.title} />
                                                </li>
                                            )}
                                        </Fragment>
                                    )
                                })}
                            </ul>
                        </>
                    )}
                </div>

            </div>

            {showEdit && (
                <PlaylistCreateModal
                    playlist={playlist}
                    onClose={() => setShowEdit(false)}
                    onUpdated={updated => setPlaylist(prev => ({ ...prev, ...updated }))}
                />
            )}

            {showConfirmDel && (
                <ConfirmModal
                    title="Remover playlist"
                    message={`Tens a certeza que queres remover "${playlist.name}"? Esta acção não pode ser desfeita.`}
                    confirmLabel="Remover"
                    loading={deleting}
                    onConfirm={handleDelete}
                    onClose={() => setShowConfirmDel(false)}
                />
            )}

        </AppShell>
    )
}
