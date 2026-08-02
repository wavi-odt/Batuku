/* ─────────────────────────────────────────────────────────────────
   Publish.jsx  ·  Modal de publicação de faixa / álbum.
   Montado globalmente em App.jsx; aberto via usePublish().
   ───────────────────────────────────────────────────────────────── */

import { useState, useRef, useEffect } from 'react'
import { createPortal }   from 'react-dom'
import { FaMusic, FaImage, FaTrash, FaPlus, FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import { getToken }       from '../../../utils/auth.js'
import { usePublish }     from '../../../context/PublishContext.jsx'
import './Publish.css'

const API    = `${import.meta.env.VITE_API_BASE_URL}/api`
const GENRES = ['Funaná', 'Batuku', 'Morna', 'Coladeira', 'Kizomba', 'Afrobeat', 'Hip-Hop', 'Outro'];
const MAX_AUDIO = 60 * 1024 * 1024;
const MAX_IMAGE  =  5 * 1024 * 1024;

function DropZone({ label, hint, accept, file, onPick, icon: Icon }) {
    const ref = useRef(null);
    return (
        <div className={'pub-drop' + (file ? ' pub-drop--ready' : '')} onClick={() => ref.current?.click()}>
            <input ref={ref} type="file" accept={accept} className="pub-drop__input"
                   onChange={e => onPick(e.target.files?.[0] || null)} />
            <Icon size={22} className="pub-drop__icon" />
            {file
                ? <p className="pub-drop__hint"><strong>{file.name}</strong><span className="pub-drop__sub"> · clica para trocar</span></p>
                : <><p className="pub-drop__hint">{label}</p><p className="pub-drop__sub">{hint}</p></>}
        </div>
    );
}

function TrackRow({ track, onChange, onRemove }) {
    return (
        <div className="pub-track-row">
            <input className="input" placeholder="Título da faixa" value={track.title}
                   onChange={e => onChange({ ...track, title: e.target.value })} />
            <DropZone label="Áudio" hint="MP3/WAV · máx. 60 MB" accept="audio/*" icon={FaMusic}
                      file={track.audio} onPick={f => onChange({ ...track, audio: f })} />
            <button type="button" className="pub-track-row__remove" onClick={onRemove} aria-label="Remover faixa">
                <FaTrash size={12} />
            </button>
        </div>
    );
}

export default function PublishModal() {
    const { isOpen, closePublish } = usePublish();

    const [mode,        setMode]        = useState('track');
    const [title,       setTitle]       = useState('');
    const [genre,       setGenre]       = useState(GENRES[0]);
    const [releaseType, setReleaseType] = useState('Álbum');
    const [cover,       setCover]       = useState(null);
    const [audio,       setAudio]       = useState(null);
    const [tracks,      setTracks]      = useState([{ title: '', audio: null }]);
    const [submitting,  setSubmitting]  = useState(false);
    const [error,       setError]       = useState('');

    /* Fecha com Escape */
    useEffect(() => {
        if (!isOpen) return;
        function onKey(e) { if (e.key === 'Escape') closePublish(); }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, closePublish]);

    /* Impede scroll da página quando aberto */
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    function reset() {
        setMode('track'); setTitle(''); setGenre(GENRES[0]);
        setReleaseType('Álbum'); setCover(null); setAudio(null);
        setTracks([{ title: '', audio: null }]); setError('');
    }

    function handleClose() { reset(); closePublish(); }

    function addTrackRow()          { setTracks(p => [...p, { title: '', audio: null }]); }
    function updateTrackRow(i, t)   { setTracks(p => p.map((r, idx) => idx === i ? t : r)); }
    function removeTrackRow(i)      { setTracks(p => p.filter((_, idx) => idx !== i)); }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!title.trim()) { setError('Dá um título à publicação.'); return; }
        if (mode === 'track' && !audio) { setError('Escolhe o ficheiro de áudio.'); return; }
        if (mode === 'release' && tracks.some(t => !t.title.trim() || !t.audio)) {
            setError('Preenche o título e o áudio de todas as faixas.'); return;
        }
        if (audio && audio.size > MAX_AUDIO) { setError('O áudio não pode ultrapassar 60 MB.'); return; }
        if (cover && cover.size > MAX_IMAGE)  { setError('A capa não pode ultrapassar 5 MB.');  return; }

        setSubmitting(true);
        try {
            const body = new FormData();
            body.append('title', title);
            body.append('genre', genre);
            if (cover) body.append('cover', cover);

            let url;
            if (mode === 'track') {
                body.append('audio', audio);
                url = `${API}/tracks`;
            } else {
                body.append('releaseType', releaseType);
                tracks.forEach((t, i) => {
                    body.append(`tracks[${i}].title`, t.title);
                    body.append(`tracks[${i}].audio`, t.audio);
                });
                url = `${API}/releases`;
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
                body,
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (!isOpen) return null;

    return createPortal(
        <div className="pub-overlay" onMouseDown={handleClose}>
            <div className="pub-modal" onMouseDown={e => e.stopPropagation()}>

                {/* ── Cabeçalho ─────────────────────────────────── */}
                <div className="pub-modal__head">
                    <h2 className="pub-modal__title">Publicar música</h2>
                    <button type="button" className="pub-modal__close" onClick={handleClose} aria-label="Fechar">
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* ── Tabs ──────────────────────────────────────── */}
                <div className="pub-tabs">
                    <button type="button" className={'pub-tab' + (mode === 'track'   ? ' is-active' : '')} onClick={() => setMode('track')}>
                        Faixa
                    </button>
                    <button type="button" className={'pub-tab' + (mode === 'release' ? ' is-active' : '')} onClick={() => setMode('release')}>
                        Álbum / EP / Mixtape
                    </button>
                </div>

                {/* ── Formulário ────────────────────────────────── */}
                <form className="pub-form" onSubmit={handleSubmit}>
                    <div className="pub-form__row">
                        <DropZone label="Capa" hint="JPG/PNG · quadrada · máx. 5 MB" accept="image/*"
                                  icon={FaImage} file={cover} onPick={setCover} />

                        <div className="pub-form__fields">
                            <label className="settings-field">
                                <span className="settings-field__label">Título</span>
                                <input className="input" value={title}
                                       onChange={e => setTitle(e.target.value)}
                                       placeholder={mode === 'track' ? 'Nome da faixa' : 'Nome do álbum/EP/mixtape'} />
                            </label>
                            <div className="pub-form__fields-2col">
                                <label className="settings-field">
                                    <span className="settings-field__label">Género</span>
                                    <select className="input" value={genre} onChange={e => setGenre(e.target.value)}>
                                        {GENRES.map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </label>
                                {mode === 'release' && (
                                    <label className="settings-field">
                                        <span className="settings-field__label">Tipo</span>
                                        <select className="input" value={releaseType} onChange={e => setReleaseType(e.target.value)}>
                                            <option>Álbum</option><option>EP</option><option>Mixtape</option>
                                        </select>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {mode === 'track' ? (
                        <DropZone label="Ficheiro de áudio" hint="MP3/WAV · máx. 60 MB" accept="audio/*"
                                  icon={FaMusic} file={audio} onPick={setAudio} />
                    ) : (
                        <div className="pub-tracks">
                            <div className="pub-tracks__head">
                                <span className="settings-field__label">Faixas · {tracks.length}</span>
                                <button type="button" className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}
                                        onClick={addTrackRow}>
                                    <FaPlus size={10} /> Adicionar faixa
                                </button>
                            </div>
                            {tracks.map((t, i) => (
                                <TrackRow key={i} track={t}
                                          onChange={next => updateTrackRow(i, next)}
                                          onRemove={() => tracks.length > 1 && removeTrackRow(i)} />
                            ))}
                        </div>
                    )}

                    {error && (
                        <p className="settings-msg settings-msg--error">
                            <FaExclamationTriangle size={12} /> {error}
                        </p>
                    )}

                    <div className="pub-modal__footer">
                        <button type="button" className="pub-modal__cancel" onClick={handleClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'A publicar…' : 'Publicar'}
                        </button>
                    </div>
                </form>

            </div>
        </div>,
        document.body
    );
}
