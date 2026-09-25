import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { API, getToken } from '../utils/auth'
import { useToast } from './ToastContext'

const TYPE_TO_ROUTE = {
    BADGE:               '/achievements',
    CHALLENGE_COMPLETED: '/achievements',
    LEVEL_UP:            '/achievements',
    BEAT_PURCHASED:      '/marketplace',
    OFFER_RECEIVED:      '/marketplace',
    OFFER_ACCEPTED:      '/marketplace',
    OFFER_REJECTED:      '/marketplace',
}

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([])
    const stompRef = useRef(null)
    const { showToast } = useToast()

    const fetchAll = useCallback(() => {
        if (!getToken()) return Promise.resolve()
        return fetch(`${API}/api/notifications`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setNotifications(Array.isArray(data) ? data : []))
            .catch(() => {})
    }, [])

    // Carga inicial via REST + polling de fallback a cada 60s
    useEffect(() => {
        fetchAll()
        const id = setInterval(fetchAll, 60_000)
        return () => clearInterval(id)
    }, [fetchAll])

    // Refresca ao voltar ao separador
    useEffect(() => {
        window.addEventListener('focus', fetchAll)
        return () => window.removeEventListener('focus', fetchAll)
    }, [fetchAll])

    // Ligação WebSocket STOMP
    useEffect(() => {
        function connect() {
            if (!getToken()) return
            if (stompRef.current?.active) return

            const wsUrl = `${API.replace(/^http/, 'ws')}/ws`
            const client = new Client({
                brokerURL: wsUrl,
                connectHeaders: { Authorization: `Bearer ${getToken()}` },
                reconnectDelay: 5000,
                onConnect: () => {
                    console.log('[WS] STOMP ligado')
                    client.subscribe('/user/queue/notifications', msg => {
                        try {
                            const notif = JSON.parse(msg.body)
                            setNotifications(prev => [notif, ...prev])
                            showToast(notif.message, 'info')
                        } catch (e) {
                            console.error('[WS] Erro ao processar notificação:', e)
                        }
                    })
                },
                onDisconnect: () => {
                    console.warn('[WS] STOMP desligado')
                },
                onStompError: (frame) => {
                    console.error('[WS] STOMP error:', frame.headers?.message, frame.body)
                },
                onWebSocketError: (evt) => {
                    console.error('[WS] WebSocket error:', evt)
                },
            })

            client.activate()
            stompRef.current = client
        }

        // Tenta ligar imediatamente (caso o utilizador já esteja autenticado)
        connect()

        // Liga após login (o provider pode montar antes do utilizador autenticar)
        const handleLogin = () => { fetchAll(); connect() }
        window.addEventListener('batuku:login', handleLogin)

        return () => {
            window.removeEventListener('batuku:login', handleLogin)
            stompRef.current?.deactivate()
        }
    }, [fetchAll])

    const badgesPerRoute = {}
    for (const n of notifications) {
        if (n.read) continue
        const route = TYPE_TO_ROUTE[n.type]
        if (route) badgesPerRoute[route] = (badgesPerRoute[route] ?? 0) + 1
    }

    const totalUnread = notifications.filter(n => !n.read).length

    const markRead = useCallback((id) => {
        fetch(`${API}/api/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}` },
        }).catch(() => {})
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }, [])

    const markAllRead = useCallback(() => {
        fetch(`${API}/api/notifications/read-all`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}` },
        }).catch(() => {})
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }, [])

    const clearRouteNotifications = useCallback((route) => {
        setNotifications(prev => {
            const toMark = prev.filter(n => !n.read && TYPE_TO_ROUTE[n.type] === route)
            if (toMark.length === 0) return prev
            for (const n of toMark) {
                fetch(`${API}/api/notifications/${n.id}/read`, {
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${getToken()}` },
                }).catch(() => {})
            }
            return prev.map(n =>
                !n.read && TYPE_TO_ROUTE[n.type] === route ? { ...n, read: true } : n
            )
        })
    }, [])

    return (
        <NotificationsContext.Provider value={{
            notifications,
            badgesPerRoute,
            totalUnread,
            markRead,
            markAllRead,
            clearRouteNotifications,
            refresh: fetchAll,
        }}>
            {children}
        </NotificationsContext.Provider>
    )
}

export function useNotifications() {
    return useContext(NotificationsContext)
}
