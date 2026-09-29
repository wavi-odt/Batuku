/* ─────────────────────────────────────────────────────────────────
   pages/fan/community/Community.jsx, Página de comunidade.
   ───────────────────────────────────────────────────────────────── */

import { FaDiscord }      from 'react-icons/fa'
import AppShell           from '../../../../components/HomeComponents/AppShell.jsx'
import './Community.css'

export default function Community() {
    return (
        <AppShell>
            <div className="com__header">
                <div>
                    <h1 className="com__title">Comunidade</h1>
                    <p className="com__subtitle">Em breve</p>
                </div>
                <a
                    href="https://discord.gg/batuku"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="com__discord-btn"
                >
                    <FaDiscord size={16} />
                    Entrar no Discord
                </a>
            </div>

            <div style={{ padding: '48px 0', color: 'var(--color-ink-mute)', textAlign: 'center' }}>
                <p style={{ fontSize: 16, marginBottom: 8 }}>A comunidade está a ser preparada.</p>
                <p style={{ fontSize: 13 }}>Em breve poderás interagir com outros fãs e artistas.</p>
            </div>
        </AppShell>
    );
}
