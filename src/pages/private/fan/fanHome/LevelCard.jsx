/* ─────────────────────────────────────────────────────────────────
   LevelCard.jsx, Cartão de nível, pontos e badges do fã.
   ───────────────────────────────────────────────────────────────── */

import './LevelCard.css'

const MAX_LEVEL = 10

export default function LevelCard({ user }) {
    const isMaxLevel = user.level >= MAX_LEVEL
    const pct        = isMaxLevel ? 100 : Math.min(100, (user.points / user.nextLevelAt) * 100)
    const remaining  = isMaxLevel ? 0   : user.nextLevelAt - user.points

    return (
        <div className="level-card">
            <div className="level-card__head">
                <span className="level-card__label">Nível {user.level}</span>
                <span className="level-card__rank">
                    Rank global · <strong>#{user.rank}</strong>
                </span>
            </div>

            <div className="level-card__num-row">
                <div className="level-card__num">{user.points.toLocaleString('pt-PT')}</div>
                <div className="level-card__num-label">pontos</div>
            </div>

            <div className="level-card__bar" role="progressbar"
                 aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                <div className="level-card__bar-fill" style={{ width: `${pct}%` }} />
            </div>

            <div className="level-card__bar-label">
                {isMaxLevel
                    ? <strong>Nível máximo atingido</strong>
                    : <>Faltam <strong>{remaining.toLocaleString('pt-PT')} pts</strong> para o nível {user.level + 1}</>
                }
            </div>

            <div className="level-card__stats">
                <div>
                    <div className="level-card__stat-v">{user.badges ?? 0}</div>
                    <div className="level-card__stat-l">Badges</div>
                </div>
                {user.streak != null && (
                    <div>
                        <div className="level-card__stat-v">{user.streak}</div>
                        <div className="level-card__stat-l">Streak</div>
                    </div>
                )}
                {user.following != null && (
                    <div>
                        <div className="level-card__stat-v">{user.following}</div>
                        <div className="level-card__stat-l">A seguir</div>
                    </div>
                )}
            </div>
        </div>
    );
}
