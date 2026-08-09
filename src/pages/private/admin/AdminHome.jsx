/* ─────────────────────────────────────────────────────────────────
   pages/private/admin/AdminHome.jsx, Painel de administração.
   Rota /admin, acessível só a ROLE_ADMIN (ver RoleRoute.jsx).

   Ferramenta de trabalho interno (1-2 pessoas), não uma vitrine:
   sem hero, sem ilustração, só clareza e densidade de informação.
   Usa os tokens/classes globais (tokens.css, global.css: .btn-ghost,
   .card, .badge) tal como Profile.jsx. Layout próprio e independente
   (sem AppShell), simples cabeçalho + conteúdo.
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSpotify, FaFlag, FaExclamationTriangle, FaDatabase, FaCheckCircle, FaTimesCircle, FaPlay } from 'react-icons/fa'
import { logout, getToken } from '../../../utils/auth.js'
import './AdminHome.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api/admin`

const MIGRATIONS = [
    {
        key: 'artist-follows',
        title: 'Migrar follows de artistas',
        desc: 'Move registos antigos da tabela follows para artist_follows quando o followee tem perfil de artista. Seguro de correr múltiplas vezes.',
        endpoint: `${import.meta.env.VITE_API_BASE_URL}/api/admin/migrate/artist-follows`,
        resultKeys: [
            { key: 'migrated', label: 'migrados'               },
            { key: 'deleted',  label: 'removidos de follows'    },
            { key: 'skipped',  label: 'ignorados (não artistas)'},
        ],
    },
    {
        key: 'track-durations',
        title: 'Preencher durações de faixas',
        desc: 'Calcula e preenche durationMs em todas as faixas UPLOAD sem duração registada.',
        endpoint: `${import.meta.env.VITE_API_BASE_URL}/api/admin/migrate/track-durations`,
        resultKeys: [
            { key: 'total',   label: 'total'       },
            { key: 'updated', label: 'atualizadas' },
            { key: 'skipped', label: 'ignoradas'   },
        ],
    },
];

const TOOLS = [
    {
        key: 'spotify-import',
        title: 'Importar artistas do Spotify',
        desc: 'Pesquisar e criar perfis por reclamar a partir do Spotify.',
        icon: <FaSpotify size={20} />,
        accent: 'green',
        to: '/admin/artist-import',
        status: 'active',
    },
    {
        key: 'claims',
        title: 'Reclamações de perfil',
        desc: 'Rever e aprovar pedidos de artistas a reclamar o seu perfil importado.',
        icon: <FaFlag size={20} />,
        accent: 'mustard',
        to: '/admin/claims',
        status: 'active',
    },
];

function MetricCard({ label, value, alert }) {
    return (
        <div className={'admin-metric' + (alert && value > 0 ? ' admin-metric--alert' : '')}>
            <div className="admin-metric__value">
                {value ?? '—'}
                {alert && value > 0 && <FaExclamationTriangle size={15} className="admin-metric__flag" aria-hidden="true" />}
            </div>
            <div className="admin-metric__label">{label}</div>
        </div>
    );
}

function ToolCard({ tool }) {
    const isActive = tool.status === 'active';
    const body = (
        <>
            <span className={'admin-tool__icon admin-tool__icon--' + tool.accent}>{tool.icon}</span>
            <div className="admin-tool__body">
                <div className="admin-tool__title-row">
                    <h3 className="admin-tool__title">{tool.title}</h3>
                    {!isActive && <span className="badge badge--mustard">Em breve</span>}
                </div>
                <p className="admin-tool__desc">{tool.desc}</p>
            </div>
        </>
    );

    if (isActive) {
        return (
            <Link to={tool.to} className="admin-tool admin-tool--active">
                {body}
            </Link>
        );
    }

    return (
        <div className="admin-tool admin-tool--disabled" aria-disabled="true">
            {body}
        </div>
    );
}

function MigrationCard({ migration }) {
    const [status,  setStatus]  = useState('idle')   // idle | running | done | error
    const [result,  setResult]  = useState(null)
    const [errMsg,  setErrMsg]  = useState('')

    async function run() {
        setStatus('running')
        setResult(null)
        setErrMsg('')
        try {
            const res = await fetch(migration.endpoint, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error(`Erro ${res.status}`)
            setResult(await res.json())
            setStatus('done')
        } catch (err) {
            setErrMsg(err.message)
            setStatus('error')
        }
    }

    return (
        <div className={'admin-migration' + (status === 'done' ? ' admin-migration--done' : status === 'error' ? ' admin-migration--error' : '')}>
            <div className="admin-migration__head">
                <span className="admin-tool__icon admin-tool__icon--blue">
                    <FaDatabase size={17} />
                </span>
                <div className="admin-migration__info">
                    <div className="admin-migration__title">{migration.title}</div>
                    <div className="admin-migration__desc">{migration.desc}</div>
                </div>
            </div>

            <div className="admin-migration__foot">
                {status === 'idle' && (
                    <button type="button" className="btn-ghost admin-migration__btn" onClick={run}>
                        <FaPlay size={10} /> Correr
                    </button>
                )}
                {status === 'running' && (
                    <span className="admin-migration__state admin-migration__state--running">A correr…</span>
                )}
                {status === 'done' && result && (
                    <div className="admin-migration__result">
                        <FaCheckCircle size={13} className="admin-migration__result-icon" />
                        {migration.resultKeys.map(({ key, label }) => (
                            <span key={key} className="admin-migration__pill">
                                <strong>{result[key] ?? 0}</strong> {label}
                            </span>
                        ))}
                        <button type="button" className="admin-migration__reset" onClick={() => setStatus('idle')}>
                            Correr novamente
                        </button>
                    </div>
                )}
                {status === 'error' && (
                    <div className="admin-migration__result admin-migration__result--error">
                        <FaTimesCircle size={13} className="admin-migration__result-icon" />
                        <span>{errMsg}</span>
                        <button type="button" className="admin-migration__reset" onClick={() => setStatus('idle')}>
                            Tentar novamente
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function AdminHome() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState([
        { label: 'Perfis de artista importados',    value: null },
        { label: 'Pedidos de reclamação pendentes', value: null, alert: true },
        { label: 'Utilizadores registados',         value: null },
        { label: 'Contas ARTIST ativas',            value: null },
    ]);

    useEffect(() => {
        fetch(`${API}/metrics`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setMetrics([
                { label: 'Perfis de artista importados',    value: data.importedArtists },
                { label: 'Pedidos de reclamação pendentes', value: data.pendingClaimRequests, alert: true },
                { label: 'Utilizadores registados',         value: data.totalUsers },
                { label: 'Contas ARTIST ativas',            value: data.activeArtistAccounts },
            ]))
            .catch(() => {});
    }, []);

    function handleLogout() {
        logout();
        navigate('/', { replace: true });
    }

    return (
        <div className="admin-page">
            <div className="admin-page__inner">
                <header className="admin-head">
                    <div className="admin-head__row">
                        <div>
                            <h1 className="admin-head__title">Administração</h1>
                            <p className="admin-head__sub">Ferramentas de gestão da plataforma</p>
                        </div>
                        <button className="btn-ghost admin-head__logout" onClick={handleLogout}>
                            Sair
                        </button>
                    </div>
                </header>

                <section className="admin-metrics">
                    {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
                </section>

                <section className="admin-tools">
                    {TOOLS.map((t) => <ToolCard key={t.key} tool={t} />)}
                </section>

                <section className="admin-section">
                    <h2 className="admin-section__title">Migrações</h2>
                    <p className="admin-section__sub">Operações de manutenção de dados. Todas são idempotentes — seguras de correr mais do que uma vez.</p>
                    <div className="admin-migrations">
                        {MIGRATIONS.map(m => <MigrationCard key={m.key} migration={m} />)}
                    </div>
                </section>
            </div>
        </div>
    );
}
