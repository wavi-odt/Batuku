import { useEffect, useState } from 'react'
import { FaTrash, FaRegComment, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { API, getToken } from '../utils/auth.js'

function timeAgo(iso) {
    if (!iso) return ''
    const m = Math.floor((Date.now() - new Date(iso)) / 60000)
    if (m < 1)  return 'agora mesmo'
    if (m < 60) return `há ${m} min`
    const h = Math.floor(m / 60)
    if (h < 24) return `há ${h}h`
    const d = Math.floor(h / 24)
    if (d < 30) return `há ${d} dia${d > 1 ? 's' : ''}`
    return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}

function CommentItem({ c, onDelete }) {
    const [showReply, setShowReply] = useState(false)
    const hasReply = !!c.reply

    return (
        <li className="rel-inline-comment">
            <div className="rel-inline-comment__avatar">
                {c.authorAvatarUrl
                    ? <img src={c.authorAvatarUrl} alt={c.authorName} />
                    : <span>{c.authorName?.[0]?.toUpperCase() ?? '?'}</span>
                }
            </div>
            <div className="rel-inline-comment__body">
                <div className="rel-inline-comment__header">
                    <span className="rel-inline-comment__author">{c.authorName}</span>
                    <span className="rel-inline-comment__time">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="rel-inline-comment__text">{c.content}</p>

                {hasReply && (
                    <button
                        type="button"
                        className={'rel-inline-comment__reply-toggle' + (showReply ? ' is-open' : '')}
                        onClick={() => setShowReply(v => !v)}
                    >
                        {showReply ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
                        {showReply ? 'Ocultar resposta' : 'Ver resposta'}
                    </button>
                )}

                {hasReply && showReply && (
                    <div className="rel-inline-comment__reply">
                        <div className="rel-inline-comment__reply-avatar">
                            {c.reply.authorAvatarUrl
                                ? <img src={c.reply.authorAvatarUrl} alt={c.reply.authorName} />
                                : <span>{c.reply.authorName?.[0]?.toUpperCase() ?? '?'}</span>
                            }
                        </div>
                        <div className="rel-inline-comment__reply-body">
                            <div className="rel-inline-comment__reply-header">
                                <span className="rel-inline-comment__reply-author">{c.reply.authorName ?? 'Artista'}</span>
                                <span className="rel-inline-comment__reply-badge">Artista</span>
                                <span className="rel-inline-comment__time">{timeAgo(c.reply.createdAt)}</span>
                            </div>
                            <p className="rel-inline-comment__reply-text">{c.reply.content}</p>
                        </div>
                    </div>
                )}
            </div>
            {c.owner && (
                <button
                    type="button"
                    className="rel-inline-comment__delete"
                    onClick={() => onDelete(c.id)}
                    aria-label="Eliminar"
                >
                    <FaTrash size={11} />
                </button>
            )}
        </li>
    )
}

export default function TrackComments({ trackId, trackTitle }) {
    const [comments,   setComments]   = useState([])
    const [loading,    setLoading]    = useState(true)
    const [draft,      setDraft]      = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`${API}/api/comments/track/${trackId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(setComments)
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [trackId])

    async function submit(e) {
        e.preventDefault()
        if (!draft.trim() || submitting) return
        setSubmitting(true)
        try {
            const res = await fetch(`${API}/api/comments/track/${trackId}`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({ content: draft.trim() }),
            })
            if (!res.ok) throw new Error()
            const c = await res.json()
            setComments(prev => [c, ...prev])
            setDraft('')
        } catch { } finally {
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
        } catch { }
    }

    const count = comments.length

    return (
        <div className="rel-inline-comments">
            <div className="rel-inline-comments__hdr">
                <FaRegComment size={11} />
                {loading ? 'A carregar…' : `${count} comentário${count !== 1 ? 's' : ''}`}
            </div>

            <form className="rel-inline-comments__form" onSubmit={submit}>
                <input
                    className="rel-inline-comments__input"
                    placeholder={`Comentar "${trackTitle}"…`}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    autoFocus
                />
                <button
                    type="submit"
                    className="btn-primary rel-inline-comments__submit"
                    disabled={submitting || !draft.trim()}
                >
                    {submitting ? '…' : 'Publicar'}
                </button>
            </form>

            {!loading && count === 0 && (
                <div className="rel-inline-comments__empty">
                    <FaRegComment size={20} />
                    <span>Sem comentários. Sê o primeiro!</span>
                </div>
            )}

            {count > 0 && (
                <ul className="rel-inline-comments__list">
                    {comments.map(c => (
                        <CommentItem key={c.id} c={c} onDelete={del} />
                    ))}
                </ul>
            )}
        </div>
    )
}
