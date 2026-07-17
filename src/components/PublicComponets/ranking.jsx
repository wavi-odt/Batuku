/* ─────────────────────────────────────────────────────────────────
   Ranking, Gamificação. Mostra leaderboard + pontos por interação.
   ───────────────────────────────────────────────────────────────── */

import { LEADERBOARD, ARTISTS } from '../../data/batuku.js'
import ArtistArtwork from './ArtistArtwork.jsx'
import useReveal from '../../hooks/useReveal.js'
import './ranking.css'

const REWARDS = [
    { v: '+10', l: 'por reprodução' },
    { v: '+50', l: 'por seguidor' },
    { v: '+25', l: 'por comentário' },
];

const RANK_COLORS = {
    1: 'gold',
    2: 'silver',
    3: 'bronze',
};

export default function Ranking() {
    const ref = useReveal();
    const max = LEADERBOARD[0].pts;

    return (
        <section className="ranking section">
            <div className="container" ref={ref}>
                <div className="ranking__grid reveal">

                    <div className="ranking__board card">
                        <div className="ranking__board-head">
                            <div className="ranking__board-title">Ranking semanal</div>
                            <div className="ranking__live">● ATUALIZADO HÁ 4 MIN</div>
                        </div>
                        {LEADERBOARD.map((r, i) => (
                            <div key={i} className="ranking__row">
                                <div className={'ranking__rank ranking__rank--' + (RANK_COLORS[r.rank] || 'mute')}>
                                    #{r.rank}
                                </div>
                                <div className="ranking__avatar">
                                    <ArtistArtwork shape={ARTISTS[i].shape} hue={ARTISTS[i].hue} image={ARTISTS[i].image} rounded={0} showGloss={false} />
                                </div>
                                <div className="ranking__row-meta">
                                    <div className="ranking__row-name">{r.name}</div>
                                    <div className="ranking__bar">
                                        <div className="ranking__bar-fill" style={{ width: `${(r.pts / max) * 100}%` }} />
                                    </div>
                                </div>
                                <div className="ranking__pts">{r.pts.toLocaleString('pt-PT')} pts</div>
                                <div className="ranking__delta">{r.delta}</div>
                            </div>
                        ))}
                    </div>

                    <div className="ranking__copy">
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
            </div>
        </section>
    );
}
