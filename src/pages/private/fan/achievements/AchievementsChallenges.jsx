/* ─────────────────────────────────────────────────────────────────
   AchievementsChallenges.jsx, Desafios ativos com barra de progresso.
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'

export default function AchievementsChallenges({ challenges, onAdvance }) {
    const [advancing, setAdvancing] = useState(false)

    const allDone   = challenges.length > 0 && challenges.every(ch => ch.completed)
    const setIndex  = challenges[0]?.setIndex  ?? 0
    const totalSets = challenges[0]?.totalSets ?? 3
    const setLabel  = `Conjunto ${setIndex + 1} de ${totalSets}`

    async function handleAdvance() {
        setAdvancing(true)
        try { await onAdvance?.() } finally { setAdvancing(false) }
    }

    return (
        <div>
            <div className="home__section-head" style={{ marginBottom: 16 }}>
                <div>
                    <h2 className="home__section-title">Desafios ativos</h2>
                    <div className="home__section-sub">
                        Completa para ganhar pontos de experiência
                        <span className="ach__set-label">{setLabel}</span>
                    </div>
                </div>
            </div>

            <div className="ach__challenges">
                {challenges.map(ch => {
                    const pct = Math.min(100, Math.round((ch.progress / ch.total) * 100));
                    return (
                        <div
                            key={ch.id}
                            className={`ach__challenge${ch.completed ? ' ach__challenge--done' : ''}`}
                        >
                            <div className="ach__challenge-row">
                                <span className="ach__challenge-icon" aria-hidden="true">{ch.icon}</span>
                                <div className="ach__challenge-info">
                                    <div className="ach__challenge-title">{ch.title}</div>
                                    <div className="ach__challenge-desc">{ch.desc}</div>
                                </div>
                                <span className="ach__challenge-xp">+{ch.xp} pts</span>
                            </div>

                            {ch.completed ? (
                                <div className="ach__challenge-done-label">✓ Concluído</div>
                            ) : (
                                <>
                                    <div className="ach__challenge-bar">
                                        <div
                                            className="ach__challenge-fill"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="ach__challenge-foot">
                                        <span>{ch.progress} / {ch.total}</span>
                                        {ch.expires && (
                                            <span className="ach__challenge-expires">
                                                Expira {ch.expires}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {allDone && (
                <div className="ach__advance-wrap">
                    <p className="ach__advance-msg">
                        Completaste todos os desafios deste conjunto!
                    </p>
                    <button
                        type="button"
                        className="ach__advance-btn"
                        onClick={handleAdvance}
                        disabled={advancing}
                    >
                        {advancing ? 'A carregar…' : '🎯 Desbloquear próximos desafios'}
                    </button>
                </div>
            )}
        </div>
    );
}
