/* ─────────────────────────────────────────────────────────────────
   FansTable.jsx, Lista de fãs com search / sort / tier filter.
   ───────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react'
import { FaSearch }          from 'react-icons/fa'
import ArtistArtwork         from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { fansData }          from '../../../../data/fans.js'

const TIER_TABS = [
    { key: 'all',      label: 'Todos'     },
    { key: 'superfan', label: 'Superfãs'  },
    { key: 'regular',  label: 'Regulares' },
    { key: 'casual',   label: 'Ocasionais'},
];

const TIER_LABELS = {
    superfan: 'Superfã',
    regular:  'Regular',
    casual:   'Ocasional',
};

export default function FansTable() {
    const [query, setQuery]   = useState('');
    const [tier,  setTier]    = useState('all');
    const [sort,  setSort]    = useState('plays');

    const filtered = useMemo(() => {
        let list = fansData.fans;

        if (tier !== 'all')
            list = list.filter(f => f.tier === tier);

        if (query.trim())
            list = list.filter(f =>
                f.name.toLowerCase().includes(query.toLowerCase()) ||
                f.handle.toLowerCase().includes(query.toLowerCase())
            );

        list = [...list].sort((a, b) => {
            if (sort === 'plays')      return b.plays - a.plays;
            if (sort === 'likes')      return b.likes - a.likes;
            if (sort === 'comments')   return b.comments - a.comments;
            if (sort === 'recent')     return new Date(b.followedAt) - new Date(a.followedAt);
            if (sort === 'lastActive') return a.lastActive.localeCompare(b.lastActive);
            return 0;
        });

        return list;
    }, [query, tier, sort]);

    return (
        <div>
            {/* Toolbar */}
            <div className="fns__toolbar">
                <div className="fns__search-wrap">
                    <FaSearch className="fns__search-icon" />
                    <input
                        className="fns__search"
                        placeholder="Pesquisar fã..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>

                <div className="fns__tier-tabs">
                    {TIER_TABS.map(t => (
                        <button
                            key={t.key}
                            type="button"
                            className={`fns__tier-tab${tier === t.key ? ' fns__tier-tab--active' : ''}`}
                            onClick={() => setTier(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <select
                    className="fns__sort"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    {fansData.sortOptions.map(o => (
                        <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="fns__table">
                {/* Head */}
                <div className="fns__row fns__row--head">
                    <div />
                    <div className="fns__col fns__col--left">Fã</div>
                    <div className="fns__col fns__col--left">Tier</div>
                    <div className="fns__col">Reprod.</div>
                    <div className="fns__col">❤</div>
                    <div className="fns__col">💬</div>
                    <div className="fns__col">🔖</div>
                    <div className="fns__col">Ativo</div>
                </div>

                {filtered.length === 0 && (
                    <div className="fns__empty">Nenhum fã encontrado.</div>
                )}

                {filtered.map(fan => (
                    <div key={fan.id} className="fns__row">
                        {/* Avatar */}
                        <div className="fns__avatar">
                            <ArtistArtwork
                                shape={fan.shape}
                                hue={fan.hue}
                                image={fan.image}
                                rounded={0}
                                showGloss={false}
                            />
                        </div>

                        {/* Name / handle */}
                        <div className="fns__fan-info">
                            <div className="fns__fan-name">
                                {fan.name}
                                {fan.isNew && <span className="fns__new-badge">novo</span>}
                            </div>
                            <div className="fns__fan-handle">{fan.handle}</div>
                        </div>

                        {/* Tier */}
                        <div>
                            <span className={`fns__tier fns__tier--${fan.tier}`}>
                                {TIER_LABELS[fan.tier]}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="fns__col">{fan.plays}</div>
                        <div className="fns__col">{fan.likes}</div>
                        <div className="fns__col">{fan.comments}</div>
                        <div className="fns__col">{fan.saves}</div>

                        {/* Last active */}
                        <div className="fns__active">{fan.lastActive}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
