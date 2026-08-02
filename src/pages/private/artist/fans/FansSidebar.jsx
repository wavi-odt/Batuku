/* ─────────────────────────────────────────────────────────────────
   FansSidebar.jsx, Sidebar: tier breakdown + localização + actividade.
   ───────────────────────────────────────────────────────────────── */

import { FaUserPlus, FaComment, FaHeart, FaBookmark } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { fansData }  from '../../../../data/fans.js'

const ACTIVITY_ICONS = {
    follow:  { Icon: FaUserPlus,  cls: 'follow'  },
    comment: { Icon: FaComment,   cls: 'comment' },
    like:    { Icon: FaHeart,     cls: 'like'    },
    save:    { Icon: FaBookmark,  cls: 'save'    },
};

export default function FansSidebar() {
    const { tiers, locations, recentActivity } = fansData;
    const maxLoc = Math.max(...locations.map(l => l.value));

    return (
        <aside className="fns__sidebar">

            {/* ── Tier breakdown ─────────────────────────────────── */}
            <div className="fns__card">
                <div className="fns__card-title">Distribuição de fãs</div>
                <div className="fns__tier-list">
                    {tiers.map(t => (
                        <div key={t.key} className="fns__tier-item">
                            <div className={`fns__tier-dot fns__tier-dot--${t.color}`} />
                            <div className="fns__tier-text">
                                <div className="fns__tier-label">{t.label}</div>
                                <div className="fns__tier-desc">{t.desc}</div>
                            </div>
                            <div className="fns__tier-count">{t.count.toLocaleString('pt-PT')}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Localização ────────────────────────────────────── */}
            <div className="fns__card">
                <div className="fns__card-title">Top localizações</div>
                <div className="fns__hbar-list">
                    {locations.map(loc => (
                        <div key={loc.label} className="fns__hbar-row">
                            <div className="fns__hbar-label">{loc.label}</div>
                            <div className="fns__hbar-track">
                                <div
                                    className="fns__hbar-fill"
                                    style={{ width: `${(loc.value / maxLoc) * 100}%` }}
                                />
                            </div>
                            <div className="fns__hbar-val">
                                {loc.value >= 1000
                                    ? `${(loc.value / 1000).toFixed(1)}k`
                                    : loc.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Actividade recente ─────────────────────────────── */}
            <div className="fns__card">
                <div className="fns__card-title">Actividade recente</div>
                <div className="fns__activity-list">
                    {recentActivity.map((act, i) => {
                        const { Icon, cls } = ACTIVITY_ICONS[act.type] ?? ACTIVITY_ICONS.like;
                        return (
                            <div key={i} className="fns__activity-item">
                                <div className="fns__activity-avatar">
                                    <ArtistArtwork
                                        shape="split"
                                        hue={act.hue}
                                        rounded={0}
                                        showGloss={false}
                                    />
                                </div>
                                <div className="fns__activity-body">
                                    <div className="fns__activity-text">
                                        <strong>@{act.user}</strong> {act.text}
                                    </div>
                                    <div className="fns__activity-time">{act.time}</div>
                                </div>
                                <div className={`fns__activity-icon fns__activity-icon--${cls}`}>
                                    <Icon size={11} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </aside>
    );
}
