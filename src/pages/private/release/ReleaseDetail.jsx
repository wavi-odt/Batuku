import { useEffect, useState, useRef, Fragment } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaPlay, FaCompactDisc, FaArrowLeft, FaShareAlt, FaTrash, FaRegComment, FaCamera, FaPen, FaCheck } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import { API, getToken, getRole } from '../../../utils/auth.js'
import { usePlayer } from '../../../context/PlayerContext'
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import { useToast } from '../../../context/ToastContext.jsx'
import LikeButton from '../../../components/LikeButton'
import TrackMenu from '../../../components/TrackMenu'
import TrackComments from '../../../components/TrackComments'
import '../DetailPage.css'
import './ReleaseDetail.css'

const TYPE_LABEL = { ALBUM: 'Álbum', EP: 'EP', MIXTAPE: 'Mixtape', SINGLE: 'Single' }

function fmtMs(ms) {
    if (!ms) return '—'
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function fmtTotalMs(ms) {
    if (!ms) return null
    const min = Math.floor(ms / 60000)
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `${h} h ${m} min` : `${h} h`
}

function fmtDate(iso) {
    if (!iso) return null
    const [y, m, d] = iso.split('-')
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    return d ? `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}` : y
}

function toPlayerTrack(t, fallbackCover, artistName) {
    return {
        id:         t.id,
        name:       t.title,
        artistName: t.artistName || artistName,
        coverUrl:   t.coverUrl || fallbackCover,
        durationMs: t.durationMs,
        audioUrl:   t.audioUrl,
        source:     'upload',
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

    function fmtTime(iso) {
        if (!iso) return ''
        return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
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
                                    <span className="rel-inline-comment__time">{fmtTime(c.createdAt)}</span>
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
    const realUser  = useCurrentUser()
    const { showToast } = useToast()
    const coverInputRef = useRef(null)

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
            .then(res => res.ok ? res.json() : Promise.reject(`Erro ${res.status}`))
            .then(data => {
                setRelease(data)
            })
            .catch(err => setError(String(err)))
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

    if (loading) return <AppShell role={role}><div className="detail-loading">A carregar…</div></AppShell>
    if (error || !release) return <AppShell role={role}><div className="detail-error">{error || 'Lançamento não encontrado.'}</div></AppShell>

    const tracks    = release.tracks ?? []
    const queue     = tracks.map(t => toPlayerTrack(t, release.coverUrl, release.artistName))
    const totalMs   = tracks.reduce((acc, t) => acc + (t.durationMs || 0), 0)
    const typeLabel = TYPE_LABEL[release.albumType] ?? release.albumType
    const dateStr   = fmtDate(release.releaseDate) ?? release.createdAt?.split('T')[0].split('-')[0]
    const isOwner   = role === 'artist' && realUser?.artistProfileId === release.artistProfileId

    return (
        <AppShell role={role}>
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
                            {release.coverUrl
                                ? <img src={release.coverUrl} alt={release.title} />
                                : <div className="rel-detail__cover-placeholder"><FaCompactDisc size={52} /></div>
                            }
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
                                        autoFocus
                                    />
                                    <button type="button" className="btn-primary" style={{ padding: '8px 12px' }} onClick={handleTitleSave} disabled={savingTitle}>
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
                                <Link className="rel-detail__artist" to={`/artists/${release.artistProfileId}`}>
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
                                                    <span className="strack__num">{i + 1}</span>
                                                    <span className="strack__play-icon"><FaPlay size={11} /></span>
                                                </div>
                                                {pt.coverUrl
                                                    ? <img src={pt.coverUrl} alt={t.title} className="strack__cover" />
                                                    : <div className="strack__cover strack__cover--placeholder" />
                                                }
                                                <div className="strack__info">
                                                    <div className="strack__title">{t.title}</div>
                                                    <div className="strack__sub">{isActive ? 'A reproduzir…' : t.artistName}</div>
                                                </div>
                                                <LikeButton trackId={t.id} />
                                                <button
                                                    type="button"
                                                    className={'rel-comment-btn' + (commentsOpen ? ' rel-comment-btn--active' : '')}
                                                    onClick={e => toggleComments(e, t.id)}
                                                    aria-label="Comentários"
                                                >
                                                    <FaRegComment size={13} />
                                                </button>
                                                <TrackMenu trackId={t.id} />
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
        </AppShell>
    )
}
