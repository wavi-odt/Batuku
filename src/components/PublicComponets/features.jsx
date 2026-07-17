/* ─────────────────────────────────────────────────────────────────
   Features, Quatro cartões com as razões para usar o Batuku.
   ───────────────────────────────────────────────────────────────── */

import { FaChartLine, FaStore, FaTrophy, FaDiscord } from 'react-icons/fa'
import { FEATURES } from '../../data/batuku.js'
import useReveal from '../../hooks/useReveal.js'
import './features.css'

const ICONS = {
    chart:      FaChartLine,
    storefront: FaStore,
    trophy:     FaTrophy,
    discord:    FaDiscord,
};

const ACCENTS = ['coral', 'ocean', 'mustard', 'green'];

export default function Features() {
    const ref = useReveal();

    return (
        <section className="features section" id="features">
            <div className="container" ref={ref}>
                <div className="features__head reveal">
                    <div>
                        <div className="label-eyebrow">Porquê o Batuku</div>
                        <h2 className="features__title">Tudo num só lugar.</h2>
                    </div>
                    <p className="features__lede">
                        Quatro ferramentas pensadas para artistas independentes,
                        sem complicações, sem taxas escondidas.
                    </p>
                </div>

                <div className="features__grid reveal">
                    {FEATURES.map((f, i) => {
                        const Icon = ICONS[f.icon];
                        const accent = ACCENTS[i % ACCENTS.length];
                        return (
                            <article key={i} className={'features__card card features__card--' + accent}>
                                <div className="features__icon">{Icon && <Icon />}</div>
                                <div>
                                    <h3 className="features__card-title">{f.title}</h3>
                                    <p className="features__card-body">{f.body}</p>
                                </div>
                                <a href="#" className="features__link">Saber mais →</a>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
