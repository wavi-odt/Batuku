/* ─────────────────────────────────────────────────────────────────
   PendingComments.jsx — Comentários por responder nas faixas.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import './PendingComments.css'

export default function PendingComments({ comments }) {
    return (
        <div className="comments-card">
            <h3 className="comments-card__title">
                Comentários por responder
                <span className="comments-card__count">{comments.length} novos</span>
            </h3>

            {comments.map((c, i) => (
                <div key={i} className="comment-row">
                    <div className="comment-row__head">
                        <div className="comment-row__avatar">
                            <ArtistArtwork shape="circles" hue={c.hue} rounded={0} />
                        </div>
                        <span className="comment-row__user">{c.user}</span>
                        <span className="comment-row__track">· em {c.track}</span>
                        <span className="comment-row__time">{c.time}</span>
                    </div>
                    <p className="comment-row__text">{c.text}</p>
                    <div className="comment-row__actions">
                        <button type="button" className="comment-row__btn comment-row__btn--primary">Responder</button>
                        <button type="button" className="comment-row__btn">Gostar</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
