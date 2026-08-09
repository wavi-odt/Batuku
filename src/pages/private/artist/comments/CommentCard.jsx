import { useState } from 'react'
import { FaThumbtack, FaReply, FaTrash, FaMusic } from 'react-icons/fa'
import { useCurrentUser } from '../../../../hooks/useCurrentUser.js'

function hueFromStr(str) {
    let n = 0
    for (const c of str ?? '') n = (n * 31 + c.charCodeAt(0)) & 0xffff
    return n % 360
}

function timeAgo(iso) {
    if (!iso) return ''
    const m = Math.floor((Date.now() - new Date(iso)) / 60000)
    if (m < 1)  return 'agora mesmo'
    if (m < 60) return `há ${m} min`
    const h = Math.floor(m / 60)
    if (h < 24) return `há ${h}h`
    const d = Math.floor(h / 24)
    if (d < 30) return `há ${d} dia${d > 1 ? 's' : ''}`
    return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Av({ name, url, className }) {
    return (
        <div className={className}>
            {url
                ? <img src={url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span className="cmt__initials">{name?.[0]?.toUpperCase() ?? '?'}</span>
            }
        </div>
    )
}

export default function CommentCard({ comment, onDelete, onReply, onPin }) {
    const currentUser = useCurrentUser()
    const [pinned,     setPinned]     = useState(comment.pinned ?? false)
    const [replyOpen,  setReplyOpen]  = useState(false)
    const [replyText,  setReplyText]  = useState('')
    const [savedReply, setSavedReply] = useState(comment.reply ?? null)
    const [saving,     setSaving]     = useState(false)

    const isPending = !savedReply
    const trackHue  = hueFromStr(comment.trackTitle)

    function openReply() {
        setReplyText(savedReply?.content ?? '')
        setReplyOpen(v => !v)
    }

    async function togglePin() {
        const next = !pinned
        setPinned(next)
        onPin?.(comment.id, next)
    }

    async function submitReply() {
        if (!replyText.trim() || saving) return
        setSaving(true)
        try {
            const reply = await onReply(comment.id, replyText.trim(), !!savedReply)
            setSavedReply(reply)
            setReplyText('')
            setReplyOpen(false)
        } catch { } finally {
            setSaving(false)
        }
    }

    return (
        <div className={[
            'cmt__card',
            pinned    ? 'cmt__card--pinned'  : '',
            isPending ? 'cmt__card--pending' : '',
        ].filter(Boolean).join(' ')}>

            <div className="cmt__card-body">
                {/* ── Top row ──────────────────────────────────── */}
                <div className="cmt__card-top">
                    <Av name={comment.authorName} url={comment.authorAvatarUrl} className="cmt__avatar" />

                    <div className="cmt__meta">
                        <div className="cmt__user-row">
                            <span className="cmt__user-name">{comment.authorName}</span>
                            {comment.authorHandle && (
                                <span className="cmt__user-handle">{comment.authorHandle}</span>
                            )}
                            {comment.trackTitle && (
                                <>
                                    <span className="cmt__dot" />
                                    <span className="cmt__track-pill" style={{ '--track-hue': trackHue }}>
                                        <FaMusic size={9} />
                                        {comment.trackTitle}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="cmt__time">{timeAgo(comment.createdAt)}</div>
                    </div>

                    <div className="cmt__badges">
                        {pinned && (
                            <span className="cmt__badge cmt__badge--pinned">
                                <FaThumbtack size={9} /> Fixado
                            </span>
                        )}
                        {isPending
                            ? <span className="cmt__badge cmt__badge--pending">Pendente</span>
                            : <span className="cmt__badge cmt__badge--replied">Respondido</span>
                        }
                    </div>
                </div>

                {/* ── Texto ────────────────────────────────────── */}
                <p className="cmt__text">{comment.content}</p>

                {/* ── Ações ────────────────────────────────────── */}
                <div className="cmt__actions">
                    <button
                        type="button"
                        className={`cmt__action-btn${pinned ? ' cmt__action-btn--pinned' : ''}`}
                        onClick={togglePin}
                        title={pinned ? 'Remover pin' : 'Fixar comentário'}
                    >
                        <FaThumbtack size={11} /> {pinned ? 'Fixado' : 'Fixar'}
                    </button>

                    <button
                        type="button"
                        className={`cmt__action-btn${replyOpen ? ' cmt__action-btn--reply-open' : ''}`}
                        onClick={openReply}
                    >
                        <FaReply size={11} /> {savedReply ? 'Editar resposta' : 'Responder'}
                    </button>

                    <button
                        type="button"
                        className="cmt__action-btn cmt__action-btn--delete"
                        onClick={() => onDelete(comment.id)}
                        title="Eliminar comentário"
                    >
                        <FaTrash size={10} />
                    </button>
                </div>
            </div>

            {/* ── Resposta existente ───────────────────────────── */}
            {savedReply && !replyOpen && (
                <div className="cmt__reply">
                    <Av name={currentUser?.name} url={currentUser?.picture} className="cmt__reply-avatar" />
                    <div className="cmt__reply-body">
                        <div className="cmt__reply-author">
                            {currentUser?.name ?? 'Tu'}
                            <span className="cmt__reply-badge"> · Artista</span>
                        </div>
                        <div className="cmt__reply-text">{savedReply.content}</div>
                        <div className="cmt__reply-time">{timeAgo(savedReply.createdAt)}</div>
                    </div>
                </div>
            )}

            {/* ── Compositor de resposta ───────────────────────── */}
            {replyOpen && (
                <div className="cmt__composer">
                    <Av name={currentUser?.name} url={currentUser?.picture} className="cmt__composer-avatar" />
                    <div className="cmt__composer-inner">
                        <textarea
                            className="cmt__composer-textarea"
                            placeholder={`Responder a ${comment.authorName}…`}
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            autoFocus
                        />
                        <div className="cmt__composer-row">
                            <button
                                type="button"
                                className="cmt__composer-cancel"
                                onClick={() => { setReplyOpen(false); setReplyText('') }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="cmt__composer-submit"
                                onClick={submitReply}
                                disabled={!replyText.trim() || saving}
                            >
                                {saving ? '…' : 'Publicar resposta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
