/* ─────────────────────────────────────────────────────────────────
   DiscordCard.jsx — Card lateral com link para o servidor Discord.
   ───────────────────────────────────────────────────────────────── */

import { FaDiscord } from 'react-icons/fa'
import './DiscordCard.css'

export default function DiscordCard() {
    return (
        <aside className="discord-card">
            <FaDiscord size={26} color="#5865F2" />
            <h3 className="discord-card__title">Comunidade Discord</h3>
            <p className="discord-card__sub">
                3 novas mensagens em <strong>#sessões-praia</strong>.
                A Naia está em listening party agora.
            </p>
            <a href="https://discord.gg/" className="discord-card__btn"
               target="_blank" rel="noreferrer noopener">
                <FaDiscord size={16} /> Abrir Discord
            </a>
        </aside>
    );
}
