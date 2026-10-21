/* ─────────────────────────────────────────────────────────────────
   AppShell.jsx, Layout principal das páginas autenticadas.
   Compõe Sidebar + TopBar + (children).
   O MiniPlayer já não é montado aqui: passou para o PlayerLayer, em
   App.jsx, para persistir entre navegações sem duplicar (as rotas de
   admin, que não usam AppShell, também não devem ter MiniPlayer).
   ───────────────────────────────────────────────────────────────── */

import { useLocation, Outlet } from 'react-router-dom'
import Sidebar    from './Sidebar'
import TopBar     from './TopBar'
import { getRole } from '../../utils/auth.js'
import './AppShell.css'

function AppShell() {
    const resolvedRole = getRole() ?? 'fan';
    const location = useLocation();
    return (
        <div className="shell">
            <Sidebar role={resolvedRole} />
            <TopBar  role={resolvedRole} />
            <main className="shell__main page-enter" key={location.pathname}>
                <Outlet />
            </main>
        </div>
    );
}

export default AppShell
