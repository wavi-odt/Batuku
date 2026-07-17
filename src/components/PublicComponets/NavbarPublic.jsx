/* ─────────────────────────────────────────────────────────────────
   NavbarPublic, Barra de navegação pública.
   Sticky no topo. Menu mobile com toggle simples (sem headlessui).
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import logo from '../../assets/batuku.png'
import '../PublicComponets/NavbarPublic.css'

const NAV_LINKS = [
    { name: 'Artistas',    href: '/artists' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Comunidade',  href: '/community' },
];

export default function NavbarPublic() {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <header className="nav">
            <div className="container nav__inner">

                <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
                    <img src={logo} alt="Batuku" className="nav__logo" />
                    <span className="nav__wordmark">Batuku</span>
                </Link>

                <nav className="nav__links" aria-label="Principal">
                    {NAV_LINKS.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={'nav__link' + (isActive ? ' is-active' : '')}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="nav__cta">
                    <Link to="/login" className="btn btn--ghost btn--sm">Entrar</Link>
                    <Link to="/register" className="btn btn--primary btn--sm">Registar</Link>
                </div>

                <button
                    className="nav__burger"
                    aria-label={open ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={open}
                    onClick={() => setOpen(v => !v)}
                >
                    {open ? <HiX size={22} /> : <HiMenu size={22} />}
                </button>
            </div>

            {open && (
                <div className="nav__mobile">
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className="nav__mobile-link"
                            onClick={() => setOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="nav__mobile-cta">
                        <Link to="/login" className="btn btn--ghost btn--sm" onClick={() => setOpen(false)}>Entrar</Link>
                        <Link to="/register" className="btn btn--primary btn--sm" onClick={() => setOpen(false)}>Registar</Link>
                    </div>
                </div>
            )}
        </header>
    );
}
