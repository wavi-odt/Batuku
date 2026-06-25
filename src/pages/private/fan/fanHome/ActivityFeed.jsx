/* ─────────────────────────────────────────────────────────────────
   ActivityFeed.jsx — Lista de atividade recente do fã.
   ───────────────────────────────────────────────────────────────── */

import { FaAward, FaUsers, FaHeart } from 'react-icons/fa'
import { HiOutlineChatAlt2, HiArrowUp } from 'react-icons/hi'
import './ActivityFeed.css'

const ICONS_MAP = {
    badge:   FaAward,
    follow:  FaUsers,
    comment: HiOutlineChatAlt2,
    like:    FaHeart,
    level:   HiArrowUp,
};

export default function ActivityFeed({ items }) {
    return (
        <div className="activity">
            <h3 className="activity__title">
                Atividade recente
                <a href="#" className="home__section-link">Tudo →</a>
            </h3>
            {items.map((it, i) => {
                const Icon = ICONS_MAP[it.type] || FaAward;
                return (
                    <div key={i} className="activity__item">
                        <div className={'activity__dot activity__dot--' + it.type}>
                            <Icon size={14} />
                        </div>
                        <div className="activity__body">
                            <div className="activity__text">{it.text}</div>
                            <div className="activity__time">{it.time}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
