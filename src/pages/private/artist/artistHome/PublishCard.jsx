/* ─────────────────────────────────────────────────────────────────
   PublishCard.jsx, CTA destacado para publicar nova faixa.
   ───────────────────────────────────────────────────────────────── */

import { HiUpload, HiPlus } from 'react-icons/hi'
import { usePublish } from '../../../../context/PublishContext.jsx'
import './PublishCard.css'

export default function PublishCard() {
    const { openPublish } = usePublish();

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
            <button type="button" className="publish-card__btn" onClick={openPublish}>
                <HiPlus size={16} /> Nova publicação
            </button>
        </div>
    );
}
