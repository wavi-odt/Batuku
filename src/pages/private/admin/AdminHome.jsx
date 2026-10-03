/* ─────────────────────────────────────────────────────────────────
   pages/private/admin/AdminHome.jsx, Painel de administração.
   Rota /admin, acessível só a ROLE_ADMIN (ver RoleRoute.jsx).

   Ferramenta de trabalho interno (1-2 pessoas), não uma vitrine:
   sem hero, sem ilustração, só clareza e densidade de informação.
   Usa os tokens/classes globais (tokens.css, global.css: .btn-ghost,
   .card, .badge) tal como Profile.jsx. Layout próprio e independente
   (sem AppShell), simples cabeçalho + conteúdo.
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSpotify, FaFlag, FaExclamationTriangle, FaStar, FaUsers, FaMusic, FaCheckCircle, FaSearch } from 'react-icons/fa'
import { getToken } from '../../../utils/auth.js'
import AdminShell from './AdminShell.jsx'
import './AdminHome.css'

const API     = `${import.meta.env.VITE_API_BASE_URL}/api/admin`
const MKT_API = `${import.meta.env.VITE_API_BASE_URL}/api/marketplace`

const ACCENT_COLORS = {
    green:   'var(--color-green)',
    mustard: 'var(--color-mustard)',
    blue:    '#818cf8',
}

const TODAY = new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })



function MetricCard({ label, value, alert, icon: Icon, accent, to }) {
    const card = (
        <div
            className={'admin-metric' + (alert && value > 0 ? ' admin-metric--alert' : '')}
            style={{ '--admin-metric-accent': ACCENT_COLORS[accent] }}
        >
            {Icon && (
                <span className={`admin-tool__icon admin-tool__icon--${accent}`} style={{ marginBottom: 'var(--space-3)' }}>
                    <Icon size={18} />
                </span>
            )}
            <div className="admin-metric__value">
                {value ?? ''}
                {alert && value > 0 && <FaExclamationTriangle size={15} className="admin-metric__flag" aria-hidden="true" />}
            </div>
            <div className="admin-metric__label">{label}</div>
        </div>
    );
    return to
        ? <Link to={to} style={{ textDecoration: 'none' }}>{card}</Link>
        : card;
}



function QuoteForm({ page, label, artists }) {
    const [quote,    setQuote]    = useState('')
    const [artistId, setArtistId] = useState('')
    const [preview,  setPreview]  = useState(null)
    const [busy,     setBusy]     = useState(false)
    const [saved,    setSaved]    = useState(false)

    useEffect(() => {
        fetch(`${API}/auth-quote/${page}`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) return
                if (data.quote)           setQuote(data.quote)
                if (data.artistProfileId) {
                    setArtistId(String(data.artistProfileId))
                    setPreview({ genre: data.genre, location: data.location })
                }
            })
            .catch(() => {})
    }, [page])

    function handleArtistChange(id) {
        setArtistId(id)
        const artist = artists.find(a => String(a.id) === id)
        setPreview(artist ? { genre: artist.genre, location: artist.location } : null)
    }

    async function handleSave() {
        setBusy(true)
        try {
            await fetch(`${API}/auth-quote/${page}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ quote, artistProfileId: artistId ? Number(artistId) : null }),
            })
            flash()
        } catch { /* ignora */ } finally { setBusy(false) }
    }

    async function handleClear() {
        setBusy(true)
        try {
            await fetch(`${API}/auth-quote/${page}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            setQuote('')
            setArtistId('')
            setPreview(null)
            flash()
        } catch { /* ignora */ } finally { setBusy(false) }
    }

    function flash() { setSaved(true); setTimeout(() => setSaved(false), 3000) }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="label-eyebrow">{label}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label className="admin-migration__title">Citação</label>
                <textarea
                    className="input"
                    rows={3}
                    style={{ resize: 'vertical', minHeight: 80, fontFamily: 'inherit' }}
                    placeholder='Ex: "Vendi o primeiro beat três dias depois de me registar."'
                    value={quote}
                    onChange={e => setQuote(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label className="admin-migration__title">Artista</label>
                <select
                    className="input"
                    value={artistId}
                    onChange={e => handleArtistChange(e.target.value)}
                >
                    <option value="">Sem artista</option>
                    {artists.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
                {preview && (preview.genre || preview.location) && (
                    <div className="admin-migration__desc">
                        {[preview.genre, preview.location].filter(Boolean).join(' · ')}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleSave}
                    disabled={busy || !quote.trim()}
                >
                    {busy ? 'A guardar…' : 'Guardar'}
                </button>
                <button
                    type="button"
                    className="btn-ghost"
                    onClick={handleClear}
                    disabled={busy}
                >
                    Remover
                </button>
                {saved && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-green)' }}>Guardado.</span>}
            </div>
        </div>
    )
}

function AuthQuoteSection() {
    const [artists, setArtists] = useState([])

    useEffect(() => {
        fetch(`${API}/artist-profiles`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.ok ? r.json() : [])
            .then(data => setArtists(Array.isArray(data) ? data : []))
            .catch(() => {})
    }, [])

    return (
        <section className="admin-section">
            <h2 className="admin-section__title">Statements do login / registo</h2>
            <p className="admin-section__sub">
                Citações que aparecem na coluna lateral de cada página. O género e a localização são preenchidos automaticamente a partir do perfil do artista.
            </p>
            <div className="admin-tools">
                <QuoteForm page="login"    label="Página de login"   artists={artists} />
                <QuoteForm page="register" label="Página de registo" artists={artists} />
            </div>
        </section>
    )
}

function HeroArtistsSection() {
    const [artists,  setArtists]  = useState([])
    const [loading,  setLoading]  = useState(true)
    const [toggling, setToggling] = useState(null)

    useEffect(() => {
        fetch(`${API}/artist-profiles`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.ok ? r.json() : [])
            .then(data => setArtists(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    async function toggleHero(artist) {
        setToggling(artist.id)
        try {
            const res = await fetch(`${API}/artist-profiles/${artist.id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ featuredOnHero: !artist.featuredOnHero }),
            })
            if (!res.ok) throw new Error()
            setArtists(prev => prev.map(a => a.id === artist.id ? { ...a, featuredOnHero: !a.featuredOnHero } : a))
        } catch {
            /* ignora */
        } finally {
            setToggling(null)
        }
    }

    const featured = artists.filter(a => a.featuredOnHero)
    const rest     = artists.filter(a => !a.featuredOnHero)
    const sorted   = [...featured, ...rest]

    return (
        <section className="admin-section">
            <h2 className="admin-section__title">Artistas no Hero</h2>
            <p className="admin-section__sub">
                Os artistas marcados com estrela aparecem na parede animada da página inicial. Precisas de pelo menos 8 para preencher as 3 colunas.
            </p>

            {loading && <p className="admin-beats__empty">A carregar artistas…</p>}

            {!loading && artists.length === 0 && (
                <p className="admin-beats__empty">Ainda não há artistas na plataforma.</p>
            )}

            {!loading && artists.length > 0 && (
                <div className="admin-beats">
                    {sorted.map(artist => (
                        <div key={artist.id} className={`admin-beat-row${artist.featuredOnHero ? ' admin-beat-row--featured' : ''}`}>
                            <div className="admin-beat-row__info" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-3)' }}>
                                {artist.imageUrl
                                    ? <img src={artist.imageUrl} alt={artist.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                                    : <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-surface-2)', flexShrink: 0 }} />
                                }
                                <span className="admin-beat-row__title">{artist.name}</span>
                            </div>
                            <button
                                type="button"
                                className={`admin-beat-row__star${artist.featuredOnHero ? ' admin-beat-row__star--on' : ''}`}
                                onClick={() => toggleHero(artist)}
                                disabled={toggling === artist.id}
                                title={artist.featuredOnHero ? 'Remover do hero' : 'Adicionar ao hero'}
                            >
                                <FaStar size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

function BeatsFeaturedSection() {
    const [beats,   setBeats]   = useState([])
    const [loading, setLoading] = useState(true)
    const [toggling, setToggling] = useState(null) // id do beat a ser alterado

    useEffect(() => {
        fetch(`${MKT_API}/beats`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.ok ? r.json() : [])
            .then(data => setBeats(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    async function toggleFeatured(beat) {
        setToggling(beat.id)
        try {
            const res = await fetch(`${MKT_API}/beats/${beat.id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isFeatured: !beat.isFeatured }),
            })
            if (!res.ok) throw new Error()
            setBeats(prev => prev.map(b => b.id === beat.id ? { ...b, isFeatured: !b.isFeatured } : b))
        } catch {
            /* ignora */
        } finally {
            setToggling(null)
        }
    }

    const featured = beats.filter(b => b.isFeatured)
    const rest     = beats.filter(b => !b.isFeatured)
    const sorted   = [...featured, ...rest]

    return (
        <section className="admin-section">
            <h2 className="admin-section__title">Beat em Destaque</h2>
            <p className="admin-section__sub">
                O beat marcado com estrela aparece como destaque no marketplace. Se nenhum estiver marcado, é usado o beat com mais plays.
            </p>

            {loading && <p className="admin-beats__empty">A carregar beats…</p>}

            {!loading && beats.length === 0 && (
                <p className="admin-beats__empty">Ainda não há beats no marketplace.</p>
            )}

            {!loading && beats.length > 0 && (
                <div className="admin-beats">
                    {sorted.map(beat => (
                        <div key={beat.id} className={`admin-beat-row${beat.isFeatured ? ' admin-beat-row--featured' : ''}`}>
                            <div className="admin-beat-row__info">
                                <span className="admin-beat-row__title">{beat.title}</span>
                                <span className="admin-beat-row__meta">
                                    {beat.producer}
                                    {beat.genre && <> · {beat.genre}</>}
                                    {beat.bpm   && <> · {beat.bpm} BPM</>}
                                    {' · '}<FaPlay size={9} style={{ verticalAlign: 'middle' }} /> {beat.plays ?? 0} plays
                                </span>
                            </div>
                            <button
                                type="button"
                                className={`admin-beat-row__star${beat.isFeatured ? ' admin-beat-row__star--on' : ''}`}
                                onClick={() => toggleFeatured(beat)}
                                disabled={toggling === beat.id}
                                title={beat.isFeatured ? 'Remover destaque' : 'Marcar como destaque'}
                            >
                                <FaStar size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

function UsersSection() {
    const [users,    setUsers]    = useState([])
    const [loading,  setLoading]  = useState(true)
    const [query,    setQuery]    = useState('')
    const [toggling, setToggling] = useState(null)

    useEffect(() => {
        setLoading(true)
        const q = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''
        fetch(`${API}/users${q}`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.ok ? r.json() : [])
            .then(data => setUsers(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [query])

    async function toggleVerify(user) {
        setToggling(user.id)
        try {
            const res = await fetch(`${API}/users/${user.id}/verify`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, verified: updated.verified } : u))
        } catch { /* ignora */ } finally { setToggling(null) }
    }

    return (
        <section className="admin-section">
            <h2 className="admin-section__title">Utilizadores</h2>
            <p className="admin-section__sub">Pesquisa e gere a verificação dos utilizadores.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
                    <FaSearch size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ink-mute)', pointerEvents: 'none' }} />
                    <input
                        className="input"
                        style={{ paddingLeft: 30 }}
                        placeholder="Nome, username ou email…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading && <p className="admin-beats__empty">A carregar utilizadores…</p>}
            {!loading && users.length === 0 && <p className="admin-beats__empty">Nenhum utilizador encontrado.</p>}
            {!loading && users.length > 0 && (
                <div className="admin-beats">
                    {users.map(u => (
                        <div key={u.id} className={`admin-beat-row${u.verified ? ' admin-beat-row--featured' : ''}`}>
                            <div className="admin-beat-row__info" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-3)' }}>
                                {u.avatarUrl
                                    ? <img src={u.avatarUrl} alt={u.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                    : <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-surface-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-mute)', fontSize: 14 }}>{u.name?.[0]?.toUpperCase() ?? '?'}</div>
                                }
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span className="admin-beat-row__title">{u.name}</span>
                                        {u.verified && <FaCheckCircle size={11} style={{ color: 'var(--color-green)', flexShrink: 0 }} />}
                                    </div>
                                    <span className="admin-beat-row__meta">@{u.username} · {u.userRole?.toLowerCase()}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`admin-beat-row__star${u.verified ? ' admin-beat-row__star--on' : ''}`}
                                style={u.verified ? { color: 'var(--color-green)', borderColor: 'rgba(52,211,153,0.5)', background: 'rgba(52,211,153,0.1)' } : {}}
                                onClick={() => toggleVerify(u)}
                                disabled={toggling === u.id}
                                title={u.verified ? 'Remover verificação' : 'Verificar utilizador'}
                            >
                                <FaCheckCircle size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default function AdminHome() {
    const [metrics, setMetrics] = useState([
        { label: 'Perfis de artista importados',    value: null, icon: FaSpotify,            accent: 'green'   },
        { label: 'Pedidos de reclamação pendentes', value: null, alert: true, icon: FaFlag,              accent: 'mustard' },
        { label: 'Géneros não mapeados',            value: null, alert: true, icon: FaExclamationTriangle, accent: 'mustard', to: '/admin/artist-import' },
        { label: 'Utilizadores registados',         value: null, icon: FaUsers,              accent: 'blue'    },
        { label: 'Contas ARTIST ativas',            value: null, icon: FaMusic,              accent: 'blue'    },
    ]);

    useEffect(() => {
        fetch(`${API}/metrics`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setMetrics([
                { label: 'Perfis de artista importados',    value: data.importedArtists,       icon: FaSpotify, accent: 'green'   },
                { label: 'Pedidos de reclamação pendentes', value: data.pendingClaimRequests,   alert: true, icon: FaFlag,              accent: 'mustard' },
                { label: 'Géneros não mapeados',            value: data.unmappedGenres,         alert: true, icon: FaExclamationTriangle, accent: 'mustard', to: '/admin/artist-import' },
                { label: 'Utilizadores registados',         value: data.totalUsers,             icon: FaUsers,  accent: 'blue'    },
                { label: 'Contas ARTIST ativas',            value: data.activeArtistAccounts,   icon: FaMusic,  accent: 'blue'    },
            ]))
            .catch(() => {});
    }, []);

    return (
        <AdminShell>
            <div className="admin-page__inner">
                <header className="admin-head">
                    <div className="label-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>{TODAY}</div>
                    <h1 className="admin-head__title">Painel de controlo</h1>
                    <p className="admin-head__sub">Visão geral da plataforma Batuku</p>
                </header>

                <section className="admin-metrics">
                    {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
                </section>

<AuthQuoteSection />
                <HeroArtistsSection />
                <BeatsFeaturedSection />
                <UsersSection />
            </div>
        </AdminShell>
    );
}
