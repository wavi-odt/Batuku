/* ─────────────────────────────────────────────────────────────────
   AchievementsBadges.jsx, Grelha de badges ganhos e bloqueados.
   ───────────────────────────────────────────────────────────────── */

import {
    FaSun, FaFire, FaCompass, FaHeart, FaList,
    FaCrown, FaHeadphones, FaBolt, FaGem, FaLock,
} from 'react-icons/fa'

const BADGE_ICONS = {
    'Madrugador':   FaSun,
    'Streak 12':    FaFire,
    'Explorador':   FaCompass,
    'Apoiante':     FaHeart,
    'Curador':      FaList,
    'Top 100':      FaCrown,
    'Fã Dedicado':  FaHeadphones,
    'Streak 30':    FaFire,
    'Influenciador':FaBolt,
    'Lenda':        FaGem,
}

function BadgeIcon({ name, locked }) {
    const Icon = BADGE_ICONS[name] ?? FaGem
    return <Icon size={22} color={locked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.9)'} />
}

export default function AchievementsBadges({ badges }) {
    const earned = badges.filter(b => b.got);
    const locked = badges.filter(b => !b.got);

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Conquistas</h2>
                    <div className="home__section-sub">
                        {earned.length} desbloqueadas · {locked.length} por conquistar
                    </div>
                </div>
            </div>

            <div className="ach__badges">
                {badges.map(b => (
                    <div
                        key={b.id}
                        className={`ach__badge${b.got ? '' : ' ach__badge--locked'}`}
                        title={b.got ? `Desbloqueado: ${b.meta}` : `Bloqueado: ${b.meta}`}
                    >
                        <div className={`ach__badge-icon ach__badge-icon--${b.tier}`}>
                            <BadgeIcon name={b.name} locked={!b.got} />
                        </div>
                        <div className="ach__badge-name">{b.name}</div>
                        <div className="ach__badge-desc">{b.desc}</div>
                        <div className="ach__badge-meta">
                            {b.got
                                ? <><span className="ach__badge-xp">+{b.xp} xp</span> · {b.meta}</>
                                : b.meta
                            }
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
