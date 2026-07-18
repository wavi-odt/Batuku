import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SiSpotify } from 'react-icons/si'
import { FaCamera, FaRedo, FaCheck, FaFileImage } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken } from '../../../utils/auth.js'
import './ClaimProfile.css'

const STEPS = ['Perfil Spotify', 'Selfie', 'Documento', 'Confirmar'];
const DEBOUNCE_MS = 400;
const MIN_QUERY   = 2;

/* ── Step 1: Pesquisa Spotify ────────────────────────────────────────── */
function StepSpotify({ selected, onSelect, onNext }) {
    const [query,   setQuery]   = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    function handleChange(e) {
        const q = e.target.value;
        setQuery(q);
        clearTimeout(timerRef.current);
        if (q.length < MIN_QUERY) { setResults([]); return; }
        setLoading(true);
        timerRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/spotify/search/artists?q=${encodeURIComponent(q)}`,
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setResults(res.ok ? await res.json() : []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, DEBOUNCE_MS);
    }

    return (
        <div className="claim-step">
            <h2 className="claim-step__title">Qual é o teu perfil no Spotify?</h2>
            <p className="claim-step__desc">
                Pesquisa pelo teu nome artístico e seleciona o perfil correto.
                O admin irá confirmar a correspondência na fase de revisão.
            </p>

            <div className="claim-search">
                <SiSpotify size={15} className="claim-search__icon" style={{ color: '#1DB954' }} />
                <input
                    className="claim-search__input"
                    type="text"
                    placeholder="Nome artístico…"
                    value={query}
                    onChange={handleChange}
                    autoFocus
                />
                {loading && <span className="claim-search__spinner" />}
            </div>

            {results.length > 0 && (
                <ul className="claim-artists">
                    {results.map(a => (
                        <li
                            key={a.id}
                            className={'claim-artist' + (selected?.id === a.id ? ' is-selected' : '')}
                            onClick={() => onSelect(a)}
                        >
                            {a.imageUrl
                                ? <img src={a.imageUrl} alt={a.name} className="claim-artist__img" />
                                : <div className="claim-artist__img claim-artist__img--placeholder" />
                            }
                            <div className="claim-artist__info">
                                <div className="claim-artist__name">{a.name}</div>
                                {(a.followers != null || a.genres?.length > 0) && (
                                    <div className="claim-artist__meta">
                                        {a.followers != null && `${a.followers.toLocaleString('pt-PT')} seguidores`}
                                        {a.followers != null && a.genres?.length > 0 && ' · '}
                                        {a.genres?.[0]}
                                    </div>
                                )}
                            </div>
                            {selected?.id === a.id && (
                                <span className="claim-artist__check"><FaCheck size={11} /></span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {selected && (
                <div className="claim-selected-badge">
                    <FaCheck size={11} />
                    <strong>{selected.name}</strong> selecionado
                </div>
            )}

            <div className="claim-step__footer">
                <button className="btn-primary" onClick={onNext} disabled={!selected}>
                    Próximo →
                </button>
            </div>
        </div>
    );
}

/* ── Step 2: Selfie ──────────────────────────────────────────────────── */
function StepSelfie({ blob, onCapture, onNext, onBack }) {
    const videoRef  = useRef(null);
    const streamRef = useRef(null);
    const [ready,   setReady]   = useState(false);
    const [camErr,  setCamErr]  = useState('');
    const [preview, setPreview] = useState(() => blob ? URL.createObjectURL(blob) : null);

    useEffect(() => {
        if (!blob) startCamera();
        return stopCamera;
    }, []);

    async function startCamera() {
        setCamErr('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setReady(true);
        } catch {
            setCamErr('Não foi possível aceder à câmara. Verifica as permissões do browser.');
        }
    }

    function stopCamera() {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setReady(false);
    }

    function handleCapture() {
        const v = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width  = v.videoWidth  || 640;
        canvas.height = v.videoHeight || 480;
        canvas.getContext('2d').drawImage(v, 0, 0);
        canvas.toBlob(b => {
            stopCamera();
            setPreview(URL.createObjectURL(b));
            onCapture(b);
        }, 'image/jpeg', 0.92);
    }

    function handleRetake() {
        setPreview(null);
        onCapture(null);
        startCamera();
    }

    return (
        <div className="claim-step">
            <h2 className="claim-step__title">Tira uma selfie</h2>
            <p className="claim-step__desc">
                Olha diretamente para a câmara com boa iluminação. A foto tem de ser tirada
                agora — não são aceites imagens carregadas de ficheiro.
            </p>

            <div className="claim-camera">
                {!preview ? (
                    <>
                        <video ref={videoRef} className="claim-camera__video claim-camera__video--mirror" muted playsInline />
                        {!ready && !camErr && (
                            <div className="claim-camera__overlay">A iniciar câmara…</div>
                        )}
                        {camErr && (
                            <div className="claim-camera__overlay claim-camera__overlay--err">{camErr}</div>
                        )}
                        {ready && (
                            <button className="claim-camera__shutter" onClick={handleCapture} aria-label="Tirar selfie">
                                <FaCamera size={20} />
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <img src={preview} alt="Selfie" className="claim-camera__preview" />
                        <button className="claim-camera__retake" onClick={handleRetake}>
                            <FaRedo size={11} /> Repetir
                        </button>
                    </>
                )}
            </div>

            <div className="claim-step__footer">
                <button className="btn-ghost" onClick={onBack}>← Voltar</button>
                <button className="btn-primary" onClick={onNext} disabled={!preview}>
                    Próximo →
                </button>
            </div>
        </div>
    );
}

/* ── Step 3: Documento ───────────────────────────────────────────────── */
function StepDocument({ blob, onCapture, onNext, onBack }) {
    const [mode,    setMode]    = useState('camera');
    const videoRef  = useRef(null);
    const streamRef = useRef(null);
    const fileRef   = useRef(null);
    const [ready,   setReady]   = useState(false);
    const [camErr,  setCamErr]  = useState('');
    const [preview, setPreview] = useState(() => blob ? URL.createObjectURL(blob) : null);

    useEffect(() => {
        if (mode === 'camera' && !preview) startCamera();
        return stopCamera;
    }, [mode]);

    async function startCamera() {
        setCamErr('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setReady(true);
        } catch {
            setCamErr('Não foi possível aceder à câmara. Verifica as permissões do browser.');
        }
    }

    function stopCamera() {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setReady(false);
    }

    function handleCapture() {
        const v = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width  = v.videoWidth  || 640;
        canvas.height = v.videoHeight || 480;
        canvas.getContext('2d').drawImage(v, 0, 0);
        canvas.toBlob(b => {
            stopCamera();
            setPreview(URL.createObjectURL(b));
            onCapture(b);
        }, 'image/jpeg', 0.92);
    }

    function handleRetake() {
        setPreview(null);
        onCapture(null);
        if (mode === 'camera') startCamera();
    }

    function switchMode(m) {
        stopCamera();
        setPreview(null);
        onCapture(null);
        setMode(m);
    }

    function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        onCapture(file);
    }

    return (
        <div className="claim-step">
            <h2 className="claim-step__title">Documento de identificação</h2>
            <p className="claim-step__desc">
                Tira uma foto ao teu Bilhete de Identidade ou Cartão de Cidadão.
                Certifica-te de que o nome e a foto estão legíveis e sem reflexos.
            </p>

            <div className="claim-doc-tabs">
                <button
                    className={'claim-doc-tab' + (mode === 'camera' ? ' is-active' : '')}
                    onClick={() => switchMode('camera')}
                >
                    <FaCamera size={12} /> Câmara
                </button>
                <button
                    className={'claim-doc-tab' + (mode === 'file' ? ' is-active' : '')}
                    onClick={() => switchMode('file')}
                >
                    <FaFileImage size={12} /> Ficheiro
                </button>
            </div>

            {mode === 'camera' && (
                <div className="claim-camera claim-camera--landscape">
                    {!preview ? (
                        <>
                            <video ref={videoRef} className="claim-camera__video" muted playsInline />
                            {!ready && !camErr && <div className="claim-camera__overlay">A iniciar câmara…</div>}
                            {camErr && <div className="claim-camera__overlay claim-camera__overlay--err">{camErr}</div>}
                            {ready && (
                                <button className="claim-camera__shutter" onClick={handleCapture} aria-label="Fotografar documento">
                                    <FaCamera size={20} />
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <img src={preview} alt="Documento" className="claim-camera__preview" />
                            <button className="claim-camera__retake" onClick={handleRetake}>
                                <FaRedo size={11} /> Repetir
                            </button>
                        </>
                    )}
                </div>
            )}

            {mode === 'file' && (
                <div
                    className={'claim-file-zone' + (preview ? ' has-file' : '')}
                    onClick={() => !preview && fileRef.current?.click()}
                >
                    {preview ? (
                        <>
                            <img src={preview} alt="Documento" className="claim-file-preview" />
                            <button
                                className="claim-camera__retake"
                                onClick={e => { e.stopPropagation(); handleRetake(); fileRef.current.value = ''; }}
                            >
                                <FaRedo size={11} /> Trocar
                            </button>
                        </>
                    ) : (
                        <>
                            <FaFileImage size={30} className="claim-file-zone__icon" />
                            <p className="claim-file-zone__label">Clica para selecionar ficheiro</p>
                            <p className="claim-file-zone__hint">JPG ou PNG · máx. 10 MB</p>
                        </>
                    )}
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="claim-file-input"
                        onChange={handleFile}
                    />
                </div>
            )}

            <div className="claim-step__footer">
                <button className="btn-ghost" onClick={onBack}>← Voltar</button>
                <button className="btn-primary" onClick={onNext} disabled={!blob}>
                    Próximo →
                </button>
            </div>
        </div>
    );
}

/* ── Step 4: Confirmação ──────────────────────────────────────────────── */
function StepConfirm({ spotifyArtist, selfieBlob, docBlob, onBack, onSubmit, submitting, error }) {
    const selfieUrl = selfieBlob ? URL.createObjectURL(selfieBlob) : null;
    const docUrl    = docBlob instanceof Blob ? URL.createObjectURL(docBlob) : null;
    const isPdf     = docBlob instanceof File && docBlob.type === 'application/pdf';

    return (
        <div className="claim-step">
            <h2 className="claim-step__title">Confirma os teus dados</h2>
            <p className="claim-step__desc">
                Revê a informação antes de enviar. O admin irá verificar a tua identidade
                e fazer o acerto da conta com o perfil Spotify.
            </p>

            <div className="claim-summary">
                <div className="claim-summary__row">
                    <span className="claim-summary__label">Spotify</span>
                    <div className="claim-summary__artist">
                        {spotifyArtist.imageUrl && (
                            <img src={spotifyArtist.imageUrl} alt={spotifyArtist.name} className="claim-summary__artist-img" />
                        )}
                        <span className="claim-summary__value">{spotifyArtist.name}</span>
                    </div>
                </div>
                <div className="claim-summary__row">
                    <span className="claim-summary__label">Selfie</span>
                    {selfieUrl && <img src={selfieUrl} alt="Selfie" className="claim-summary__thumb" />}
                </div>
                <div className="claim-summary__row">
                    <span className="claim-summary__label">Documento</span>
                    {!isPdf && docUrl && <img src={docUrl} alt="Documento" className="claim-summary__thumb" />}
                    {isPdf && <span className="claim-summary__value">PDF — {docBlob.name}</span>}
                </div>
            </div>

            <p className="claim-note">
                Ao enviar, confirmas que os documentos são genuínos e que és o titular do perfil Spotify indicado.
                Pedidos falsos resultam na suspensão da conta.
            </p>

            {error && <p className="claim-error">{error}</p>}

            <div className="claim-step__footer">
                <button className="btn-ghost" onClick={onBack} disabled={submitting}>← Voltar</button>
                <button className="btn-primary" onClick={onSubmit} disabled={submitting}>
                    {submitting ? 'A enviar…' : 'Enviar pedido'}
                </button>
            </div>
        </div>
    );
}

/* ── Sucesso ──────────────────────────────────────────────────────────── */
function StepSuccess() {
    return (
        <div className="claim-step claim-step--center">
            <div className="claim-success__icon">✓</div>
            <h2 className="claim-step__title">Pedido enviado!</h2>
            <p className="claim-step__desc">
                O admin irá verificar a tua identidade e fazer o acerto da conta.
                Receberás uma notificação quando o pedido for processado.
                O processo pode demorar até 48 horas.
            </p>
            <Link to="/dashboard" className="btn-primary">
                Voltar ao dashboard
            </Link>
        </div>
    );
}

/* ── Stepper indicator ────────────────────────────────────────────────── */
function Stepper({ current }) {
    return (
        <div className="claim-stepper">
            {STEPS.map((label, i) => (
                <div
                    key={label}
                    className={
                        'claim-stepper__step' +
                        (i === current ? ' is-active' : '') +
                        (i < current  ? ' is-done'   : '')
                    }
                >
                    <div className="claim-stepper__dot">
                        {i < current ? <FaCheck size={9} /> : i + 1}
                    </div>
                    <span className="claim-stepper__label">{label}</span>
                </div>
            ))}
        </div>
    );
}

/* ── Página principal ────────────────────────────────────────────────── */
export default function ClaimProfile() {
    const [step,          setStep]          = useState(0);
    const [spotifyArtist, setSpotifyArtist] = useState(null);
    const [selfieBlob,    setSelfieBlob]    = useState(null);
    const [docBlob,       setDocBlob]       = useState(null);
    const [submitting,    setSubmitting]    = useState(false);
    const [submitErr,     setSubmitErr]     = useState('');
    const [done,          setDone]          = useState(false);

    async function handleSubmit() {
        setSubmitting(true);
        setSubmitErr('');
        try {
            const body = new FormData();
            body.append('spotifyArtistId', spotifyArtist.id);
            body.append('selfie',      selfieBlob, 'selfie.jpg');
            body.append('idDocument',  docBlob, docBlob instanceof File ? docBlob.name : 'document.jpg');
            const res = await fetch('http://localhost:8080/api/artist-claims', {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
                body,
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            setDone(true);
        } catch (e) {
            setSubmitErr(e.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AppShell role="artist">
            <div className="claim-page">
                <Link to="/dashboard" className="claim-back">← Dashboard</Link>
                <h1 className="claim-page__title">Reclamar perfil Spotify</h1>

                {!done && <Stepper current={step} />}

                <div className="claim-card">
                    {done ? (
                        <StepSuccess />
                    ) : step === 0 ? (
                        <StepSpotify
                            selected={spotifyArtist}
                            onSelect={setSpotifyArtist}
                            onNext={() => setStep(1)}
                        />
                    ) : step === 1 ? (
                        <StepSelfie
                            blob={selfieBlob}
                            onCapture={setSelfieBlob}
                            onNext={() => setStep(2)}
                            onBack={() => setStep(0)}
                        />
                    ) : step === 2 ? (
                        <StepDocument
                            blob={docBlob}
                            onCapture={setDocBlob}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                        />
                    ) : (
                        <StepConfirm
                            spotifyArtist={spotifyArtist}
                            selfieBlob={selfieBlob}
                            docBlob={docBlob}
                            onBack={() => setStep(2)}
                            onSubmit={handleSubmit}
                            submitting={submitting}
                            error={submitErr}
                        />
                    )}
                </div>
            </div>
        </AppShell>
    );
}
