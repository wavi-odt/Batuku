import { useState, useEffect } from 'react'
import {
    FaTimes, FaCheck, FaExclamationTriangle, FaPlus, FaTrash,
    FaInstagram, FaYoutube, FaSoundcloud, FaTwitter, FaFacebook,
} from 'react-icons/fa'
import { SiSpotify, SiTiktok, SiApplemusic } from 'react-icons/si'
import { getToken } from '../../../utils/auth'
import './EditProfileModal.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api`

const PLATFORMS = [
    { id: 'instagram',   label: 'Instagram',    Icon: FaInstagram,  color: '#E1306C', placeholder: '@handle' },
    { id: 'youtube',     label: 'YouTube',      Icon: FaYoutube,    color: '#FF0000', placeholder: 'Canal ou URL' },
    { id: 'tiktok',      label: 'TikTok',       Icon: SiTiktok,     color: '#fff',    placeholder: '@handle' },
    { id: 'soundcloud',  label: 'SoundCloud',   Icon: FaSoundcloud, color: '#FF5500', placeholder: 'Nome ou URL' },
    { id: 'twitter',     label: 'Twitter / X',  Icon: FaTwitter,    color: '#1DA1F2', placeholder: '@handle' },
    { id: 'facebook',    label: 'Facebook',     Icon: FaFacebook,   color: '#1877F2', placeholder: 'Nome ou URL' },
    { id: 'spotify',     label: 'Spotify',      Icon: SiSpotify,    color: '#1DB954', placeholder: 'URL do artista' },
    { id: 'applemusic',  label: 'Apple Music',  Icon: SiApplemusic, color: '#FC3C44', placeholder: 'URL do artista' },
]

function getPlatform(id) {
    return PLATFORMS.find(p => p.id === id) ?? PLATFORMS[0]
}

function Field({ label, multiline, ...props }) {
    return (
        <label className="ep-field">
            <span className="ep-field__label">{label}</span>
            {multiline
                ? <textarea className="input ep-textarea" rows={3} {...props} />
                : <input className="input" {...props} />
            }
        </label>
    )
}

function Msg({ error, done, doneText = 'Alterações guardadas.' }) {
    if (error) return <p className="ep-msg ep-msg--error"><FaExclamationTriangle size={12} /> {error}</p>
    if (done)  return <p className="ep-msg ep-msg--ok"><FaCheck size={12} /> {doneText}</p>
    return null
}

/* ── Tab: Perfil ─────────────────────────────────────────────────────── */
function TabPerfil({ user, onProfileUpdated }) {
    const [name, setName]         = useState(user.name || '')
    const [username, setUsername] = useState(user.username || '')
    const [saved, setSaved]       = useState({ name: user.name || '', username: user.username || '' })
    const [saving, setSaving]     = useState(false)
    const [error, setError]       = useState('')
    const [done, setDone]         = useState(false)

    const isDirty = name !== saved.name || username !== saved.username

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true); setError(''); setDone(false)
        try {
            const res = await fetch(`${API}/users/me/nameUsername`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name, username }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || `Erro ${res.status}`)
            }
            setSaved({ name, username })
            setDone(true)
            onProfileUpdated?.({ name, handle: '@' + username })
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <form className="ep-form" onSubmit={handleSubmit}>
            <div className="ep-grid">
                <Field label="Nome" value={name} onChange={e => setName(e.target.value)} required />
                <Field label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <Msg error={error} done={done} />
            <div className="ep-form__footer">
                <button type="submit" className="btn-primary ep-save-btn" disabled={!isDirty || saving}>
                    {saving ? 'A guardar…' : 'Guardar alterações'}
                </button>
            </div>
        </form>
    )
}

/* ── Chip toggle (genres / languages) ───────────────────────────────── */
function ChipSelect({ options, selected, onChange, max }) {
    function toggle(opt) {
        if (selected.includes(opt)) {
            onChange(selected.filter(s => s !== opt))
        } else {
            if (max && selected.length >= max) return
            onChange([...selected, opt])
        }
    }
    return (
        <div className="ep-chips">
            {options.map(opt => (
                <button
                    key={opt}
                    type="button"
                    className={'ep-chip' + (selected.includes(opt) ? ' is-on' : '') + (max && selected.length >= max && !selected.includes(opt) ? ' is-disabled' : '')}
                    onClick={() => toggle(opt)}
                >
                    {opt}
                </button>
            ))}
        </div>
    )
}

function sortedStr(arr) { return JSON.stringify([...(arr || [])].sort()) }

