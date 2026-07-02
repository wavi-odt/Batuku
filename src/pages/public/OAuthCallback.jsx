import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveAuth, getRole } from '../../utils/auth.js'

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
        const role = getRole()
        navigate(role === 'artist' ? '/dashboard' : '/home', { replace: true })
    }, [navigate, searchParams])

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <p>A autenticar…</p>
        </div>
    )
}