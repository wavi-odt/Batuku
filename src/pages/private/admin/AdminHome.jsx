/* ─────────────────────────────────────────────────────────────────
   pages/private/admin/AdminHome.jsx, Painel de administração.
   Rota /admin, acessível só a ROLE_ADMIN (ver RoleRoute.jsx).

   Ferramenta de trabalho interno (1-2 pessoas), não uma vitrine:
   sem hero, sem ilustração, só clareza e densidade de informação.
   Usa os tokens/classes globais (tokens.css, global.css: .btn-ghost,
   .card, .badge) tal como Profile.jsx. Layout próprio e independente
   (sem AppShell), simples cabeçalho + conteúdo.
   ───────────────────────────────────────────────────────────────── */

import { Link, useNavigate } from 'react-router-dom'
import { FaSpotify, FaFlag, FaExclamationTriangle } from 'react-icons/fa'
import { logout } from '../../../utils/auth.js'
import './AdminHome.css'

/* Dados de exemplo, substituir por fetch ao backend quando pronto. */
const METRICS = [
    { label: 'Perfis de artista importados', value: 12 },
    { label: 'Pedidos de reclamação pendentes', value: 3, alert: true },
    { label: 'Utilizadores registados', value: 248 },
    { label: 'Contas ARTIST ativas', value: 9 },
];

const TOOLS = [
    {
        key: 'spotify-import',
        title: 'Importar artistas do Spotify',
        desc: 'Pesquisar e criar perfis por reclamar a partir do Spotify.',
        icon: <FaSpotify size={20} />,
        accent: 'green',
        to: '/admin/spotify-import',
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
                {value}
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
                    {METRICS.map((m) => <MetricCard key={m.label} {...m} />)}
                </section>

                <section className="admin-tools">
                    {TOOLS.map((t) => <ToolCard key={t.key} tool={t} />)}
                </section>
            </div>
        </div>
    );
}
