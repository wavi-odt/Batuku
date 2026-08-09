import { useState, useRef, useEffect } from 'react'
import { FaTimes, FaMusic, FaCamera } from 'react-icons/fa'
import { API, getToken } from '../../../utils/auth.js'
import './PlaylistCreateModal.css'

export default function PlaylistCreateModal({ onClose, onCreated, onUpdated, playlist }) {
    const isEdit = !!playlist;

    const [name,        setName]        = useState(playlist?.name ?? '');
    const [description, setDescription] = useState(playlist?.description ?? '');
    const [coverFile,   setCoverFile]   = useState(null);
    const [previewUrl,  setPreviewUrl]  = useState(playlist?.coverUrl ?? null);
    const [saving,      setSaving]      = useState(false);
    const [error,       setError]       = useState('');
    const fileRef = useRef(null);

    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

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

            const url    = isEdit ? `${API}/api/playlists/${playlist.id}` : `${API}/api/playlists`;
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${getToken()}` },
                body:    fd,
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const result = await res.json();
            if (isEdit) {
                onUpdated?.(result);
            } else {
                onCreated?.(result);
            }
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="pcm-overlay" onClick={onClose}>
            <div className="pcm-modal" onClick={e => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="pcm-modal__header">
                    <span className="pcm-modal__title">{isEdit ? 'Editar playlist' : 'Nova playlist'}</span>
                    <button type="button" className="pcm-modal__close" onClick={onClose} aria-label="Fechar">
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* ── Corpo ── */}
                <form className="pcm-modal__body" onSubmit={handleSubmit}>

                    {/* Capa */}
                    <div className="pcm-cover-wrap">
                        <button
                            type="button"
                            className="pcm-cover"
                            onClick={() => fileRef.current?.click()}
                            aria-label="Escolher capa"
                        >
                            {previewUrl
                                ? <img src={previewUrl} alt="Pré-visualização" className="pcm-cover__img" />
                                : <div className="pcm-cover__empty"><FaMusic size={30} /></div>
                            }
                            <div className="pcm-cover__overlay">
                                <FaCamera size={18} />
                                <span>{previewUrl ? 'Alterar' : 'Adicionar foto'}</span>
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

                    {/* Campos */}
                    <div className="pcm-fields">
                        <label className="pcm-field">
                            <span className="pcm-field__label">Nome</span>
                            <input
                                className="input"
                                placeholder="Nome da playlist"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                            />
                        </label>
                        <label className="pcm-field">
                            <span className="pcm-field__label">Descrição <span className="pcm-field__opt">(opcional)</span></span>
                            <input
                                className="input"
                                placeholder="Adiciona uma descrição…"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </label>
                    </div>

                    {error && <p className="pcm-error">{error}</p>}

                    {/* Footer */}
                    <div className="pcm-modal__footer">
                        <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={saving || !name.trim()}>
                            {saving
                                ? (isEdit ? 'A guardar…' : 'A criar…')
                                : (isEdit ? 'Guardar' : 'Criar playlist')
                            }
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
