import { useState, useEffect } from 'react'
import { getUser } from '../utils/auth'

const API = 'http://localhost:8080'

function formatJoined(dateStr) {
    if (!dateStr) return null
    const d = new Date(dateStr)
    if (isNaN(d)) return null
    return d.toLocaleString('pt-PT', { month: 'long' }) + ' ' + d.getFullYear()
}

export function useCurrentUser() {
    const [user, setUser] = useState(getUser)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) return
                setUser(prev => ({
                    ...prev,
                    name:     data.name     || data.displayName              || prev?.name,
                    email:    data.email                                      || prev?.email,
                    handle:   data.username ? `@${data.username}` : (data.handle || prev?.handle),
                    picture:  data.avatarUrl || data.picture || data.avatar   || prev?.picture,
                    location: data.country                                                    || prev?.location,
                    joined:   formatJoined(data.createdAt || data.joinedAt || data.memberSince) || prev?.joined,
                    bio:      data.bio || data.description                                       || prev?.bio,
                }))
            })
            .catch(() => {})
    }, [])

    return user
}
