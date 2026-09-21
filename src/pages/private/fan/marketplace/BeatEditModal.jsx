import { useState }      from 'react'
import { createPortal }  from 'react-dom'
import { FaTimes }       from 'react-icons/fa'
import { API, getToken } from '../../../../utils/auth.js'
import './BeatUploadModal.css'

const CV_GENRES   = ['Funaná', 'Morna', 'Coladeira', 'Batuque', 'Cabo Love', 'Kizomba', 'Tabanka', 'Kola']
const INTL_GENRES = ['Afrobeat', 'Amapiano', 'Gqom', 'Trap', 'Boom Bap', 'Drill', 'R&B', 'Dancehall']
const KEYS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
               'Am', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m']

export default function BeatEditModal({ beat, onClose, onSaved }) {
    const [title,         setTitle]         = useState(beat.title ?? '')
    const [genre,         setGenre]         = useState(beat.genre ?? '')
    const [bpm,           setBpm]           = useState(beat.bpm ?? '')
    const [key,           setKey]           = useState(beat.key ?? '')
    const [hue,           setHue]           = useState(beat.hue ?? 180)
    const [lease,         setLease]         = useState(beat.prices?.lease ?? '')
    const [premium,       setPremium]       = useState(beat.prices?.premium ?? '')
    const [exclusive,     setExclusive]     = useState(beat.exclusiveNegotiable ? '' : (beat.prices?.exclusive ?? ''))
    const [exclusiveMode, setExclusiveMode] = useState(beat.exclusiveNegotiable ? 'negotiate' : 'price')
    const [saving,        setSaving]        = useState(false)
    const [error,         setError]         = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        if (!title.trim()) { setError('O título é obrigatório.'); return }
        setSaving(true)
        setError(null)
        try {
            const res = await fetch(`${API}/api/marketplace/beats/${beat.id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title:                 title.trim(),
                    genre:                 genre || null,
                    bpm:                   bpm     ? Number(bpm)     : null,
                    musicalKey:            key     || null,
                    hue:                   Number(hue),
                    leasePrice:            lease   ? Number(lease)   : null,
                    premiumPrice:          premium ? Number(premium) : null,
                    exclusivePrice:        (exclusiveMode === 'price' && exclusive) ? Number(exclusive) : null,
                    exclusiveNegotiable:   exclusiveMode === 'negotiate',
                }),
            })
            if (!res.ok) throw new Error(await res.text())
            onSaved(await res.json())
            onClose()
        } catch (err) {
            setError(err.message || 'Erro ao guardar.')
        } finally {
            setSaving(false)
        }
    }

    return createPortal(
        <div className="bum__backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bum__box">
                <div className="bum__head">
                    <h2 className="bum__title">Editar Beat</h2>
                    <button type="button" className="bum__close" onClick={onClose}><FaTimes /></button>
                </div>

                <form className="bum__form" onSubmit={handleSubmit}>
                    <div className="bum__row">
                        <div className="bum__field bum__field--wide">
                            <label className="bum__label">Título *</label>
                            <input className="bum__input" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="bum__field">
                            <label className="bum__label">Género</label>
                            <select className="bum__input" value={genre} onChange={e => setGenre(e.target.value)}>
                                <option value="">— Selecionar —</option>
                                <optgroup label="Cabo Verde">
                                    {CV_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                </optgroup>
                                <optgroup label="Internacional">
                                    {INTL_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                </optgroup>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </div>

                    <div className="bum__row">
                        <div className="bum__field">
                            <label className="bum__label">BPM</label>
                            <input className="bum__input" type="number" min="40" max="250"
                                   value={bpm} onChange={e => setBpm(e.target.value)} />
                        </div>
                        <div className="bum__field">
                            <label className="bum__label">Tom</label>
                            <select className="bum__input" value={key} onChange={e => setKey(e.target.value)}>
                                <option value="">— Selecionar —</option>
                                {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div className="bum__field">
                            <label className="bum__label">
                                Cor
                                <span className="bum__hue-preview" style={{ background: `hsl(${hue},70%,55%)` }} />
                            </label>
                            <input className="bum__input bum__input--range" type="range" min="0" max="359"
                                   value={hue} onChange={e => setHue(Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="bum__prices-label">Preços por licença</div>
                    <div className="bum__row bum__row--prices">
                        <div className="bum__field">
                            <label className="bum__label">Lease (€)</label>
                            <input className="bum__input" type="number" min="0" step="0.01"
                                   value={lease} onChange={e => setLease(e.target.value)} />
                        </div>
                        <div className="bum__field">
                            <label className="bum__label">Premium (€)</label>
                            <input className="bum__input" type="number" min="0" step="0.01"
                                   value={premium} onChange={e => setPremium(e.target.value)} />
                        </div>
                        <div className="bum__field">
                            <label className="bum__label">Exclusiva</label>
                            <div className="bum__excl-toggle">
                                <button type="button"
                                        className={`bum__excl-btn${exclusiveMode === 'price' ? ' bum__excl-btn--on' : ''}`}
                                        onClick={() => setExclusiveMode('price')}>
                                    Preço fixo
                                </button>
                                <button type="button"
                                        className={`bum__excl-btn${exclusiveMode === 'negotiate' ? ' bum__excl-btn--on' : ''}`}
                                        onClick={() => setExclusiveMode('negotiate')}>
                                    Negociar
                                </button>
                            </div>
                            {exclusiveMode === 'price'
                                ? <input className="bum__input" type="number" min="0" step="0.01"
                                         placeholder="ex: 199.99" value={exclusive}
                                         onChange={e => setExclusive(e.target.value)} />
                                : <p className="bum__excl-note">Valor a combinar com o comprador</p>
                            }
                        </div>
                    </div>

                    {error && <p className="bum__error">{error}</p>}

                    <div className="bum__footer">
                        <button type="button" className="bum__btn bum__btn--cancel"
                                onClick={onClose} disabled={saving}>Cancelar</button>
                        <button type="submit" className="bum__btn bum__btn--submit" disabled={saving}>
                            {saving ? 'A guardar…' : 'Guardar alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}
