import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API, getToken, getRole } from '../utils/auth'

const Ctx = createContext({ count: null, decrement: () => {}, refresh: () => {} })

export function PendingCommentsProvider({ children }) {
    const [count, setCount] = useState(null)

    const refresh = useCallback(() => {
        if (getRole() !== 'artist') return
        const token = getToken()
        if (!token) return
        fetch(`${API}/api/comments/artist`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : [])
            .then(list => setCount(Array.isArray(list) ? list.filter(c => !c.reply).length : 0))
            .catch(() => {})
    }, [])

    useEffect(() => {
        refresh()
        window.addEventListener('batuku:login', refresh)
        return () => window.removeEventListener('batuku:login', refresh)
    }, [refresh])

    const decrement = useCallback(() => {
        setCount(prev => (prev != null && prev > 0) ? prev - 1 : 0)
    }, [])

    return <Ctx.Provider value={{ count, decrement, refresh }}>{children}</Ctx.Provider>
}

export const usePendingComments = () => useContext(Ctx)
