import { useState, useEffect } from 'react'
import { FaHeart, FaUserPlus, FaComment, FaTrophy, FaBell,
         FaHandshake, FaCheckCircle, FaTimesCircle, FaShoppingCart } from 'react-icons/fa'
import { API, getToken } from '../../utils/auth.js'
import { timeAgo }       from '../../utils/timeAgo.js'
import './NotificationsPanel.css'

const TYPE_META = {
    LIKE:             { icon: FaHeart,       color: 'var(--color-coral)'    },
    FOLLOW:           { icon: FaUserPlus,    color: 'var(--color-primary)'  },
    COMMENT:          { icon: FaComment,     color: '#60a5fa'                },
    BADGE:            { icon: FaTrophy,      color: '#fbbf24'                },
    SYSTEM:           { icon: FaBell,        color: 'var(--color-ink-mute)' },
    OFFER_RECEIVED:   { icon: FaHandshake,   color: 'var(--color-mustard)'  },
    OFFER_ACCEPTED:   { icon: FaCheckCircle, color: '#10b981'                },
    OFFER_REJECTED:   { icon: FaTimesCircle, color: 'var(--color-coral)'    },
    BEAT_PURCHASED:   { icon: FaShoppingCart,color: '#60a5fa'                },
}

export default function NotificationsPanel({ onClose, onUnreadChange }) {
    const [notifs,  setNotifs]  = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API}/api/notifications`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                setNotifs(Array.isArray(data) ? data : [])
                const unread = Array.isArray(data) ? data.filter(n => !n.read).length : 0
                onUnreadChange?.(unread)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    function markRead(id) {
        fetch(`${API}/api/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}` },
        }).catch(console.error)
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        onUnreadChange?.(prev => Math.max(0, prev - 1))
    }

    function markAllRead() {
        fetch(`${API}/api/notifications/read-all`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}` },
        }).catch(console.error)
        setNotifs(prev => prev.map(n => ({ ...n, read: true })))
        onUnreadChange?.(0)
    }

    const unread = notifs.filter(n => !n.read).length

    return (
        <div className="notif-panel">
            <div className="notif-panel__header">
                <span className="notif-panel__title">Notificações</span>
                {unread > 0 && (
                    <button type="button" className="notif-panel__mark-all" onClick={markAllRead}>
                        Marcar todas como lidas
                    </button>
                )}
            </div>

            {loading && (
                <p className="notif-panel__empty">A carregar…</p>
            )}

            {!loading && notifs.length === 0 && (
                <p className="notif-panel__empty">Sem notificações.</p>
            )}

            {!loading && notifs.length > 0 && (
                <ul className="notif-panel__list">
                    {notifs.map(n => {
                        const meta = TYPE_META[n.type] ?? TYPE_META.SYSTEM
                        const Icon = meta.icon
                        return (
                            <li
                                key={n.id}
                                className={`notif-panel__item${n.read ? '' : ' notif-panel__item--unread'}`}
                                onClick={() => !n.read && markRead(n.id)}
                            >
                                <span className="notif-panel__icon" style={{ color: meta.color }}>
                                    <Icon size={16} />
                                </span>
                                <div className="notif-panel__body">
                                    <span className="notif-panel__msg">{n.message}</span>
                                    <span className="notif-panel__time">{timeAgo(n.createdAt)}</span>
                                </div>
                                {!n.read && <span className="notif-panel__dot" />}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
