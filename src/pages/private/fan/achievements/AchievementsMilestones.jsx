/* ─────────────────────────────────────────────────────────────────
   AchievementsMilestones.jsx, Estatísticas acumuladas de escuta.
   ───────────────────────────────────────────────────────────────── */

export default function AchievementsMilestones({ milestones }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">As tuas estatísticas</h2>
                    <div className="home__section-sub">Desde que entraste no Batuku</div>
                </div>
            </div>

            <div className="ach__milestones">
                {milestones.map((m, i) => (
                    <div key={i} className="ach__milestone">
                        <div className="ach__milestone-value">
                            {m.value.toLocaleString('pt-PT')}
                            {m.unit && <span className="ach__milestone-unit">{m.unit}</span>}
                        </div>
                        <div className="ach__milestone-label">{m.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