/* ── Tab: Artista ────────────────────────────────────────────────────── */
function TabArtista({ onSaved }) {
    const [bio, setBio]           = useState('')
    const [location, setLocation] = useState('')
    const [genres, setGenres]     = useState([])
    const [languages, setLangs]   = useState([])
    const [saved, setSaved]       = useState({ bio: '', location: '', genres: [], languages: [] })

    const [options, setOptions]   = useState({ genres: [], languages: [], locations: [] })
    const [loading, setLoading]   = useState(true)
    const [saving, setSaving]     = useState(false)
    const [error, setError]       = useState('')
    const [done, setDone]         = useState(false)

    const isDirty = bio !== saved.bio ||
                    location !== saved.location ||
                    sortedStr(genres) !== sortedStr(saved.genres) ||
                    sortedStr(languages) !== sortedStr(saved.languages)

    useEffect(() => {
        const headers = { Authorization: `Bearer ${getToken()}` }
        Promise.all([
            fetch(`${API}/artists/options`).then(r => r.json()),
            fetch(`${API}/artists/me`, { headers }).then(r => r.ok ? r.json() : null),
        ]).then(([opts, me]) => {
            setOptions(opts)
            if (me) {
                const snap = {
                    bio:       me.bio      || '',
                    location:  me.location || '',
                    genres:    me.genres   || [],
                    languages: me.languages || [],
                }
                setBio(snap.bio)
                setLocation(snap.location)
                setGenres(snap.genres)
                setLangs(snap.languages)
                setSaved(snap)
            }
        }).catch(() => {}).finally(() => setLoading(false))
    }, [])

    async function callPut(path, body) {
        const res = await fetch(`${API}${path}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(body),
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || `Erro ${res.status}`)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true); setError(''); setDone(false)
        try {
            await Promise.all([
                callPut('/artists/me/bio',       { bio }),
                callPut('/artists/me/location',  { location }),
                callPut('/artists/me/genres',    { genres }),
                callPut('/artists/me/languages', { languages }),
            ])
            setSaved({ bio, location, genres, languages })
            setDone(true)
            onSaved?.()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="ep-loading">A carregar…</p>

    const locationGroups = options.locations.reduce((acc, loc) => {
        const g = loc.group ?? 'Outras'
        if (!acc[g]) acc[g] = []
        acc[g].push(loc.value)
        return acc
    }, {})

    return (
        <form className="ep-form" onSubmit={handleSubmit}>
            <Field
                label="Sobre"
                multiline
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Conta algo sobre ti, o teu estilo, a tua história…"
                maxLength={1000}
            />

            <label className="ep-field">
                <span className="ep-field__label">Localização</span>
                <select
                    className="input ep-location-select"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                >
                    <option value="">— Escolhe uma localização —</option>
                    {Object.entries(locationGroups).map(([group, locs]) => (
                        <optgroup key={group} label={group}>
                            {locs.map(l => <option key={l} value={l}>{l}</option>)}
                        </optgroup>
                    ))}
                </select>
            </label>

            <div className="ep-field">
                <span className="ep-field__label">
                    Género musical
                    <span className="ep-field__hint"> — máx. 3</span>
                </span>
                <ChipSelect options={options.genres} selected={genres} onChange={setGenres} max={3} />
            </div>

            <div className="ep-field">
                <span className="ep-field__label">Línguas</span>
                <ChipSelect options={options.languages} selected={languages} onChange={setLangs} />
            </div>

            <Msg error={error} done={done} />
            <div className="ep-form__footer">
                <button type="submit" className="btn-primary ep-save-btn" disabled={!isDirty || saving}>
                    {saving ? 'A guardar…' : 'Guardar alterações'}
                </button>
            </div>
        </form>
    )
}

function linksKey(ls) { return JSON.stringify(ls.map(l => l.platform + '|' + l.handle)) }

/* ── Tab: Links ──────────────────────────────────────────────────────── */
function TabLinks({ onSaved }) {
    const [links, setLinks]       = useState([])
    const [savedKey, setSavedKey] = useState(linksKey([]))
    const [loading, setLoading]   = useState(true)
    const [saving, setSaving]     = useState(false)
    const [error, setError]       = useState('')
    const [done, setDone]         = useState(false)

    useEffect(() => {
        fetch(`${API}/artists/me/links`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const loaded = (data || []).map((s, i) => ({ id: i, platform: s.kind || 'instagram', handle: s.handle || '' }))
                setLinks(loaded)
                setSavedKey(linksKey(loaded))
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const isDirty = linksKey(links) !== savedKey

    function addLink() {
        setLinks(prev => [...prev, { id: Date.now(), platform: 'instagram', handle: '' }])
    }

    function removeLink(id) {
        setLinks(prev => prev.filter(l => l.id !== id))
    }

    function updateLink(id, field, value) {
        setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true); setError(''); setDone(false)
        try {
            const res = await fetch(`${API}/artists/me/links`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ social: links.map(l => ({ kind: l.platform, handle: l.handle })) }),
            })
            if (!res.ok) throw new Error(`Erro ${res.status}`)
            setSavedKey(linksKey(links))
            setDone(true)
            onSaved?.()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="ep-loading">A carregar…</p>

    return (
        <form className="ep-form" onSubmit={handleSubmit}>
            <p className="ep-hint">Adiciona os teus links para redes sociais e plataformas de música.</p>

            {links.length > 0 && (
                <div className="ep-links-list">
                    {links.map(link => {
                        const plat = getPlatform(link.platform)
                        return (
                            <div key={link.id} className="ep-link-row">
                                <span className="ep-link-icon" style={{ color: plat.color }}>
                                    <plat.Icon size={17} />
                                </span>
                                <select
                                    className="ep-link-select"
                                    value={link.platform}
                                    onChange={e => updateLink(link.id, 'platform', e.target.value)}
                                >
                                    {PLATFORMS.map(p => (
                                        <option key={p.id} value={p.id}>{p.label}</option>
                                    ))}
                                </select>
                                <input
                                    className="input ep-link-input"
                                    value={link.handle}
                                    onChange={e => updateLink(link.id, 'handle', e.target.value)}
                                    placeholder={plat.placeholder}
                                />
                                <button
                                    type="button"
                                    className="ep-link-remove"
                                    onClick={() => removeLink(link.id)}
                                    aria-label="Remover link"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            <button type="button" className="ep-add-link" onClick={addLink}>
                <FaPlus size={11} /> Adicionar link
            </button>

            <Msg error={error} done={done} doneText="Links guardados." />
            <div className="ep-form__footer">
                <button type="submit" className="btn-primary ep-save-btn" disabled={!isDirty || saving}>
                    {saving ? 'A guardar…' : 'Guardar links'}
                </button>
            </div>
        </form>
    )
}

/* ── Tab: Segurança ──────────────────────────────────────────────────── */
function TabSeguranca() {
    const [current, setCurrent] = useState('')
    const [next, setNext]       = useState('')
    const [confirm, setConfirm] = useState('')
    const [saving, setSaving]   = useState(false)
    const [error, setError]     = useState('')
    const [done, setDone]       = useState(false)

    const isDirty = current.length > 0 || next.length > 0 || confirm.length > 0

    async function handleSubmit(e) {
        e.preventDefault()
        setError(''); setDone(false)
        if (next !== confirm) { setError('As novas palavras-passe não coincidem.'); return }
        if (next.length < 8)  { setError('A nova palavra-passe deve ter pelo menos 8 caracteres.'); return }
        setSaving(true)
        try {
            const res = await fetch(`${API}/users/me/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ currentPassword: current, newPassword: next }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || `Erro ${res.status}`)
            }
            setDone(true)
            setCurrent(''); setNext(''); setConfirm('')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <form className="ep-form" onSubmit={handleSubmit}>
            <Field
                label="Palavra-passe atual"
                type="password"
                value={current}
                onChange={e => setCurrent(e.target.value)}
            />
            <div className="ep-grid">
                <Field
                    label="Nova palavra-passe"
                    type="password"
                    value={next}
                    onChange={e => setNext(e.target.value)}
                />
                <Field
                    label="Confirmar nova palavra-passe"
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                />
            </div>
            <Msg error={error} done={done} doneText="Palavra-passe alterada." />
            <div className="ep-form__footer">
                <button type="submit" className="btn-primary ep-save-btn" disabled={!isDirty || saving}>
                    {saving ? 'A alterar…' : 'Alterar palavra-passe'}
                </button>
            </div>
        </form>
    )
}

