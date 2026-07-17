/* ─────────────────────────────────────────────────────────────────
   CTA, Chamada à ação final.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { FaDiscord } from 'react-icons/fa'
import useReveal from '../../hooks/useReveal.js'
import './cta.css'

export default function CTA() {
    const ref = useReveal();
    return (
        <section className="cta section">
            <div className="cta__bg" aria-hidden="true" />
            <div className="container cta__inner" ref={ref}>
                <div className="reveal">
                    <div className="label-eyebrow">Junta-te à comunidade</div>
                    <h2 className="cta__title">
                        O Batuku liga tecnologia à <span className="cta__title-accent">cultura cabo-verdiana</span>.
                    </h2>
                    <p className="cta__lede">Grátis para sempre. Regista-te em segundos.</p>
                    <div className="cta__actions">
                        <Link to="/register" className="btn btn--primary">Criar conta grátis</Link>
                        <a href="https://discord.gg/" className="btn btn--ghost">
                            <FaDiscord size={16} />
                            Entrar via Discord
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
