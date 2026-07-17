/* ─────────────────────────────────────────────────────────────────
   Sidebar.jsx, Navegação lateral. Adapta-se ao role (fan/artist).
   ───────────────────────────────────────────────────────────────── */

import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HiUser, HiShieldCheck, HiLockClosed, HiLogout, HiChevronUp } from 'react-icons/hi'
import { FaCog } from 'react-icons/fa'
import { homeData } from '../../data/home'
import { logout } from '../../utils/auth'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { ICONS } from './icons'
import ArtistArtwork from '../PublicComponets/ArtistArtwork'
import logo from '../../assets/batuku.png'
import './Sidebar.css'

const menuItems = (role) => [
    { icon: HiUser,        label: 'O meu perfil',  to: '/profile' },
    { icon: FaCog,         label: 'Definições',    to: '/settings' },
    { icon: HiShieldCheck, label: 'Privacidade',   to: '/privacy-settings' },
    { icon: HiLockClosed,  label: 'Segurança',     to: '/security' },
];

export default function Sidebar({ role = 'fan' }) {
    const nav      = role === 'artist' ? homeData.artistNav : homeData.fanNav;
    const mockUser = role === 'artist' ? homeData.artist    : homeData.fan;
    const realUser = useCurrentUser();

    const user = {
        ...mockUser,
        ...(realUser?.name   && { name:   realUser.name }),
        ...(realUser?.handle && { handle: realUser.handle }),
    };

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!menuOpen) return;
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpen]);

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <aside className="sidebar">

            <NavLink to={role === 'artist' ? '/dashboard' : '/home'} className="sidebar__brand">
                <img src={logo} alt="Batuku" className="sidebar__logo" />
                <span className="sidebar__brand-name">Batuku</span>
            </NavLink>

            <nav className="sidebar__nav" aria-label="Principal">
                <div className="sidebar__section-label">Menu</div>
                {nav.map((item) => {
                    const Icon = ICONS[item.icon];
                    return (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) => 'sidebar__item' + (isActive ? ' is-active' : '')}
                            end
                        >
                            <span className="sidebar__item-icon"><Icon size={18} /></span>
                            <span className="sidebar__item-label">{item.label}</span>
                            {item.badge != null && (
                                <span className="sidebar__item-badge">{item.badge}</span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* ─── Profile card + popup menu ─────────────────────── */}
            <div className="sidebar__profile-wrap" ref={menuRef}>

                {menuOpen && (
                    <div className="sidebar__menu">
                        <div className="sidebar__menu-header">
                            <div className="sidebar__menu-avatar">
                                {realUser?.picture
                                    ? <img src={realUser.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    : <ArtistArtwork shape={user.avatar.shape} hue={user.avatar.hue} rounded={0} />}
                            </div>
                            <div>
                                <div className="sidebar__menu-name">{user.name}</div>
                                <div className="sidebar__menu-handle">{user.handle}</div>
                            </div>
                        </div>

                        <div className="sidebar__menu-divider" />

                        {menuItems(role).map(({ icon: Icon, label, to }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className="sidebar__menu-item"
                                onClick={() => setMenuOpen(false)}
                            >
                                <Icon size={15} />
                                {label}
                            </NavLink>
                        ))}

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
                    <div className="sidebar__profile-avatar">
                        {realUser?.picture
                            ? <img src={realUser.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            : <ArtistArtwork shape={user.avatar.shape} hue={user.avatar.hue} rounded={0} />}
                    </div>
                    <div className="sidebar__profile-info">
                        <div className="sidebar__profile-name">{user.name}</div>
                        <div className="sidebar__profile-sub">
                            {role === 'artist' && user.isVerified
                                ? <><span className="sidebar__verified-dot" /> Verificado</>
                                : `Nível ${user.level}`}
                        </div>
                    </div>
                    <HiChevronUp
                        size={14}
                        className={'sidebar__profile-chevron' + (menuOpen ? ' is-open' : '')}
                    />
                </button>
            </div>
        </aside>
    );
}
