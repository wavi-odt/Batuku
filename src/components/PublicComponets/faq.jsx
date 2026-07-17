/* ─────────────────────────────────────────────────────────────────
   FAQ, Perguntas frequentes (accordion).
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { FAQ as ITEMS } from '../../data/batuku.js'
import useReveal from '../../hooks/useReveal.js'
import './faq.css'

export default function FAQ() {
    const [open, setOpen] = useState(0);
    const ref = useReveal();

    return (
        <section className="faq section">
            <div className="container faq__inner" ref={ref}>
                <div className="reveal" style={{ textAlign: 'center' }}>
                    <div className="label-eyebrow">Perguntas frequentes</div>
                    <h2 className="faq__title">Ainda tens dúvidas?</h2>
                </div>

                <div className="faq__list reveal">
                    {ITEMS.map((f, i) => {
                        const isOpen = open === i;
                        return (
                            <div key={i} className={'faq__item card' + (isOpen ? ' is-open' : '')}>
                                <button
                                    type="button"
                                    className="faq__q"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpen(isOpen ? -1 : i)}
                                >
                                    <strong>{f.q}</strong>
                                    <span className="faq__plus" aria-hidden="true">+</span>
                                </button>
                                {isOpen && <div className="faq__a">{f.a}</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
