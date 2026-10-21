import { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react'
import { API, getToken } from '../utils/auth'

export function createLikeStore(endpoint, { onToggle } = {}) {
    const Ctx = createContext(null)

    function Provider({ children }) {
        const [likes, setLikes] = useState({})
        const likesRef   = useRef(likes)
        likesRef.current = likes
        const fetchingRef = useRef(new Set())

        const set = useCallback((id, liked, count) => {
            setLikes(prev => ({ ...prev, [String(id)]: { liked, count } }))
        }, [])

        const fetchLikeStatus = useCallback(async (id) => {
            if (!id) return
            const key = String(id)
            if (likesRef.current[key] !== undefined) return
            if (fetchingRef.current.has(key)) return
            fetchingRef.current.add(key)
            try {
                const res = await fetch(`${API}${endpoint}/${key}/status`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                })
                if (!res.ok) return
                const data = await res.json()
                set(key, data.liked, data.count)
            } catch {
            } finally {
                fetchingRef.current.delete(key)
            }
        }, [set])

        const toggleLike = useCallback(async (id) => {
            if (!id) return
            const key     = String(id)
            const current = likesRef.current[key] ?? { liked: false, count: 0 }
            const next      = !current.liked
            const nextCount = Math.max(0, current.count + (next ? 1 : -1))
            set(key, next, nextCount)
            try {
                const res = await fetch(`${API}${endpoint}/${key}`, {
                    method:  next ? 'POST' : 'DELETE',
                    headers: { Authorization: `Bearer ${getToken()}` },
                })
                if (!res.ok) throw new Error()
                onToggle?.(key, next)
            } catch {
                set(key, current.liked, current.count)
            }
        }, [set])

        const value = useMemo(
            () => ({ likes, fetchLikeStatus, toggleLike }),
            [likes, fetchLikeStatus, toggleLike]
        )

        return <Ctx.Provider value={value}>{children}</Ctx.Provider>
    }

    function useStore() {
        return useContext(Ctx)
    }

    return { Provider, useStore }
}
