/* ─────────────────────────────────────────────────────────────────
   Testimonials — Citações de artistas reais.
   ───────────────────────────────────────────────────────────────── */

import { TESTIMONIALS } from '../../data/batuku.js'
import ArtistArtwork from './ArtistArtwork.jsx'
import useReveal from '../../hooks/useReveal.js'
import './testimonials.css'

export default function Testimonials() {
    const ref = useReveal();
    return (
        <section className="testimonials section">
            <div className="container" ref={ref}>
                <div className="reveal">
                    <div className="label-eyebrow">Testemunhos</div>
                    <h2 className="testimonials__title">Artistas que já fazem casa aqui.</h2>
                </div>

                <div className="testimonials__grid reveal">
                    {TESTIMONIALS.map((t, i) => (
                        <article key={i} className="testimonial card">
                            <div className="testimonial__quote" aria-hidden="true">"</div>
                            <p className="testimonial__text">{t.quote}</p>
                            <div className="testimonial__author">
                                <div className="testimonial__avatar">
                                    <ArtistArtwork shape="split" hue={t.hue} rounded={0} showGloss={false} />
                                </div>
                                <div>
                                    <div className="testimonial__name">{t.name}</div>
                                    <div className="testimonial__role">{t.role}</div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
