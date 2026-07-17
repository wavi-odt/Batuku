/* ─────────────────────────────────────────────────────────────────
   pages/artist/Dashboard.jsx, Painel do artista verificado.
   ───────────────────────────────────────────────────────────────── */

import AppShell      from '../../../../components/HomeComponents/AppShell.jsx'
import { homeData }  from '../../../../data/home.js'
import { useCurrentUser } from '../../../../hooks/useCurrentUser.js'
import VerifyBanner  from './VerifyBanner.jsx'
import StatCards     from './StatCards.jsx'
import GrowthChart   from './GrowthChart.jsx'
import PublishCard   from './PublishCard.jsx'
import TracksTable   from './TracksTable.jsx'
import TopFans       from './TopFans.jsx'
import PendingComments from './PendingComments.jsx'
import BeatSales     from './BeatSales.jsx'
import './Dashboard.css'

export default function Dashboard() {
    const u        = homeData.artist;
    const realUser = useCurrentUser();

    return (
        <AppShell role="artist">

            {/* ─── Greeting ──────────────────────────────────────── */}
            <div className="dash__greet">
                <h1 className="dash__greet-title">Olá, {realUser?.name || u.name}.</h1>
                <p className="dash__greet-sub">
                    A tua música está em <strong>#{u.rank} no ranking semanal</strong> ·{' '}
                    {u.followers.toLocaleString('pt-PT')} seguidores ·{' '}
                    {u.tracksPublished} faixas publicadas
                </p>
            </div>

            {/* ─── Verify banner ─────────────────────────────────── */}
            <VerifyBanner provider={u.verifiedOn} />

            {/* ─── Stats ─────────────────────────────────────────── */}
            <StatCards stats={homeData.artistStats} />

            {/* ─── Chart + Publish ───────────────────────────────── */}
            <div className="dash__row">
                <GrowthChart data={homeData.growth} />
                <PublishCard />
            </div>

            {/* ─── Tracks ────────────────────────────────────────── */}
            <TracksTable tracks={homeData.myTracks} />

            {/* ─── Fans + Comments + Sales ───────────────────────── */}
            <section className="dash__section">
                <div className="dash__triple">
                    <TopFans fans={homeData.topFans} />
                    <PendingComments comments={homeData.pendingComments} />
                    <BeatSales sales={homeData.beatSales} revenue={homeData.monthlyRevenue} />
                </div>
            </section>

        </AppShell>
    );
}
