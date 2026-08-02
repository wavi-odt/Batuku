/* ─────────────────────────────────────────────────────────────────
   pages/fan/following/Following.jsx, Página "A seguir".
   ───────────────────────────────────────────────────────────────── */

import AppShell            from '../../../../components/HomeComponents/AppShell.jsx'
import { followingData }   from '../../../../data/following.js'
import FollowingLive       from './FollowingLive.jsx'
import FollowingUpdates    from './FollowingUpdates.jsx'
import FollowingFeed       from './FollowingFeed.jsx'
import FollowingRoster     from './FollowingRoster.jsx'
import FollowingSuggestions from './FollowingSuggestions.jsx'

/* Reutiliza os estilos de track-card e .continue da Home */
import '../fanHome/ContinueListening.css'
import './Following.css'

const d = followingData;

export default function Following() {
    return (
        <AppShell role="fan">

            {/* ─── A ouvir agora ───────────────────────────────────── */}
            <FollowingLive items={d.nowListening} />

            {/* ─── Novidades ───────────────────────────────────────── */}
            <FollowingUpdates releases={d.newContent} />

            {/* ─── Feed + Sidebar ──────────────────────────────────── */}
            <section className="home__section">
                <div className="flw__split">

                    {/* Coluna principal: feed cronológico */}
                    <FollowingFeed items={d.feed} />

                    {/* Sidebar: roster compacto + sugestões */}
                    <aside className="flw__sidebar">
                        <FollowingRoster artists={d.roster} />
                        <FollowingSuggestions artists={d.suggestions} />
                    </aside>

                </div>
            </section>

        </AppShell>
    );
}
