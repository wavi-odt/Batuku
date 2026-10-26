import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { HiLockClosed, HiEye, HiEyeOff, HiCheckCircle } from 'react-icons/hi'
import AuthSide from '../../components/AuthComponents/AuthSide.jsx'
import '../../components/AuthComponents/auth.css'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') ?? ''

    const [form,    setForm]    = useState({ password: '', confirm: '' })
    const [show,    setShow]    = useState({ password: false, confirm: false })
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState('')
    const [done,    setDone]    = useState(false)

    const update = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const toggleShow = k => setShow(s => ({ ...s, [k]: !s[k] }))

    async function onSubmit(e) {
        e.preventDefault()
        if (form.password !== form.confirm) {
            setError('As passwords não coincidem.')
            return
        }
        if (form.password.length < 8) {
            setError('A password deve ter pelo menos 8 caracteres.')
            return
        }
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: form.password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Erro ao redefinir a password.')
            setDone(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            setError(err.message || 'Não foi possível redefinir a password. Tenta novamente.')
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <main className="auth">
                <AuthSide page="login" title="Link" accent="inválido." lede="" />
                <section className="auth__form-col">
                    <div className="auth__form">
                        <div className="label-eyebrow">Recuperar password</div>
                        <h1 className="auth__title">Link inválido.</h1>
                        <p className="auth__sub">Este link não é válido ou já expirou.</p>
                        <Link to="/forgot-password" className="btn btn--primary auth__submit" style={{ textAlign: 'center' }}>
                            Pedir novo link →
                        </Link>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="auth">
            <AuthSide
                page="login"
                title="Nova"
                accent="password."
                lede="Define uma nova password para voltares a aceder à tua conta Batuku."
            />

            <section className="auth__form-col">
                <form className="auth__form" onSubmit={onSubmit} noValidate>

                    <div className="label-eyebrow">Recuperar password</div>
                    <h1 className="auth__title">Define uma nova password.</h1>

                    {done ? (
                        <div className="auth__success" role="status">
                            <HiCheckCircle size={20} />
                            <span>Password alterada com sucesso! A redirecionar para o login…</span>
                        </div>
                    ) : (
                        <>
                            {error && <div className="auth__error" role="alert">{error}</div>}

                            <div className="auth__field">
                                <label htmlFor="password" className="auth__label">Nova password</label>
                                <div className="auth__input-wrap">
                                    <HiLockClosed size={18} className="auth__icon" />
                                    <input
                                        id="password"
                                        type={show.password ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Mínimo 8 caracteres"
                                        autoComplete="new-password"
                                        required
                                        value={form.password}
                                        onChange={e => update('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="auth__toggle-pass"
                                        onClick={() => toggleShow('password')}
                                        aria-label={show.password ? 'Esconder password' : 'Mostrar password'}
                                    >
                                        {show.password ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="auth__field">
                                <label htmlFor="confirm" className="auth__label">Confirmar password</label>
                                <div className="auth__input-wrap">
                                    <HiLockClosed size={18} className="auth__icon" />
                                    <input
                                        id="confirm"
                                        type={show.confirm ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Repete a password"
                                        autoComplete="new-password"
                                        required
                                        value={form.confirm}
                                        onChange={e => update('confirm', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="auth__toggle-pass"
                                        onClick={() => toggleShow('confirm')}
                                        aria-label={show.confirm ? 'Esconder password' : 'Mostrar password'}
                                    >
                                        {show.confirm ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn--primary auth__submit"
                                disabled={loading}
                            >
                                {loading ? 'A guardar…' : 'Guardar password →'}
                            </button>
                        </>
                    )}

                </form>
            </section>
        </main>
    )
}
