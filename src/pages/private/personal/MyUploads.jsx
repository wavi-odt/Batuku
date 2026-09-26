import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaPlay, FaEllipsisH, FaPen, FaTrash, FaLink, FaSyncAlt, FaMusic } from 'react-icons/fa'
import PersonalLayout from '../../../components/PersonalLayout/PersonalLayout.jsx'
import ConfirmModal from '../../../components/ConfirmModal.jsx'
import { API, getToken } from '../../../utils/auth.js'
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import { useToast } from '../../../context/ToastContext.jsx'
import './MyUploads.css'

const MAX_IMAGE = 5 * 1024 * 1024

function ProjectCard({ proj, onOpen, onEdit, onCopyLink, onRegenLink, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        if (!menuOpen) return
        function handle(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [menuOpen])

    return (
        <div className="mu__card">
            <div className="mu__card-cover-wrap">
                <button type="button" className="mu__card-cover" onClick={() => onOpen(proj)}>
                    {proj.coverUrl
                        ? <img src={proj.coverUrl} alt={proj.name} className="mu__card-cover-img" />
                        : <div className="mu__card-cover-empty"><FaMusic size={28} /></div>
                    }
                    <span className="mu__card-play" aria-hidden="true"><FaPlay size={11} /></span>
                </button>

                <div className={'mu__card-menu' + (menuOpen ? ' mu__card-menu--open' : '')} ref={menuRef}>
                    <button
                        type="button"
                        className="mu__menu-btn"
                        onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
                        aria-label="Mais opções"
                    >
                        <FaEllipsisH size={12} />
                    </button>
                    {menuOpen && (
                        <div className="mu__menu-popover" onClick={e => e.stopPropagation()}>
                            <button type="button" className="mu__menu-item" onClick={() => { setMenuOpen(false); onEdit(proj) }}>
                                <span className="mu__menu-icon"><FaPen size={10} /></span>
                                <span>Editar projeto</span>
                            </button>
                            <button type="button" className="mu__menu-item" onClick={() => { setMenuOpen(false); onCopyLink(proj) }}>
                                <span className="mu__menu-icon"><FaLink size={10} /></span>
                                <span>Copiar link</span>
                            </button>
                            <button type="button" className="mu__menu-item" onClick={() => { setMenuOpen(false); onRegenLink(proj) }}>
                                <span className="mu__menu-icon"><FaSyncAlt size={10} /></span>
                                <span>Novo link</span>
                            </button>
                            <div className="mu__menu-divider" />
                            <button type="button" className="mu__menu-item mu__menu-item--danger" onClick={() => { setMenuOpen(false); onDelete(proj) }}>
                                <span className="mu__menu-icon mu__menu-icon--danger"><FaTrash size={10} /></span>
                                <span>Apagar projeto</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function MyUploads() {
    const navigate    = useNavigate()
    const { showToast } = useToast()
    const authHeader  = { Authorization: `Bearer ${getToken()}` }
    const currentUser = useCurrentUser()
    const [searchParams, setSearchParams] = useSearchParams()

    const [projects,     setProjects]     = useState([])
    const [loading,      setLoading]      = useState(true)
    const [error,        setError]        = useState(null)
    const [showForm,     setShowForm]     = useState(false)
    const filter    = searchParams.get('filter') ?? 'all'
    const setFilter = (key) => setSearchParams({ filter: key })
    const [confirmDel,   setConfirmDel]   = useState(null)
    const [confirmRegen, setConfirmRegen] = useState(null)
    const [deleting,     setDeleting]     = useState(false)
    const [regening,     setRegening]     = useState(false)
    const [copiedId,     setCopiedId]     = useState(null)

    const [prName,      setPrName]      = useState('')
    const [prCover,     setPrCover]     = useState(null)
    const [prCoverPrev, setPrCoverPrev] = useState(null)
    const [formError,   setFormError]   = useState(null)
    const [creating,    setCreating]    = useState(false)
    const coverRef = useRef(null)

    const [editProject,   setEditProject]   = useState(null)
    const [editName,      setEditName]      = useState('')
    const [editCover,     setEditCover]     = useState(null)
    const [editCoverPrev, setEditCoverPrev] = useState(null)
    const [editError,     setEditError]     = useState(null)
    const [editing,       setEditing]       = useState(false)
    const editCoverRef = useRef(null)

    useEffect(() => {
        fetch(`${API}/api/my-projects`, { headers: authHeader })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(projs => setProjects(Array.isArray(projs) ? projs : []))
            .catch(() => setError('Não foi possível carregar os projetos.'))
            .finally(() => setLoading(false))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function handleCoverChange(e) {
        const f = e.target.files?.[0] ?? null
        setPrCover(f); setFormError(null)
        setPrCoverPrev(f ? URL.createObjectURL(f) : null)
    }

    function closeCreateModal() {
        setShowForm(false)
        setPrName(''); setPrCover(null); setPrCoverPrev(null); setFormError(null)
        if (coverRef.current) coverRef.current.value = ''
    }

    async function handleCreate(e) {
        e.preventDefault(); setFormError(null)
        if (!prName.trim()) return setFormError('O nome é obrigatório.')
        if (prCover && !prCover.type.startsWith('image/')) return setFormError('Só são aceites imagens para a capa.')
        if (prCover && prCover.size > MAX_IMAGE) return setFormError('A capa não pode ultrapassar 5 MB.')
        setCreating(true)
        try {
            const body = new FormData()
            body.append('name', prName.trim())
            if (prCover) body.append('cover', prCover)
            const res = await fetch(`${API}/api/my-projects`, { method: 'POST', headers: authHeader, body })
            if (!res.ok) throw new Error()
            const created = await res.json()
            setProjects(p => [created, ...p])
            closeCreateModal()
            showToast('Projeto criado!')
        } catch {
            setFormError('Erro ao criar o projeto.')
        } finally {
            setCreating(false)
        }
    }

    function openEdit(proj) {
        setEditProject(proj); setEditName(proj.name)
        setEditCover(null); setEditCoverPrev(proj.coverUrl ?? null); setEditError(null)
    }

    function handleEditCoverChange(e) {
        const f = e.target.files?.[0] ?? null
        setEditCover(f); setEditError(null)
        setEditCoverPrev(f ? URL.createObjectURL(f) : editProject?.coverUrl ?? null)
    }

    async function handleEdit(e) {
        e.preventDefault(); setEditError(null)
        if (!editName.trim()) return setEditError('O nome é obrigatório.')
        if (editCover && !editCover.type.startsWith('image/')) return setEditError('Só são aceites imagens.')
        if (editCover && editCover.size > MAX_IMAGE) return setEditError('A capa não pode ultrapassar 5 MB.')
        setEditing(true)
        try {
            const body = new FormData()
            body.append('name', editName.trim())
            if (editCover) body.append('cover', editCover)
            const res = await fetch(`${API}/api/my-projects/${editProject.id}`, {
                method: 'PATCH', headers: authHeader, body
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setProjects(p => p.map(pr => pr.id === updated.id ? updated : pr))
            setEditProject(null)
            showToast('Projeto actualizado!')
        } catch {
            setEditError('Erro ao guardar. Tenta novamente.')
        } finally {
            setEditing(false)
        }
    }

    function copyLink(proj) {
        navigator.clipboard.writeText(`${window.location.origin}/proj/${proj.shareToken}`)
            .then(() => { setCopiedId(proj.id); setTimeout(() => setCopiedId(null), 2000) })
    }

    async function handleRegen() {
        setRegening(true)
        try {
            const res = await fetch(`${API}/api/my-projects/${confirmRegen.id}/regenerate-link`, {
                method: 'POST', headers: authHeader
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setProjects(p => p.map(pr => pr.id === updated.id ? updated : pr))
            setConfirmRegen(null)
            showToast('Novo link gerado!')
        } catch {
            showToast('Erro ao gerar novo link.', 'error')
        } finally {
            setRegening(false)
        }
    }

    async function handleDelete() {
        setDeleting(true)
        try {
            const res = await fetch(`${API}/api/my-projects/${confirmDel.id}`, {
                method: 'DELETE', headers: authHeader
            })
            if (!res.ok) throw new Error()
            setProjects(p => p.filter(pr => pr.id !== confirmDel.id))
            setConfirmDel(null)
            showToast('Projeto eliminado.')
        } catch {
            showToast('Erro ao eliminar o projeto.', 'error')
        } finally {
            setDeleting(false)
        }
    }

    const FILTERS = [
        { key: 'all',    label: 'Todos'           },
        { key: 'mine',   label: 'Meus projetos'   },
        { key: 'shared', label: 'Partilhados'     },
    ]

    const visibleProjects = filter === 'shared' ? [] : projects

    return (
        <PersonalLayout>

            <div className="mu__header">
                <div className="mu__filters">
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            type="button"
                            className={'mu__filter-btn' + (filter === f.key ? ' mu__filter-btn--active' : '')}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <button type="button" className="mu__new-btn" onClick={() => setShowForm(true)}>
                    Nova +
                </button>
            </div>

            {loading && <p className="mu__state">A carregar…</p>}
            {error   && <p className="mu__state mu__state--error">{error}</p>}

            {!loading && !error && visibleProjects.length === 0 && (
                <div className="mu__empty">
                    <span className="mu__empty-icon">◈</span>
                    {filter === 'shared' ? (
                        <>
                            <p className="mu__empty-title">Sem projetos partilhados</p>
                            <p className="mu__empty-text">Projetos partilhados contigo aparecerão aqui.</p>
                        </>
                    ) : (
                        <>
                            <p className="mu__empty-title">Ainda não tens projetos</p>
                            <p className="mu__empty-text">Cria um projeto para organizar e partilhar as tuas faixas.</p>
                            <button type="button" className="mu__btn mu__btn--accent" onClick={() => setShowForm(true)}>
                                Criar primeiro projeto
                            </button>
                        </>
                    )}
                </div>
            )}

            {!loading && !error && visibleProjects.length > 0 && (
                <div className="mu__grid">
                    {visibleProjects.map(proj => (
                        <div key={proj.id} className="mu__proj-item">
                            <ProjectCard
                                proj={proj}
                                onOpen={p => navigate(`/pessoal/projetos/${p.id}`)}
                                onEdit={openEdit}
                                onCopyLink={copyLink}
                                onRegenLink={p => setConfirmRegen(p)}
                                onDelete={p => setConfirmDel(p)}
                            />
                            <div className="mu__proj-caption" onClick={() => navigate(`/pessoal/projetos/${proj.id}`)}>
                                <span className="mu__proj-name">{proj.name}</span>
                                <span className="mu__proj-user">{currentUser?.name ?? ''}</span>
                            </div>
                            {copiedId === proj.id && (
                                <div className="mu__copied-toast">✓ Link copiado!</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Modal: criar projeto ────────────────────────────────── */}
            {showForm && (
                <div className="mu__modal-overlay" onClick={() => !creating && closeCreateModal()}>
                    <div className="mu__modal" onClick={e => e.stopPropagation()}>
                        <div className="mu__modal-header">
                            <span className="mu__modal-title">Novo projeto</span>
                            <button type="button" className="mu__modal-close" onClick={() => !creating && closeCreateModal()}>×</button>
                        </div>
                        <form onSubmit={handleCreate} noValidate>
                            <div className="mu__form-proj">
                                <label htmlFor="pr-cover" className="mu__cover-zone" title="Adicionar capa">
                                    {prCoverPrev
                                        ? <img src={prCoverPrev} alt="" className="mu__cover-preview" />
                                        : <div className="mu__cover-placeholder"><span>+</span><span>Capa</span></div>
                                    }
                                    <input id="pr-cover" ref={coverRef} type="file" accept="image/*"
                                        className="mu__file-hidden" onChange={handleCoverChange} disabled={creating} />
                                </label>
                                <div className="mu__form-fields">
                                    <div className="mu__field">
                                        <label className="mu__label" htmlFor="pr-name">Nome do projeto</label>
                                        <input id="pr-name" type="text" className="mu__input" value={prName}
                                            onChange={e => { setPrName(e.target.value); setFormError(null) }}
                                            placeholder="Ex: Demo 2025, EP de Verão…"
                                            disabled={creating} autoFocus />
                                    </div>
                                    {formError && <p className="mu__form-error">{formError}</p>}
                                    <div className="mu__form-footer">
                                        <button type="submit" className="mu__btn mu__btn--accent" disabled={creating}>
                                            {creating ? 'A criar…' : 'Criar projeto'}
                                        </button>
                                        <button type="button" className="mu__btn mu__btn--ghost" onClick={closeCreateModal} disabled={creating}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── Modal: editar projeto ───────────────────────────────── */}
            {editProject && (
                <div className="mu__modal-overlay" onClick={() => !editing && setEditProject(null)}>
                    <div className="mu__modal" onClick={e => e.stopPropagation()}>
                        <div className="mu__modal-header">
                            <span className="mu__modal-title">Editar projeto</span>
                            <button type="button" className="mu__modal-close" onClick={() => !editing && setEditProject(null)}>×</button>
                        </div>
                        <form onSubmit={handleEdit} noValidate>
                            <div className="mu__form-proj">
                                <label htmlFor="edit-cover" className="mu__cover-zone" title="Mudar capa">
                                    {editCoverPrev
                                        ? <img src={editCoverPrev} alt="" className="mu__cover-preview" />
                                        : <div className="mu__cover-placeholder"><span>+</span><span>Capa</span></div>
                                    }
                                    <input id="edit-cover" ref={editCoverRef} type="file" accept="image/*"
                                        className="mu__file-hidden" onChange={handleEditCoverChange} disabled={editing} />
                                </label>
                                <div className="mu__form-fields">
                                    <div className="mu__field">
                                        <label className="mu__label" htmlFor="edit-name">Nome</label>
                                        <input id="edit-name" type="text" className="mu__input" value={editName}
                                            onChange={e => { setEditName(e.target.value); setEditError(null) }}
                                            disabled={editing} autoFocus />
                                    </div>
                                    {editError && <p className="mu__form-error">{editError}</p>}
                                    <div className="mu__form-footer">
                                        <button type="submit" className="mu__btn mu__btn--accent" disabled={editing}>
                                            {editing ? 'A guardar…' : 'Guardar'}
                                        </button>
                                        <button type="button" className="mu__btn mu__btn--ghost" onClick={() => setEditProject(null)} disabled={editing}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDel && (
                <ConfirmModal
                    title="Apagar projeto"
                    message={`Apagar "${confirmDel.name}" e todas as suas faixas? Esta acção não pode ser desfeita.`}
                    confirmLabel="Apagar"
                    loading={deleting}
                    onConfirm={handleDelete}
                    onClose={() => !deleting && setConfirmDel(null)}
                />
            )}
            {confirmRegen && (
                <ConfirmModal
                    title="Novo link de partilha"
                    message={`O link anterior de "${confirmRegen.name}" ficará inválido. Continuar?`}
                    confirmLabel="Novo link"
                    loading={regening}
                    onConfirm={handleRegen}
                    onClose={() => !regening && setConfirmRegen(null)}
                />
            )}

        </PersonalLayout>
    )
}
