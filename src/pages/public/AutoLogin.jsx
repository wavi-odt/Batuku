import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API, saveAuth } from '../../utils/auth.js'

export default function AutoLogin() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [error, setError] = useState('')

    useEffect(() => {
        const token = searchParams.get('token')
        if (!token) { setError('Link inválido.'); return }

        fetch(`${API}/api/auth/magic?token=${encodeURIComponent(token)}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) throw new Error(data.error)
                saveAuth(data.token)
                navigate(data.redirectPath || '/home', { replace: true })
            })
            .catch(e => setError(e.message))
    }, [])

    if (error) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0D0D0E', color: '#fff', gap: 16 }}>
            <p style={{ color: '#E85D3C', fontSize: 15 }}>{error}</p>
            <a href="/login" style={{ color: '#A0A0A6', fontSize: 14 }}>Ir para o login</a>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0E', color: '#A0A0A6', fontSize: 15 }}>
            A entrar na tua conta…
        </div>
    )
}
