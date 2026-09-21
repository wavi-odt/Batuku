import { useState }   from 'react'
import ArtistArtwork  from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { API, getToken } from '../../../../utils/auth.js'
import { useToast }   from '../../../../context/ToastContext.jsx'
import './OfferModal.css'

export default function OfferModal({ beat, onClose, onSubmitted }) {
    const { showToast } = useToast()
    const refPrice = beat.prices?.exclusive > 0 ? beat.prices.exclusive : null

    const [amount,  setAmount]  = useState(refPrice ? refPrice.toFixed(2) : '')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        const val = parseFloat(amount)
        if (!val || val <= 0) { setError('Introduz um valor válido.'); return }
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API}/api/marketplace/offers`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    beatId:  beat.id,
                    amount:  val,
                    message: message.trim() || null,
                }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error ?? 'Erro ao submeter proposta.'); return }
            showToast('Proposta enviada!')
            onSubmitted?.(data)
            onClose()
        } catch {
            showToast('Erro de ligação.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="offer-modal__backdrop"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="offer-modal">

                <div className="offer-modal__header">
                    <div className="offer-modal__cover">
                        <ArtistArtwork
                            shape="circles"
                            hue={beat.hue}
                            image={beat.image}
                            rounded={0}
                            showGloss={false}
                        />
                    </div>
                    <div className="offer-modal__info">
                        <p className="offer-modal__eyebrow">Proposta de licença exclusiva</p>
                        <h3 className="offer-modal__beat-title">{beat.title}</h3>
                        <p className="offer-modal__producer">{beat.producer}</p>
                    </div>
                    <button type="button" className="offer-modal__close" onClick={onClose}>×</button>
                </div>

                <form className="offer-modal__body" onSubmit={handleSubmit}>
                    {refPrice && (
                        <p className="offer-modal__ref">
                            Preço de referência: <strong>€{refPrice.toFixed(2)}</strong>
                        </p>
                    )}

                    <label className="offer-modal__field">
                        <span className="offer-modal__field-label">A tua proposta</span>
                        <div className="offer-modal__amount-wrap">
                            <span className="offer-modal__currency">€</span>
                            <input
                                type="number"
                                className="offer-modal__amount"
                                min="1"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    </label>

                    <label className="offer-modal__field">
                        <span className="offer-modal__field-label">Mensagem (opcional)</span>
                        <textarea
                            className="offer-modal__message"
                            placeholder="Apresenta-te ou explica o teu projecto…"
                            maxLength={500}
                            rows={3}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                    </label>

                    {error && <p className="offer-modal__error">{error}</p>}

                    <div className="offer-modal__actions">
                        <button type="button" className="offer-modal__cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="offer-modal__submit" disabled={loading}>
                            {loading ? 'A enviar…' : 'Enviar proposta'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}
