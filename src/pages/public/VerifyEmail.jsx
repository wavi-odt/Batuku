/* ─────────────────────────────────────────────────────────────────
   VerifyEmail.jsx
   Dois modos:
     1. ?token=xxx  → confirma o email via backend
     2. sem token   → ecrã "verifica o teu email" com botão de reenvio
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { HiMail, HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi'
import AuthSide from '../../components/AuthComponents/AuthSide.jsx'
import { saveAuth, setPendingClaim } from '../../utils/auth.js'
import '../../components/AuthComponents/auth.css'

const API = import.meta.env.VITE_API_BASE_URL
const RESEND_COOLDOWN = 60

export default function VerifyEmail() {
    const { state } = useLocation()
    const navigate  = useNavigate()
    const params    = new URLSearchParams(window.location.search)
    const token     = params.get('token')

    /* ── email guardado no state ou sessionStorage ── */
    const email = state?.email || sessionStorage.getItem('pendingEmail') || ''

    /* ── modo confirmação (tem token no URL) ── */
    const [confirmStatus, setConfirmStatus] = useState('idle') // idle | loading | success | error
    const [confirmError,  setConfirmError]  = useState('')

    /* ── modo "check email" ── */
    const [resendStatus,  setResendStatus]  = useState('idle') // idle | loading | success | error
    const [resendError,   setResendError]   = useState('')
    const [cooldown,      setCooldown]      = useState(0)
    const timerRef = useRef(null)

    /* ── confirmar quando há token ── */
    useEffect(() => {
        if (!token) return
        setConfirmStatus('loading')

        fetch(`${API}/api/auth/verify-email?token=${token}`)
            .then(r => r.json().then(d => ({ ok: r.ok, data: d })))
            .then(({ ok, data }) => {
                if (!ok) throw new Error(data.error || 'Link inválido ou expirado.')

                sessionStorage.removeItem('pendingEmail')

                if (data.pendingClaim) {
                    setConfirmStatus('success')
                    setTimeout(() => navigate(`/artist-claim?claimToken=${data.claimToken}`), 2000)
                } else {
                    saveAuth(data.token)
                    setConfirmStatus('success')
                    setTimeout(() => navigate('/home'), 2000)
                }
            })
            .catch(err => {
                setConfirmStatus('error')
                setConfirmError(err.message)
            })
    }, [token])

    /* ── limpar timer ao desmontar ── */
    useEffect(() => () => clearInterval(timerRef.current), [])

    function startCooldown() {
        setCooldown(RESEND_COOLDOWN)
        timerRef.current = setInterval(() => {
            setCooldown(c => {
                if (c <= 1) { clearInterval(timerRef.current); return 0 }
                return c - 1
            })
        }, 1000)
    }

    async function handleResend() {
        if (!email || cooldown > 0) return
        setResendStatus('loading')
        setResendError('')
        try {
            const res = await fetch(`${API}/api/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Não foi possível reenviar o email.')
            setResendStatus('success')
            startCooldown()
        } catch (err) {
            setResendStatus('error')
            setResendError(err.message)
        }
    }

    /* ════════════════════════════════════════════════════════════════
       Modo confirmação (token no URL)
    ════════════════════════════════════════════════════════════════ */
    if (token) {
        return (
            <main className="auth">
                <AuthSide
                    title="Quase"
                    accent="lá."
                    lede="Estamos a confirmar o teu email e a criar a tua conta no Batuku."
                />

                <section className="auth__form-col">
                    <div className="auth__form">

                        {confirmStatus === 'loading' && (
                            <>
                                <div className="label-eyebrow">A verificar</div>
                                <h1 className="auth__title">Um momento…</h1>
                                <div className="pending-validation__card">
                                    <div className="pending-validation__icon" style={{ fontSize: 40 }}>⏳</div>
                                    <p className="pending-validation__text">
                                        A confirmar o teu email. Não feches esta página.
                                    </p>
                                </div>
                            </>
                        )}

                        {confirmStatus === 'success' && (
                            <>
                                <div className="label-eyebrow">Email confirmado</div>
                                <h1 className="auth__title">Tudo certo!</h1>
                                <div className="pending-validation__card">
                                    <HiCheckCircle size={44} style={{ color: 'var(--color-green)' }} />
                                    <p className="pending-validation__text">
                                        Email verificado com sucesso. A redirecionar…
                                    </p>
                                </div>
                            </>
                        )}

                        {confirmStatus === 'error' && (
                            <>
                                <div className="label-eyebrow">Erro</div>
                                <h1 className="auth__title">Link inválido</h1>
                                <div className="pending-validation__card">
                                    <HiXCircle size={44} style={{ color: 'var(--color-danger)' }} />
                                    <p className="pending-validation__text">{confirmError}</p>
                                    <p className="pending-validation__sub">
                                        O link pode ter expirado (válido 24h) ou já ter sido utilizado.
                                    </p>
                                </div>
                                <Link
                                    to="/register"
                                    className="btn btn--primary auth__submit"
                                    style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-5)' }}
                                >
                                    Voltar ao registo
                                </Link>
                            </>
                        )}

                    </div>
                </section>
            </main>
        )
    }

    /* ════════════════════════════════════════════════════════════════
       Modo "verifica o teu email"
    ════════════════════════════════════════════════════════════════ */
    return (
        <main className="auth">
            <AuthSide
                title="Só falta"
                accent="um clique."
                lede="Enviámos um link de confirmação para o teu email. Verifica a caixa de entrada (e a pasta de spam)."
            />

            <section className="auth__form-col">
                <div className="auth__form">
                    <div className="label-eyebrow">Verificação de email</div>
                    <h1 className="auth__title">Verifica o teu email</h1>
                    <p className="auth__sub">
                        Já tens conta? <Link to="/login">Entrar →</Link>
                    </p>

                    <div className="pending-validation__card">
                        <HiMail size={44} style={{ color: 'var(--color-coral)' }} />

                        <p className="pending-validation__text">
                            Enviámos um email de confirmação para:
                        </p>

                        {email && (
                            <p className="pending-validation__email">{email}</p>
                        )}

                        <p className="pending-validation__sub">
                            Clica no link do email para ativar a tua conta.
                            O link é válido durante <strong style={{ color: 'var(--color-ink)' }}>24 horas</strong>.
                        </p>
                    </div>

                    {/* Feedback do reenvio */}
                    {resendStatus === 'success' && (
                        <div style={{
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--color-green)',
                            background: 'rgba(34,197,94,0.08)',
                            border: '1px solid rgba(34,197,94,0.25)',
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 14px',
                            marginTop: 'var(--space-4)',
                            textAlign: 'center',
                        }}>
                            Email reenviado com sucesso.
                        </div>
                    )}
                    {resendStatus === 'error' && (
                        <div className="auth__error" style={{ marginTop: 'var(--space-4)' }}>
                            {resendError}
                        </div>
                    )}

                    {/* Botão de reenvio */}
                    <button
                        type="button"
                        className="btn btn--ghost auth__submit"
                        style={{ marginTop: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
                        onClick={handleResend}
                        disabled={resendStatus === 'loading' || cooldown > 0}
                    >
                        <HiRefresh size={16} />
                        {resendStatus === 'loading'
                            ? 'A reenviar…'
                            : cooldown > 0
                                ? `Reenviar em ${cooldown}s`
                                : 'Reenviar email'}
                    </button>

                    <p className="auth__small" style={{ marginTop: 'var(--space-4)' }}>
                        Email errado? <Link to="/register">Volta ao registo</Link>
                    </p>
                </div>
            </section>
        </main>
    )
}
