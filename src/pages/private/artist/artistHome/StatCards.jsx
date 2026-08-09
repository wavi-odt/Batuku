import { FaPlay, FaHeart, FaUsers, FaRegComment } from 'react-icons/fa'
import './StatCards.css'

const META = {
    plays:     { icon: FaPlay,       accent: 'coral'   },
    likes:     { icon: FaHeart,      accent: 'mustard' },
    comments:  { icon: FaRegComment, accent: 'green'   },
    followers: { icon: FaUsers,      accent: 'ocean'   },
}

export default function StatCards({ stats }) {
    const order = ['plays', 'likes', 'comments', 'followers']

    return (
        <div className="stats4">
            {order.map(key => {
                const s = stats[key]
                if (!s) return null
                const { icon: Icon, accent } = META[key]
                const isUp    = s.delta >= 0
                const display = s.value.toLocaleString('pt-PT')
                const deltaText = `${s.delta >= 0 ? '↑' : '↓'} ${Math.abs(s.delta)}%`

                return (
                    <div key={key} className="stat-card">
                        <div className="stat-card__label">
                            <span className={`stat-card__icon stat-card__icon--${accent}`}>
                                <Icon size={14} />
                            </span>
                            {s.label}
                        </div>
                        <div className="stat-card__value">{display}</div>
                        <div className={`stat-card__delta ${isUp ? 'stat-card__delta--up' : 'stat-card__delta--down'}`}>
                            {deltaText}
                            <span className="stat-card__delta-period">vs período anterior</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
