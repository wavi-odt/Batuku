import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSearchParams, useParams, useNavigate, Navigate } from 'react-router-dom'
import { FaSearch }                     from 'react-icons/fa'
import AppShell                         from '../../../../components/HomeComponents/AppShell.jsx'
import { API, getToken }                from '../../../../utils/auth.js'
import { useCurrentUser }               from '../../../../hooks/useCurrentUser.js'
import { useNotifications }            from '../../../../context/NotificationsContext.jsx'
import MarketplaceFeatured              from './MarketplaceFeatured.jsx'
import MarketplaceGrid                  from './MarketplaceGrid.jsx'
import MarketplaceSidebar               from './MarketplaceSidebar.jsx'
import MarketplaceRoleModal             from './MarketplaceRoleModal.jsx'
import MarketplaceProducer              from './MarketplaceProducer.jsx'
import MarketplacePurchases             from './MarketplacePurchases.jsx'
import MarketplaceOffers                from './MarketplaceOffers.jsx'
import MarketplaceProducerOffers        from './MarketplaceProducerOffers.jsx'
import OfferModal                       from './OfferModal.jsx'
import './Marketplace.css'
import './MarketplacePurchases.css'

const SORT_OPTIONS = [
    { key: 'newest',     label: 'Mais recentes' },
    { key: 'popular',    label: 'Mais vendidos'  },
    { key: 'price_asc',  label: 'Preço ↑'        },
    { key: 'price_desc', label: 'Preço ↓'        },
    { key: 'bpm_asc',    label: 'BPM ↑'          },
]

