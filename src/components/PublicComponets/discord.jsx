/* ─────────────────────────────────────────────────────────────────
   Discord, Block que convida para o servidor Discord.
   ───────────────────────────────────────────────────────────────── */

import { FaDiscord } from 'react-icons/fa'
import useReveal from '../../hooks/useReveal.js'
import './discord.css'

export default function Discord() {
    const ref = useReveal();
    return (
        <section className="discord section" id="comunidade">
            <div className="container" ref={ref}>
                <div className="discord__card reveal">

                    <div className="discord__copy">
                        <div className="label-eyebrow discord__eyebrow">Comunidade Discord</div>
                        <h2 className="discord__title">Comunidade musical online. Tu também tens voz.</h2>
                        <p className="discord__lede">
                            Sessões ao vivo, feedback entre produtores, listening parties e muito mais.
                            Entra, apresenta-te e faz parte da cena.
                        </p>
                        <a href="https://discord.gg/RCMcu9PAe" target="_blank" rel="noreferrer" className="btn discord__btn" style={{ display: 'inline-flex', margin: '0 auto' }}>
                            <FaDiscord size={18} />
                            Entrar no Discord
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
