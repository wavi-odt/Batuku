/* ─────────────────────────────────────────────────────────────────
   pages/private/profile/Settings.jsx, Editar perfil (nome, username,
   password). Rota /settings (linkada a partir de Profile.jsx).

   Segue o padrão de fetch de TrackDetail.jsx/ClaimProfile.jsx:
   loading/error/data com fetch + Authorization Bearer. Widgets
   (.input, .btn-primary, .btn-ghost, .card) vêm de global.css —
   nada de novo inventado aí.
   ───────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import './Settings.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api`

function Field({ label, ...props }) {
    return (
        <label className="settings-field">
            <span className="settings-field__label">{label}</span>
            <input className="input" {...props} />
        </label>
    );
}

function ProfileForm({ user }) {
    const [name, setName]         = useState(user.name || '');
    const [username, setUsername] = useState(user.username || '');
    const [saving, setSaving]     = useState(false);
    const [error, setError]       = useState('');
    const [done, setDone]         = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        setDone(false);
        try {
            const res = await fetch(`${API}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ name, username }),
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            setDone(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="card settings-card" onSubmit={handleSubmit}>
            <h2 className="settings-card__title">Perfil</h2>
            <p className="settings-card__desc">Nome e nome de utilizador visíveis publicamente.</p>

            <div className="settings-grid">
                <Field label="Nome" value={name} onChange={e => setName(e.target.value)} required />
                <Field label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>

            {error && <p className="settings-msg settings-msg--error"><FaExclamationTriangle size={12} /> {error}</p>}
            {done && !error && <p className="settings-msg settings-msg--ok"><FaCheck size={12} /> Alterações guardadas.</p>}

            <div className="settings-card__footer">
                <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'A guardar…' : 'Guardar alterações'}
                </button>
            </div>
        </form>
    );
}

function PasswordForm() {
    const [current, setCurrent] = useState('');
    const [next, setNext]       = useState('');
    const [confirm, setConfirm] = useState('');
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState('');
    const [done, setDone]       = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setDone(false);
        if (next !== confirm) { setError('As palavras-passe novas não coincidem.'); return; }
        if (next.length < 8)  { setError('A nova palavra-passe deve ter pelo menos 8 caracteres.'); return; }

        setSaving(true);
        try {
            const res = await fetch(`${API}/users/me/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ currentPassword: current, newPassword: next }),
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            setDone(true);
            setCurrent(''); setNext(''); setConfirm('');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="card settings-card" onSubmit={handleSubmit}>
            <h2 className="settings-card__title">Palavra-passe</h2>
            <p className="settings-card__desc">Usa uma palavra-passe com pelo menos 8 caracteres.</p>

            <div className="settings-grid">
                <Field label="Palavra-passe atual" type="password" value={current} onChange={e => setCurrent(e.target.value)} required />
                <span />
                <Field label="Nova palavra-passe" type="password" value={next} onChange={e => setNext(e.target.value)} required />
                <Field label="Confirmar nova palavra-passe" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>

            {error && <p className="settings-msg settings-msg--error"><FaExclamationTriangle size={12} /> {error}</p>}
            {done && !error && <p className="settings-msg settings-msg--ok"><FaCheck size={12} /> Palavra-passe alterada.</p>}

            <div className="settings-card__footer">
                <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'A guardar…' : 'Alterar palavra-passe'}
                </button>
            </div>
        </form>
    );
}

export default function Settings() {
    const role = getRole() === 'artist' ? 'artist' : 'fan';

    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(data => setUser({
                name: data.name || data.displayName || '',
                username: data.username || '',
            }))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AppShell role={role}>
            <div className="settings-page">
                <Link to="/profile" className="settings-back">← Perfil</Link>
                <h1 className="settings-page__title">Editar perfil</h1>

                {loading && <div className="detail-loading">A carregar…</div>}
                {error && <div className="detail-error">{error}</div>}

                {user && (
                    <div className="settings-list">
                        <ProfileForm user={user} />
                        <PasswordForm />
                    </div>
                )}
            </div>
        </AppShell>
    );
}
