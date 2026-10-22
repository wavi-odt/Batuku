import { NavLink, useLocation } from 'react-router-dom'
import { homeData } from '../../data/home'
import { ICONS } from './icons'
import { usePendingComments } from '../../context/PendingCommentsContext'
import { useNotifications } from '../../context/NotificationsContext'
import './BottomNav.css'

export default function BottomNav({ role = 'fan' }) {
    const nav = role === 'admin' ? homeData.adminNav
              : role === 'artist' ? homeData.artistNav
              : homeData.fanNav
    const { count: pendingComments } = usePendingComments()
    const { badgesPerRoute } = useNotifications()
    const location = useLocation()

    const activeIndex = nav.findIndex(item =>
        item.end === false
            ? location.pathname.startsWith(item.to)
            : location.pathname === item.to
    )

    const isProfilePage = location.pathname === '/profile'
        || location.pathname.startsWith('/users/')
        || location.pathname.startsWith('/artists/')

    if (isProfilePage) return null

    return (
        <nav className="bottom-nav" aria-label="Navegação principal">
            <span
                className="bottom-nav__pill"
                style={{
                    width:   `${100 / nav.length}%`,
                    left:    `${(activeIndex / nav.length) * 100}%`,
                    opacity: activeIndex < 0 ? 0 : 1,
                }}
            />
            {nav.map((item) => {
                const Icon = ICONS[item.icon]
                const badge = item.to === '/comments'
                    ? (pendingComments || null)
                    : (badgesPerRoute[item.to] || null)
                return (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end !== false}
                        className={({ isActive }) => 'bottom-nav__item' + (isActive ? ' is-active' : '')}
                    >
                        <span className="bottom-nav__icon">
                            <Icon size={20} />
                            {badge != null && (
                                <span className="bottom-nav__badge">
                                    {badge > 9 ? '9+' : badge}
                                </span>
                            )}
                        </span>
                        <span className="bottom-nav__label">{item.label}</span>
                    </NavLink>
                )
            })}
        </nav>
    )
}
