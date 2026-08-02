/* ─────────────────────────────────────────────────────────────────
   CommentCard.jsx  ·  Cartão de comentário com reply inline.
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { FaHeart, FaThumbtack, FaReply, FaTrash, FaMusic } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { homeData }  from '../../../../data/home.js'

const artist = homeData.artist;

export default function CommentCard({ comment, onDelete }) {
    const [liked,      setLiked]      = useState(comment.isLiked);
    const [likes,      setLikes]      = useState(comment.likes);
    const [pinned,     setPinned]     = useState(comment.isPinned);
    const [replyOpen,  setReplyOpen]  = useState(false);
    const [replyText,  setReplyText]  = useState('');
    const [savedReply, setSavedReply] = useState(comment.reply);

    function toggleLike() {
        setLiked(v => !v);
        setLikes(n => liked ? n - 1 : n + 1);
    }

    function submitReply() {
        if (!replyText.trim()) return;
        setSavedReply({ text: replyText.trim(), time: 'agora mesmo' });
        setReplyText('');
        setReplyOpen(false);
    }

    const isPending = !savedReply;

    return (
        <div className={[
            'cmt__card',
            pinned    ? 'cmt__card--pinned'  : '',
            isPending ? 'cmt__card--pending' : '',
        ].filter(Boolean).join(' ')}>

            <div className="cmt__card-body">
                {/* ── Top row ──────────────────────────────────── */}
                <div className="cmt__card-top">
                    <div className="cmt__avatar">
                        <ArtistArtwork
                            shape={comment.shape}
                            hue={comment.hue}
                            rounded={0}
                            showGloss={false}
                        />
                    </div>

                    <div className="cmt__meta">
                        <div className="cmt__user-row">
                            <span className="cmt__user-name">{comment.user}</span>
                            <span className="cmt__user-handle">{comment.handle}</span>
                            <span className="cmt__dot" />
                            <span
                                className="cmt__track-pill"
                                style={{ '--track-hue': comment.trackHue }}
                            >
                                <FaMusic size={9} />
                                {comment.track}
                            </span>
                        </div>
                        <div className="cmt__time">{comment.time}</div>
                    </div>

                    {/* Badges */}
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

                {/* ── Comment text ─────────────────────────────── */}
                <p className="cmt__text">{comment.text}</p>

                {/* ── Actions ──────────────────────────────────── */}
                <div className="cmt__actions">
                    <button
                        type="button"
                        className={`cmt__action-btn${liked ? ' cmt__action-btn--liked' : ''}`}
                        onClick={toggleLike}
                    >
                        <FaHeart size={11} /> {likes}
                    </button>

                    <button
                        type="button"
                        className={`cmt__action-btn${pinned ? ' cmt__action-btn--pinned' : ''}`}
                        onClick={() => setPinned(v => !v)}
                        title={pinned ? 'Remover pin' : 'Fixar comentário'}
                    >
                        <FaThumbtack size={11} /> {pinned ? 'Fixado' : 'Fixar'}
                    </button>

                    <button
                        type="button"
                        className={`cmt__action-btn${replyOpen ? ' cmt__action-btn--reply-open' : ''}`}
                        onClick={() => setReplyOpen(v => !v)}
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

            {/* ── Existing reply ───────────────────────────────── */}
            {savedReply && !replyOpen && (
                <div className="cmt__reply">
                    <div className="cmt__reply-avatar">
                        <ArtistArtwork
                            shape={artist.avatar.shape}
                            hue={artist.avatar.hue}
                            rounded={0}
                            showGloss={false}
                        />
                    </div>
                    <div className="cmt__reply-body">
                        <div className="cmt__reply-author">{artist.name} <span style={{ fontWeight: 400, fontSize: '.72rem', color: 'var(--text-muted)' }}>· Artista</span></div>
                        <div className="cmt__reply-text">{savedReply.text}</div>
                        <div className="cmt__reply-time">{savedReply.time}</div>
                    </div>
                </div>
            )}

            {/* ── Reply composer ───────────────────────────────── */}
            {replyOpen && (
                <div className="cmt__composer">
                    <div className="cmt__composer-avatar">
                        <ArtistArtwork
                            shape={artist.avatar.shape}
                            hue={artist.avatar.hue}
                            rounded={0}
                            showGloss={false}
                        />
                    </div>
                    <div className="cmt__composer-inner">
                        <textarea
                            className="cmt__composer-textarea"
                            placeholder={`Responder a ${comment.user}…`}
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            autoFocus
                        />
                        <div className="cmt__composer-row">
                            <button
                                type="button"
                                className="cmt__composer-cancel"
                                onClick={() => { setReplyOpen(false); setReplyText(''); }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="cmt__composer-submit"
                                onClick={submitReply}
                                disabled={!replyText.trim()}
                            >
                                Publicar resposta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
