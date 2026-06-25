/* ─────────────────────────────────────────────────────────────────
   Register.jsx — Página de criar conta.
   ───────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaDiscord, FaGoogle, FaApple } from 'react-icons/fa'
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiMusicNote, HiHeart, HiArrowLeft, HiAtSymbol } from 'react-icons/hi'
import AuthSide from '../../components/AuthComponents/AuthSide.jsx'
import '../../components/AuthComponents/auth.css'

const GENRES = [
    'Funaná', 'Morna', 'Coladeira', 'Batuque', 'Cabo Love',
    'Kizomba', 'Tabanka', 'Kola San Jon', 'Hip-Hop', 'Outro',
];

const COUNTRIES = [
    'Cabo Verde', 'Portugal', 'França', 'EUA', 'Países Baixos',
    'Luxemburgo', 'Reino Unido', 'Senegal', 'Brasil', 'Outro',
];

function strength(pw) {
    if (!pw) return { score: 0, label: '' };
    let s = 0;
    if (pw.length >= 8)            s++;
    if (/[A-Z]/.test(pw))           s++;
    if (/[0-9]/.test(pw))           s++;
    if (/[^A-Za-z0-9]/.test(pw))    s++;
    const labels = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'];
    return { score: s, label: labels[s] };
}

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep]         = useState(1);
    const [role, setRole]         = useState('fan');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const [form, setForm] = useState({
        name: '', username: '', email: '', password: '',
        country: 'Cabo Verde',
        stageName: '', genreId: '', location: '',
        terms: false,
    });

    const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const pwStrength = useMemo(() => strength(form.password), [form.password]);

    async function onSubmit(e) {
        e.preventDefault();
        if (!form.terms) {
            setError('Tens de aceitar os Termos para continuar.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const payload = {
                name:     form.name,
                username: form.username,
                email:    form.email,
                password: form.password,
                country:  form.country,
                role:     role.toUpperCase(),
            };

            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Não foi possível criar a conta.');
            }

            navigate('/login');
        } catch (err) {
            setError(err.message || 'Erro inesperado. Tenta novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth">
            <AuthSide
                title="Faz parte da"
                accent="cena."
                lede="Cria a tua conta grátis. Como fã descobres artistas e ganhas pontos. Como artista publicas a tua música e cresces."
                quote="Vendi o primeiro beat três dias depois de me registar. Coisa séria."
                author="— Bento Lima · Produtor · São Filipe"
            />

            <section className="auth__form-col">
                <form className="auth__form" onSubmit={onSubmit} noValidate>

                    <div className="label-eyebrow">Criar conta · Passo {step} de 2</div>
                    <h1 className="auth__title">
                        {step === 1 ? 'O que vens fazer ao Batuku?' : 'Quase lá. Só faltam os teus dados.'}
                    </h1>
                    <p className="auth__sub">
                        {step === 1
                            ? <>Já tens conta? <Link to="/login">Entrar →</Link></>
                            : 'Podes mudar isto mais tarde no teu perfil.'}
                    </p>

                    {error && <div className="auth__error" role="alert">{error}</div>}

                    {/* ── Passo 1: escolher tipo de conta ── */}
                    {step === 1 && (
                        <>
                            <div className="role-grid">
                                <button
                                    type="button"
                                    className={'role-card' + (role === 'fan' ? ' is-active' : '')}
                                    onClick={() => setRole('fan')}
                                    aria-pressed={role === 'fan'}
                                >
                                    <span className="role-card__icon"><HiHeart /></span>
                                    <h3 className="role-card__title">Sou fã</h3>
                                    <p className="role-card__desc">
                                        Descobre artistas, faz playlists, ganha pontos a cada interação.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    className={'role-card' + (role === 'artist' ? ' is-active' : '')}
                                    onClick={() => setRole('artist')}
                                    aria-pressed={role === 'artist'}
                                >
                                    <span className="role-card__icon"><HiMusicNote /></span>
                                    <h3 className="role-card__title">Sou artista</h3>
                                    <p className="role-card__desc">
                                        Publica faixas, vende beats, acede a analytics em tempo real.
                                    </p>
                                </button>
                            </div>

                            <button
                                type="button"
                                className="btn btn--primary auth__submit"
                                onClick={() => setStep(2)}
                            >
                                Continuar →
                            </button>

                            <div className="divider"><span>ou regista-te com</span></div>

                            <div className="auth__oauth">
                                <button type="button" className="auth__oauth-btn auth__oauth-btn--discord">
                                    <FaDiscord size={18} /> Discord
                                </button>
                                <button type="button" className="auth__oauth-btn auth__oauth-btn--google">
                                    <FaGoogle size={16} /> Google
                                </button>
                                <button type="button" className="auth__oauth-btn auth__oauth-btn--apple">
                                    <FaApple size={18} /> Apple
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── Passo 2: preencher dados ── */}
                    {step === 2 && (
                        <>
                            {/* Nome + País */}
                            <div className="auth__field-row">
                                <div className="auth__field">
                                    <label htmlFor="name" className="auth__label">Nome</label>
                                    <div className="auth__input-wrap">
                                        <HiUser size={18} className="auth__icon" />
                                        <input
                                            id="name"
                                            type="text"
                                            className="input"
                                            placeholder="O teu nome"
                                            autoComplete="name"
                                            required
                                            value={form.name}
                                            onChange={(e) => update('name', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="auth__field">
                                    <label htmlFor="country" className="auth__label">País</label>
                                    <select
                                        id="country"
                                        className="input auth__select"
                                        value={form.country}
                                        onChange={(e) => update('country', e.target.value)}
                                    >
                                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Username */}
                            <div className="auth__field">
                                <label htmlFor="username" className="auth__label">Username</label>
                                <div className="auth__input-wrap">
                                    <HiAtSymbol size={18} className="auth__icon" />
                                    <input
                                        id="username"
                                        type="text"
                                        className="input"
                                        placeholder="ex: djossa_cv"
                                        autoComplete="username"
                                        required
                                        value={form.username}
                                        onChange={(e) => update('username', e.target.value.toLowerCase())}
                                    />
                                </div>
                                <span className="auth__hint">Usado para login e menções. Só letras, números, . e _</span>
                            </div>

                            {/* Email */}
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
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="auth__field">
                                <label htmlFor="password" className="auth__label">Password</label>
                                <div className="auth__input-wrap">
                                    <HiLockClosed size={18} className="auth__icon" />
                                    <input
                                        id="password"
                                        type={showPass ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Mínimo 8 caracteres"
                                        autoComplete="new-password"
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
                                {form.password && (
                                    <>
                                        <div className="auth__strength">
                                            {[1, 2, 3, 4].map((i) => {
                                                const tier = pwStrength.score <= 1 ? 'weak'
                                                    : pwStrength.score <= 2 ? 'medium'
                                                        : 'strong';
                                                return (
                                                    <div
                                                        key={i}
                                                        className={'auth__strength-bar' + (i <= pwStrength.score ? ' is-on--' + tier : '')}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className="auth__strength-label">{pwStrength.label}</div>
                                    </>
                                )}
                            </div>

                            {/* Campos extra para artistas */}
                            {role === 'artist' && (
                                <>
                                    <div className="divider"><span>perfil de artista</span></div>

                                    <div className="auth__field">
                                        <label htmlFor="stageName" className="auth__label">Nome artístico</label>
                                        <div className="auth__input-wrap">
                                            <HiMusicNote size={18} className="auth__icon" />
                                            <input
                                                id="stageName"
                                                type="text"
                                                className="input"
                                                placeholder="Ex: Djossa"
                                                required
                                                value={form.stageName}
                                                onChange={(e) => update('stageName', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="auth__field-row">
                                        <div className="auth__field">
                                            <label htmlFor="genre" className="auth__label">Género principal</label>
                                            <select
                                                id="genre"
                                                className="input auth__select"
                                                value={form.genreId}
                                                onChange={(e) => update('genreId', e.target.value)}
                                                required
                                            >
                                                <option value="">Escolhe…</option>
                                                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>

                                        <div className="auth__field">
                                            <label htmlFor="location" className="auth__label">Localização</label>
                                            <input
                                                id="location"
                                                type="text"
                                                className="input"
                                                placeholder="Ex: Praia"
                                                value={form.location}
                                                onChange={(e) => update('location', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <p className="auth__hint">
                                        Vais poder validar o teu perfil mais tarde com a tua conta de Spotify ou Apple Music.
                                    </p>
                                </>
                            )}

                            {/* Termos */}
                            <label className="auth__check" style={{ margin: 'var(--space-4) 0 var(--space-6)' }}>
                                <input
                                    type="checkbox"
                                    checked={form.terms}
                                    onChange={(e) => update('terms', e.target.checked)}
                                />
                                <span className="auth__check-box" />
                                <span style={{ fontSize: 'var(--fs-sm)' }}>
                                    Aceito os <Link to="/terms" style={{ color: 'var(--color-coral)' }}>Termos</Link> e a{' '}
                                    <Link to="/privacy" style={{ color: 'var(--color-coral)' }}>Política de Privacidade</Link>.
                                </span>
                            </label>

                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <button
                                    type="button"
                                    className="btn btn--ghost"
                                    onClick={() => setStep(1)}
                                    style={{ flexShrink: 0 }}
                                >
                                    <HiArrowLeft size={16} /> Voltar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn--primary auth__submit"
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    {loading ? 'A criar conta…' : 'Criar conta →'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </section>
        </main>
    );
}
