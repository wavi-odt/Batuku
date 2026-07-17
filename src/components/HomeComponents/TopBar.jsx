import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiSearch, HiBell, HiPlus, HiX } from 'react-icons/hi'
import { homeData } from '../../data/home'
import ArtistArtwork from '../PublicComponets/ArtistArtwork'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { getToken } from '../../utils/auth.js'
import './TopBar.css'

const DEBOUNCE_MS  = 350;
const MIN_QUERY    = 2;

function ResultItem({ to, img, imgCircle, name, sub, onSelect }) {
    return (
        <Link
            to={to}
            className="topbar__result-item"
            onClick={onSelect}
        >
            {img
                ? <img
                    src={img}
                    alt={name}
                    className={`topbar__result-img${imgCircle ? ' topbar__result-img--circle' : ''}`}
                  />
                : <div className={`topbar__result-img topbar__result-img--placeholder${imgCircle ? ' topbar__result-img--circle' : ''}`} />
            }
            <div className="topbar__result-info">
                <span className="topbar__result-name">{name}</span>
                {sub && <span className="topbar__result-sub">{sub}</span>}
            </div>
        </Link>
    );
}

function ResultGroup({ label, items, renderItem }) {
    if (!items?.length) return null;
    return (
        <div className="topbar__result-group">
            <div className="topbar__result-label">{label}</div>
            {items.map(renderItem)}
        </div>
    );
}

export default function TopBar({ role = 'fan', notifications = true }) {
    const mockUser = role === 'artist' ? homeData.artist : homeData.fan;
    const realUser = useCurrentUser();
    const user     = mockUser;

    const [query,   setQuery]   = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const timerRef   = useRef(null);
    const wrapperRef = useRef(null);

    const placeholder = role === 'artist'
        ? 'Procurar nas tuas faixas, fãs, comentários…'
        : 'Procurar artistas, faixas, géneros…';

    const isOpen = query.length >= MIN_QUERY;
    const hasResults = results && (
        results.artists?.length   > 0 ||
        results.tracks?.length    > 0 ||
        results.playlists?.length > 0 ||
        results.users?.length     > 0
    );

    async function doSearch(q) {
        try {
            const res = await fetch(
                `http://localhost:8080/api/search?q=${encodeURIComponent(q)}`,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            if (!res.ok) throw new Error();
            setResults(await res.json());
        } catch {
            setResults({ artists: [], tracks: [], playlists: [], users: [] });
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const q = e.target.value;
        setQuery(q);
        clearTimeout(timerRef.current);
        if (q.length < MIN_QUERY) {
            setResults(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        timerRef.current = setTimeout(() => doSearch(q), DEBOUNCE_MS);
    }

    function handleClose() {
        clearTimeout(timerRef.current);
        setQuery('');
        setResults(null);
        setLoading(false);
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') handleClose();
    }

    useEffect(() => {
        function onMouseDown(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                handleClose();
            }
        }
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, []);

    return (
        <header className="topbar">
            <div className="topbar__search" ref={wrapperRef}>
                <HiSearch size={16} className="topbar__search-icon" />
                <input
                    type="search"
                    className="topbar__search-input"
                    placeholder={placeholder}
                    aria-label="Pesquisar"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                {query && (
                    <button
                        className="topbar__search-clear"
                        onClick={handleClose}
                        aria-label="Limpar pesquisa"
                        tabIndex={-1}
                    >
                        <HiX size={12} />
                    </button>
                )}

                {isOpen && (
                    <div className="topbar__dropdown" role="listbox" aria-label="Resultados da pesquisa">
                        {loading && (
                            <div className="topbar__result-empty">A pesquisar…</div>
                        )}

                        {!loading && results && !hasResults && (
                            <div className="topbar__result-empty">Sem resultados para "{query}"</div>
                        )}

                        {!loading && results && hasResults && (
                            <>
                                <ResultGroup
                                    label="Artistas"
                                    items={results.artists}
                                    renderItem={a => (
                                        <ResultItem
                                            key={a.id}
                                            to={`/artists/${a.id}`}
                                            img={a.imageUrl}
                                            imgCircle
                                            name={a.name}
                                            sub={a.genre}
                                            onSelect={handleClose}
                                        />
                                    )}
                                />
                                <ResultGroup
                                    label="Faixas"
                                    items={results.tracks}
                                    renderItem={t => (
                                        <ResultItem
                                            key={t.id}
                                            to={`/tracks/${t.id}`}
                                            img={t.imageUrl}
                                            name={t.title}
                                            sub={t.duration ? `${t.artist} · ${t.duration}` : t.artist}
                                            onSelect={handleClose}
                                        />
                                    )}
                                />
                                <ResultGroup
                                    label="Playlists"
                                    items={results.playlists}
                                    renderItem={p => (
                                        <ResultItem
                                            key={p.id}
                                            to={`/playlists/${p.id}`}
                                            img={p.imageUrl}
                                            name={p.name}
                                            sub={p.trackCount != null ? `${p.trackCount} faixas` : undefined}
                                            onSelect={handleClose}
                                        />
                                    )}
                                />
                                <ResultGroup
                                    label="Utilizadores"
                                    items={results.users}
                                    renderItem={u => (
                                        <ResultItem
                                            key={u.id}
                                            to={`/users/${u.id}`}
                                            img={u.imageUrl}
                                            imgCircle
                                            name={u.name}
                                            sub={u.handle}
                                            onSelect={handleClose}
                                        />
                                    )}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="topbar__spacer" />

            {role === 'artist' && (
                <Link to="/publish" className="topbar__publish">
                    <HiPlus size={16} /> Publicar
                </Link>
            )}

            <button className="topbar__action" aria-label="Notificações">
                <HiBell size={18} />
                {notifications && <span className="topbar__action-dot" />}
            </button>

            <Link to={role === 'artist' ? '/artist/profile' : '/profile'} className="topbar__avatar" aria-label="O meu perfil">
                {realUser?.picture
                    ? <img src={realUser.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    : <ArtistArtwork shape={user.avatar.shape} hue={user.avatar.hue} rounded={0} />}
            </Link>
        </header>
    );
}
