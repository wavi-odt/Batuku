import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HiHome, HiChevronUp, HiLogout } from 'react-icons/hi'
import { FaSpotify, FaFlag, FaUser } from 'react-icons/fa'
import { getUser, logout } from '../../../utils/auth.js'
import logo from '../../../assets/batuku.png'
import '../../../components/HomeComponents/Sidebar.css'
import './AdminHome.css'

const ADMIN_NAV = [
    { icon: HiHome,    label: 'Dashboard',          to: '/admin',               end: true  },
    { icon: FaSpotify, label: 'Importar artistas',  to: '/admin/artist-import', end: false },
    { icon: FaFlag,    label: 'Reclamações',         to: '/admin/claims',        end: false },
];

export default function AdminShell({ children }) {
    const navigate = useNavigate();
    const user     = getUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        function onClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [menuOpen]);

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <div className="admin-shell">
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

                <div className="sidebar__profile-wrap" ref={menuRef}>
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
        </div>
    );
}
