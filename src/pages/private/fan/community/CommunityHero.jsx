/* ─────────────────────────────────────────────────────────────────
   CommunityHero.jsx, Banner Discord com stats e canais activos.
   ───────────────────────────────────────────────────────────────── */

import { FaDiscord } from 'react-icons/fa'

export default function CommunityHero({ discord, channels }) {
    return (
        <div className="com__hero">

            {/* ─── Copy + stats ─────────────────────────────────── */}
            <div>
                <div className="com__hero-eyebrow">
                    <FaDiscord size={14} />
                    Comunidade Discord
                </div>
                <h2 className="com__hero-title">Onde o cenário musical vive 24/7.</h2>
                <p className="com__hero-lede">
                    Sessões ao vivo, feedback entre produtores, listening parties às quintas.
                    Mais de <strong>{discord.members.toLocaleString('pt-PT')} membros</strong> já lá estão.
                </p>

                <div className="com__hero-stats">
                    <div className="com__hero-stat">
                        <span className="com__hero-stat-val">{discord.members.toLocaleString('pt-PT')}</span>
                        <span className="com__hero-stat-label">Membros</span>
                    </div>
                    <div className="com__hero-stat">
                        <span className="com__hero-stat-val com__hero-stat-val--online">
                            {discord.online}
                        </span>
                        <span className="com__hero-stat-label">Online agora</span>
                    </div>
                    <div className="com__hero-stat">
                        <span className="com__hero-stat-val">{discord.messagesPerDay.toLocaleString('pt-PT')}</span>
                        <span className="com__hero-stat-label">Mensagens/dia</span>
                    </div>
                </div>
            </div>

            {/* ─── Canal list ───────────────────────────────────── */}
            <div className="com__channels-panel">
                <div className="com__channels-head">Canais activos</div>
                <div className="com__channel-list">
                    {channels.map(ch => (
                        <a
                            key={ch.id}
                            href={discord.inviteUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="com__channel-row"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <span className="com__channel-emoji" aria-hidden="true">{ch.emoji}</span>
                            <div className="com__channel-info">
                                <div className="com__channel-name">#{ch.name}</div>
                                <div className="com__channel-last">
                                    <strong>{ch.lastUser}</strong>: {ch.lastMsg}
                                </div>
                            </div>
                            {ch.unread > 0 && (
                                <span className="com__channel-unread">{ch.unread}</span>
                            )}
                        </a>
                    ))}
                </div>
            </div>

        </div>
    );
}
