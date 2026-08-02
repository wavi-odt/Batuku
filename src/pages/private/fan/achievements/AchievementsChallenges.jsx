/* ─────────────────────────────────────────────────────────────────
   AchievementsChallenges.jsx, Desafios ativos com barra de progresso.
   ───────────────────────────────────────────────────────────────── */

export default function AchievementsChallenges({ challenges }) {
    return (
        <div>
            <div className="home__section-head" style={{ marginBottom: 16 }}>
                <div>
                    <h2 className="home__section-title">Desafios ativos</h2>
                    <div className="home__section-sub">Completa para ganhar pontos de experiência</div>
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
                                <span className="ach__challenge-xp">+{ch.xp} xp</span>
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
        </div>
    );
}
