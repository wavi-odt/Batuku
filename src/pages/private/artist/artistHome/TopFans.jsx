import { Link } from 'react-router-dom'
import UserAvatar from '../../../../components/UserAvatar.jsx'
import './TopFans.css'

export default function TopFans({ fans, loading }) {
    const top = [...fans].sort((a, b) => b.plays - a.plays).slice(0, 5)

    return (
        <div className="fans-card">
            <h3 className="fans-card__title">
                Top fãs no período
                <Link to="/fans" className="dash__head-link">Ver todos →</Link>
            </h3>

            {loading && <div style={{ color: 'var(--color-ink-mute)', fontSize: 13 }}>A carregar…</div>}

            {!loading && top.length === 0 && (
                <div style={{ color: 'var(--color-ink-mute)', fontSize: 13 }}>Sem fãs ainda</div>
            )}

            {top.map((f, i) => (
                <Link key={f.id} to={`/users/${f.id}`} className="fans-row" style={{ textDecoration: 'none' }}>
                    <div className={`fans-row__rank${i === 0 ? ' fans-row__rank--gold' : ''}`}>
                        #{i + 1}
                    </div>
                    <div className="fans-row__avatar">
                        <UserAvatar id={f.id} name={f.name} imageUrl={f.avatarUrl} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="fans-row__info">
                        <div className="fans-row__name">{f.name}</div>
                        <div className="fans-row__handle">{f.handle}</div>
                    </div>
                    <div className="fans-row__plays">{f.plays.toLocaleString('pt-PT')} plays</div>
                </Link>
            ))}
        </div>
    )
}
