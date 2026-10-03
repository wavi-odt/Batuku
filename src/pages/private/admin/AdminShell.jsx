import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HiHome, HiChevronUp, HiLogout } from 'react-icons/hi'
import { FaSpotify, FaFlag, FaUser } from 'react-icons/fa'
import { logout } from '../../../utils/auth.js'
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import BottomNav from '../../../components/HomeComponents/BottomNav.jsx'
import logo from '../../../assets/batuku.png'
import '../../../components/HomeComponents/Sidebar.css'
import '../../../components/HomeComponents/TopBar.css'
import './AdminHome.css'

const ADMIN_NAV = [
    { icon: HiHome,    label: 'Dashboard',          to: '/admin',               end: true  },
    { icon: FaSpotify, label: 'Importar artistas',  to: '/admin/artist-import', end: false },
    { icon: FaFlag,    label: 'Reclamações',         to: '/admin/claims',        end: false },
];

export default function AdminShell({ children }) {
    const navigate = useNavigate();
    const { user, isLoading: userLoading } = useCurrentUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [topbarMenuOpen, setTopbarMenuOpen] = useState(false);
    const topbarAvatarRef = useRef(null);

    useEffect(() => {
        function onClickOutside(e) {
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
            if (topbarMenuOpen && topbarAvatarRef.current && !topbarAvatarRef.current.contains(e.target)) setTopbarMenuOpen(false);
        }
        function onScroll() {
            setMenuOpen(false);
            setTopbarMenuOpen(false);
        }
        document.addEventListener('mousedown', onClickOutside);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, [menuOpen, topbarMenuOpen]);

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <div className="admin-shell">
            <header className="topbar admin-topbar">
                <NavLink to="/admin" className="sidebar__brand">
                    <img src={logo} alt="Batuku" className="sidebar__logo" />
                    <span className="sidebar__brand-name">Admin</span>
                </NavLink>
                <div className="topbar__avatar-wrap" ref={topbarAvatarRef} style={{ marginLeft: 'auto' }}>
                    {topbarMenuOpen && (
                        <div className="topbar__avatar-menu">
                            <div className="sidebar__menu-header">
                                <div className="sidebar__menu-avatar admin-shell__avatar-placeholder">
                                    <FaUser size={16} />
                                </div>
                                <div>
                                    <div className="sidebar__menu-name">{user?.name || 'Admin'}</div>
                                    <div className="sidebar__menu-handle">{user?.handle || ''}</div>
                                </div>
                            </div>
                            <div className="sidebar__menu-divider" />
                            <button className="sidebar__menu-item sidebar__menu-item--danger" onClick={handleLogout}>
                                <HiLogout size={15} /> Terminar sessão
                            </button>
                        </div>
                    )}
                    <button
                        className="topbar__avatar"
                        onClick={() => setTopbarMenuOpen(v => !v)}
                        aria-label="Menu do perfil"
                        aria-expanded={topbarMenuOpen}
                    >
                        <div className="admin-shell__avatar-placeholder" style={{ width: '100%', height: '100%' }}>
                            <FaUser size={16} />
                        </div>
                    </button>
                </div>
            </header>

            <aside className="sidebar">
                <NavLink to="/admin" className="sidebar__brand">
                    <img src={logo} alt="Batuku" className="sidebar__logo" />
                    <span className="sidebar__brand-name">Batuku</span>
                </NavLink>

                <nav className="sidebar__nav" aria-label="Administração">
                    <div className="sidebar__section-label">Admin</div>
                    {ADMIN_NAV.map(({ icon: Icon, label, to, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => 'sidebar__item' + (isActive ? ' is-active' : '')}
                        >
                            <span className="sidebar__item-icon"><Icon size={18} /></span>
                            <span className="sidebar__item-label">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar__profile-wrap" ref={menuRef} style={{ marginTop: 'auto', position: 'relative' }}>
                    {menuOpen && (
                        <div className="sidebar__menu">
                            <div className="sidebar__menu-header">
                                <div className="sidebar__menu-avatar admin-shell__avatar-placeholder">
                                    <FaUser size={16} />
                                </div>
                                <div>
                                    <div className="sidebar__menu-name">{user?.name || 'Admin'}</div>
                                    <div className="sidebar__menu-handle">{user?.handle || ''}</div>
                                </div>
                            </div>
                            <div className="sidebar__menu-divider" />
                            <button className="sidebar__menu-item sidebar__menu-item--danger" onClick={handleLogout}>
                                <HiLogout size={15} />
                                Terminar sessão
                            </button>
                        </div>
                    )}

                    <button
                        className={'sidebar__profile' + (menuOpen ? ' is-open' : '')}
                        onClick={() => setMenuOpen(v => !v)}
                        aria-expanded={menuOpen}
                        aria-label="Menu do perfil"
                        style={{ marginTop: 0 }}
                    >
                        <div className="sidebar__profile-avatar admin-shell__avatar-placeholder">
                            <FaUser size={16} />
                        </div>
                        <div className="sidebar__profile-info">
                            <div className="sidebar__profile-name">{user?.name || 'Admin'}</div>
                            <div className="sidebar__profile-sub">Administrador</div>
                        </div>
                        <HiChevronUp
                            size={14}
                            className={'sidebar__profile-chevron' + (menuOpen ? ' is-open' : '')}
                        />
                    </button>
                </div>
            </aside>

            <main className="admin-shell__main">
                {children}
            </main>

            <BottomNav role="admin" />
        </div>
    );
}
