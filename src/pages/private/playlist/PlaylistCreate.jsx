/* ─────────────────────────────────────────────────────────────────
   pages/private/playlist/PlaylistCreate.jsx, Criar nova playlist.
   Rota /playlists/new (link "+ Nova playlist" do perfil aponta aqui).
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import '../DetailPage.css'
import '../profile/Settings.css'

export default function PlaylistCreate() {
    const navigate = useNavigate();
    const role = getRole() === 'artist' ? 'artist' : 'fan';
    const [name, setName]       = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) { setError('Dá um nome à playlist.'); return; }
        setSaving(true);
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/playlists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name, description }),
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const created = await res.json();
            navigate(`/playlists/${created.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AppShell role={role}>
            <div className="settings-page">
                <h1 className="settings-page__title">Nova playlist</h1>
                <form className="card settings-card" onSubmit={handleSubmit}>
                    <label className="settings-field" style={{ marginBottom: 14 }}>
                        <span className="settings-field__label">Nome</span>
                        <input className="input" value={name} onChange={e => setName(e.target.value)} autoFocus />
                    </label>
                    <label className="settings-field">
                        <span className="settings-field__label">Descrição (opcional)</span>
                        <input className="input" value={description} onChange={e => setDescription(e.target.value)} />
                    </label>
                    {error && <p className="settings-msg settings-msg--error">{error}</p>}
                    <div className="settings-card__footer">
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? 'A criar…' : 'Criar playlist'}
                        </button>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}
