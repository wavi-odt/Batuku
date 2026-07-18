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
import { FaSpotify, FaFlag, FaExclamationTriangle } from 'react-icons/fa'
import { logout, getToken } from '../../../utils/auth.js'
import './AdminHome.css'

const API = 'http://localhost:8080/api/admin'

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
        to: null,
        status: 'soon',
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
            </div>
        </div>
    );
}
