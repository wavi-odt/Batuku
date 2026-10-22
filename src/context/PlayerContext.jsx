import { createContext, useContext, useRef, useState, useCallback } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
    const [track,     setTrackState] = useState(null)
    const [queue,     setQueue]      = useState([])
    const [queueIdx,  setQueueIdx]   = useState(-1)
    const [isPlaying, setIsPlaying]  = useState(false)
    const [oneOff,    setOneOff]     = useState(false)
    const [shuffle,   setShuffle]    = useState(false)
    const togglePlayRef = useRef(null)

    const toggleShuffle = useCallback(() => setShuffle(s => !s), [])

    const setTrack = useCallback((t, list) => {
        setTrackState(t)
        if (t && list) {
            const idx = list.findIndex(q =>
                t.spotifyId ? q.spotifyId === t.spotifyId : q.audioUrl === t.audioUrl
            )
            setQueue(list)
            setQueueIdx(idx)
            setOneOff(false)
        } else if (!t) {
            setQueue([])
            setQueueIdx(-1)
            setOneOff(false)
        } else {
            setOneOff(true)
        }
    }, [])

    const nextTrack = useCallback(() => {
        setOneOff(false)
        setQueueIdx(prev => {
            if (shuffle && queue.length > 1) {
                let next
                do { next = Math.floor(Math.random() * queue.length) } while (next === prev)
                setTrackState(queue[next])
                return next
            }
            const next = prev + 1
            if (next < queue.length) {
                setTrackState(queue[next])
                return next
            }
            return prev
        })
    }, [queue, shuffle])

    const prevTrack = useCallback(() => {
        setOneOff(false)
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
            hasNext:    !oneOff && (shuffle ? queue.length > 1 : queueIdx >= 0 && queueIdx < queue.length - 1),
            hasPrev:    !oneOff && queueIdx > 0,
            isPlaying,
            setIsPlaying,
            togglePlayRef,
            shuffle,
            toggleShuffle,
            oneOff,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    return useContext(PlayerContext)
}
