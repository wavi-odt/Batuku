/* ─────────────────────────────────────────────────────────────────
   Footer — Rodapé com colunas de links e copyright.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import logo from '../../assets/batuku.png'
import './footer.css'

const COLUMNS = [
    { title: 'Plataforma', links: [
        { label: 'Artistas',    to: '/artists' },
        { label: 'Marketplace', to: '/marketplace' },
        { label: 'Comunidade',  to: '/community' },
        { label: 'Preços',      to: '/pricing' },
    ]},
    { title: 'Conta', links: [
        { label: 'Entrar',         to: '/login' },
        { label: 'Registar',       to: '/register' },
        { label: 'Para artistas',  to: '/for-artists' },
        { label: 'Para fãs',       to: '/for-fans' },
    ]},
    { title: 'Legal', links: [
        { label: 'Termos',      to: '/terms' },
        { label: 'Privacidade', to: '/privacy' },
        { label: 'Contacto',    to: '/contact' },
        { label: 'Press kit',   to: '/press' },
    ]},
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">

                <div className="footer__top">
                    <div className="footer__brand">
                        <div className="footer__logo-row">
                            <img src={logo} alt="Batuku" className="footer__logo" />
                            <span className="footer__wordmark">Batuku</span>
                        </div>
                        <p className="footer__tag">
                            A casa dos artistas independentes de Cabo Verde.
                        </p>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.title} className="footer__col">
                            <div className="label-eyebrow footer__col-title">{col.title}</div>
                            <ul>
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <Link to={l.to} className="link">{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="footer__bottom">
                    <span>© 2026 Batuku. Todos os direitos reservados.</span>
                    <span>Feito com o coração 🇨🇻 — Praia · Lisboa · Boston</span>
                </div>
            </div>
        </footer>
    );
}
