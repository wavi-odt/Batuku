/* ─────────────────────────────────────────────────────────────────
   HowItWorks, Três passos para começar.
   ───────────────────────────────────────────────────────────────── */

import { STEPS } from '../../data/batuku.js'
import useReveal from '../../hooks/useReveal.js'
import './howItWorks.css'

export default function HowItWorks() {
    const ref = useReveal();
    return (
        <section className="how section">
            <div className="container" ref={ref}>
                <div className="how__head reveal">
                    <div className="label-eyebrow">Como funciona</div>
                    <h2 className="how__title">Do registo ao primeiro fã, em minutos.</h2>
                </div>

                <div className="how__grid reveal">
                    {STEPS.map((s, i) => (
                        <div key={i} className="how__step">
                            <div className="how__step-num">{s.n}</div>
                            <h3 className="how__step-title">{s.title}</h3>
                            <p className="how__step-body">{s.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
