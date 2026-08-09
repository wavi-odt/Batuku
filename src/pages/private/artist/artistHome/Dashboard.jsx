import { useState, useEffect } from 'react'
import AppShell         from '../../../../components/HomeComponents/AppShell.jsx'
import { useCurrentUser } from '../../../../hooks/useCurrentUser.js'
import { API, getToken } from '../../../../utils/auth.js'
import { usePendingComments } from '../../../../context/PendingCommentsContext.jsx'
import VerifyBanner     from './VerifyBanner.jsx'
import StatCards        from './StatCards.jsx'
import GrowthChart      from './GrowthChart.jsx'
import PublishCard      from './PublishCard.jsx'
import TracksTable      from './TracksTable.jsx'
import TopFans          from './TopFans.jsx'
import PendingComments  from './PendingComments.jsx'
import './Dashboard.css'

export default function Dashboard() {
    const realUser = useCurrentUser()
    const { decrement } = usePendingComments()
    const [period, setPeriod]   = useState('30d')
    const [stats, setStats]     = useState(null)
    const [fans, setFans]       = useState([])
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const headers = { Authorization: `Bearer ${getToken()}` }
        setLoading(true)
        const safe = r => r.ok ? r.json() : Promise.resolve(null)
        Promise.all([
            fetch(`${API}/api/stats/me?period=${period}`, { headers }).then(safe),
            fetch(`${API}/api/artist-follows/fans`,        { headers }).then(safe),
            fetch(`${API}/api/comments/artist`,            { headers }).then(safe),
        ]).then(([statsData, fansData, commentsData]) => {
            if (statsData?.kpis) setStats(statsData)
            setFans(Array.isArray(fansData) ? fansData : [])
            setComments(Array.isArray(commentsData) ? commentsData : [])
        }).catch(console.error)
          .finally(() => setLoading(false))
    }, [period])

    async function handleReply(id, content, isEdit = false) {
        const res = await fetch(`${API}/api/comments/${id}/reply`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body:    JSON.stringify({ content }),
        })
        if (!res.ok) throw new Error('Erro ao publicar resposta')
        const reply = await res.json()
        setComments(prev => prev.map(c => c.id === id ? { ...c, reply } : c))
        if (!isEdit) decrement()
        return reply
    }

    const followers = stats?.kpis?.followers?.value
    const pending   = comments.filter(c => !c.reply)

    return (
        <AppShell role="artist">

            {/* ─── Greeting ──────────────────────────────────────── */}
            <div className="dash__greet">
                <h1 className="dash__greet-title">Olá, {realUser?.name ?? '…'}.</h1>
                {followers != null && (
                    <p className="dash__greet-sub">
                        {followers.toLocaleString('pt-PT')} seguidores
                        {stats.topTracks?.length > 0 && ` · ${stats.topTracks.length} faixas em destaque`}
                    </p>
                )}
            </div>

            {/* ─── Verify banner ─────────────────────────────────── */}
            <VerifyBanner provider={realUser?.spotifyArtistId ? 'spotify' : undefined} />

            {/* ─── Stats ─────────────────────────────────────────── */}
            {stats && <StatCards stats={stats.kpis} />}

            {/* ─── Chart + Publish ───────────────────────────────── */}
            <div className="dash__row">
                <GrowthChart
                    data={stats?.dailyPlays ?? []}
                    period={period}
                    onPeriodChange={setPeriod}
                />
                <PublishCard />
            </div>

            {/* ─── Tracks ────────────────────────────────────────── */}
            {stats?.topTracks?.length > 0 && <TracksTable tracks={stats.topTracks} />}

            {/* ─── Fans + Comments ───────────────────────────────── */}
            <section className="dash__section">
                <div className="dash__duo">
                    <TopFans fans={fans} loading={loading} />
                    <PendingComments comments={pending} loading={loading} onReply={handleReply} />
                </div>
            </section>

        </AppShell>
    )
}
