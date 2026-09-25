/* ─────────────────────────────────────────────────────────────────
   AchievementsLeaderboard.jsx, Ranking semanal em card de sidebar.
   Mostra o top 10 + posição do utilizador (com gap se necessário).
   ───────────────────────────────────────────────────────────────── */

import { FaUser } from 'react-icons/fa'
import ClickableName from '../../../../components/ClickableName'

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

function LbAvatar({ imageUrl, name }) {
    return (
        <div className="ach__lb-avatar">
            {imageUrl
                ? <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div className="prof__avatar-placeholder"><FaUser size={12} /></div>
            }
        </div>
    );
}

export default function AchievementsLeaderboard({ entries }) {
    const top10  = entries.filter(e => e.rank <= 10);
    const me     = entries.find(e => e.isYou);
    const meInTop = me && me.rank <= 10;

    return (
        <div className="ach__leaderboard">
            <div className="ach__lb-head">
                <span className="ach__lb-title">Ranking semanal</span>
                <a href="#" className="home__section-link" style={{ fontSize: 12 }}>Tudo →</a>
            </div>

            <ol className="ach__lb-list">
                {top10.map(e => (
                    <li
                        key={e.userId ?? e.rank}
                        className={`ach__lb-row${e.isYou ? ' ach__lb-row--me' : ''}`}
                    >
                        <span className="ach__lb-rank">
                            {MEDAL[e.rank] ?? `#${e.rank}`}
                        </span>
                        <LbAvatar imageUrl={e.imageUrl} name={e.name} />
                        <span className="ach__lb-name">
                            <ClickableName userId={e.userId} name={e.name} />
                            {e.isYou ? ' (tu)' : ''}
                        </span>
                        <span className="ach__lb-pts">
                            {e.points.toLocaleString('pt-PT')}
                        </span>
                    </li>
                ))}

                {!meInTop && me && (
                    <>
                        <li className="ach__lb-gap" aria-hidden="true">· · ·</li>
                        <li className="ach__lb-row ach__lb-row--me">
                            <span className="ach__lb-rank">#{me.rank}</span>
                            <LbAvatar imageUrl={me.imageUrl} name={me.name} />
                            <span className="ach__lb-name">
                            <ClickableName userId={me.userId} name={me.name} />
                            {' (tu)'}
                        </span>
                            <span className="ach__lb-pts">{me.points.toLocaleString('pt-PT')}</span>
                        </li>
                    </>
                )}
            </ol>
        </div>
    );
}
