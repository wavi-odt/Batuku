import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaPlay, FaLock, FaGlobe, FaHeart, FaMusic, FaEllipsisH, FaPen, FaTrash, FaBookmark } from 'react-icons/fa'

function CoverPlaceholder() {
    return (
        <div className="lib__pl-cover-empty">
            <FaMusic size={26} />
        </div>
    );
}

function FavoritosCard({ playlist }) {
    const to    = playlist ? `/playlists/${playlist.id}` : '#';
    const count = playlist?.trackCount ?? 0;
    return (
        <Link to={to} className="lib__pl-card lib__pl-card--fav">
            <div className="lib__pl-cover lib__pl-cover--fav">
                <FaHeart className="lib__pl-fav-icon" />
                <span className="lib__pl-play" aria-hidden="true">
                    <FaPlay size={11} />
                </span>
            </div>
            <div className="lib__pl-title">Favoritos</div>
            <div className="lib__pl-meta">
                <FaLock size={9} /> Privada · {count} {count === 1 ? 'faixa' : 'faixas'}
            </div>
        </Link>
    );
}

function PlaylistCard({ pl, onEdit, onDelete, onToggleVisibility, onUnsave }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        function handle(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        }
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [menuOpen]);

    return (
        <div className="lib__pl-card">
            <div className="lib__pl-cover-wrap">
                <Link to={`/playlists/${pl.id}`} className="lib__pl-cover lib__pl-cover--img">
                    {pl.coverUrl
                        ? <img src={pl.coverUrl} alt={pl.name} className="lib__pl-cover-img" />
                        : <CoverPlaceholder />
                    }
                    <span className="lib__pl-play" aria-hidden="true">
                        <FaPlay size={11} />
                    </span>
                </Link>

                <div
                    className={'lib__pl-menu trk-menu' + (menuOpen ? ' lib__pl-menu--open' : '')}
                    ref={menuRef}
                >
                    <button
                        type="button"
                        className={'trk-menu__btn' + (menuOpen ? ' trk-menu__btn--open' : '')}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(v => !v); }}
                        aria-label="Mais opções"
                    >
                        <FaEllipsisH size={13} />
                    </button>

                    {menuOpen && (
                        <div className="trk-menu__popover lib__pl-menu__popover" onClick={e => e.stopPropagation()}>
                            {pl.owner ? (
                                <>
                                    <button
                                        type="button"
                                        className="trk-menu__item"
                                        onClick={() => { setMenuOpen(false); onEdit(pl); }}
                                    >
                                        <div className="trk-menu__pl-cover trk-menu__create-icon">
                                            <FaPen size={10} />
                                        </div>
                                        <span className="trk-menu__pl-name">Editar playlist</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="trk-menu__item"
                                        onClick={() => { setMenuOpen(false); onToggleVisibility(pl); }}
                                    >
                                        <div className="trk-menu__pl-cover trk-menu__create-icon">
                                            {pl.isPublic ? <FaLock size={10} /> : <FaGlobe size={10} />}
                                        </div>
                                        <span className="trk-menu__pl-name">
                                            {pl.isPublic ? 'Tornar privada' : 'Tornar pública'}
                                        </span>
                                    </button>
                                    <div className="trk-menu__divider" />
                                    <button
                                        type="button"
                                        className="trk-menu__item trk-menu__item--remove"
                                        onClick={() => { setMenuOpen(false); onDelete(pl); }}
                                    >
                                        <div className="trk-menu__pl-cover trk-menu__remove-icon">
                                            <FaTrash size={10} />
                                        </div>
                                        <span className="trk-menu__pl-name">Remover playlist</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="trk-menu__item trk-menu__item--remove"
                                    onClick={() => { setMenuOpen(false); onUnsave(pl); }}
                                >
                                    <div className="trk-menu__pl-cover trk-menu__remove-icon">
                                        <FaBookmark size={10} />
                                    </div>
                                    <span className="trk-menu__pl-name">Remover da biblioteca</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Link to={`/playlists/${pl.id}`} className="lib__pl-card-body">
                <div className="lib__pl-title">{pl.name}</div>
                <div className="lib__pl-meta">
                    {pl.isPublic ? <FaGlobe size={9} /> : <FaLock size={9} />}
                    {pl.isPublic ? 'Pública' : 'Privada'} · {pl.trackCount ?? 0} {pl.trackCount === 1 ? 'faixa' : 'faixas'}
                </div>
            </Link>
        </div>
    );
}

export default function LibraryPlaylists({ playlists, loading, onNew, onEdit, onDelete, onToggleVisibility, onUnsave }) {
    if (loading) {
        return (
            <div style={{ padding: '20px 0', color: 'var(--color-ink-mute)', fontSize: 'var(--fs-sm)' }}>
                A carregar playlists…
            </div>
        );
    }

    const favoritos = playlists.find(p => p.systemGenerated);
    const mine      = playlists.filter(p => p.owner && !p.systemGenerated);
    const saved     = playlists.filter(p => !p.owner);

    return (
        <>
            <section className="home__section">
                <div className="home__section-head">
                    <div>
                        <h2 className="home__section-title">As minhas playlists</h2>
                        <div className="home__section-sub">{mine.length + 1} playlists criadas</div>
                    </div>
                    <button type="button" className="home__section-link" onClick={onNew}>Nova +</button>
                </div>
                <div className="lib__playlist-grid">
                    <FavoritosCard playlist={favoritos} />
                    {mine.map(pl => (
                        <PlaylistCard key={pl.id} pl={pl} onEdit={onEdit} onDelete={onDelete} onToggleVisibility={onToggleVisibility} onUnsave={onUnsave} />
                    ))}
                </div>
            </section>

            <section className="home__section">
                <div className="home__section-head">
                    <div>
                        <h2 className="home__section-title">Playlists guardadas</h2>
                        <div className="home__section-sub">
                            {saved.length > 0
                                ? `${saved.length} ${saved.length === 1 ? 'playlist guardada' : 'playlists guardadas'}`
                                : 'Playlists de outros utilizadores que guardas aqui'
                            }
                        </div>
                    </div>
                </div>
                {saved.length === 0 ? (
                    <div className="lib__saved-empty">
                        <FaMusic size={18} />
                        <span>Ainda não guardaste nenhuma playlist.</span>
                    </div>
                ) : (
                    <div className="lib__playlist-grid">
                        {saved.map(pl => (
                            <PlaylistCard key={pl.id} pl={pl} onEdit={onEdit} onDelete={onDelete} onToggleVisibility={onToggleVisibility} onUnsave={onUnsave} />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
