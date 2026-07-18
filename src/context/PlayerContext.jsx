import { createContext, useContext, useState, useCallback } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
    const [track,    setTrackState] = useState(null)
    const [queue,    setQueue]      = useState([])
    const [queueIdx, setQueueIdx]   = useState(-1)

    const setTrack = useCallback((t, list) => {
        setTrackState(t)
        if (list) {
            const idx = list.findIndex(q => q.spotifyId === t.spotifyId)
            setQueue(list)
            setQueueIdx(idx)
        }
    }, [])

    const nextTrack = useCallback(() => {
        setQueueIdx(prev => {
            const next = prev + 1
            if (next < queue.length) {
                setTrackState(queue[next])
                return next
            }
            return prev
        })
    }, [queue])

    const prevTrack = useCallback(() => {
        setQueueIdx(prev => {
            const p = prev - 1
            if (p >= 0) {
                setTrackState(queue[p])
                return p
            }
            return prev
        })
    }, [queue])

    return (
        <PlayerContext.Provider value={{
            track,
            setTrack,
            nextTrack,
            prevTrack,
            hasNext: queueIdx >= 0 && queueIdx < queue.length - 1,
            hasPrev: queueIdx > 0,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    return useContext(PlayerContext)
}
