import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiSearch, HiBell, HiPlus, HiX, HiLogout, HiUser } from 'react-icons/hi'
import { FaUser, FaMusic } from 'react-icons/fa'
import { usePublish } from '../../context/PublishContext.jsx'
import { useNotifications } from '../../context/NotificationsContext.jsx'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { getToken, logout } from '../../utils/auth.js'
import { usePlayer } from '../../context/PlayerContext.jsx'
import NotificationsPanel from './NotificationsPanel.jsx'
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
                : <div className={`topbar__result-img topbar__result-img--placeholder${imgCircle ? ' topbar__result-img--circle' : ''}`}>
                    {imgCircle ? <FaUser size={14} /> : <FaMusic size={12} />}
                  </div>
            }
            <div className="topbar__result-info">
                <span className="topbar__result-name">{name}</span>
                {sub && <span className="topbar__result-sub">{sub}</span>}
            </div>
        </Link>
    );
}

function TrackResultItem({ track, onPlay }) {
    return (
        <button
            type="button"
            className="topbar__result-item"
            onClick={onPlay}
        >
            {track.imageUrl
                ? <img src={track.imageUrl} alt={track.title} className="topbar__result-img" />
                : <div className="topbar__result-img topbar__result-img--placeholder"><FaMusic size={12} /></div>
            }
            <div className="topbar__result-info">
                <span className="topbar__result-name">{track.title}</span>
                {track.artist && <span className="topbar__result-sub">{track.artist}</span>}
            </div>
        </button>
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

export default function TopBar({ role = 'fan' }) {
    const { user: realUser } = useCurrentUser();
    const { openPublish } = usePublish();
    const navigate = useNavigate();
    const { setTrack } = usePlayer();

    const [query,          setQuery]          = useState('');
    const [results,        setResults]        = useState(null);
    const [loading,        setLoading]        = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [picError,       setPicError]       = useState(false);

    const [notifOpen,      setNotifOpen]      = useState(false);
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const notifRef  = useRef(null);
    const avatarRef = useRef(null);
    const { totalUnread: unread, refresh: refreshNotifs } = useNotifications()

    const timerRef   = useRef(null);
    const wrapperRef = useRef(null);
    const inputRef   = useRef(null);

    function handleLogout() {
        setTrack(null);
        logout();
        navigate('/');
    }

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
                `${import.meta.env.VITE_API_BASE_URL}/api/search?q=${encodeURIComponent(q)}`,
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
        setSearchExpanded(false);
    }

    function handleMobileSearchOpen() {
        setSearchExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') handleClose();
    }

    useEffect(() => {
        function onMouseDown(e) {
            if (!wrapperRef.current?.contains(e.target)) {
                handleClose();
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarMenuOpen(false);
            }
        }
        function onScroll() {
            handleClose();
            setNotifOpen(false);
            setAvatarMenuOpen(false);
        }
        document.addEventListener('mousedown', onMouseDown);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, []);

    return (
        <header className={`topbar${searchExpanded ? ' topbar--search-open' : ''}`}>
            <div
                className="topbar__search"
                ref={wrapperRef}
                onClick={!searchExpanded ? handleMobileSearchOpen : undefined}
            >
                <HiSearch size={16} className="topbar__search-icon" />
                <input
                    ref={inputRef}
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

                        {!loading && results && hasResults && (() => {
                            // Utilizadores que fizeram claim de um perfil artista: artistProfileId → user
                            const claimedMap = new Map(
                                (results.users ?? [])
                                    .filter(u => u.artistProfileId)
                                    .map(u => [u.artistProfileId, u])
                            );
                            // IDs de artistas já cobertos por results.artists
                            const artistResultIds = new Set((results.artists ?? []).map(a => a.id));

                            const isMe = (uid) => realUser?.id != null && String(uid) === String(realUser.id);

                            // Secção Artistas:
                            // – artistas do search, substituindo pelo utilizador se tiver claim
                            const artistItems = [
                                ...(results.artists ?? []).map(a => {
                                    const claimed = claimedMap.get(a.id);
                                    return claimed
                                        ? { _key: `u-${claimed.id}`, to: isMe(claimed.id) ? '/profile' : `/users/${claimed.id}`, imageUrl: claimed.imageUrl, name: claimed.name, genre: a.genre }
                                        : { _key: `a-${a.id}`,       to: `/artists/${a.id}`,                                     imageUrl: a.imageUrl,      name: a.name,      genre: a.genre };
                                }),
                                // utilizadores artistas cujo perfil não apareceu em results.artists
                                ...(results.users ?? [])
                                    .filter(u => u.artistProfileId && !artistResultIds.has(u.artistProfileId))
                                    .map(u => ({ _key: `u-${u.id}`, to: isMe(u.id) ? '/profile' : `/users/${u.id}`, imageUrl: u.imageUrl, name: u.name, genre: 'Artista' })),
                            ];

                            // Secção Utilizadores: apenas fãs (sem artistProfileId)
                            const fanItems = (results.users ?? []).filter(u => !u.artistProfileId);

                            return (
                            <>
                                <ResultGroup
                                    label="Artistas"
                                    items={artistItems}
                                    renderItem={a => (
                                        <ResultItem
                                            key={a._key}
                                            to={a.to}
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
                                        <TrackResultItem
                                            key={t.id}
                                            track={t}
                                            onPlay={() => {
                                                if (t.audioUrl || t.spotifyId) {
                                                    setTrack({
                                                        id:              t.id,
                                                        name:            t.title,
                                                        artistName:      t.artist ?? '',
                                                        artistProfileId: t.artistProfileId ?? null,
                                                        coverUrl:        t.imageUrl ?? null,
                                                        audioUrl:        t.audioUrl ?? null,
                                                        spotifyId:       t.spotifyId ?? null,
                                                        durationMs:      t.durationMs ?? null,
                                                        source:          'upload',
                                                        playContext:     'search',
                                                    }, null)
                                                }
                                                handleClose()
                                            }}
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
                                    items={fanItems}
                                    renderItem={u => (
                                        <ResultItem
                                            key={u.id}
                                            to={isMe(u.id) ? '/profile' : `/users/${u.id}`}
                                            img={u.imageUrl}
                                            imgCircle
                                            name={u.name}
                                            sub={u.handle}
                                            onSelect={handleClose}
                                        />
                                    )}
                                />
                            </>
                            );
                        })()}
                    </div>
                )}
            </div>

            <Link to="/home" className="topbar__logo-link">
                <img src="/batuku-logo-H-escuro.svg" alt="Batuku" className="topbar__logo" />
            </Link>

            <div className="topbar__spacer" />

            <div className="topbar__actions">
                {role === 'artist' && (
                    <button type="button" className="topbar__publish" onClick={() => openPublish('track')}>
                        <HiPlus size={16} /> Publicar
                    </button>
                )}

                <div className="topbar__notif-wrap" ref={notifRef}>
                    <button className="topbar__action" aria-label="Notificações" onClick={() => setNotifOpen(v => !v)}>
                        <HiBell size={18} />
                        {unread > 0 && (
                            <span className="topbar__action-badge">
                                {unread > 9 ? '9+' : unread}
                            </span>
                        )}
                    </button>
                    {notifOpen && (
                        <NotificationsPanel onClose={() => setNotifOpen(false)} />
                    )}
                </div>

                <div className="topbar__avatar-wrap" ref={avatarRef}>
                    {avatarMenuOpen && (
                        <div className="topbar__avatar-menu">
                            <Link to="/profile" className="sidebar__menu-header sidebar__menu-header--link" onClick={() => setAvatarMenuOpen(false)}>
                                <div className="sidebar__menu-avatar">
                                    {realUser?.picture && !picError
                                        ? <img src={realUser.picture} alt={realUser?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={() => setPicError(true)} />
                                        : <div className="prof__avatar-placeholder"><FaUser size={16} /></div>}
                                </div>
                                <div>
                                    <div className="sidebar__menu-name">{realUser?.name || ''}</div>
                                    <div className="sidebar__menu-handle">
                                        {realUser?.verified
                                            ? <><span className="sidebar__verified-dot" /> Verificado</>
                                            : realUser?.handle || ''}
                                    </div>
                                </div>
                            </Link>
                            <div className="sidebar__menu-divider" />
                            <Link to="/profile" className="sidebar__menu-item" onClick={() => setAvatarMenuOpen(false)}>
                                <HiUser size={15} /> O meu perfil
                            </Link>
                            <div className="sidebar__menu-divider" />
                            <button className="sidebar__menu-item sidebar__menu-item--danger" onClick={handleLogout}>
                                <HiLogout size={15} /> Terminar sessão
                            </button>
                        </div>
                    )}
                    <button
                        className="topbar__avatar"
                        onClick={() => setAvatarMenuOpen(v => !v)}
                        aria-label="Menu do perfil"
                        aria-expanded={avatarMenuOpen}
                    >
                        {realUser?.picture
                            ? <img src={realUser.picture} alt={realUser?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            : <div className="prof__avatar-placeholder"><FaUser size={16} /></div>}
                    </button>
                </div>
            </div>

        </header>
    );
}
