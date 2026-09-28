import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveAuth, getRole, setPendingClaim, API } from '../../utils/auth.js'

export default function OAuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const processed = useRef(false)

    useEffect(() => {
        if (processed.current) return
        processed.current = true

        const run = async () => {
            const token = searchParams.get('token')
            const isNewUser = searchParams.get('new') === 'true'

            const error = searchParams.get('error')
            if (error === 'account_pending') {
                navigate('/aguardar-validacao', { replace: true })
                return
            }
            if (!token) {
                navigate('/login?error=oauth', { replace: true })
                return
            }

            saveAuth(token)

            const pendingRole = sessionStorage.getItem('oauthPendingRole')
            sessionStorage.removeItem('oauthPendingRole')

            if (pendingRole === 'artist') {
                let artistEmail = null
                try {
                    const res = await fetch(`${API}/api/auth/oauth2/upgrade-to-artist`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    if (res.ok) {
                        const data = await res.json()
                        saveAuth(data.token)
                        artistEmail = data.email
                    }
                } catch (_) {}
                setPendingClaim()
                navigate('/claim-profile', { state: { fromRegistration: true }, replace: true })
                return
            }

            if (isNewUser) {
                try {
                    await fetch(`${API}/api/auth/welcome`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                } catch (_) {}
            }

            const role = getRole()
            navigate(role === 'artist' ? '/dashboard' : '/home', { replace: true })
        }

        run()
    }, [navigate, searchParams])

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <p>A autenticar…</p>
        </div>
    )
}
