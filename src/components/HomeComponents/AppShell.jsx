/* ─────────────────────────────────────────────────────────────────
   AppShell.jsx — Layout principal das páginas autenticadas.
   Compõe Sidebar + TopBar + (children) + MiniPlayer.
   ───────────────────────────────────────────────────────────────── */

import Sidebar    from './Sidebar'
import TopBar     from './TopBar'
import MiniPlayer from './MiniPlayer'
import './AppShell.css'

function AppShell({ role = 'fan', children }) {
    return (
        <div className="shell">
            <Sidebar role={role} />
            <TopBar  role={role} />
            <main className="shell__main">
                {children}
            </main>
            <MiniPlayer />
        </div>
    );
}

export default AppShell
