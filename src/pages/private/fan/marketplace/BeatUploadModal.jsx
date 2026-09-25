import { useState, useRef } from 'react'
import { createPortal }     from 'react-dom'
import { FaMusic, FaImage, FaTimes } from 'react-icons/fa'
import { API, getToken }    from '../../../../utils/auth.js'
import { useGenres }        from '../../../../context/GenresContext.jsx'
import './BeatUploadModal.css'
const KEYS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
               'Am', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m']

function DropZone({ label, hint, accept, file, onPick, icon: Icon }) {
    const ref = useRef(null)
    return (
        <div className={`bum__drop${file ? ' bum__drop--ready' : ''}`} onClick={() => ref.current?.click()}>
            <input ref={ref} type="file" accept={accept} className="bum__drop-input"
                   onChange={e => onPick(e.target.files?.[0] ?? null)} />
            <Icon size={20} className="bum__drop-icon" />
            {file
                ? <span className="bum__drop-name">{file.name}</span>
                : <><span className="bum__drop-label">{label}</span><span className="bum__drop-hint">{hint}</span></>}
        </div>
    )
}

export default function BeatUploadModal({ onClose, onUploaded }) {
    const { cvNames: CV_GENRES, mundialNames: INTL_GENRES } = useGenres()
    const [title,         setTitle]         = useState('')
    const [genre,         setGenre]         = useState('')
    const [bpm,           setBpm]           = useState('')
    const [key,           setKey]           = useState('')
    const [hue,           setHue]           = useState(180)
    const [lease,         setLease]         = useState('9.99')
    const [premium,       setPremium]       = useState('24.99')
    const [exclusive,     setExclusive]     = useState('')
    const [exclusiveMode, setExclusiveMode] = useState('negotiate') // 'price' | 'negotiate'
    const [audio,         setAudio]         = useState(null)
    const [cover,         setCover]         = useState(null)
    const [saving,        setSaving]        = useState(false)
    const [error,         setError]         = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        if (!audio) { setError('O ficheiro de áudio é obrigatório.'); return }
        if (!title.trim()) { setError('O título é obrigatório.'); return }

        setSaving(true)
        setError(null)
        try {
            const fd = new FormData()
            fd.append('title', title.trim())
            fd.append('audio', audio)
            if (genre)   fd.append('genre', genre)
            if (bpm)     fd.append('bpm', bpm)
            if (key)     fd.append('key', key)
            fd.append('hue', String(hue))
            fd.append('leasePrice',   lease   || '9.99')
            if (premium) fd.append('premiumPrice', premium)
            if (exclusiveMode === 'price' && exclusive) fd.append('exclusivePrice', exclusive)
            fd.append('exclusiveNegotiable', exclusiveMode === 'negotiate' ? 'true' : 'false')
            if (cover)   fd.append('cover', cover)

            const res = await fetch(`${API}/api/marketplace/beats`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
                body: fd,
            })
            if (!res.ok) {
                const msg = await res.text()
                throw new Error(msg || 'Erro ao publicar beat.')
            }
            onUploaded(await res.json())
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return createPortal(
        <div className="bum__backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bum__box">

                <div className="bum__head">
                    <h2 className="bum__title">Publicar Beat</h2>
                    <button type="button" className="bum__close" onClick={onClose} aria-label="Fechar">
                        <FaTimes />
                    </button>
                </div>

                <form className="bum__form" onSubmit={handleSubmit}>

                    {/* Ficheiros */}
                    <div className="bum__files">
                        <DropZone
                            label="Arrastar áudio ou clicar"
                            hint="MP3 · WAV · até 300 MB"
                            accept="audio/*"
                            file={audio}
                            onPick={setAudio}
                            icon={FaMusic}
                        />
                        <DropZone
                            label="Capa (opcional)"
                            hint="JPG · PNG · até 5 MB"
                            accept="image/*"
                            file={cover}
                            onPick={setCover}
                            icon={FaImage}
                        />
                    </div>

                    {/* Campos principais */}
                    <div className="bum__row">
                        <div className="bum__field bum__field--wide">
                            <label className="bum__label">Título *</label>
                            <input className="bum__input" placeholder="Nome do beat" value={title}
                                   onChange={e => setTitle(e.target.value)} />
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
                                   placeholder="ex: 90" value={bpm}
                                   onChange={e => setBpm(e.target.value)} />
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
                                Cor da capa
                                <span className="bum__hue-preview" style={{ background: `hsl(${hue},70%,55%)` }} />
                            </label>
                            <input className="bum__input bum__input--range" type="range" min="0" max="359"
                                   value={hue} onChange={e => setHue(Number(e.target.value))} />
                        </div>
                    </div>

                    {/* Preços */}
                    <div className="bum__prices-label">Preços por licença</div>
                    <div className="bum__row bum__row--prices">
                        <div className="bum__field">
                            <label className="bum__label">Lease (€)</label>
                            <input className="bum__input" type="number" min="0" step="0.01"
                                   value={lease}
                                   onChange={e => setLease(e.target.value)} />
                        </div>
                        <div className="bum__field">
                            <label className="bum__label">Premium (€)</label>
                            <input className="bum__input" type="number" min="0" step="0.01"
                                   value={premium}
                                   onChange={e => setPremium(e.target.value)} />
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
                        <button type="button" className="bum__btn bum__btn--cancel" onClick={onClose}
                                disabled={saving}>
                            Cancelar
                        </button>
                        <button type="submit" className="bum__btn bum__btn--submit" disabled={saving}>
                            {saving ? 'A publicar…' : 'Publicar beat'}
                        </button>
                    </div>

                </form>
            </div>
        </div>,
        document.body
    )
}
