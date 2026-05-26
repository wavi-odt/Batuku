/* ─────────────────────────────────────────────────────────────────
   Discord — Block que convida para o servidor Discord.
   ───────────────────────────────────────────────────────────────── */

import { FaDiscord } from 'react-icons/fa'
import useReveal from '../../hooks/useReveal.js'
import './discord.css'

const MESSAGES = [
    { user: 'djossa',     msg: 'Acabei de subir o single novo 🔥',  time: '14:32', hue: 14 },
    { user: 'naia',       msg: 'Quem vai à listening session quinta?', time: '15:01', hue: 220 },
    { user: 'bento_prod', msg: 'Beat exclusivo só €30 hoje',        time: '15:14', hue: 42 },
];

export default function Discord() {
    const ref = useReveal();
    return (
        <section className="discord section" id="comunidade">
            <div className="container" ref={ref}>
                <div className="discord__card reveal">

                    <div className="discord__copy">
                        <div className="label-eyebrow discord__eyebrow">Comunidade Discord</div>
                        <h2 className="discord__title">Onde a cena vive 24/7.</h2>
                        <p className="discord__lede">
                            Sessões ao vivo, feedback entre produtores, listening parties às quintas.
                            Mais de <strong>8.500 membros</strong> já lá estão.
                        </p>
                        <a href="https://discord.gg/" className="btn discord__btn">
                            <FaDiscord size={18} />
                            Entrar no Discord
                        </a>
                    </div>

                    <div className="discord__chat">
                        {MESSAGES.map((m, i) => (
                            <div key={i} className="discord__msg">
                                <span className="discord__msg-avatar" style={{ background: `oklch(0.6 0.18 ${m.hue})` }} />
                                <div className="discord__msg-body">
                                    <div className="discord__msg-head">
                                        <strong>@{m.user}</strong>
                                        <span className="discord__msg-time">{m.time}</span>
                                    </div>
                                    <div className="discord__msg-text">{m.msg}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
