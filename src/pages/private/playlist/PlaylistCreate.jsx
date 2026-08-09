import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMusic, FaCamera } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import { API, getToken, getRole } from '../../../utils/auth.js'
import '../DetailPage.css'
import '../profile/Settings.css'
import './PlaylistCreate.css'

export default function PlaylistCreate() {
    const navigate = useNavigate();
    const role = getRole() === 'artist' ? 'artist' : 'fan';

    const [name,        setName]        = useState('');
    const [description, setDescription] = useState('');
    const [coverFile,   setCoverFile]   = useState(null);
    const [previewUrl,  setPreviewUrl]  = useState(null);
    const [saving,      setSaving]      = useState(false);
    const [error,       setError]       = useState('');
    const fileRef = useRef(null);

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) { setError('Dá um nome à playlist.'); return; }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', name.trim());
            if (description.trim()) fd.append('description', description.trim());
            if (coverFile) fd.append('cover', coverFile);

            const res = await fetch(`${API}/api/playlists`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
                body: fd,
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

                <form className="card settings-card pl-create-form" onSubmit={handleSubmit}>

                    {/* ── Capa ── */}
                    <div className="pl-create-cover-wrap">
                        <button
                            type="button"
                            className="pl-create-cover"
                            onClick={() => fileRef.current?.click()}
                            aria-label="Escolher capa"
                        >
                            {previewUrl
                                ? <img src={previewUrl} alt="Pré-visualização" className="pl-create-cover__img" />
                                : <div className="pl-create-cover__empty">
                                    <FaMusic size={32} className="pl-create-cover__icon" />
                                </div>
                            }
                            <div className="pl-create-cover__overlay">
                                <FaCamera size={20} />
                                <span>{previewUrl ? 'Alterar foto' : 'Adicionar foto'}</span>
                            </div>
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* ── Campos ── */}
                    <div className="pl-create-fields">
                        <label className="settings-field" style={{ marginBottom: 14 }}>
                            <span className="settings-field__label">Nome</span>
                            <input
                                className="input"
                                placeholder="Nome da playlist"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                            />
                        </label>
                        <label className="settings-field">
                            <span className="settings-field__label">Descrição (opcional)</span>
                            <input
                                className="input"
                                placeholder="Adiciona uma descrição…"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </label>

                        {error && <p className="settings-msg settings-msg--error">{error}</p>}

                        <div className="settings-card__footer">
                            <button type="submit" className="btn-primary" disabled={saving || !name.trim()}>
                                {saving ? 'A criar…' : 'Criar playlist'}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </AppShell>
    );
}
