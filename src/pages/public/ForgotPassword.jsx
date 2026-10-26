import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiMail, HiArrowLeft, HiCheckCircle } from 'react-icons/hi'
import AuthSide from '../../components/AuthComponents/AuthSide.jsx'
import '../../components/AuthComponents/auth.css'

export default function ForgotPassword() {
    const [email,   setEmail]   = useState('')
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState('')
    const [sent,    setSent]    = useState(false)

    async function onSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Erro ao enviar o email.')
            }
            setSent(true)
        } catch (err) {
            setError(err.message || 'Não foi possível enviar o email. Tenta novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth">
            <AuthSide
                page="login"
                title="Recuperar"
                accent="acesso."
                lede="Envia-te um link para definires uma nova password e voltares à música."
            />

            <section className="auth__form-col">
                <form className="auth__form" onSubmit={onSubmit} noValidate>

                    <div className="label-eyebrow">Recuperar password</div>
                    <h1 className="auth__title">Esqueceste-te da password?</h1>
                    <p className="auth__sub">
                        Lembras-te? <Link to="/login">Entrar →</Link>
                    </p>

                    {sent ? (
                        <div className="auth__success" role="status">
                            <HiCheckCircle size={20} />
                            <span>
                                Se este email estiver registado, receberás um link de recuperação em breve.
                                Verifica também a pasta de spam.
                            </span>
                        </div>
                    ) : (
                        <>
                            {error && <div className="auth__error" role="alert">{error}</div>}

                            <div className="auth__field">
                                <label htmlFor="email" className="auth__label">Email</label>
                                <div className="auth__input-wrap">
                                    <HiMail size={18} className="auth__icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        className="input"
                                        placeholder="tu@batuku.cv"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn--primary auth__submit"
                                disabled={loading}
                            >
                                {loading ? 'A enviar…' : 'Enviar link →'}
                            </button>
                        </>
                    )}

                    <Link to="/login" className="auth__back-link">
                        <HiArrowLeft size={14} /> Voltar ao login
                    </Link>

                </form>
            </section>
        </main>
    )
}
