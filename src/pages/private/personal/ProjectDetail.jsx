import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
    FaPlay, FaPause, FaMusic, FaTimes, FaCheck,
    FaCamera, FaLink, FaSearch, FaEllipsisH, FaPlus,
} from 'react-icons/fa'
import PersonalLayout from '../../../components/PersonalLayout/PersonalLayout.jsx'
import PersonalMiniPlayer from '../../../components/PersonalLayout/PersonalMiniPlayer.jsx'
import ConfirmModal from '../../../components/ConfirmModal.jsx'
import { API, getToken } from '../../../utils/auth.js'
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import './ProjectDetail.css'

const MAX_AUDIO = 60 * 1024 * 1024
const MAX_IMAGE = 5 * 1024 * 1024

function fmtDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtDuration(s) {
    if (!s && s !== 0) return ''
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

function EqBars({ playing }) {
    return (
        <div className={'pd__eq' + (playing ? '' : ' pd__eq--paused')} aria-hidden="true">
            <span className="pd__eq-bar" />
            <span className="pd__eq-bar" />
            <span className="pd__eq-bar" />
        </div>
    )
}

function TrackMenu({ onDelete }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        const handle = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [open])

    return (
        <div className="pd__trow-menu" ref={ref}>
            <button
                type="button"
                className="pd__trow-menu-btn"
                onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
                aria-label="Opções da faixa"
            >
                <FaEllipsisH size={11} />
            </button>
            {open && (
                <div className="pd__trow-menu-pop">
                    <button
                        type="button"
                        className="pd__trow-menu-item pd__trow-menu-item--danger"
                        onClick={() => { setOpen(false); onDelete() }}
                    >
                        Remover faixa
                    </button>
                </div>
            )}
        </div>
    )
}

