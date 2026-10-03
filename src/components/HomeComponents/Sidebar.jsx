/* ─────────────────────────────────────────────────────────────────
   Sidebar.jsx, Navegação lateral. Adapta-se ao role (fan/artist).
   ───────────────────────────────────────────────────────────────── */

import { NavLink } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { homeData } from '../../data/home'
import { usePendingComments } from '../../context/PendingCommentsContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { ICONS } from './icons'
import logo from '../../assets/batuku.png'
import './Sidebar.css'

export default function Sidebar({ role = 'fan' }) {
    const nav      = role === 'artist' ? homeData.artistNav : homeData.fanNav;
    const { user: realUser } = useCurrentUser();
    const { count: pendingComments } = usePendingComments();
    const { badgesPerRoute } = useNotifications();

    const user = {
        name:     realUser?.name     ?? null,
        handle:   realUser?.handle   ?? null,
        verified: realUser?.verified ?? false,
    };

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
                    const badge = item.to === '/comments'
                        ? (pendingComments || null)
                        : (badgesPerRoute[item.to] || null);
                    return (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) => 'sidebar__item' + (isActive ? ' is-active' : '')}
                            end
                        >
                            <span className="sidebar__item-icon"><Icon size={18} /></span>
                            <span className="sidebar__item-label">{item.label}</span>
                            {badge != null && (
                                <span className="sidebar__item-badge">{badge}</span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* ─── Profile card (link direto) ────────────────────── */}
            <NavLink to="/profile" className="sidebar__profile" aria-label="O meu perfil">
                <div className="sidebar__profile-avatar">
                    {realUser?.picture
                        ? <img src={realUser.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        : <div className="prof__avatar-placeholder"><FaUser size={16} /></div>}
                </div>
                <div className="sidebar__profile-info">
                    <div className="sidebar__profile-name">{user.name}</div>
                    <div className="sidebar__profile-sub">
                        {user.verified
                            ? <><span className="sidebar__verified-dot" /> Verificado</>
                            : user.handle ?? ''}
                    </div>
                </div>
            </NavLink>
        </aside>
    );
}
