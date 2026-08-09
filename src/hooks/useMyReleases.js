import { useState, useEffect } from 'react'
import { API, getToken } from '../utils/auth'

export function useMyReleases(artistProfileId, version = 0) {
    const [releases, setReleases] = useState([])
    const [loading,  setLoading]  = useState(false)
    const [error,    setError]    = useState(null)

    useEffect(() => {
        if (!artistProfileId) return
        setLoading(true)
        setError(null)
        fetch(`${API}/api/releases/my`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(data => setReleases(Array.isArray(data) ? data : []))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [artistProfileId, version])

    return { releases, loading, error }
}
