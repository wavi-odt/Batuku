/* ─────────────────────────────────────────────────────────────────
   Testimonials, Citações de artistas reais.
   ───────────────────────────────────────────────────────────────── */

import { FOUNDERS, ARTISTS } from '../../data/landing.js'
import ArtistArtwork from './ArtistArtwork.jsx'
import useReveal from '../../hooks/useReveal.js'
import './testimonials.css'

const IMG_BY_NAME = Object.fromEntries(ARTISTS.map(a => [a.name, a.image]));

export default function Testimonials() {
    const ref = useReveal();
    return (
        <section className="testimonials section">
            <div className="container" ref={ref}>
                <div className="reveal">
                    <div className="label-eyebrow">Artistas fundadores</div>
                    <h2 className="testimonials__title">Os primeiros a fazer casa aqui.</h2>
                </div>

                <div className="testimonials__grid reveal">
                    {FOUNDERS.map((f, i) => (
                        <article key={i} className="testimonial card">
                            <div className="testimonial__author" style={{ marginTop: 'auto' }}>
                                <div className="testimonial__avatar">
                                    <ArtistArtwork shape="split" hue={f.hue} image={IMG_BY_NAME[f.name]} rounded={0} showGloss={false} />
                                </div>
                                <div>
                                    <div className="testimonial__name">{f.name}</div>
                                    <div className="testimonial__role">{f.role}</div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
