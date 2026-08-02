/* ─────────────────────────────────────────────────────────────────
   pages/fan/achievements/Achievements.jsx, Conquistas do fã.
   ───────────────────────────────────────────────────────────────── */

import AppShell                from '../../../../components/HomeComponents/AppShell.jsx'
import LevelCard               from '../fanHome/LevelCard.jsx'
import { achievementsData }    from '../../../../data/achievements.js'
import AchievementsChallenges  from './AchievementsChallenges.jsx'
import AchievementsBadges      from './AchievementsBadges.jsx'
import AchievementsLeaderboard from './AchievementsLeaderboard.jsx'
import AchievementsMilestones  from './AchievementsMilestones.jsx'
import '../fanHome/LevelCard.css'
import './Achievements.css'

const d = achievementsData;

export default function Achievements() {
    return (
        <AppShell>
            {/* ─── Header ─────────────────────────────────────────── */}
            <div className="ach__header">
                <div>
                    <h1 className="ach__title">Conquistas</h1>
                    <p className="ach__subtitle">
                        <span>Nível {d.user.level}</span>
                        <span className="ach__subtitle-sep">·</span>
                        <span>{d.user.points.toLocaleString('pt-PT')} pts</span>
                        <span className="ach__subtitle-sep">·</span>
                        <span>Rank #{d.user.rank}</span>
                        <span className="ach__subtitle-sep">·</span>
                        <span className="ach__streak">🔥 {d.user.streak} dias</span>
                    </p>
                </div>
            </div>

            {/* ─── Desafios + Sidebar ─────────────────────────────── */}
            <div className="ach__split">
                <AchievementsChallenges challenges={d.challenges} />

                <aside className="ach__sidebar">
                    <LevelCard user={d.user} />
                    <AchievementsLeaderboard entries={d.leaderboard} />
                </aside>
            </div>

            {/* ─── Badges ─────────────────────────────────────────── */}
            <AchievementsBadges badges={d.badges} />

            {/* ─── Milestones ─────────────────────────────────────── */}
            <AchievementsMilestones milestones={d.milestones} />
        </AppShell>
    );
}