export default function ProjectDetail() {
    const { id }      = useParams()
    const navigate    = useNavigate()
    const currentUser = useCurrentUser()

    const [project, setProject] = useState(null)
    const [tracks,  setTracks]  = useState([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState(null)

    const [currentIndex, setCurrentIndex] = useState(null)
    const [isPlaying,    setIsPlaying]    = useState(false)
    const [leaving,      setLeaving]      = useState(false)

    function navigateOut(to) {
        setLeaving(true)
        setTimeout(() => navigate(to), 300)
    }

    /* ─── Inline name edit ──────────────────────────────────────────────── */
    const [editingName, setEditingName] = useState(false)
    const [nameDraft,   setNameDraft]   = useState('')
    const [savingName,  setSavingName]  = useState(false)
    const nameInputRef = useRef(null)

    /* ─── Cover upload ──────────────────────────────────────────────────── */
    const [uploadingCover, setUploadingCover] = useState(false)
    const coverFileRef = useRef(null)

    /* ─── Add track form ────────────────────────────────────────────────── */
    const [showForm,  setShowForm]  = useState(false)
    const [title,     setTitle]     = useState('')
    const [audioFile, setAudioFile] = useState(null)
    const [formError, setFormError] = useState(null)
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef(null)

    /* ─── Toolbar state ─────────────────────────────────────────────────── */
    const [search,     setSearch]     = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [toolMenu,   setToolMenu]   = useState(false)
    const toolMenuRef = useRef(null)

    /* ─── Actions state ─────────────────────────────────────────────────── */
    const [linkCopied,        setLinkCopied]       = useState(false)
    const [confirmDelTrack,   setConfirmDelTrack]   = useState(null)
    const [confirmDelProject, setConfirmDelProject] = useState(false)
    const [confirmRegen,      setConfirmRegen]      = useState(false)
    const [deletingTrack,     setDeletingTrack]     = useState(false)
    const [deletingProject,   setDeletingProject]   = useState(false)
    const [regening,          setRegening]          = useState(false)

    const authHeader = { Authorization: `Bearer ${getToken()}` }

    useEffect(() => {
        Promise.all([
            fetch(`${API}/api/my-projects/${id}`,        { headers: authHeader }).then(r => r.ok ? r.json() : Promise.reject()),
            fetch(`${API}/api/my-projects/${id}/tracks`, { headers: authHeader }).then(r => r.ok ? r.json() : []),
        ])
            .then(([proj, trks]) => { setProject(proj); setTracks(Array.isArray(trks) ? trks : []) })
            .catch(() => setError('Não foi possível carregar o projeto.'))
            .finally(() => setLoading(false))
    }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!toolMenu) return
        const handle = e => { if (!toolMenuRef.current?.contains(e.target)) setToolMenu(false) }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [toolMenu])

    useEffect(() => {
        if (!showSearch) setSearch('')
    }, [showSearch])


    const playerTracks = tracks.map(t => ({
        id: t.id, title: t.title, audioUrl: t.audioUrl, coverUrl: project?.coverUrl ?? null,
        author: currentUser?.name ?? null,
    }))

    const filteredTracks = search.trim()
        ? tracks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
        : tracks

    /* ─── Handlers ──────────────────────────────────────────────────────── */
    function startEditName() {
        setNameDraft(project.name)
        setEditingName(true)
        setTimeout(() => nameInputRef.current?.select(), 0)
    }

    async function handleSaveName() {
        const trimmed = nameDraft.trim()
        if (!trimmed || trimmed === project.name) { setEditingName(false); return }
        setSavingName(true)
        try {
            const body = new FormData()
            body.append('name', trimmed)
            const res = await fetch(`${API}/api/my-projects/${id}`, { method: 'PATCH', headers: authHeader, body })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setProject(p => ({ ...p, name: updated.name }))
            setEditingName(false)
        } catch { /* keep editing open */ }
        finally { setSavingName(false) }
    }

    async function handleCoverChange(e) {
        const f = e.target.files?.[0]
        if (!f || !f.type.startsWith('image/') || f.size > MAX_IMAGE) return
        setUploadingCover(true)
        try {
            const body = new FormData()
            body.append('name', project.name)
            body.append('cover', f)
            const res = await fetch(`${API}/api/my-projects/${id}`, { method: 'PATCH', headers: authHeader, body })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setProject(p => ({ ...p, coverUrl: updated.coverUrl }))
        } catch { /* silent */ }
        finally {
            setUploadingCover(false)
            if (coverFileRef.current) coverFileRef.current.value = ''
        }
    }

    function copyLink() {
        navigator.clipboard.writeText(`${window.location.origin}/proj/${project.shareToken}`)
            .then(() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000) })
    }

    function handleProjectPlay() {
        if (currentIndex !== null) {
            setCurrentIndex(null)
        } else if (tracks.length > 0) {
            setCurrentIndex(0)
        }
    }

    async function handleAddTrack(e) {
        e.preventDefault(); setFormError(null)
        if (!title.trim())                         return setFormError('O título é obrigatório.')
        if (!audioFile)                            return setFormError('Seleciona um ficheiro de áudio.')
        if (!audioFile.type.startsWith('audio/')) return setFormError('Só são aceites ficheiros de áudio.')
        if (audioFile.size > MAX_AUDIO)            return setFormError('O ficheiro não pode ultrapassar 60 MB.')
        setUploading(true)
        try {
            const body = new FormData()
            body.append('title', title.trim())
            body.append('audio', audioFile)
            const res = await fetch(`${API}/api/my-projects/${id}/tracks`, { method: 'POST', headers: authHeader, body })
            if (!res.ok) throw new Error()
            const created = await res.json()
            setTracks(p => [...p, created])
            setProject(p => ({ ...p, trackCount: (p.trackCount ?? 0) + 1 }))
            setTitle(''); setAudioFile(null)
            if (fileRef.current) fileRef.current.value = ''
            setShowForm(false)
        } catch {
            setFormError('Erro ao adicionar a faixa. Tenta novamente.')
        } finally {
            setUploading(false)
        }
    }

    async function handleDeleteTrack() {
        setDeletingTrack(true)
        try {
            const res = await fetch(`${API}/api/my-projects/${id}/tracks/${confirmDelTrack.id}`, {
                method: 'DELETE', headers: authHeader,
            })
            if (!res.ok) throw new Error()
            const deletedIdx = tracks.findIndex(t => t.id === confirmDelTrack.id)
            setTracks(p => p.filter(t => t.id !== confirmDelTrack.id))
            setProject(p => ({ ...p, trackCount: Math.max(0, (p.trackCount ?? 1) - 1) }))
            if (currentIndex !== null) {
                if (currentIndex === deletedIdx)    setCurrentIndex(null)
                else if (currentIndex > deletedIdx) setCurrentIndex(i => i - 1)
            }
            setConfirmDelTrack(null)
        } catch {
            alert('Erro ao remover a faixa.')
        } finally {
            setDeletingTrack(false)
        }
    }

    async function handleDeleteProject() {
        setDeletingProject(true)
        try {
            const res = await fetch(`${API}/api/my-projects/${id}`, { method: 'DELETE', headers: authHeader })
            if (!res.ok) throw new Error()
            navigateOut(-1)
        } catch {
            alert('Erro ao apagar o projeto.')
            setDeletingProject(false)
        }
    }

    async function handleRegen() {
        setRegening(true)
        try {
            const res = await fetch(`${API}/api/my-projects/${id}/regenerate-link`, {
                method: 'POST', headers: authHeader,
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setProject(p => ({ ...p, shareToken: updated.shareToken }))
            setConfirmRegen(false)
        } catch {
            alert('Erro ao gerar novo link.')
        } finally {
            setRegening(false)
        }
    }

    /* ─── Loading / error ───────────────────────────────────────────────── */
    if (loading) return (
        <PersonalLayout>
            <Link to="/pessoal" className="pd__back">← Projetos</Link>
            <p className="pd__state">A carregar…</p>
        </PersonalLayout>
    )

    if (error) return (
        <PersonalLayout>
            <Link to="/pessoal" className="pd__back">← Projetos</Link>
            <p className="pd__state pd__state--error">{error}</p>
        </PersonalLayout>
    )

    const isProjectPlaying = currentIndex !== null

    return (
        <PersonalLayout playerPadding={isProjectPlaying}>
            <div className={'pd__page' + (leaving ? ' pd__page--leaving' : '')}>

                {/* ── Hero background ───────────────────────────────────── */}
                {project.coverUrl && (
                    <div className="pd__hero-bg" aria-hidden="true">
                        <img src={project.coverUrl} alt="" />
                    </div>
                )}

                {/* ── Barra de ferramentas ─────────────────────────────── */}
                <div className="pd__toolbar">
                    <button
                        type="button"
                        className={'pd__tool-btn' + (linkCopied ? ' pd__tool-btn--active' : '')}
                        onClick={copyLink}
                        title="Copiar link de partilha"
                    >
                        {linkCopied ? <FaCheck size={13} /> : <FaLink size={13} />}
                    </button>
                    <button
                        type="button"
                        className={'pd__tool-btn' + (showSearch ? ' pd__tool-btn--active' : '')}
                        onClick={() => setShowSearch(v => !v)}
                        title="Pesquisar faixas"
                    >
                        <FaSearch size={13} />
                    </button>
                    <div className="pd__tool-menu-wrap" ref={toolMenuRef}>
                        <button
                            type="button"
                            className={'pd__tool-btn' + (toolMenu ? ' pd__tool-btn--active' : '')}
                            onClick={() => setToolMenu(v => !v)}
                            title="Mais opções"
                        >
                            <FaEllipsisH size={13} />
                        </button>
                        {toolMenu && (
                            <div className="pd__tool-popover">
                                <button type="button" className="pd__tool-pop-item"
                                    onClick={() => { setToolMenu(false); setConfirmRegen(true) }}>
                                    Novo link de partilha
                                </button>
                                <button type="button" className="pd__tool-pop-item"
                                    onClick={() => { setToolMenu(false); startEditName() }}>
                                    Renomear projeto
                                </button>
                                <div className="pd__tool-pop-divider" />
                                <button type="button" className="pd__tool-pop-item pd__tool-pop-item--danger"
                                    onClick={() => { setToolMenu(false); setConfirmDelProject(true) }}>
                                    Apagar projeto
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Capa ─────────────────────────────────────────────── */}
                <div className="pd__cover-section">
                    <button type="button" className="pd__back pd__back--cover" onClick={() => navigateOut(-1)}>← Projetos</button>
                    <div className="pd__cover-outer">
                        <button
                            type="button"
                            className={'pd__cover-btn' + (uploadingCover ? ' pd__cover-btn--busy' : '')}
                            onClick={() => coverFileRef.current?.click()}
                            disabled={uploadingCover}
                            title="Alterar capa"
                        >
                            {project.coverUrl
                                ? <img src={project.coverUrl} alt={project.name} className="pd__cover-img" />
                                : <div className="pd__cover-empty"><FaMusic size={56} /></div>
                            }
                            <div className="pd__cover-overlay">
                                <FaCamera size={18} />
                                <span>{uploadingCover ? 'A carregar…' : 'Alterar capa'}</span>
                            </div>
                        </button>
                    </div>
                    <input ref={coverFileRef} type="file" accept="image/*" className="pd__hidden" onChange={handleCoverChange} />
                </div>

                {/* ── Info ─────────────────────────────────────────────── */}
                <div className="pd__info">
                    <div className="pd__title-row">
                        <div className="pd__title-group">
                            {editingName ? (
                                <div className="pd__title-edit">
                                    <input
                                        ref={nameInputRef}
                                        className="pd__title-input"
                                        value={nameDraft}
                                        onChange={e => setNameDraft(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter')  handleSaveName()
                                            if (e.key === 'Escape') setEditingName(false)
                                        }}
                                        disabled={savingName}
                                        autoFocus
                                    />
                                    <button type="button" className="pd__icon-btn" onClick={handleSaveName} disabled={savingName} aria-label="Guardar">
                                        <FaCheck size={11} />
                                    </button>
                                    <button type="button" className="pd__icon-btn pd__icon-btn--mute" onClick={() => setEditingName(false)} disabled={savingName} aria-label="Cancelar">
                                        <FaTimes size={11} />
                                    </button>
                                </div>
                            ) : (
                                <h1 className="pd__title">{project.name}</h1>
                            )}
                        </div>
                        <button
                            type="button"
                            className="pd__play-circle"
                            onClick={handleProjectPlay}
                            aria-label={isProjectPlaying ? 'Parar' : 'Reproduzir projeto'}
                            disabled={tracks.length === 0}
                        >
                            {isProjectPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                        </button>
                    </div>

                    <p className="pd__meta">
                        {currentUser?.name ?? '—'}
                        {tracks.length > 0 && ` · ${tracks.length} ${tracks.length === 1 ? 'faixa' : 'faixas'}`}
                    </p>

                    {currentUser?.id && project?.userId && currentUser.id !== project.userId && (
                        <button type="button" className="pd__save-pill">
                            <FaPlus size={10} />
                            Guardar na biblioteca
                        </button>
                    )}
                </div>

                {/* ── Lista de faixas ───────────────────────────────────── */}
                <div className="pd__tracks-area">

                    <div className="pd__tracks-head">
                        <div className="pd__tracks-head-left">
                            {showSearch ? (
                                <input
                                    type="text"
                                    className="pd__search-input"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Pesquisar…"
                                    autoFocus
                                />
                            ) : tracks.length > 0 ? (
                                <span className="pd__tracks-label">
                                    Faixas{filteredTracks.length > 0 && <span className="pd__tracks-count">{filteredTracks.length}</span>}
                                </span>
                            ) : null}
                        </div>
                        <button
                            type="button"
                            className={'pd__add-btn' + (showForm ? ' pd__add-btn--active' : '')}
                            onClick={() => setShowForm(v => !v)}
                        >
                            {showForm ? '× Cancelar' : '+ Adicionar'}
                        </button>
                    </div>

                    {showForm && (
                        <form className="pd__form" onSubmit={handleAddTrack} noValidate>
                            <div className="pd__form-row">
                                <div className="pd__field">
                                    <label className="pd__label" htmlFor="pd-title">Título</label>
                                    <input id="pd-title" type="text" className="pd__input" value={title}
                                        onChange={e => { setTitle(e.target.value); setFormError(null) }}
                                        placeholder="Nome da faixa" disabled={uploading} />
                                </div>
                                <div className="pd__field">
                                    <label className="pd__label" htmlFor="pd-audio">Áudio</label>
                                    <label htmlFor="pd-audio" className={'pd__file-zone' + (audioFile ? ' pd__file-zone--has-file' : '')}>
                                        <span className="pd__file-icon">♪</span>
                                        <span className="pd__file-name">
                                            {audioFile ? audioFile.name : 'Selecionar ficheiro'}
                                        </span>
                                        <input id="pd-audio" ref={fileRef} type="file" accept="audio/*"
                                            className="pd__hidden"
                                            onChange={e => { setAudioFile(e.target.files?.[0] ?? null); setFormError(null) }}
                                            disabled={uploading} />
                                    </label>
                                </div>
                                <button type="submit" className="pd__btn pd__btn--accent" disabled={uploading}>
                                    {uploading ? '…' : 'Adicionar'}
                                </button>
                            </div>
                            {formError && <p className="pd__form-error">{formError}</p>}
                        </form>
                    )}

                    {filteredTracks.length === 0 && !showForm ? (
                        <div className="pd__empty">
                            <p>{search ? 'Sem resultados.' : 'Ainda não há faixas neste projeto.'}</p>
                            {!search && (
                                <button type="button" className="pd__btn pd__btn--accent" onClick={() => setShowForm(true)}>
                                    Adicionar primeira faixa
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="pd__track-list">
                            {filteredTracks.map((t) => {
                                const realIdx  = tracks.indexOf(t)
                                const isActive = currentIndex === realIdx
                                return (
                                    <div
                                        key={t.id}
                                        className={
                                            'pd__track-row' +
                                            (isActive ? ' pd__track-row--active' : '') +
                                            (!t.audioUrl ? ' pd__track-row--no-audio' : '')
                                        }
                                        onClick={() => t.audioUrl && setCurrentIndex(realIdx)}
                                    >
                                        <span className="pd__track-icon">
                                            {isActive
                                                ? <EqBars playing={isPlaying} />
                                                : <span className="pd__track-num">{realIdx + 1}</span>
                                            }
                                        </span>
                                        <div className="pd__track-info">
                                            <span className="pd__track-title">{t.title}</span>
                                            {t.createdAt && <span className="pd__track-date">{fmtDate(t.createdAt)}</span>}
                                        </div>
                                        <span className="pd__track-duration">{fmtDuration(t.duration)}</span>
                                        <TrackMenu onDelete={() => setConfirmDelTrack(t)} />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* ─── Modais ───────────────────────────────────────────────── */}
            {confirmDelTrack && (
                <ConfirmModal
                    title="Remover faixa"
                    message={`Remover "${confirmDelTrack.title}" do projeto?`}
                    confirmLabel="Remover"
                    loading={deletingTrack}
                    onConfirm={handleDeleteTrack}
                    onClose={() => !deletingTrack && setConfirmDelTrack(null)}
                />
            )}
            {confirmDelProject && (
                <ConfirmModal
                    title="Apagar projeto"
                    message={`Apagar "${project.name}" e todas as suas faixas? Esta acção não pode ser desfeita.`}
                    confirmLabel="Apagar tudo"
                    loading={deletingProject}
                    onConfirm={handleDeleteProject}
                    onClose={() => !deletingProject && setConfirmDelProject(false)}
                />
            )}
            {confirmRegen && (
                <ConfirmModal
                    title="Gerar novo link"
                    message={`O link anterior de "${project.name}" ficará inválido. Continuar?`}
                    confirmLabel="Gerar novo link"
                    loading={regening}
                    onConfirm={handleRegen}
                    onClose={() => !regening && setConfirmRegen(false)}
                />
            )}

            {/* ─── Player ───────────────────────────────────────────────── */}
            <PersonalMiniPlayer
                tracks={playerTracks}
                currentIndex={currentIndex}
                onIndexChange={setCurrentIndex}
                onClose={() => setCurrentIndex(null)}
                onPlayingChange={setIsPlaying}
            />
        </PersonalLayout>
    )
}
