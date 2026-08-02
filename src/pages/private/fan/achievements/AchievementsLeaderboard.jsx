/* ─────────────────────────────────────────────────────────────────
   AchievementsLeaderboard.jsx, Ranking semanal em card de sidebar.
   Mostra o top 10 + posição do utilizador (com gap se necessário).
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

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
                        key={e.rank}
                        className={`ach__lb-row${e.isYou ? ' ach__lb-row--me' : ''}`}
                    >
                        <span className="ach__lb-rank">
                            {MEDAL[e.rank] ?? `#${e.rank}`}
                        </span>
                        <div className="ach__lb-avatar">
                            <ArtistArtwork shape={e.shape} hue={e.hue} image={null} rounded={0} showGloss={false} />
                        </div>
                        <span className="ach__lb-name">
                            {e.name}{e.isYou ? ' (tu)' : ''}
                        </span>
                        <span className="ach__lb-pts">
                            {e.points.toLocaleString('pt-PT')}
                        </span>
                    </li>
                ))}

                {/* Gap + posição do utilizador se fora do top 10 */}
                {!meInTop && me && (
                    <>
                        <li className="ach__lb-gap" aria-hidden="true">· · ·</li>
                        <li className="ach__lb-row ach__lb-row--me">
                            <span className="ach__lb-rank">#{me.rank}</span>
                            <div className="ach__lb-avatar">
                                <ArtistArtwork shape={me.shape} hue={me.hue} image={null} rounded={0} showGloss={false} />
                            </div>
                            <span className="ach__lb-name">{me.name} (tu)</span>
                            <span className="ach__lb-pts">{me.points.toLocaleString('pt-PT')}</span>
                        </li>
                    </>
                )}
            </ol>
        </div>
    );
}
