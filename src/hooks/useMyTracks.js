import { useState, useEffect } from 'react'
import { API, getToken } from '../utils/auth'

export function useMyTracks(artistProfileId, version = 0) {
    const [tracks,  setTracks]  = useState([])
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState(null)

    useEffect(() => {
        if (!artistProfileId) return
        setLoading(true)
        setError(null)
        fetch(`${API}/api/tracks/artist/${artistProfileId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(data => {
                const seen = new Set()
                setTracks(data.filter(t => t.audioUrl && !seen.has(t.id) && seen.add(t.id)))
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [artistProfileId, version])

    return { tracks, loading, error, setTracks }
}
