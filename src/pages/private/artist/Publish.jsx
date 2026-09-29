/* ─────────────────────────────────────────────────────────────────
   Publish.jsx  ·  Modal de publicação de faixa / álbum.
   Montado globalmente em App.jsx; aberto via usePublish().
   ───────────────────────────────────────────────────────────────── */

import { useState, useRef, useEffect } from 'react'
import { createPortal }   from 'react-dom'
import { FaMusic, FaImage, FaTrash, FaPlus, FaExclamationTriangle, FaTimes, FaCheck, FaChevronDown, FaCalendarAlt } from 'react-icons/fa'
import { getToken }       from '../../../utils/auth.js'
import { usePublish }     from '../../../context/PublishContext.jsx'
import { useToast }       from '../../../context/ToastContext.jsx'
import { useGenres }      from '../../../context/GenresContext.jsx'
import './Publish.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api`
const MAX_AUDIO = 300 * 1024 * 1024;
const MAX_IMAGE  =  5 * 1024 * 1024;

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAYS_PT   = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']
function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function DateTimePicker({ value, onChange, min }) {
    const now     = new Date()
    const parsed  = value ? new Date(value) : null
    const minDate = min   ? new Date(min)   : null

    const [open,      setOpen]      = useState(false)
    const [viewYear,  setViewYear]  = useState(parsed?.getFullYear()  ?? now.getFullYear())
    const [viewMonth, setViewMonth] = useState(parsed?.getMonth()     ?? now.getMonth())
    const [selDate,   setSelDate]   = useState(
        parsed ? `${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,'0')}-${String(parsed.getDate()).padStart(2,'0')}` : ''
    )
    const [selTime,   setSelTime]   = useState(
        parsed ? `${String(parsed.getHours()).padStart(2,'0')}:${String(parsed.getMinutes()).padStart(2,'0')}` : '12:00'
    )
    const [timeOpen,  setTimeOpen]  = useState(false)

    const [panelPos, setPanelPos] = useState({ top: 0, bottom: 'auto', left: 0, width: 0, maxHeight: 'none' })
    const btnRef    = useRef(null)
    const panelRef  = useRef(null)
    const hourColRef = useRef(null)
    const minColRef  = useRef(null)

    useEffect(() => {
        if (!timeOpen) return
        const scrollTo = (colRef) => {
            const sel = colRef.current?.querySelector('.pub-dtp__time-opt--sel')
            if (sel) sel.scrollIntoView({ block: 'center', behavior: 'instant' })
        }
        scrollTo(hourColRef)
        scrollTo(minColRef)
    }, [timeOpen])

    useEffect(() => {
        if (!open) return
        function onDown(e) {
            if (!btnRef.current?.contains(e.target) && !panelRef.current?.contains(e.target))
                setOpen(false)
        }
        document.addEventListener('mousedown', onDown, true)
        return () => document.removeEventListener('mousedown', onDown, true)
    }, [open])

    function handleOpen() {
        if (btnRef.current) {
            const r        = btnRef.current.getBoundingClientRect()
            const w        = 272
            const gap      = 6
            const estH     = 340
            const left     = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8))
            const fitsBelow = window.innerHeight - r.bottom - gap >= estH

            if (fitsBelow) {
                setPanelPos({ top: r.bottom + gap, bottom: 'auto', left, width: w, maxHeight: window.innerHeight - r.bottom - gap - 8 })
            } else {
                setPanelPos({ top: 'auto', bottom: window.innerHeight - r.top + gap, left, width: w, maxHeight: r.top - gap - 8 })
            }
        }
        setOpen(o => !o)
    }

    function getDays() {
        let dow = new Date(viewYear, viewMonth, 1).getDay()
        dow = dow === 0 ? 6 : dow - 1
        const lastPrev   = new Date(viewYear, viewMonth, 0)
        const daysInMon  = new Date(viewYear, viewMonth + 1, 0).getDate()
        const days = []
        for (let i = dow - 1; i >= 0; i--)
            days.push({ date: new Date(lastPrev.getFullYear(), lastPrev.getMonth(), lastPrev.getDate() - i), overflow: true })
        for (let d = 1; d <= daysInMon; d++)
            days.push({ date: new Date(viewYear, viewMonth, d), overflow: false })
        let nd = 1
        while (days.length % 7 !== 0)
            days.push({ date: new Date(viewYear, viewMonth + 1, nd++), overflow: true })
        return days
    }

    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
        else setViewMonth(m => m - 1)
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
        else setViewMonth(m => m + 1)
    }

    function selectDay(d) {
        if (isDisabled(d)) return
        const dt = d.date
        const ds = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
        setSelDate(ds)
        onChange(`${ds}T${selTime}`)
        if (d.overflow) { setViewYear(dt.getFullYear()); setViewMonth(dt.getMonth()) }
    }

    function pickHour(h) {
        const [, m] = selTime.split(':')
        const t = `${h}:${m}`
        setSelTime(t)
        if (selDate) onChange(`${selDate}T${t}`)
    }
    function pickMinute(m) {
        const [h] = selTime.split(':')
        const t = `${h}:${m}`
        setSelTime(t)
        if (selDate) onChange(`${selDate}T${t}`)
    }

    function isSelected(d) {
        if (!selDate) return false
        const [y, mo, day] = selDate.split('-').map(Number)
        return isSameDay(d.date, new Date(y, mo - 1, day))
    }
    function isToday(d)    { return isSameDay(d.date, now) }
    function isDisabled(d) {
        if (!minDate) return false
        return d.date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    }

    function formatDisplay() {
        if (!selDate) return null
        const [y, mo, day] = selDate.split('-').map(Number)
        return new Date(y, mo - 1, day).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }) + ' às ' + selTime
    }

    const days    = getDays()
    const display = formatDisplay()

    return (
        <div className="pub-dtp">
            <button
                ref={btnRef}
                type="button"
                className={'pub-dtp__trigger' + (open ? ' pub-dtp__trigger--open' : '')}
                onClick={handleOpen}
            >
                <FaCalendarAlt size={13} className="pub-dtp__trigger-icon" />
                <span className={display ? 'pub-dtp__trigger-value' : 'pub-dtp__trigger-placeholder'}>
                    {display || 'Escolhe uma data e hora'}
                </span>
                <FaChevronDown size={9} className={'pub-dtp__chevron' + (open ? ' pub-dtp__chevron--open' : '')} />
            </button>

            {open && createPortal(
                <div
                    ref={panelRef}
                    className="pub-dtp__panel"
                    style={{ position: 'fixed', top: panelPos.top, bottom: panelPos.bottom, left: panelPos.left, width: panelPos.width, maxHeight: panelPos.maxHeight }}
                >
                    <div className="pub-dtp__nav">
                        <button type="button" className="pub-dtp__nav-btn" onClick={prevMonth}>‹</button>
                        <span className="pub-dtp__nav-title">{MONTHS_PT[viewMonth]} {viewYear}</span>
                        <button type="button" className="pub-dtp__nav-btn" onClick={nextMonth}>›</button>
                    </div>

                    <div className="pub-dtp__grid">
                        {DAYS_PT.map(d => <div key={d} className="pub-dtp__day-hd">{d}</div>)}
                        {days.map((d, i) => (
                            <button
                                key={i}
                                type="button"
                                className={
                                    'pub-dtp__day' +
                                    (d.overflow                   ? ' pub-dtp__day--overflow' : '') +
                                    (isSelected(d)                ? ' pub-dtp__day--selected' : '') +
                                    (isToday(d) && !isSelected(d) ? ' pub-dtp__day--today'    : '') +
                                    (isDisabled(d)                ? ' pub-dtp__day--disabled' : '')
                                }
                                onClick={() => selectDay(d)}
                                disabled={isDisabled(d)}
                            >
                                {d.date.getDate()}
                            </button>
                        ))}
                    </div>

                    <div className="pub-dtp__time">
                        <span className="pub-dtp__time-label">Hora</span>
                        <button
                            type="button"
                            className={'pub-dtp__time-btn' + (timeOpen ? ' pub-dtp__time-btn--open' : '')}
                            onClick={() => setTimeOpen(o => !o)}
                        >
                            {selTime}
                            <FaChevronDown size={7} className={'pub-dtp__chevron' + (timeOpen ? ' pub-dtp__chevron--open' : '')} />
                        </button>
                    </div>
                    {timeOpen && (
                        <div className="pub-dtp__time-menu">
                            <div className="pub-dtp__time-col" ref={hourColRef}>
                                {Array.from({length: 24}, (_, i) => String(i).padStart(2,'0')).map(h => (
                                    <button key={h} type="button"
                                        className={'pub-dtp__time-opt' + (selTime.split(':')[0] === h ? ' pub-dtp__time-opt--sel' : '')}
                                        onClick={() => pickHour(h)}
                                    >{h}</button>
                                ))}
                            </div>
                            <div className="pub-dtp__time-col" ref={minColRef}>
                                {Array.from({length: 12}, (_, i) => String(i * 5).padStart(2,'0')).map(m => (
                                    <button key={m} type="button"
                                        className={'pub-dtp__time-opt' + (selTime.split(':')[1] === m ? ' pub-dtp__time-opt--sel' : '')}
                                        onClick={() => { pickMinute(m); setTimeOpen(false) }}
                                    >{m}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    )
}

function PubDropdown({ value, onChange, options, placeholder }) {
    const [open,    setOpen]    = useState(false)
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 })
    const btnRef  = useRef(null)
    const menuRef = useRef(null)

    useEffect(() => {
        if (!open) return
        function onDown(e) {
            if (!btnRef.current?.contains(e.target) && !menuRef.current?.contains(e.target))
                setOpen(false)
        }
        document.addEventListener('mousedown', onDown, true)
        return () => document.removeEventListener('mousedown', onDown, true)
    }, [open])

    function handleOpen() {
        if (btnRef.current) {
            const r = btnRef.current.getBoundingClientRect()
            setMenuPos({ top: r.bottom + 5, left: r.left, width: r.width })
        }
        setOpen(o => !o)
    }

    return (
        <div className="pub-dd">
            <button
                ref={btnRef}
                type="button"
                className={'pub-dd__btn' + (open ? ' pub-dd__btn--open' : '')}
                onClick={handleOpen}
            >
                <span className={value ? '' : 'pub-dd__placeholder'}>
                    {value || placeholder || '—'}
                </span>
                <FaChevronDown size={9} className={'pub-dd__chevron' + (open ? ' pub-dd__chevron--open' : '')} />
            </button>
            {open && createPortal(
                <div
                    ref={menuRef}
                    className="pub-dd__menu"
                    style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, width: menuPos.width }}
                >
                    {placeholder && (
                        <button
                            type="button"
                            className={'pub-dd__option' + (!value ? ' pub-dd__option--active' : '')}
                            onClick={() => { onChange(''); setOpen(false) }}
                        >
                            <span className="pub-dd__check">{!value && <FaCheck size={8} />}</span>
                            {placeholder}
                        </button>
                    )}
                    {options.map(o => (
                        <button
                            key={o}
                            type="button"
                            className={'pub-dd__option' + (o === value ? ' pub-dd__option--active' : '')}
                            onClick={() => { onChange(o); setOpen(false) }}
                        >
                            <span className="pub-dd__check">{o === value && <FaCheck size={8} />}</span>
                            {o}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    )
}

function DropZone({ label, hint, accept, file, onPick, icon: Icon }) {
    const ref = useRef(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!file || !file.type?.startsWith('image/')) { setPreview(null); return; }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <div
            className={'pub-drop' + (file ? ' pub-drop--ready' : '') + (preview ? ' pub-drop--has-preview' : '')}
            onClick={() => ref.current?.click()}
        >
            <input ref={ref} type="file" accept={accept} className="pub-drop__input"
                   onChange={e => onPick(e.target.files?.[0] || null)} />
            {preview ? (
                <>
                    <img src={preview} alt="" className="pub-drop__img" />
                    <div className="pub-drop__img-overlay">Trocar capa</div>
                </>
            ) : (
                <>
                    <Icon size={22} className="pub-drop__icon" />
                    {file
                        ? <p className="pub-drop__hint"><strong>{file.name}</strong><span className="pub-drop__sub"> · clica para trocar</span></p>
                        : <><p className="pub-drop__hint">{label}</p><p className="pub-drop__sub">{hint}</p></>}
                </>
            )}
        </div>
    );
}

function TrackRow({ track, onChange, onRemove, genres }) {
    return (
        <div className="pub-track-row">
            <input className="input" placeholder="Título da faixa" value={track.title}
                   onChange={e => onChange({ ...track, title: e.target.value })} />
            <PubDropdown
                value={track.genre}
                onChange={v => onChange({ ...track, genre: v })}
                options={genres}
                placeholder="Sem género"
            />
            <DropZone label="Áudio" hint="MP3/WAV" accept="audio/*" icon={FaMusic}
                      file={track.audio} onPick={f => onChange({ ...track, audio: f })} />
            <button type="button" className="pub-track-row__remove" onClick={onRemove} aria-label="Remover faixa">
                <FaTrash size={12} />
            </button>
        </div>
    );
}

export default function PublishModal() {
    const { isOpen, closePublish, notifyPublished, publishMode } = usePublish();
    const { showToast } = useToast();
    const { allNames: GENRES } = useGenres();

    const [mode,        setMode]        = useState(publishMode);
    const [title,       setTitle]       = useState('');
    const [genre,       setGenre]       = useState(GENRES[0]);
    const [releaseType, setReleaseType] = useState('Álbum');
    const [cover,       setCover]       = useState(null);
    const [audio,       setAudio]       = useState(null);
    const [tracks,      setTracks]      = useState([{ title: '', audio: null, genre: 'Batuku' }]);
    const [schedule,    setSchedule]    = useState(false);
    const [scheduledAt, setScheduledAt] = useState('');
    const [submitting,  setSubmitting]  = useState(false);
    const [progress,    setProgress]    = useState('');
    const [error,       setError]       = useState('');

    /* Sincroniza o modo ao abrir */
    useEffect(() => {
        if (isOpen) setMode(publishMode);
    }, [isOpen]); // eslint-disable-line

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
        setTracks([{ title: '', audio: null, genre: 'Batuku' }]); setSchedule(false); setScheduledAt('');
        setError(''); setProgress('');
    }

    function handleClose() { reset(); closePublish(); }

    function addTrackRow()          { setTracks(p => [...p, { title: '', audio: null, genre: 'Batuku' }]); }
    function updateTrackRow(i, t)   { setTracks(p => p.map((r, idx) => idx === i ? t : r)); }
    function removeTrackRow(i)      { setTracks(p => p.filter((_, idx) => idx !== i)); }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(''); setProgress('');

        if (!title.trim()) { setError('Dá um título à publicação.'); return; }
        if (mode === 'track' && !audio) { setError('Escolhe o ficheiro de áudio.'); return; }
        if (mode === 'release' && tracks.some(t => !t.title.trim() || !t.audio)) {
            setError('Preenche o título e o áudio de todas as faixas.'); return;
        }
        if (audio && audio.size > MAX_AUDIO) { setError('O áudio não pode ultrapassar 60 MB.'); return; }
        if (mode === 'release' && tracks.some(t => t.audio && t.audio.size > MAX_AUDIO)) {
            setError('Um ou mais ficheiros de áudio ultrapassam os 60 MB.'); return;
        }
        if (cover && cover.size > MAX_IMAGE)  { setError('A capa não pode ultrapassar 5 MB.');  return; }

        const headers = { Authorization: `Bearer ${getToken()}` };
        setSubmitting(true);

        /* ── Faixa única ───────────────────────────────────────────── */
        if (mode === 'track') {
            try {
                setProgress(schedule ? 'A agendar faixa…' : 'A enviar faixa…');
                const body = new FormData();
                body.append('title', title);
                body.append('genre', genre);
                body.append('audio', audio);
                if (cover) body.append('cover', cover);
                if (schedule && scheduledAt) body.append('scheduledAt', new Date(scheduledAt).toISOString().slice(0, 19));
                const res = await fetch(`${API}/tracks`, { method: 'POST', headers, body });
                if (!res.ok) throw new Error(`Erro ${res.status}`);
                notifyPublished();
                handleClose();
                showToast(schedule ? 'Faixa agendada com sucesso!' : 'Faixa publicada com sucesso!');
            } catch (err) {
                setError(err.message);
            } finally {
                setSubmitting(false);
            }
            return;
        }

        /* ── Álbum: upload sequencial ──────────────────────────────── */
        let albumId = null;
        try {
            // Passo 1: criar draft com metadata + capa
            setProgress('A criar álbum…');
            const draftBody = new FormData();
            draftBody.append('title', title);
            draftBody.append('genre', genre);
            draftBody.append('releaseType', releaseType);
            if (cover) draftBody.append('cover', cover);
            const draftRes = await fetch(`${API}/releases`, { method: 'POST', headers, body: draftBody });
            if (!draftRes.ok) throw new Error(`Erro ao criar álbum (${draftRes.status})`);
            const draft = await draftRes.json();
            albumId = draft.id;

            // Passo 2: enviar cada faixa individualmente
            for (let i = 0; i < tracks.length; i++) {
                const t = tracks[i];
                setProgress(`A enviar faixa ${i + 1} de ${tracks.length}: "${t.title}"…`);
                const trackBody = new FormData();
                trackBody.append('title', t.title);
                if (t.genre) trackBody.append('genre', t.genre);
                trackBody.append('audio', t.audio);
                const trackRes = await fetch(`${API}/releases/${albumId}/tracks`, { method: 'POST', headers, body: trackBody });
                if (!trackRes.ok) throw new Error(`Erro na faixa ${i + 1} (${trackRes.status})`);
            }

            // Passo 3: publicar / agendar
            setProgress(schedule ? 'A agendar lançamento…' : 'A publicar…');
            const pubBody = new FormData();
            if (schedule && scheduledAt) pubBody.append('scheduledAt', new Date(scheduledAt).toISOString().slice(0, 19));
            const pubRes = await fetch(`${API}/releases/${albumId}/publish`, { method: 'POST', headers, body: pubBody });
            if (!pubRes.ok) throw new Error(`Erro ao publicar (${pubRes.status})`);

            notifyPublished();
            handleClose();
            showToast(schedule ? 'Lançamento agendado com sucesso!' : 'Lançamento publicado com sucesso!');
        } catch (err) {
            setError(err.message);
            // Limpa o draft se foi criado e falhou a meio
            if (albumId) {
                fetch(`${API}/releases/${albumId}/draft`, { method: 'DELETE', headers }).catch(() => {});
            }
        } finally {
            setSubmitting(false);
            setProgress('');
        }
    }

    if (!isOpen) return null;

    return createPortal(
        <div className="pub-overlay" onMouseDown={handleClose}>
            <div className="pub-modal" onMouseDown={e => e.stopPropagation()}>

                {/* ── Cabeçalho + Tabs (sticky) ─────────────────── */}
                <div className="pub-modal__top">
                    <div className="pub-modal__head">
                        <h2 className="pub-modal__title">Publicar música</h2>
                        <button type="button" className="pub-modal__close" onClick={handleClose} aria-label="Fechar">
                            <FaTimes size={14} />
                        </button>
                    </div>
                    <div className="pub-tabs">
                        <button type="button" className={'pub-tab' + (mode === 'track'   ? ' is-active' : '')} onClick={() => setMode('track')}>
                            Faixa
                        </button>
                        <button type="button" className={'pub-tab' + (mode === 'release' ? ' is-active' : '')} onClick={() => setMode('release')}>
                            Álbum / EP / Mixtape
                        </button>
                    </div>
                </div>

                {/* ── Formulário ────────────────────────────────── */}
                <div className="pub-modal__body">
                <form id="pub-form" className="pub-form" onSubmit={handleSubmit}>
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
                                    <PubDropdown value={genre} onChange={setGenre} options={GENRES} />
                                </label>
                                {mode === 'release' && (
                                    <label className="settings-field">
                                        <span className="settings-field__label">Tipo</span>
                                        <PubDropdown value={releaseType} onChange={setReleaseType} options={['Álbum', 'EP', 'Mixtape']} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {mode === 'track' ? (
                        <DropZone label="Ficheiro de áudio" hint="MP3/WAV · máx. 300 MB" accept="audio/*"
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
                                          onRemove={() => tracks.length > 1 && removeTrackRow(i)}
                                          genres={GENRES} />
                            ))}
                        </div>
                    )}

                    {error && (
                        <p className="settings-msg settings-msg--error">
                            <FaExclamationTriangle size={12} /> {error}
                        </p>
                    )}

                    <div className="pub-schedule">
                        <div className="pub-schedule__row">
                            <div className="pub-schedule__label">
                                <FaCalendarAlt size={12} />
                                Agendar publicação
                            </div>
                            <label className="pub-schedule__switch">
                                <input
                                    type="checkbox"
                                    checked={schedule}
                                    onChange={e => { setSchedule(e.target.checked); if (!e.target.checked) setScheduledAt(''); }}
                                />
                                <span className="pub-schedule__slider" />
                            </label>
                        </div>
                        {schedule && (
                            <div className="pub-schedule__picker">
                                <DateTimePicker
                                    value={scheduledAt}
                                    onChange={setScheduledAt}
                                    min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                                />
                                <p className="pub-schedule__hint">
                                    {mode === 'track'
                                        ? 'A faixa ficará visível apenas a partir desta data e hora.'
                                        : 'O lançamento ficará visível apenas a partir desta data e hora.'}
                                </p>
                            </div>
                        )}
                    </div>

                </form>
                </div>

                <div className="pub-modal__footer">
                    <button type="button" className="pub-modal__cancel" onClick={handleClose} disabled={submitting}>
                        Cancelar
                    </button>
                    <button type="submit" form="pub-form" className="btn-primary" disabled={submitting}>
                        {progress || (schedule && scheduledAt ? 'Agendar' : 'Publicar')}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
