/* ─────────────────────────────────────────────────────────────────
   Login.jsx, Página de entrar na conta.
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaDiscord, FaGoogle, FaApple } from 'react-icons/fa'
import { HiUser, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import AuthSide from '../../components/AuthComponents/AuthSide.jsx'
import { saveAuth, getRole } from '../../utils/auth.js'
import '../../components/AuthComponents/auth.css'

export default function Login() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    // campo chama-se "identifier" internamente, pode ser email ou username
    const [form, setForm] = useState({ identifier: '', password: '', remember: true });

    const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // O backend (JwtAuthenticationController) espera o campo "username".
            // Enviamos o que o utilizador escreveu, pode ser email ou username.
            // O JwtUserDetailsService tenta os dois automaticamente.
            const res = await fetch('http://localhost:8080/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: form.identifier,
                    password: form.password,
                }),
            });

            if (!res.ok) throw new Error('Email/username ou password inválidos.');

            const data = await res.json();

            saveAuth(data.token);
            const role = getRole();
            navigate(role === 'artist' ? '/dashboard' : '/home');
        } catch (err) {
            setError(err.message || 'Não foi possível entrar. Tenta novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth">
            <AuthSide
                title="Bem-vindo de"
                accent="volta."
                lede="Continua a apoiar artistas cabo-verdianos, descobre novas faixas e acompanha o teu ranking semanal."
                quote="Aqui não estou só. Sinto a comunidade do outro lado."
                author=", Djossa · Funaná · Praia"
            />

            <section className="auth__form-col">
                <form className="auth__form" onSubmit={onSubmit} noValidate>

                    <div className="label-eyebrow">Entrar na conta</div>
                    <h1 className="auth__title">Bom ver-te outra vez.</h1>
                    <p className="auth__sub">
                        Ainda não tens conta? <Link to="/register">Regista-te grátis →</Link>
                    </p>

                    {error && <div className="auth__error" role="alert">{error}</div>}

                    <div className="auth__oauth">
                        <button type="button" className="auth__oauth-btn auth__oauth-btn--discord"
                            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/discord'}>
                            <FaDiscord size={18} /> Discord
                        </button>
                        <button type="button" className="auth__oauth-btn auth__oauth-btn--google"
                            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}>
                            <FaGoogle size={16} /> Google
                        </button>
                        <button type="button" className="auth__oauth-btn auth__oauth-btn--apple">
                            <FaApple size={18} /> Apple
                        </button>
                    </div>

                    <div className="divider"><span>ou com email / username</span></div>

                    {/* Campo aceita email OU username */}
                    <div className="auth__field">
                        <label htmlFor="identifier" className="auth__label">Email ou username</label>
                        <div className="auth__input-wrap">
                            <HiUser size={18} className="auth__icon" />
                            <input
                                id="identifier"
                                type="text"
                                className="input"
                                placeholder="tu@batuku.cv ou djossa_cv"
                                autoComplete="username"
                                required
                                value={form.identifier}
                                onChange={(e) => update('identifier', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="auth__field">
                        <label htmlFor="password" className="auth__label">Password</label>
                        <div className="auth__input-wrap">
                            <HiLockClosed size={18} className="auth__icon" />
                            <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                className="input"
                                placeholder="•••••••••"
                                autoComplete="current-password"
                                required
                                value={form.password}
                                onChange={(e) => update('password', e.target.value)}
                            />
                            <button
                                type="button"
                                className="auth__toggle-pass"
                                onClick={() => setShowPass(v => !v)}
                                aria-label={showPass ? 'Esconder password' : 'Mostrar password'}
                            >
                                {showPass ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="auth__row">
                        <label className="auth__check">
                            <input
                                type="checkbox"
                                checked={form.remember}
                                onChange={(e) => update('remember', e.target.checked)}
                            />
                            <span className="auth__check-box" />
                            Manter sessão iniciada
                        </label>
                        <Link to="/forgot-password" className="auth__forgot">Esqueceste-te?</Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary auth__submit"
                        disabled={loading}
                    >
                        {loading ? 'A entrar…' : 'Entrar →'}
                    </button>

                    <p className="auth__small">
                        Ao entrares, aceitas os nossos <Link to="/terms">Termos</Link> e
                        a <Link to="/privacy">Política de Privacidade</Link>.
                    </p>
                </form>
            </section>
        </main>
    );
}
