/* ─────────────────────────────────────────────────────────────────
   pages/fan/marketplace/Marketplace.jsx, Marketplace de Beats.
   ───────────────────────────────────────────────────────────────── */

import { useState, useMemo }   from 'react'
import { FaSearch }            from 'react-icons/fa'
import AppShell                from '../../../../components/HomeComponents/AppShell.jsx'
import { marketplaceData }     from '../../../../data/marketplace.js'
import MarketplaceFeatured     from './MarketplaceFeatured.jsx'
import MarketplaceGrid         from './MarketplaceGrid.jsx'
import MarketplaceSidebar      from './MarketplaceSidebar.jsx'
import './Marketplace.css'

const d = marketplaceData;

export default function Marketplace() {
    const [query,   setQuery]   = useState('');
    const [genre,   setGenre]   = useState('Todos');
    const [sort,    setSort]    = useState('newest');
    const [playing, setPlaying] = useState(null);

    /* Licença selecionada por beat: { [beatId]: 'lease'|'premium'|'exclusive' } */
    const [licenses, setLicenses] = useState({});
    const getLicense = id => licenses[id] ?? 'lease';

    const handleLicense = (beatId, lic) => {
        setLicenses(prev => ({ ...prev, [beatId]: lic }));
    };

    /* Carrinho: array de { beat, license, price } — um item por beat */
    const [cart, setCart] = useState([]);
    const cartIds = useMemo(() => new Set(cart.map(i => i.beat.id)), [cart]);

    const toggleCart = (beat, license, price) => {
        setCart(prev => {
            if (prev.some(i => i.beat.id === beat.id)) {
                return prev.filter(i => i.beat.id !== beat.id);
            }
            return [...prev, { beat, license, price }];
        });
    };

    const removeFromCart = beatId => setCart(prev => prev.filter(i => i.beat.id !== beatId));

    /* Beats filtrados + ordenados */
    const filtered = useMemo(() => {
        let list = d.beats;

        if (genre !== 'Todos') {
            list = list.filter(b => b.genre === genre);
        }
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.producer.toLowerCase().includes(q) ||
                b.genre.toLowerCase().includes(q)
            );
        }

        return [...list].sort((a, b) => {
            switch (sort) {
                case 'popular':    return b.sales - a.sales;
                case 'price_asc':  return a.prices.lease - b.prices.lease;
                case 'price_desc': return b.prices.lease - a.prices.lease;
                case 'bpm_asc':    return a.bpm - b.bpm;
                default:           return 0; /* 'newest' — mantém ordem do array */
            }
        });
    }, [genre, query, sort]);

    const featCartIn = cartIds.has(d.featured.id);

    return (
        <AppShell>

            {/* ─── Header ───────────────────────────────────────── */}
            <div className="mkt__header">
                <div>
                    <h1 className="mkt__title">Marketplace</h1>
                    <p className="mkt__subtitle">Compra e vende beats cabo-verdianos</p>
                </div>
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
            </div>

            {/* ─── Stats ────────────────────────────────────────── */}
            <div className="mkt__stats-bar">
                <div className="mkt__stat">
                    <span className="mkt__stat-val">{d.stats.beats}</span>
                    <span className="mkt__stat-label">Beats disponíveis</span>
                </div>
                <div className="mkt__stat">
                    <span className="mkt__stat-val">{d.stats.producers}</span>
                    <span className="mkt__stat-label">Produtores</span>
                </div>
                <div className="mkt__stat">
                    <span className="mkt__stat-val">{d.stats.sold.toLocaleString('pt-PT')}</span>
                    <span className="mkt__stat-label">Vendas totais</span>
                </div>
            </div>

            {/* ─── Beat em destaque ─────────────────────────────── */}
            <MarketplaceFeatured
                beat={d.featured}
                onCart={toggleCart}
                inCart={featCartIn}
            />

            {/* ─── Filtros ──────────────────────────────────────── */}
            <div className="mkt__filters">
                <div className="mkt__genre-pills">
                    {d.genres.map(g => (
                        <button
                            key={g}
                            type="button"
                            className={`mkt__genre-pill${genre === g ? ' mkt__genre-pill--active' : ''}`}
                            onClick={() => setGenre(g)}
                        >
                            {g}
                        </button>
                    ))}
                </div>
                <select
                    className="mkt__sort"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    {d.sortOptions.map(o => (
                        <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* ─── Grid + Sidebar ───────────────────────────────── */}
            <div className="mkt__split">
                <MarketplaceGrid
                    beats={filtered}
                    licenses={licenses}
                    playing={playing}
                    onPlay={setPlaying}
                    onLicense={handleLicense}
                    cartIds={cartIds}
                    onCart={toggleCart}
                />

                <aside className="mkt__sidebar">
                    <MarketplaceSidebar
                        cart={cart}
                        onRemove={removeFromCart}
                        producers={d.producers}
                    />
                </aside>
            </div>

        </AppShell>
    );
}
