import { useEffect, useState, useRef, Fragment } from 'react'
import NowPlayingEq from '../../../components/NowPlayingEq.jsx'
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom'
import { FaPlay, FaArrowLeft, FaShareAlt, FaTrash, FaRegComment, FaCamera, FaPen, FaCheck } from 'react-icons/fa'
import { API, getToken, getRole } from '../../../utils/auth.js'
import { usePlayer } from '../../../context/PlayerContext'
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import { useToast } from '../../../context/ToastContext.jsx'
import TrackMenu from '../../../components/TrackMenu'
import TrackComments from '../../../components/TrackComments'
import CoverImg from '../../../components/CoverImg.jsx'
import { fmtMs, fmtTotalMs, fmtDateFull, fmtDateLong } from '../../../utils/formatters'
import '../DetailPage.css'
import './ReleaseDetail.css'

const TYPE_LABEL = { ALBUM: 'Álbum', EP: 'EP', MIXTAPE: 'Mixtape', SINGLE: 'Single' }

function toPlayerTrack(t, fallbackCover, artistName, artistProfileId) {
    return {
        id:               t.id,
        name:             t.title,
        artistName:       t.artistName || artistName,
        artistProfileId:  t.artistProfileId ?? artistProfileId ?? null,
        coverUrl:         t.coverUrl || fallbackCover,
        durationMs:       t.durationMs,
        audioUrl:         t.audioUrl,
        source:           'upload',
        playContext:      'release',
    }
}

