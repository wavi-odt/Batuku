import { useState, useEffect, useCallback } from 'react'
import { API, getUser } from '../utils/auth'

function formatJoined(dateStr) {
    if (!dateStr) return null
    const d = new Date(dateStr)
    if (isNaN(d)) return null
    return d.toLocaleString('pt-PT', { month: 'long' }) + ' ' + d.getFullYear()
}

export function useCurrentUser() {
    const [user, setUser] = useState(getUser)
    const [isLoading, setIsLoading] = useState(true)

    const refresh = useCallback(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setIsLoading(false)
            return
        }
        fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) {
                    setUser(prev => ({
                        ...prev,
                        id:               data.id       ?? data.userId ?? data.user_id     ?? prev?.id,
                        name:             data.name     || data.displayName              || prev?.name,
                        email:            data.email                                      || prev?.email,
                        handle:           data.username ? `@${data.username}` : (data.handle || prev?.handle),
                        picture:          data.avatarUrl || data.picture || data.avatar   || prev?.picture,
                        location:         data.location || data.country                   || prev?.location,
                        joined:           formatJoined(data.createdAt || data.joinedAt || data.memberSince) || prev?.joined,
                        bio:              data.bio || data.description                    || prev?.bio,
                        spotifyArtistId:  data.spotifyArtistId || data.spotifyId          || prev?.spotifyArtistId || null,
                        artistProfileId:  data.artistProfileId                            ?? prev?.artistProfileId ?? null,
                        marketplaceRole:  data.marketplaceRole                            ?? prev?.marketplaceRole ?? null,
                    }))
                }
                setIsLoading(false)
            })
            .catch(() => { setIsLoading(false) })
    }, [])

    useEffect(() => {
        refresh()
        window.addEventListener('batuku:user-updated', refresh)
        return () => window.removeEventListener('batuku:user-updated', refresh)
    }, [refresh])

    return { user, isLoading }
}
