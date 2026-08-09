import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaReply } from 'react-icons/fa'
import { useCurrentUser } from '../../../../hooks/useCurrentUser.js'
import './PendingComments.css'

function Avatar({ name, avatarUrl, size = 28 }) {
    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%' }} />
    }
    const hue = (name?.charCodeAt(0) ?? 0) * 47 % 360
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: `hsl(${hue} 50% 40%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: size * 0.43, fontWeight: 700, flexShrink: 0,
        }}>
            {name?.[0]?.toUpperCase() ?? '?'}
        </div>
    )
}

function timeAgo(isoStr) {
    if (!isoStr) return ''
    const m = Math.floor((Date.now() - new Date(isoStr)) / 60000)
    if (m < 1)   return 'agora'
    if (m < 60)  return `há ${m} min`
    const h = Math.floor(m / 60)
    if (h < 24)  return `há ${h}h`
    const d = Math.floor(h / 24)
    return `há ${d} dia${d > 1 ? 's' : ''}`
}

function CommentRow({ c, onReply, currentUser }) {
    const [open,    setOpen]    = useState(false)
    const [text,    setText]    = useState('')
    const [saving,  setSaving]  = useState(false)
    const [reply,   setReply]   = useState(c.reply ?? null)

    async function submit() {
        if (!text.trim() || saving) return
        setSaving(true)
        try {
            const r = await onReply(c.id, text.trim(), !!reply)
            setReply(r)
            setText('')
            setOpen(false)
        } catch { } finally {
            setSaving(false)
        }
    }

    return (
        <div className="comment-row">
            <div className="comment-row__head">
                <div className="comment-row__avatar">
                    <Avatar name={c.authorName} avatarUrl={c.authorAvatarUrl} />
                </div>
                <span className="comment-row__user">{c.authorName}</span>
                {c.trackTitle && <span className="comment-row__track">· em {c.trackTitle}</span>}
                <span className="comment-row__time">{timeAgo(c.createdAt)}</span>
            </div>

            <p className="comment-row__text">{c.content}</p>

            {reply && !open && (
                <div className="comment-row__reply">
                    <Avatar name={currentUser?.name} avatarUrl={currentUser?.picture} size={22} />
                    <div className="comment-row__reply-body">
                        <span className="comment-row__reply-author">{currentUser?.name ?? 'Tu'}</span>
                        <span className="comment-row__reply-text">{reply.content}</span>
                    </div>
                </div>
            )}

            {open && (
                <div className="comment-row__composer">
                    <Avatar name={currentUser?.name} avatarUrl={currentUser?.picture} size={24} />
                    <div className="comment-row__composer-inner">
                        <textarea
                            className="comment-row__composer-ta"
                            placeholder={`Responder a ${c.authorName}…`}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            rows={2}
                            autoFocus
                        />
                        <div className="comment-row__composer-btns">
                            <button
                                type="button"
                                className="comment-row__btn"
                                onClick={() => { setOpen(false); setText('') }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="comment-row__btn comment-row__btn--primary"
                                onClick={submit}
                                disabled={!text.trim() || saving}
                            >
                                {saving ? '…' : 'Publicar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!open && (
                <div className="comment-row__actions">
                    <button
                        type="button"
                        className="comment-row__btn comment-row__btn--primary"
                        onClick={() => { setText(reply?.content ?? ''); setOpen(true) }}
                    >
                        <FaReply size={10} /> {reply ? 'Editar resposta' : 'Responder'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default function PendingComments({ comments, loading, onReply }) {
    const currentUser = useCurrentUser()
    const shown = comments.slice(0, 4)

    return (
        <div className="comments-card">
            <h3 className="comments-card__title">
                Comentários por responder
                {comments.length > 0 && (
                    <span className="comments-card__count">{comments.length} novos</span>
                )}
            </h3>

            {loading && <div style={{ color: 'var(--color-ink-mute)', fontSize: 13 }}>A carregar…</div>}

            {!loading && shown.length === 0 && (
                <div style={{ color: 'var(--color-ink-mute)', fontSize: 13 }}>Nenhum comentário por responder</div>
            )}

            {shown.map(c => (
                <CommentRow key={c.id} c={c} onReply={onReply} currentUser={currentUser} />
            ))}

            {comments.length > 4 && (
                <Link to="/comments" className="dash__head-link" style={{ marginTop: 8, display: 'block' }}>
                    Ver todos ({comments.length}) →
                </Link>
            )}
        </div>
    )
}
