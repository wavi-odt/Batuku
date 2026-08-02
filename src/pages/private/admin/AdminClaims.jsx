import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../utils/auth.js'
import './AdminHome.css'
import './AdminClaims.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api/admin/artist-claims`

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
    const [detail, setDetail]             = useState(null);
    const [detailLoading, setDetailLoad]  = useState(false);
    const [detailError, setDetailError]   = useState('');
    const [success, setSuccess]           = useState('');
    const [actionBusy, setActionBusy]     = useState(false);
    const [confirm, setConfirm]           = useState(null); // { id, action } | null
    const [actionErr, setActionErr]       = useState('');

    useEffect(() => {
        fetch(API, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(res => res.ok ? res.json() : Promise.reject(new Error(`Erro ${res.status}`)))
            .then(data => setClaims(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function openDetail(id) {
        if (selectedId === id) {
            setSelectedId(null);
            setDetail(null);
            return;
        }
        setSelectedId(id);
        setDetail(null);
        setDetailError('');
        setDetailLoad(true);
        fetch(`${API}/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(res => res.ok ? res.json() : Promise.reject(new Error(`Erro ${res.status}`)))
            .then(data => setDetail(data))
            .catch(err => setDetailError(err.message))
            .finally(() => setDetailLoad(false));
    }

    function closeDetail() {
        setSelectedId(null);
        setDetail(null);
    }

    async function handleAction() {
        if (!confirm) return;
        const { id, action } = confirm;
        const label = action === 'verify' ? 'verificado' : 'duvidoso';
        setActionBusy(true);
        setActionErr('');
        try {
            const res = await fetch(`${API}/${id}/${action}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            setClaims(prev => prev.filter(c => c.id !== id));
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
        <div className="admin-page">
            <div className={`admin-page__inner${hasSplit ? ' admin-page__inner--wide' : ''}`}>
                <header className="admin-head">
                    <div className="admin-head__row">
                        <div>
                            <Link to="/admin" className="admin-back">← Administração</Link>
                            <h1 className="admin-head__title">Reclamações de perfil</h1>
                            <p className="admin-head__sub">Revê e aprova pedidos de artistas a reclamar o seu perfil importado.</p>
                        </div>
                    </div>
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
                                    key={claim.id}
                                    className={`claims-row${selectedId === claim.id ? ' claims-row--active' : ''}`}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openDetail(claim.id)}
                                    onKeyDown={e => e.key === 'Enter' && openDetail(claim.id)}
                                >
                                    <div className="claims-row__artist">{claim.artistName}</div>
                                    <div className="claims-row__user">{claim.userName ?? claim.email}</div>
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
                                                onClick={() => { setActionErr(''); setConfirm({ id: detail.id, action: 'verify' }); }}
                                            >
                                                Marcar como verificado
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-danger"
                                                onClick={() => { setActionErr(''); setConfirm({ id: detail.id, action: 'doubtful' }); }}
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
        </div>

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
