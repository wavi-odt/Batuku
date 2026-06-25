/* ─────────────────────────────────────────────────────────────────
   pages/fan/Home.jsx — Página inicial do utilizador comum (fã).
   ───────────────────────────────────────────────────────────────── */

import AppShell           from '../../../../components/HomeComponents/AppShell.jsx'
import { homeData }       from '../../../../data/home.js'
import LevelCard          from './LevelCard.jsx'
import BecomeArtistBanner from './BecomeArtistBanner.jsx'
import ContinueListening  from './ContinueListening.jsx'
import Recommended        from './Recommended.jsx'
import FollowingArtists   from './FollowingArtists.jsx'
import ActivityFeed       from './ActivityFeed.jsx'
import DiscordCard        from './DiscordCard.jsx'
import './Home.css'

export default function Home() {
    const u = homeData.fan;

    return (
        <AppShell role="fan">

            {/* ─── Greeting + Level Card ─────────────────────────── */}
            <div className="home__greet">
                <div className="home__hello">
                    <h1 className="home__hello-title">Bom dia, {u.name.split(' ')[0]}.</h1>
                    <p className="home__hello-sub">
                        Tens <strong>{u.streak} dias seguidos</strong> de streak.
                        Continua a ouvir para subir no ranking.
                    </p>
                </div>
                <LevelCard user={u} />
            </div>

            {/* ─── Banner: tornar-se artista verificado ──────────── */}
            <BecomeArtistBanner />

            {/* ─── Continue Listening ─────────────────────────────── */}
            <ContinueListening tracks={homeData.continueListening} />

            {/* ─── AI Recommendations ─────────────────────────────── */}
            <Recommended tracks={homeData.recommended} />

            {/* ─── Following + Activity Split ─────────────────────── */}
            <section className="home__section">
                <div className="home__split">
                    <FollowingArtists
                        artists={homeData.followingArtists}
                        followingCount={u.following}
                    />
                    <div className="home__side">
                        <DiscordCard />
                        <ActivityFeed items={homeData.activity} />
                    </div>
                </div>
            </section>

        </AppShell>
    );
}
