/* ─────────────────────────────────────────────────────────────────
   pages/fan/achievements/Achievements.jsx, Conquistas do fã.
   ───────────────────────────────────────────────────────────────── */

import { useState, useEffect }    from 'react'
import AppShell                   from '../../../../components/HomeComponents/AppShell.jsx'
import LevelCard                  from '../fanHome/LevelCard.jsx'
import AchievementsChallenges     from './AchievementsChallenges.jsx'
import AchievementsBadges         from './AchievementsBadges.jsx'
import AchievementsLeaderboard    from './AchievementsLeaderboard.jsx'
import AchievementsMilestones     from './AchievementsMilestones.jsx'
import { achievementsData }       from '../../../../data/achievements.js'
import { API, getToken }          from '../../../../utils/auth.js'

import { useCurrentUser }         from '../../../../hooks/useCurrentUser.js'
import '../fanHome/LevelCard.css'
import './Achievements.css'

/* ─── Helpers visuais para leaderboard ───────────────────────── */
const SHAPES = ['circles', 'orbit', 'arch', 'sun', 'triangles', 'wave', 'stripes', 'split']
const shapeFromId = id => SHAPES[Number(id) % SHAPES.length]
const hueFromId   = id => (Number(id) * 137) % 360

/* ─── Tier visual baseado nos pontos necessários ─────────────── */
function tierFromPoints(pts) {
    if (pts <= 200)  return 'coral'
    if (pts <= 500)  return 'ocean'
    if (pts <= 700)  return 'mustard'
    if (pts <= 1000) return 'gold'
    if (pts <= 2000) return 'green'
    return 'pink'
}

/* ─── Formatar data de desbloqueio ───────────────────────────── */
function formatEarned(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Achievements() {
    const currentUser = useCurrentUser()

    const [profile,     setProfile]     = useState(null)
    const [allBadges,   setAllBadges]   = useState([])
    const [leaderboard, setLeaderboard] = useState([])
    const [challenges,  setChallenges]  = useState([])
    const [milestones,  setMilestones]  = useState([])
    const [loading,     setLoading]     = useState(true)

    useEffect(() => {
        const headers = { Authorization: `Bearer ${getToken()}` }
        Promise.all([
            fetch(`${API}/api/gamification/me`,                   { headers }).then(r => r.ok ? r.json() : null),
            fetch(`${API}/api/gamification/badges`,               { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/gamification/leaderboard?limit=10`, { headers }).then(r => r.ok ? r.json() : null),
            fetch(`${API}/api/gamification/challenges`,           { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/gamification/milestones`,           { headers }).then(r => r.ok ? r.json() : []),
        ])
        .then(([prof, badges, lb, ch, ms]) => {
            setProfile(prof)
            setAllBadges(Array.isArray(badges) ? badges : [])
            setLeaderboard(lb?.entries ?? [])
            setChallenges(Array.isArray(ch) ? ch : [])
            setMilestones(Array.isArray(ms) ? ms : [])
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [])

    /* ─── Mapear badges: todos + marcar quais estão ganhos ─────── */
    const earnedIds = new Set((profile?.badges ?? []).map(b => b.id))
    const earnedMap = Object.fromEntries((profile?.badges ?? []).map(b => [b.id, b]))

    const badges = allBadges.map(b => {
        const got = earnedIds.has(b.id)
        const earned = earnedMap[b.id]
        return {
            id:   b.id,
            icon: b.iconUrl,
            name: b.name,
            desc: b.description,
            xp:   b.pointsRequired,
            tier: got ? tierFromPoints(b.pointsRequired) : 'locked',
            got,
            meta: got
                ? formatEarned(earned?.earnedAt)
                : `${(profile?.totalPoints ?? 0).toLocaleString('pt-PT')} / ${b.pointsRequired.toLocaleString('pt-PT')} pts`,
        }
    })

    /* ─── Mapear leaderboard ────────────────────────────────────── */
    const lbEntries = leaderboard.map(e => ({
        rank:   e.rank,
        name:   e.name,
        points: e.totalPoints,
        isYou:  e.userId === currentUser?.id,
        shape:  shapeFromId(e.userId),
        hue:    hueFromId(e.userId),
    }))

    /* ─── Adicionar posição do utilizador se fora do top 10 ─────── */
    const myInTop = lbEntries.some(e => e.isYou)
    if (!myInTop && profile) {
        lbEntries.push({
            rank:   Number(profile.rank),
            name:   currentUser?.name ?? 'Tu',
            points: profile.totalPoints,
            isYou:  true,
            shape:  shapeFromId(currentUser?.id ?? 0),
            hue:    hueFromId(currentUser?.id ?? 0),
        })
    }

    /* ─── Dados para LevelCard ──────────────────────────────────── */
    const userCard = profile ? {
        level:      profile.level,
        points:     profile.totalPoints,
        nextLevelAt: profile.totalPoints + (profile.pointsToNextLevel || 0),
        rank:       profile.rank,
        badges:     (profile.badges ?? []).length,
        streak:     0,
        following:  0,
    } : null

    /* ─── Header stats ──────────────────────────────────────────── */
    const level  = profile?.level  ?? '—'
    const points = profile?.totalPoints ?? 0
    const rank   = profile?.rank   ?? '—'

    return (
        <AppShell>
            {/* ─── Header ─────────────────────────────────────────── */}
            <div className="ach__header">
                <div>
                    <h1 className="ach__title">Conquistas</h1>
                    <p className="ach__subtitle">
                        <span>Nível {level}</span>
                        <span className="ach__subtitle-sep">·</span>
                        <span>{points.toLocaleString('pt-PT')} pts</span>
                        <span className="ach__subtitle-sep">·</span>
                        <span>Rank #{rank}</span>
                    </p>
                </div>
            </div>

            {/* ─── Desafios + Sidebar ─────────────────────────────── */}
            <div className="ach__split">
                <AchievementsChallenges challenges={challenges.length > 0 ? challenges : achievementsData.challenges} />

                <aside className="ach__sidebar">
                    {userCard && <LevelCard user={userCard} />}
                    {!loading && <AchievementsLeaderboard entries={lbEntries} />}
                </aside>
            </div>

            {/* ─── Badges ─────────────────────────────────────────── */}
            {!loading && badges.length > 0 && (
                <AchievementsBadges badges={badges} />
            )}

            {/* ─── Milestones ─────────────────────────────────────── */}
            <AchievementsMilestones milestones={milestones.length > 0 ? milestones : achievementsData.milestones} />
        </AppShell>
    )
}
