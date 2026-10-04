import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveAuth, getRole, API } from '../../utils/auth.js'
import { HiHeart, HiMusicNote } from 'react-icons/hi'
import '../../components/AuthComponents/auth.css'

export default function OAuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const processed = useRef(false)
    const tokenRef = useRef(null)
    const [showRoleModal, setShowRoleModal] = useState(false)
    const [roleLoading, setRoleLoading] = useState(false)

    useEffect(() => {
        if (processed.current) return
        processed.current = true

        const run = async () => {
            const token     = searchParams.get('token')
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

            if (pendingRole === 'artist' && isNewUser) {
                try {
                    const res = await fetch(`${API}/api/auth/oauth2/init-artist-claim`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (!res.ok) throw new Error()
                    const { claimToken } = await res.json()
                    localStorage.removeItem('token')
                    localStorage.removeItem('pendingClaim')
                    navigate(`/artist-claim?claimToken=${claimToken}`, { replace: true })
                } catch (_) {
                    navigate('/login?error=oauth', { replace: true })
                }
                return
            }

            if (pendingRole && !isNewUser) {
                const role = getRole()
                const roleLabel = role === 'artist' ? 'artista' : 'fã'
                navigate(role === 'artist' ? '/dashboard' : '/home', {
                    replace: true,
                    state: { notice: `Já tens uma conta registada como ${roleLabel}. Entraste com essa conta.` },
                })
                return
            }

            if (isNewUser && !pendingRole) {
                tokenRef.current = token
                setShowRoleModal(true)
                return
            }

            const role = getRole()
            navigate(role === 'artist' ? '/dashboard' : '/home', { replace: true })
        }

        run()
    }, [navigate, searchParams])

    async function handleRoleChoice(chosenRole) {
        const token = tokenRef.current
        setRoleLoading(true)

        if (chosenRole === 'artist') {
            try {
                const res = await fetch(`${API}/api/auth/oauth2/init-artist-claim`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) throw new Error()
                const { claimToken } = await res.json()
                localStorage.removeItem('token')
                localStorage.removeItem('pendingClaim')
                navigate(`/artist-claim?claimToken=${claimToken}`, { replace: true })
            } catch (_) {
                navigate('/login?error=oauth', { replace: true })
            }
            return
        }

        try {
            await fetch(`${API}/api/auth/welcome`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            })
        } catch (_) {}

        navigate('/home', { replace: true })
    }

    if (showRoleModal) {
        return (
            <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'var(--space-6)' }}>
                <section style={{ width: '100%', maxWidth: '480px' }}>
                    <div className="auth__form">
                        <div className="label-eyebrow">Bem-vindo ao Batuku</div>
                        <h1 className="auth__title">Como queres entrar?</h1>
                        <p className="auth__sub">Escolhe o tipo de conta para continuar.</p>

                        <div className="role-grid">
                            <button
                                type="button"
                                className="role-card"
                                onClick={() => handleRoleChoice('fan')}
                                disabled={roleLoading}
                            >
                                <span className="role-card__icon"><HiHeart /></span>
                                <h3 className="role-card__title">Sou fã</h3>
                                <p className="role-card__desc">
                                    Descobre artistas, faz playlists, ganha pontos a cada interação.
                                </p>
                            </button>

                            <button
                                type="button"
                                className="role-card"
                                onClick={() => handleRoleChoice('artist')}
                                disabled={roleLoading}
                            >
                                <span className="role-card__icon"><HiMusicNote /></span>
                                <h3 className="role-card__title">Sou artista</h3>
                                <p className="role-card__desc">
                                    Publica faixas, vende beats, acede a analytics em tempo real.
                                </p>
                            </button>
                        </div>

                        {roleLoading && <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', opacity: .6 }}>A processar…</p>}
                    </div>
                </section>
            </main>
        )

    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <p>A autenticar…</p>
        </div>
    )
}
