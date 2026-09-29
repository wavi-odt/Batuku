import './MarketplaceRoleModal.css'

export default function MarketplaceRoleModal({ onChoose, onBack }) {
    return (
        <div className="mkt-modal__backdrop">
            <div className="mkt-modal__content">
                <p className="mkt-modal__question">
                    O que procuras no marketplace?
                </p>
                <p className="mkt-modal__sub">
                    Escolhe o que descreve melhor o teu papel.<br />
                    Não pode ser alterada depois.
                </p>
                <div className="mkt-modal__actions">
                    <button
                        type="button"
                        className="mkt-modal__btn mkt-modal__btn--yes"
                        onClick={() => onChoose('PRODUCER')}
                    >
                        Sou produtor — quero vender beats
                    </button>
                    <button
                        type="button"
                        className="mkt-modal__btn mkt-modal__btn--no"
                        onClick={() => onChoose('FAN')}
                    >
                        Sou artista — quero comprar beats
                    </button>
                    <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--color-ink-mute)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '8px' }}
                        onClick={onBack}
                    >
                        Agora não
                    </button>
                </div>
            </div>
        </div>
    )
}