/* ─── Album comments section ─────────────────────────────────────── */
function AlbumComments({ albumId, albumTitle }) {
    const [comments,   setComments]   = useState([])
    const [loading,    setLoading]    = useState(true)
    const [draft,      setDraft]      = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetch(`${API}/api/comments/release/${albumId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(setComments)
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [albumId])

    async function submit(e) {
        e.preventDefault()
        if (!draft.trim() || submitting) return
        setSubmitting(true)
        try {
            const res = await fetch(`${API}/api/comments/release/${albumId}`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({ content: draft.trim() }),
            })
            if (!res.ok) throw new Error()
            const c = await res.json()
            setComments(prev => [c, ...prev])
            setDraft('')
        } catch { /* silencioso */ } finally {
            setSubmitting(false)
        }
    }

    async function del(id) {
        try {
            const res = await fetch(`${API}/api/comments/${id}`, {
                method:  'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            setComments(prev => prev.filter(c => c.id !== id))
        } catch { /* silencioso */ }
    }

    return (
        <div className="rel-album-comments">
            <h2 className="rel-album-comments__title">
                Comentários ao lançamento
                {comments.length > 0 && <span className="rel-album-comments__count">{comments.length}</span>}
            </h2>

            <form className="rel-inline-comments__form" onSubmit={submit}>
                <input
                    className="rel-inline-comments__input"
                    placeholder={`Comentar "${albumTitle}"…`}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                />
                <button type="submit" className="btn-primary rel-inline-comments__submit" disabled={submitting || !draft.trim()}>
                    {submitting ? '…' : 'Publicar'}
                </button>
            </form>

            {loading && <p className="rel-inline-comments__empty">A carregar…</p>}
            {!loading && comments.length === 0 && (
                <p className="rel-inline-comments__empty">Ainda sem comentários. Sê o primeiro!</p>
            )}

            {comments.length > 0 && (
                <ul className="rel-inline-comments__list">
                    {comments.map(c => (
                        <li key={c.id} className="rel-inline-comment">
                            <div className="rel-inline-comment__avatar">
                                {c.authorAvatarUrl
                                    ? <img src={c.authorAvatarUrl} alt={c.authorName} />
                                    : <span>{c.authorName?.[0]?.toUpperCase() ?? '?'}</span>
                                }
                            </div>
                            <div className="rel-inline-comment__body">
                                <div className="rel-inline-comment__header">
                                    <span className="rel-inline-comment__author">{c.authorName}</span>
                                    <span className="rel-inline-comment__time">{fmtDateLong(c.createdAt)}</span>
                                </div>
                                <p className="rel-inline-comment__text">{c.content}</p>
                            </div>
                            {c.owner && (
                                <button
                                    type="button"
                                    className="rel-inline-comment__delete"
                                    onClick={() => del(c.id)}
                                    aria-label="Eliminar"
                                >
                                    <FaTrash size={11} />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function ReleaseDetail() {
    const { id }   = useParams()
    const role     = getRole() === 'artist' ? 'artist' : 'fan'
    const navigate = useNavigate()
    const { track: currentTrack, setTrack } = usePlayer()
    const { user: realUser } = useCurrentUser()
    const { showToast } = useToast()
    const coverInputRef = useRef(null)

    const [notFound,         setNotFound]         = useState(false)
    const [release,          setRelease]          = useState(null)
    const [loading,          setLoading]           = useState(true)
    const [error,            setError]             = useState('')
    const [copied,           setCopied]            = useState(false)
    const [openCommentTrack, setOpenCommentTrack]  = useState(null)
    const [uploadingCover,   setUploadingCover]    = useState(false)
    const [editingTitle,     setEditingTitle]      = useState(false)
    const [titleDraft,       setTitleDraft]        = useState('')
    const [savingTitle,      setSavingTitle]       = useState(false)

    useEffect(() => {
        fetch(`${API}/api/releases/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => {
                if (res.status === 404) return Promise.reject('404');
                return res.ok ? res.json() : Promise.reject(`Erro ${res.status}`);
            })
            .then(data => {
                setRelease(data)
            })
            .catch(err => { if (String(err) === '404') setNotFound(true); else setError(String(err)); })
            .finally(() => setLoading(false))
    }, [id])

    function share() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    async function handleCoverChange(e) {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { showToast('Escolhe uma imagem válida.', 'error'); return }
        if (file.size > 5 * 1024 * 1024) { showToast('A capa não pode ultrapassar 5 MB.', 'error'); return }
        setUploadingCover(true)
        try {
            const body = new FormData()
            body.append('cover', file)
            const res = await fetch(`${API}/api/releases/${id}/cover`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${getToken()}` },
                body,
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setRelease(updated)
            showToast('Capa actualizada!')
        } catch {
            showToast('Erro ao actualizar a capa. Tenta novamente.', 'error')
        } finally {
            setUploadingCover(false)
            e.target.value = ''
        }
    }

    async function handleTitleSave() {
        if (!titleDraft.trim() || savingTitle) return
        setSavingTitle(true)
        try {
            const res = await fetch(`${API}/api/releases/${id}`, {
                method:  'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({ title: titleDraft.trim() }),
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setRelease(prev => ({ ...prev, title: updated.title }))
            setEditingTitle(false)
            showToast('Nome actualizado!')
        } catch {
            showToast('Erro ao guardar o nome. Tenta novamente.', 'error')
        } finally {
            setSavingTitle(false)
        }
    }

    function toggleComments(e, trackId) {
        e.stopPropagation()
        setOpenCommentTrack(prev => prev === trackId ? null : trackId)
    }

    if (notFound) return <Navigate to="/not-found" replace />
    if (loading) return <div className="detail-loading">A carregar…</div>
    if (error || !release) return <div className="detail-error">{error || 'Lançamento não encontrado.'}</div>

    const tracks    = release.tracks ?? []
    const queue     = tracks.map(t => toPlayerTrack(t, release.coverUrl, release.artistName, release.artistProfileId))
    const totalMs   = tracks.reduce((acc, t) => acc + (t.durationMs || 0), 0)
    const typeLabel = TYPE_LABEL[release.albumType] ?? release.albumType
    const dateStr   = fmtDateFull(release.releaseDate) ?? release.createdAt?.split('T')[0].split('-')[0]
    const isOwner   = role === 'artist' && realUser?.artistProfileId === release.artistProfileId

    return (
        <div className="rel-detail">

                <button type="button" className="rel-detail__back" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={14} /> Voltar
                </button>

                {/* ── Hero ────────────────────────────────────────── */}
                <div className="rel-detail__hero">
                    {release.coverUrl && (
                        <div className="rel-detail__hero-bg" style={{ backgroundImage: `url(${release.coverUrl})` }} />
                    )}
                    <div className="rel-detail__hero-overlay" />

                    <div className="rel-detail__hero-content">
                        <div
                            className={'rel-detail__cover' + (isOwner ? ' rel-detail__cover--editable' : '')}
                            onClick={isOwner ? () => coverInputRef.current?.click() : undefined}
                        >
                            <CoverImg src={release.coverUrl} alt={release.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} iconSize={52} />
                            {isOwner && (
                                <div className={'rel-detail__cover-edit' + (uploadingCover ? ' rel-detail__cover-edit--loading' : '')}>
                                    {uploadingCover
                                        ? <div className="rel-detail__cover-spinner" />
                                        : <FaCamera size={22} />
                                    }
                                </div>
                            )}
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleCoverChange}
                            />
                        </div>

                        <div className="rel-detail__meta">
                            <span className="rel-detail__type">{typeLabel}</span>
                            {editingTitle ? (
                                <div className="pl-rename">
                                    <input
                                        className="input pl-rename__input"
                                        value={titleDraft}
                                        onChange={e => setTitleDraft(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') setEditingTitle(false); }}
                                        required
                                        autoFocus
                                    />
                                    <button type="button" className="btn-primary" style={{ padding: '8px 12px' }} onClick={handleTitleSave} disabled={savingTitle || !titleDraft.trim()}>
                                        <FaCheck size={12} />
                                    </button>
                                </div>
                            ) : (
                                <h1 className="rel-detail__title">
                                    {release.title}
                                    {isOwner && (
                                        <button type="button" className="pl-rename__edit" onClick={() => { setTitleDraft(release.title); setEditingTitle(true); }} aria-label="Renomear">
                                            <FaPen size={13} />
                                        </button>
                                    )}
                                </h1>
                            )}
                            <div className="rel-detail__sub">
                                <Link className="rel-detail__artist" to={isOwner ? '/profile' : `/artists/${release.artistProfileId}`}>
                                    {release.artistName}
                                </Link>
                                {dateStr && <><span className="rel-detail__dot" /><span>{dateStr}</span></>}
                                <span className="rel-detail__dot" />
                                <span>{tracks.length} {tracks.length === 1 ? 'faixa' : 'faixas'}</span>
                                {totalMs > 0 && <><span className="rel-detail__dot" /><span>{fmtTotalMs(totalMs)}</span></>}
                            </div>

                            <div className="rel-detail__actions">
                                {tracks.length > 0 && (
                                    <button type="button" className="rel-detail__play-btn" onClick={() => setTrack(queue[0], queue)}>
                                        <FaPlay size={16} /> Reproduzir
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className={'rel-detail__share-btn' + (copied ? ' rel-detail__share-btn--copied' : '')}
                                    onClick={share}
                                >
                                    <FaShareAlt size={14} />
                                    {copied ? 'Copiado!' : 'Partilhar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Track list ──────────────────────────────────── */}
                <div className="rel-detail__body">
                    {tracks.length === 0 ? (
                        <p className="detail-loading">Sem faixas neste lançamento.</p>
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
                                    const pt           = queue[i]
                                    const isActive     = currentTrack?.audioUrl === pt.audioUrl
                                    const commentsOpen = openCommentTrack === t.id

                                    return (
                                        <Fragment key={t.id ?? i}>
                                            <li
                                                className={'strack strack--playable' + (isActive ? ' is-playing' : '') + (commentsOpen ? ' strack--comments-open' : '')}
                                                onClick={() => setTrack(pt, queue)}
                                            >
                                                <div className="strack__num-wrap">
                                                    {isActive
                                                        ? <NowPlayingEq />
                                                        : <><span className="strack__num">{i + 1}</span><span className="strack__play-icon"><FaPlay size={11} /></span></>
                                                    }
                                                </div>
                                                <CoverImg src={pt.coverUrl} alt={t.title} className="strack__cover" />
                                                <div className="strack__info">
                                                    <div className="strack__title">{t.title}</div>
                                                    <div className="strack__sub">{isActive ? 'A reproduzir…' : t.artistName}</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={'rel-comment-btn' + (commentsOpen ? ' rel-comment-btn--active' : '')}
                                                    onClick={e => toggleComments(e, t.id)}
                                                    aria-label="Comentários"
                                                >
                                                    <FaRegComment size={13} />
                                                </button>
                                                <TrackMenu trackId={t.id} artistProfileId={t.artistProfileId ?? release.artistProfileId} />
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

                {/* ── Album-level comments ────────────────────────── */}
                <AlbumComments albumId={release.id} albumTitle={release.title} />

        </div>
    )
}
