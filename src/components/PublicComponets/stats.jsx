/* ─────────────────────────────────────────────────────────────────
   Stats, Quatro métricas numa única faixa.
   ───────────────────────────────────────────────────────────────── */

import { STATS } from '../../data/batuku.js'
import useReveal from '../../hooks/useReveal.js'
import './stats.css'

export default function Stats() {
    const ref = useReveal();
    return (
        <section className="stats">
            <div className="container">
                <div ref={ref} className="stats__grid reveal">
                    {STATS.map((s, i) => (
                        <div key={i} className="stats__cell">
                            <div className="stats__value">{s.value}</div>
                            <div className="stats__label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