/* ── Modal principal ─────────────────────────────────────────────────── */
export default function EditProfileModal({ role, onClose, onProfileUpdated, onArtistSaved }) {
    const isArtist = role === 'artist'
    const tabs = isArtist
        ? ['Perfil', 'Artista', 'Links', 'Segurança']
        : ['Perfil', 'Segurança']

    const [active, setActive]   = useState(0)
    const [user, setUser]       = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.ok ? r.json() : Promise.reject(new Error()))
            .then(data => setUser({
                name:      data.name || data.displayName || '',
                username:  data.username || '',
                bio:       data.bio || '',
                location:  data.location || '',
                genre:     data.genre || '',
                languages: data.languages || '',
                social:    data.social || [],
            }))
            .catch(() => setUser({ name: '', username: '', bio: '', location: '', genre: '', languages: '', social: [] }))
            .finally(() => setLoading(false))
    }, [])

    function renderTab() {
        if (!user) return null
        switch (tabs[active]) {
            case 'Perfil':    return <TabPerfil user={user} onProfileUpdated={onProfileUpdated} />
            case 'Artista':   return <TabArtista onSaved={onArtistSaved} />
            case 'Links':     return <TabLinks onSaved={onArtistSaved} />
            case 'Segurança': return <TabSeguranca />
            default:          return null
        }
    }

    return (
        <div className="ep-overlay" onClick={onClose}>
            <div
                className="ep-modal"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Editar perfil"
            >
                {/* Header */}
                <div className="ep-modal__header">
                    <span className="ep-modal__title">Editar perfil</span>
                    <button
                        type="button"
                        className="ep-modal__close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <FaTimes size={15} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="ep-tabs">
                    {tabs.map((t, i) => (
                        <button
                            key={t}
                            type="button"
                            className={'ep-tab' + (i === active ? ' is-active' : '')}
                            onClick={() => setActive(i)}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="ep-modal__body">
                    {loading
                        ? <p className="ep-loading">A carregar…</p>
                        : renderTab()
                    }
                </div>
            </div>
        </div>
    )
}
