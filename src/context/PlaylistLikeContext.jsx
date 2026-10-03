import { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react'
import { API, getToken } from '../utils/auth'

const PlaylistLikeContext = createContext(null)

export function PlaylistLikeProvider({ children }) {
    const [likes, setLikes] = useState({})
    const likesRef   = useRef(likes)
    likesRef.current = likes
    const fetchingRef = useRef(new Set())

    const set = useCallback((playlistId, liked, count) => {
        setLikes(prev => ({ ...prev, [String(playlistId)]: { liked, count } }))
    }, [])

    const fetchLikeStatus = useCallback(async (playlistId) => {
        if (!playlistId) return
        const key = String(playlistId)
        if (likesRef.current[key] !== undefined) return
        if (fetchingRef.current.has(key)) return
        fetchingRef.current.add(key)
        try {
            const res = await fetch(`${API}/api/playlist-likes/${key}/status`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) return
            const data = await res.json()
            set(key, data.liked, data.count)
        } catch {
            // silencioso
        } finally {
            fetchingRef.current.delete(key)
        }
    }, [set])

    const toggleLike = useCallback(async (playlistId) => {
        if (!playlistId) return
        const key     = String(playlistId)
        const current = likesRef.current[key] ?? { liked: false, count: 0 }
        const next      = !current.liked
        const nextCount = Math.max(0, current.count + (next ? 1 : -1))
        set(key, next, nextCount)
        try {
            const res = await fetch(`${API}/api/playlist-likes/${key}`, {
                method:  next ? 'POST' : 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
        } catch {
            set(key, current.liked, current.count)
        }
    }, [set])

    const value = useMemo(
        () => ({ likes, fetchLikeStatus, toggleLike }),
        [likes, fetchLikeStatus, toggleLike]
    )

    return <PlaylistLikeContext.Provider value={value}>{children}</PlaylistLikeContext.Provider>
}

export function usePlaylistLikes() {
    return useContext(PlaylistLikeContext)
}
