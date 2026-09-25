import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveAuth, getRole, setPendingClaim } from '../../utils/auth.js'

export default function OAuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const processed = useRef(false)

    useEffect(() => {
        if (processed.current) return
        processed.current = true

        const token = searchParams.get('token')

        if (!token) {
            navigate('/login?error=oauth', { replace: true })
            return
        }

        saveAuth(token)

        const pendingRole = sessionStorage.getItem('oauthPendingRole')
        sessionStorage.removeItem('oauthPendingRole')

        if (pendingRole === 'artist') {
            setPendingClaim()
            navigate('/claim-profile', { state: { fromRegistration: true }, replace: true })
            return
        }

        const role = getRole()
        navigate(role === 'artist' ? '/dashboard' : '/home', { replace: true })
    }, [navigate, searchParams])

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <p>A autenticar…</p>
        </div>
    )
}