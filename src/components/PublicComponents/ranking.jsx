/* ─────────────────────────────────────────────────────────────────
   Ranking, Gamificação. Mostra leaderboard + pontos por interação.
   ───────────────────────────────────────────────────────────────── */

import useReveal from '../../hooks/useReveal.js'
import './ranking.css'

const REWARDS = [
    { v: '+10', l: 'por reprodução' },
    { v: '+50', l: 'por seguidor' },
    { v: '+25', l: 'por comentário' },
];

export default function Ranking() {
    const ref = useReveal();

    return (
        <section className="ranking section">
            <div className="container" ref={ref}>
                <div className="ranking__copy reveal">
                    <div className="label-eyebrow">Gamificação</div>
                    <h2 className="ranking__title">
                        Cada interação <span className="ranking__title-accent">conta</span>.
                    </h2>
                    <p className="ranking__lede">
                        Reproduções, seguidores, partilhas e comentários geram pontos.
                        Sobe no ranking, desbloqueia badges e ganha destaque na homepage.
                    </p>
                    <div className="ranking__rewards">
                        {REWARDS.map((r, i) => (
                            <div key={i} className="ranking__reward">
                                <div className="ranking__reward-v">{r.v}</div>
                                <div className="ranking__reward-l">{r.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
