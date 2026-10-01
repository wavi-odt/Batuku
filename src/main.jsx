import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './tokens.css'
import './global.css'
import { API, getToken, saveAuth, logout } from './utils/auth.js'

const originalFetch = window.fetch.bind(window)
let refreshPromise = null

window.fetch = async (input, init = {}) => {
    const res = await originalFetch(input, init)

    if (res.status !== 401) return res

    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : ''
    if (url.includes('/authenticate') || url.includes('/refresh-token') || url.includes('/logout')) {
        return res
    }

    if (!refreshPromise) {
        refreshPromise = originalFetch(`${API}/api/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
        })
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
            .finally(() => { refreshPromise = null; })
    }

    const refreshed = await refreshPromise

    if (!refreshed?.token) {
        await logout()
        return res
    }

    saveAuth(refreshed.token)

    return originalFetch(input, {
        ...init,
        headers: {
            ...init.headers,
            Authorization: `Bearer ${refreshed.token}`,
        },
    })
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
