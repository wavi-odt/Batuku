import { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react'
import { API, getToken } from '../utils/auth'
const LikeContext = createContext(null)

export function LikeProvider({ children }) {
    // { [trackId]: { liked: bool, count: number } }
    const [likes, setLikes] = useState({})

    // Ref sempre actualizado com o valor mais recente de likes,
    // sem criar dependências que causariam stale closures nas funções abaixo.
    const likesRef   = useRef(likes)
    likesRef.current = likes

    // IDs cujo fetch já está em curso (evita pedidos duplicados em simultâneo)
    const fetchingRef = useRef(new Set())

    const set = useCallback((trackId, liked, count) => {
        setLikes(prev => ({ ...prev, [String(trackId)]: { liked, count } }))
    }, [])

    // Pede o estado ao servidor uma única vez por trackId.
    // Chamadas seguintes para o mesmo ID são ignoradas.
    const fetchLikeStatus = useCallback(async (trackId) => {
        if (!trackId) return
        const key = String(trackId)
        if (likesRef.current[key] !== undefined) return
        if (fetchingRef.current.has(key)) return
        fetchingRef.current.add(key)
        try {
            const res = await fetch(`${API}/api/likes/${key}/status`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) return
            const data = await res.json()
            set(key, data.liked, data.count)
        } catch {
            // silencioso — o botão fica no estado padrão
        } finally {
            fetchingRef.current.delete(key)
        }
    }, [set])

    // Toggle optimista: actualiza o estado imediatamente e reverte se o pedido falhar.
    const toggleLike = useCallback(async (trackId) => {
        if (!trackId) return
        const key     = String(trackId)
        const current = likesRef.current[key] ?? { liked: false, count: 0 }
        const next      = !current.liked
        const nextCount = Math.max(0, current.count + (next ? 1 : -1))
        set(key, next, nextCount)
        try {
            const res = await fetch(`${API}/api/likes/${key}`, {
                method:  next ? 'POST' : 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
        } catch {
            set(key, current.liked, current.count)  // reverter
        }
    }, [set])

    // useMemo garante que o objecto de contexto só muda quando likes muda
    // (fetchLikeStatus e toggleLike são estáveis — mesma referência entre renders)
    const value = useMemo(
        () => ({ likes, fetchLikeStatus, toggleLike }),
        [likes, fetchLikeStatus, toggleLike]
    )

    return <LikeContext.Provider value={value}>{children}</LikeContext.Provider>
}

export function useLikes() {
    return useContext(LikeContext)
}
