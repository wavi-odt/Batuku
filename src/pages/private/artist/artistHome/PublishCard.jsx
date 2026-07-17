/* ─────────────────────────────────────────────────────────────────
   PublishCard.jsx, CTA destacado para publicar nova faixa.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { HiUpload, HiPlus } from 'react-icons/hi'
import './PublishCard.css'

export default function PublishCard() {
    return (
        <div className="publish-card">
            <div className="publish-card__bg-shape" aria-hidden="true" />
            <HiUpload size={28} />
            <div className="publish-card__text">
                <h3 className="publish-card__title">Publica uma nova faixa.</h3>
                <p className="publish-card__sub">
                    Sobe áudio, escolhe a capa, define visibilidade.
                    Vai à descoberta em minutos.
                </p>
            </div>
            <Link to="/publish" className="publish-card__btn">
                <HiPlus size={16} /> Nova publicação
            </Link>
        </div>
    );
}
