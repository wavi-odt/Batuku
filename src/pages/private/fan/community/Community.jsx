/* ─────────────────────────────────────────────────────────────────
   pages/fan/community/Community.jsx, Página de comunidade.
   ───────────────────────────────────────────────────────────────── */

import { FaDiscord }      from 'react-icons/fa'
import AppShell           from '../../../../components/HomeComponents/AppShell.jsx'
import { communityData }  from '../../../../data/community.js'
import CommunityHero      from './CommunityHero.jsx'
import CommunityEvents    from './CommunityEvents.jsx'
import CommunityFeed      from './CommunityFeed.jsx'
import CommunitySidebar   from './CommunitySidebar.jsx'
import './Community.css'

const d = communityData;

export default function Community() {
    return (
        <AppShell>

            {/* ─── Header ───────────────────────────────────────── */}
            <div className="com__header">
                <div>
                    <h1 className="com__title">Comunidade</h1>
                    <p className="com__subtitle">
                        {d.discord.members.toLocaleString('pt-PT')} membros ·{' '}
                        <span style={{ color: '#57F287' }}>{d.discord.online} online agora</span>
                    </p>
                </div>
                <a
                    href={d.discord.inviteUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="com__discord-btn"
                >
                    <FaDiscord size={16} />
                    Entrar no Discord
                </a>
            </div>

            {/* ─── Hero Discord ─────────────────────────────────── */}
            <CommunityHero discord={d.discord} channels={d.channels} />

            {/* ─── Eventos ──────────────────────────────────────── */}
            <CommunityEvents events={d.events} />

            {/* ─── Feed + Sidebar ───────────────────────────────── */}
            <div className="com__split">
                <CommunityFeed posts={d.feed} />

                <aside className="com__sidebar">
                    <CommunitySidebar
                        onlineNow={d.onlineNow}
                        trendingTags={d.trendingTags}
                        totalOnline={d.discord.online}
                    />
                </aside>
            </div>

        </AppShell>
    );
}
