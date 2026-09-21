import './MarketplaceRoleModal.css'

export default function MarketplaceRoleModal({ onChoose }) {
    return (
        <div className="mkt-modal__backdrop">
            <div className="mkt-modal__content">
                <p className="mkt-modal__question">
                    És beatmaker ou produtor de beats?
                </p>
                <p className="mkt-modal__sub">
                    A tua resposta define a tua experiência no marketplace.<br />
                    Não pode ser alterada depois.
                </p>
                <div className="mkt-modal__actions">
                    <button
                        type="button"
                        className="mkt-modal__btn mkt-modal__btn--yes"
                        onClick={() => onChoose('PRODUCER')}
                    >
                        Sim, sou produtor
                    </button>
                    <button
                        type="button"
                        className="mkt-modal__btn mkt-modal__btn--no"
                        onClick={() => onChoose('FAN')}
                    >
                        Não, só quero comprar
                    </button>
                </div>
            </div>
        </div>
    )
}
