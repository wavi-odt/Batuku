import { useState } from 'react'
import './MarketplaceRoleModal.css'

const ROLE_LABEL = {
    PRODUCER: 'Sou produtor, quero vender beats',
    FAN:      'Sou artista, quero comprar beats',
}

export default function MarketplaceRoleModal({ onChoose, onBack }) {
    const [pending, setPending] = useState(null)

    if (pending) {
        return (
            <div className="mkt-modal__backdrop">
                <div className="mkt-modal__content">
                    <p className="mkt-modal__question">Tens a certeza?</p>
                    <p className="mkt-modal__sub">
                        {ROLE_LABEL[pending]}<br />
                        Não pode ser alterada depois.
                    </p>
                    <div className="mkt-modal__actions">
                        <button
                            type="button"
                            className="mkt-modal__btn mkt-modal__btn--yes"
                            onClick={() => onChoose(pending)}
                        >
                            Sim, confirmar
                        </button>
                        <button
                            type="button"
                            style={{ background: 'none', border: 'none', color: 'var(--color-ink-mute)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '8px' }}
                            onClick={() => setPending(null)}
                        >
                            Voltar atrás
                        </button>
                    </div>
                </div>
            </div>
        )
    }

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
                        onClick={() => setPending('PRODUCER')}
                    >
                        Sou produtor, quero vender beats
                    </button>
                    <button
                        type="button"
                        className="mkt-modal__btn mkt-modal__btn--no"
                        onClick={() => setPending('FAN')}
                    >
                        Sou artista, quero comprar beats
                    </button>
                    <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--color-ink-mute)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '8px' }}
                        onClick={onBack}
                    >
                        Sou apenas um ouvinte normal
                    </button>
                    <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--color-ink-mute)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '2px' }}
                        onClick={onBack}
                    >
                        Agora não
                    </button>
                </div>
            </div>
        </div>
    )
}
