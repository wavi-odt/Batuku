/* ─────────────────────────────────────────────────────────────────
   pages/private/fan/gamification/Gamification.jsx, Badges e pontos.
   Rota /gamification (fã). Reutiliza LevelCard.jsx (fanHome) e
   BadgesGrid/CardTitle (profile/ProfileBlocks.jsx) tal e qual —
   só a tabela de leaderboard é novo (sem precedente no projeto).
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken } from '../../../utils/auth.js'
import LevelCard from './fanHome/LevelCard.jsx'
import { CardTitle, BadgesGrid } from '../profile/ProfileBlocks.jsx'
import './Gamification.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api/gamification/me`

export default function Gamification() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        fetch(API, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AppShell role="fan">
            <div className="gam-page">
                <h1 className="gam-page__title">Gamificação</h1>

                {loading && <div className="detail-loading">A carregar…</div>}
                {error && <div className="detail-error">{error}</div>}

                {data && (
                    <div className="gam-grid">
                        <div>
                            <LevelCard user={data} />

                            <div className="prof-card" style={{ marginTop: 20 }}>
                                <CardTitle link={`${data.badges.filter(b => b.got).length} de ${data.badges.length}`}>
                                    Conquistas
                                </CardTitle>
                                <BadgesGrid badges={data.badges} />
                            </div>
                        </div>

                        <div className="prof-card">
                            <CardTitle>Ranking semanal</CardTitle>
                            <ol className="gam-leaderboard">
                                {data.leaderboard.map((u, i) => (
                                    <li key={i} className={'gam-leaderboard__row' + (u.isYou ? ' is-you' : '')}>
                                        <span className="gam-leaderboard__rank">#{u.rank}</span>
                                        <span className="gam-leaderboard__name">{u.name}{u.isYou ? ' (tu)' : ''}</span>
                                        <span className="gam-leaderboard__pts">{u.points.toLocaleString('pt-PT')} pts</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
