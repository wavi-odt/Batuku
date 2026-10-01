import { useEffect, useState } from 'react'
import { getToken } from '../../../utils/auth.js'
import AdminShell from './AdminShell.jsx'
import './AdminHome.css'
import './AdminClaims.css'

const API          = `${import.meta.env.VITE_API_BASE_URL}/api/admin/artist-claims`
const PENDING_API  = `${import.meta.env.VITE_API_BASE_URL}/api/admin/pending-artist-claims`
const PROFILES_API = `${import.meta.env.VITE_API_BASE_URL}/api/admin/artist-profiles`

function ConfirmModal({ action, onConfirm, onCancel, busy, error }) {
    const isVerify = action === 'verify';
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">
                    {isVerify ? 'Marcar como verificado' : 'Marcar como duvidoso'}
                </h3>
                <p className="modal-body">
                    {isVerify
                        ? 'O artista será verificado e a conta ficará ligada ao perfil Spotify. Esta ação é irreversível.'
                        : 'O pedido será marcado como duvidoso e o artista receberá um email de notificação. Esta ação é irreversível.'}
                </p>
                {error && <p className="modal-error">{error}</p>}
                <div className="modal-actions">
                    <button className="btn-ghost" onClick={onCancel} disabled={busy}>Cancelar</button>
                    <button
                        className={isVerify ? 'btn btn--primary' : 'btn-danger'}
                        onClick={onConfirm}
                        disabled={busy}
                    >
                        {busy ? 'A processar…' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminClaims() {
    const [claims, setClaims]             = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState('');
    const [selectedId, setSelectedId]     = useState(null);
    const [selectedSource, setSelectedSource] = useState(null); // 'existing' | 'pending_registration'
    const [detail, setDetail]             = useState(null);
    const [detailLoading, setDetailLoad]  = useState(false);
    const [detailError, setDetailError]   = useState('');
    const [success, setSuccess]           = useState('');
    const [actionBusy, setActionBusy]     = useState(false);
    const [confirm, setConfirm]           = useState(null); // { id, source, action } | null
    const [actionErr, setActionErr]       = useState('');

    useEffect(() => {
        const headers = { Authorization: `Bearer ${getToken()}` };
        Promise.all([
            fetch(API,         { headers }).then(r => r.ok ? r.json() : []),
            fetch(PENDING_API, { headers }).then(r => r.ok ? r.json() : []),
        ])
            .then(([existing, pending]) => {
                const all = [
                    ...pending.map(c => ({ ...c, source: 'pending_registration' })),
                    ...existing.map(c => ({ ...c, source: 'existing' })),
                ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setClaims(all);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function openDetail(id, source) {
        if (selectedId === id) {
            setSelectedId(null);
            setSelectedSource(null);
            setDetail(null);
            return;
        }
        setSelectedId(id);
        setSelectedSource(source);
        setDetail(null);
        setDetailError('');
        setDetailLoad(true);
        const base = source === 'pending_registration' ? PENDING_API : API;
        fetch(`${base}/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(res => res.ok ? res.json() : Promise.reject(new Error(`Erro ${res.status}`)))
            .then(data => setDetail({ ...data, source }))
            .catch(err => setDetailError(err.message))
            .finally(() => setDetailLoad(false));
    }

    function closeDetail() {
        setSelectedId(null);
        setSelectedSource(null);
        setDetail(null);
    }

    async function handleAction() {
        if (!confirm) return;
        const { id, source, action } = confirm;
        const label = action === 'verify' ? 'verificado' : 'duvidoso';
        setActionBusy(true);
        setActionErr('');
        try {
            const base = source === 'pending_registration' ? PENDING_API : API;
            const res = await fetch(`${base}/${id}/${action}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);

            // Após verificar, garante que o perfil de artista existe em artist_profiles
            if (action === 'verify' && detail?.spotifyArtistId) {
                await fetch(`${PROFILES_API}/import`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({ spotifyArtistId: detail.spotifyArtistId }),
                }).catch(() => { /* ignora, perfil pode já existir */ });
            }

            setClaims(prev => prev.filter(c => !(c.id === id && c.source === source)));
            closeDetail();
            setConfirm(null);
            setSuccess(`Pedido marcado como ${label}.`);
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setActionErr(err.message);
        } finally {
            setActionBusy(false);
        }
    }

    const hasSplit = !!selectedId;

    return (
        <>
        <AdminShell>
            <div className={`admin-page__inner${hasSplit ? ' admin-page__inner--wide' : ''}`}>
                <header className="admin-head">
                    <h1 className="admin-head__title">Reclamações de perfil</h1>
                    <p className="admin-head__sub">Revê e aprova pedidos de artistas a reclamar o seu perfil importado.</p>
                </header>

                {success && (
                    <div className="claims-banner claims-banner--ok" role="status">
                        {success}
                    </div>
                )}

                {loading && <p className="claims-empty">A carregar…</p>}
                {!loading && error && <p className="claims-empty claims-empty--error">{error}</p>}
                {!loading && !error && claims.length === 0 && (
                    <p className="claims-empty">Sem pedidos pendentes.</p>
                )}

                {!loading && !error && claims.length > 0 && (
                    <div className={`claims-layout${hasSplit ? ' claims-layout--split' : ''}`}>

                        {/* ── Lista ──────────────────────────────────────── */}
                        <ul className="claims-list">
                            {claims.map(claim => (
                                <li
                                    key={`${claim.source}-${claim.id}`}
                                    className={`claims-row${selectedId === claim.id && selectedSource === claim.source ? ' claims-row--active' : ''}`}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openDetail(claim.id, claim.source)}
                                    onKeyDown={e => e.key === 'Enter' && openDetail(claim.id, claim.source)}
                                >
                                    <div className="claims-row__artist">{claim.artistName}</div>
                                    <div className="claims-row__user">
                                        {claim.userName ?? claim.userEmail ?? claim.email}
                                        {claim.source === 'pending_registration' && (
                                            <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--color-coral)', fontWeight: 600 }}>NOVO REGISTO</span>
                                        )}
                                    </div>
                                    <div className="claims-row__date">
                                        {new Date(claim.createdAt).toLocaleString('pt-PT')}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* ── Detalhe ────────────────────────────────────── */}
                        {hasSplit && (
                            <div className="claims-detail">
                                {detailLoading && <p className="claims-empty">A carregar detalhe…</p>}
                                {detailError && <p className="claims-empty claims-empty--error">{detailError}</p>}

                                {detail && (
                                    <>
                                        <div className="claims-detail__head">
                                            <div>
                                                <div className="claims-detail__artist">{detail.artistName}</div>
                                                <div className="claims-detail__user">{detail.userName ?? detail.email}</div>
                                                <div className="claims-detail__date">
                                                    {new Date(detail.createdAt).toLocaleString('pt-PT')}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="claims-detail__close"
                                                aria-label="Fechar detalhe"
                                                onClick={closeDetail}
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {detail.spotifyArtistName && (
                                            <div className="claims-spotify">
                                                {detail.spotifyArtistImageUrl && (
                                                    <img
                                                        src={detail.spotifyArtistImageUrl}
                                                        alt={detail.spotifyArtistName}
                                                        className="claims-spotify__img"
                                                    />
                                                )}
                                                <div className="claims-spotify__info">
                                                    <span className="claims-spotify__label">Perfil Spotify reclamado</span>
                                                    <span className="claims-spotify__name">{detail.spotifyArtistName}</span>
                                                    {detail.spotifyArtistId && (
                                                        <span className="claims-spotify__id">{detail.spotifyArtistId}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="claims-docs">
                                            <figure className="claims-doc">
                                                <figcaption className="claims-doc__label">Selfie</figcaption>
                                                <img
                                                    src={detail.selfieUrl}
                                                    alt="Selfie do requerente"
                                                    className="claims-doc__img"
                                                />
                                            </figure>
                                            <figure className="claims-doc">
                                                <figcaption className="claims-doc__label">Documento de identificação</figcaption>
                                                <img
                                                    src={detail.idDocumentUrl}
                                                    alt="Documento de identificação do requerente"
                                                    className="claims-doc__img"
                                                />
                                            </figure>
                                        </div>

                                        <div className="claims-actions">
                                            <button
                                                type="button"
                                                className="btn btn--primary"
                                                onClick={() => { setActionErr(''); setConfirm({ id: detail.id, source: detail.source, action: 'verify' }); }}
                                            >
                                                Marcar como verificado
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-danger"
                                                onClick={() => { setActionErr(''); setConfirm({ id: detail.id, source: detail.source, action: 'doubtful' }); }}
                                            >
                                                Marcar como duvidoso
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminShell>

        {confirm && (
            <ConfirmModal
                action={confirm.action}
                onConfirm={handleAction}
                onCancel={() => { setConfirm(null); setActionErr(''); }}
                busy={actionBusy}
                error={actionErr}
            />
        )}
        </>
    );
}