export default function Marketplace() {
    const currentUser = useCurrentUser()
    const { clearRouteNotifications } = useNotifications()

    useEffect(() => { clearRouteNotifications('/marketplace') }, []) // eslint-disable-line react-hooks/exhaustive-deps

    /* ─── Role do marketplace ────────────────────────────────────── */
    const [marketplaceRole, setMarketplaceRole] = useState(currentUser?.marketplaceRole ?? undefined)

    /* Sincronizar quando o currentUser carrega */
    useEffect(() => {
        if (currentUser?.marketplaceRole !== undefined) {
            setMarketplaceRole(currentUser.marketplaceRole)
        }
    }, [currentUser?.marketplaceRole])

    const handleChooseRole = async (role) => {
        const headers = { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
        try {
            await fetch(`${API}/api/users/me/marketplace-role`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ role }),
            })
        } catch { /* ignora erro de rede */ }
        setMarketplaceRole(role)
    }

    /* ─── Estado de filtros ──────────────────────────────────────── */
    const [query,   setQuery]   = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const genre = searchParams.get('genre') ?? 'Todos'
    const sort  = searchParams.get('sort')  ?? 'newest'
    const sp    = (key, val) => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set(key, val); return p })

    const [playing,  setPlaying]  = useState(null)
    const [licenses, setLicenses] = useState({})
    const handleLicense = (beatId, lic) => setLicenses(prev => ({ ...prev, [beatId]: lic }))

    const { tab: tabParam = '' } = useParams()
    const navigate = useNavigate()

    /* Guardar tab actual */
    useEffect(() => {
        if (tabParam) sessionStorage.setItem('mkt_tab', tabParam)
    }, [tabParam])

    const activeTab   = ['beats', 'purchases', 'offers'].includes(tabParam) ? tabParam : 'beats'
    const producerTab = ['discover', 'my-beats', 'offers'].includes(tabParam) ? tabParam : 'my-beats'
    const changeTab   = t => navigate(`/marketplace/${t}`)

    const [offerBeat, setOfferBeat] = useState(null)

    const [cart, setCart] = useState([])
    const cartIds = useMemo(() => new Set(cart.map(i => i.beat.id)), [cart])
    const toggleCart = (beat, license, price) => setCart(prev =>
        prev.some(i => i.beat.id === beat.id)
            ? prev.filter(i => i.beat.id !== beat.id)
            : [...prev, { beat, license, price }]
    )
    const removeFromCart  = beatId  => setCart(prev => prev.filter(i => i.beat.id !== beatId))
    const clearPurchased  = beatIds => setCart(prev => prev.filter(i => !beatIds.includes(i.beat.id)))

    /* ─── Dados da API ───────────────────────────────────────────── */
    const [beats,     setBeats]     = useState([])
    const [featured,  setFeatured]  = useState(null)
    const [genres,    setGenres]    = useState(['Todos'])
    const [stats,     setStats]     = useState({ beats: 0, producers: 0, sold: 0 })
    const [producers, setProducers] = useState([])
    const [loading,   setLoading]   = useState(true)

    const loadBeats = useCallback(() => {
        const headers = getToken() ? { Authorization: `Bearer ${getToken()}` } : {}
        Promise.all([
            fetch(`${API}/api/marketplace/beats`,          { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/marketplace/beats/featured`, { headers }).then(r => r.ok && r.status !== 204 ? r.json() : null),
        ])
        .then(([b, feat]) => {
            setBeats(Array.isArray(b) ? b : [])
            setFeatured(feat)
        })
        .catch(console.error)
    }, [])

    /* Carga inicial completa */
    useEffect(() => {
        const headers = getToken() ? { Authorization: `Bearer ${getToken()}` } : {}
        Promise.all([
            fetch(`${API}/api/marketplace/beats`,             { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/marketplace/beats/featured`,    { headers }).then(r => r.ok && r.status !== 204 ? r.json() : null),
            fetch(`${API}/api/marketplace/genres`,            { headers }).then(r => r.ok ? r.json() : ['Todos']),
            fetch(`${API}/api/marketplace/stats`,             { headers }).then(r => r.ok ? r.json() : {}),
            fetch(`${API}/api/marketplace/producers?limit=6`, { headers }).then(r => r.ok ? r.json() : []),
        ])
        .then(([b, feat, g, s, p]) => {
            setBeats(Array.isArray(b) ? b : [])
            setFeatured(feat)
            setGenres(Array.isArray(g) && g.length > 0 ? g : ['Todos'])
            setStats({ beats: s?.beats ?? 0, producers: s?.producers ?? 0, sold: s?.sold ?? 0 })
            setProducers(Array.isArray(p) ? p : [])
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [])

    /* Recarregar beats ao navegar para as tabs que os mostram */
    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return }
        if (tabParam === 'beats' || tabParam === 'discover') loadBeats()
    }, [tabParam, loadBeats])

    /* ─── Filtragem + ordenação ──────────────────────────────────── */
    const filtered = useMemo(() => {
        let list = beats
        if (genre !== 'Todos') list = list.filter(b => b.genre === genre)
        if (query.trim()) {
            const q = query.toLowerCase()
            list = list.filter(b =>
                b.title?.toLowerCase().includes(q) ||
                b.producer?.toLowerCase().includes(q) ||
                b.genre?.toLowerCase().includes(q)
            )
        }
        return [...list].sort((a, b) => {
            switch (sort) {
                case 'popular':    return (b.sales ?? 0) - (a.sales ?? 0)
                case 'price_asc':  return (a.prices?.lease ?? 0) - (b.prices?.lease ?? 0)
                case 'price_desc': return (b.prices?.lease ?? 0) - (a.prices?.lease ?? 0)
                case 'bpm_asc':    return (a.bpm ?? 0) - (b.bpm ?? 0)
                default:           return 0
            }
        })
    }, [beats, genre, query, sort])

    /* ─── Audio playback ────────────────────────────────────────── */
    const audioRef = useRef(new Audio())

    useEffect(() => {
        const audio = audioRef.current
        const onEnded = () => setPlaying(null)
        audio.addEventListener('ended', onEnded)
        return () => {
            audio.removeEventListener('ended', onEnded)
            audio.pause()
        }
    }, [])

    const handlePlay = useCallback((beatId) => {
        const audio = audioRef.current
        if (!beatId || playing === beatId) {
            audio.pause()
            setPlaying(null)
            return
        }
        const beat = beats.find(b => b.id === beatId)
        if (!beat?.audioUrl) return
        audio.pause()
        audio.src = beat.audioUrl
        audio.play().catch(() => {})
        setPlaying(beatId)
    }, [beats, playing])

    const featInCart = featured ? cartIds.has(featured.id) : false

    /* ─── Aguardar que o currentUser carregue antes de mostrar modal */
    const roleKnown = currentUser !== null && marketplaceRole !== undefined

    /* Redirect síncrono, sem flash */
    if (!tabParam) {
        const last = sessionStorage.getItem('mkt_tab')
        if (last) return <Navigate to={`/marketplace/${last}`} replace />
    }

    return (
        <AppShell>

            {/* Modal de escolha de papel */}
            {roleKnown && marketplaceRole === null && (
                <MarketplaceRoleModal onChoose={handleChooseRole} />
            )}

            {/* Modal de proposta exclusiva */}
            {offerBeat && (
                <OfferModal beat={offerBeat} onClose={() => setOfferBeat(null)} />
            )}

            {/* ─── Header ───────────────────────────────────────── */}
            <div className="mkt__header">
                <div>
                    <h1 className="mkt__title">Marketplace</h1>
                    <p className="mkt__subtitle">
                        {marketplaceRole === 'PRODUCER'
                            ? 'O teu estúdio de beats'
                            : 'Compra e vende beats cabo-verdianos'}
                    </p>
                </div>

                {/* Barra de pesquisa: fans na tab beats, produtores no tab descobrir */}
                {((marketplaceRole !== 'PRODUCER' && activeTab === 'beats') ||
                  (marketplaceRole === 'PRODUCER' && producerTab === 'discover')) && (
                    <div className="mkt__search-wrap">
                        <FaSearch className="mkt__search-icon" />
                        <input
                            type="search"
                            className="mkt__search"
                            placeholder="Pesquisar beats, produtores…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* ─── Tabs fans ────────────────────────────────────── */}
            {marketplaceRole !== 'PRODUCER' && (
                <div className="mkt__tabs">
                    <button
                        type="button"
                        className={`mkt__tab${activeTab === 'beats' ? ' mkt__tab--active' : ''}`}
                        onClick={() => changeTab('beats')}
                    >
                        Beats
                    </button>
                    <button
                        type="button"
                        className={`mkt__tab${activeTab === 'purchases' ? ' mkt__tab--active' : ''}`}
                        onClick={() => changeTab('purchases')}
                    >
                        Minhas Compras
                    </button>
                    <button
                        type="button"
                        className={`mkt__tab${activeTab === 'offers' ? ' mkt__tab--active' : ''}`}
                        onClick={() => changeTab('offers')}
                    >
                        Propostas
                    </button>
                </div>
            )}

            {/* ─── Tabs produtor ────────────────────────────────── */}
            {marketplaceRole === 'PRODUCER' && (
                <div className="mkt__tabs">
                    <button
                        type="button"
                        className={`mkt__tab${producerTab === 'discover' ? ' mkt__tab--active' : ''}`}
                        onClick={() => changeTab('discover')}
                    >
                        Descobrir
                    </button>
                    <button
                        type="button"
                        className={`mkt__tab${producerTab === 'my-beats' ? ' mkt__tab--active' : ''}`}
                        onClick={() => changeTab('my-beats')}
                    >
                        Meus Beats
                    </button>
                    <button
                        type="button"
                        className={`mkt__tab${producerTab === 'offers' ? ' mkt__tab--active' : ''}`}
                        onClick={() => changeTab('offers')}
                    >
                        Propostas
                    </button>
                </div>
            )}

            {/* ─── Vista do produtor: Meus Beats ────────────────── */}
            {marketplaceRole === 'PRODUCER' && producerTab === 'my-beats' && (
                <MarketplaceProducer playing={playing} onPlay={handlePlay} />
            )}

            {/* ─── Vista do produtor: Propostas ─────────────────── */}
            {marketplaceRole === 'PRODUCER' && producerTab === 'offers' && (
                <MarketplaceProducerOffers />
            )}

            {/* ─── Vista do produtor: Descobrir ─────────────────── */}
            {marketplaceRole === 'PRODUCER' && producerTab === 'discover' && (
                <>
                    {/* Stats */}
                    <div className="mkt__stats-bar">
                        <div className="mkt__stat">
                            <span className="mkt__stat-val">{stats.beats}</span>
                            <span className="mkt__stat-label">Beats disponíveis</span>
                        </div>
                        <div className="mkt__stat">
                            <span className="mkt__stat-val">{stats.producers}</span>
                            <span className="mkt__stat-label">Produtores</span>
                        </div>
                        <div className="mkt__stat">
                            <span className="mkt__stat-val">{Number(stats.sold).toLocaleString('pt-PT')}</span>
                            <span className="mkt__stat-label">Vendas totais</span>
                        </div>
                    </div>

                    {/* Beat em destaque (apenas visualização) */}
                    {featured && (
                        <MarketplaceFeatured beat={featured} readOnly />
                    )}

                    {/* Filtros */}
                    <div className="mkt__filters">
                        <div className="mkt__genre-pills">
                            {genres.map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    className={`mkt__genre-pill${genre === g ? ' mkt__genre-pill--active' : ''}`}
                                    onClick={() => sp('genre', g)}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                        <select
                            className="mkt__sort"
                            value={sort}
                            onChange={e => sp('sort', e.target.value)}
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Grid de beats (sem compra) */}
                    <MarketplaceGrid
                        beats={filtered}
                        playing={playing}
                        onPlay={handlePlay}
                        readOnly
                    />

                    {!loading && beats.length === 0 && (
                        <div style={{ padding: '40px 0', color: 'var(--color-ink-mute)', textAlign: 'center' }}>
                            <p style={{ fontSize: 16 }}>Ainda não há beats disponíveis.</p>
                        </div>
                    )}
                </>
            )}

            {/* ─── Vista do fan: Minhas Compras ─────────────────── */}
            {marketplaceRole !== 'PRODUCER' && activeTab === 'purchases' && (
                <MarketplacePurchases />
            )}

            {/* ─── Vista do fan: Propostas ──────────────────────── */}
            {marketplaceRole !== 'PRODUCER' && activeTab === 'offers' && (
                <MarketplaceOffers />
            )}

            {/* ─── Vista do fan / comprador ─────────────────────── */}
            {marketplaceRole !== 'PRODUCER' && activeTab === 'beats' && (
                <>
                    {/* Stats */}
                    <div className="mkt__stats-bar">
                        <div className="mkt__stat">
                            <span className="mkt__stat-val">{stats.beats}</span>
                            <span className="mkt__stat-label">Beats disponíveis</span>
                        </div>
                        <div className="mkt__stat">
                            <span className="mkt__stat-val">{stats.producers}</span>
                            <span className="mkt__stat-label">Produtores</span>
                        </div>
                        <div className="mkt__stat">
                            <span className="mkt__stat-val">{Number(stats.sold).toLocaleString('pt-PT')}</span>
                            <span className="mkt__stat-label">Vendas totais</span>
                        </div>
                    </div>

                    {/* Beat em destaque */}
                    {featured && (
                        <MarketplaceFeatured
                            beat={featured}
                            onCart={toggleCart}
                            inCart={featInCart}
                            onOffer={setOfferBeat}
                        />
                    )}

                    {/* Filtros */}
                    <div className="mkt__filters">
                        <div className="mkt__genre-pills">
                            {genres.map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    className={`mkt__genre-pill${genre === g ? ' mkt__genre-pill--active' : ''}`}
                                    onClick={() => sp('genre', g)}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                        <select
                            className="mkt__sort"
                            value={sort}
                            onChange={e => sp('sort', e.target.value)}
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Grid + Sidebar */}
                    <div className="mkt__split">
                        <MarketplaceGrid
                            beats={filtered}
                            licenses={licenses}
                            playing={playing}
                            onPlay={handlePlay}
                            onLicense={handleLicense}
                            cartIds={cartIds}
                            onCart={toggleCart}
                            onOffer={setOfferBeat}
                        />
                        <aside className="mkt__sidebar">
                            <MarketplaceSidebar
                                cart={cart}
                                onRemove={removeFromCart}
                                onClearCart={clearPurchased}
                                producers={producers}
                            />
                        </aside>
                    </div>

                    {!loading && beats.length === 0 && (
                        <div style={{ padding: '40px 0', color: 'var(--color-ink-mute)', textAlign: 'center' }}>
                            <p style={{ fontSize: 16 }}>Ainda não há beats disponíveis.</p>
                        </div>
                    )}
                </>
            )}

        </AppShell>
    )
}
