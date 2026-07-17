/* ─────────────────────────────────────────────────────────────────
   StatCards.jsx, Quatro métricas de topo do artista.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay, FaUsers, FaAward, FaTrophy } from 'react-icons/fa'
import './StatCards.css'

const META = {
    plays:     { icon: FaPlay,   accent: 'coral'   },
    followers: { icon: FaUsers,  accent: 'ocean'   },
    points:    { icon: FaAward,  accent: 'mustard' },
    rank:      { icon: FaTrophy, accent: 'green'   },
};

export default function StatCards({ stats }) {
    const order = ['plays', 'followers', 'points', 'rank'];

    return (
        <div className="stats4">
            {order.map((key) => {
                const s = stats[key];
                const { icon: Icon, accent } = META[key];
                const isRank = key === 'rank';
                // Para rank: delta negativo = subiu de posição (bom)
                const isUp = isRank ? s.delta < 0 : s.delta > 0;
                const display = isRank ? `#${s.value}` : s.value.toLocaleString('pt-PT');
                const deltaText = isRank
                    ? (s.delta < 0 ? `↑ ${Math.abs(s.delta)} lugares` : `↓ ${s.delta} lugares`)
                    : `${s.delta > 0 ? '↑' : '↓'} ${Math.abs(s.delta)}%`;

                return (
                    <div key={key} className="stat-card">
                        <div className="stat-card__label">
                            <span className={'stat-card__icon stat-card__icon--' + accent}>
                                <Icon size={14} />
                            </span>
                            {s.label}
                        </div>
                        <div className="stat-card__value">{display}</div>
                        <div className={'stat-card__delta ' + (isUp ? 'stat-card__delta--up' : 'stat-card__delta--down')}>
                            {deltaText}
                            <span className="stat-card__delta-period">vs semana passada</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
