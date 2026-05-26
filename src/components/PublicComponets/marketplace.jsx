/* ─────────────────────────────────────────────────────────────────
   Marketplace — Preview do marketplace de beats.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { BEATS } from '../../data/batuku.js'
import ArtistArtwork from './ArtistArtwork.jsx'
import useReveal from '../../hooks/useReveal.js'
import './marketplace.css'

const FEATURES = [
    'Licenças claras (Lease, Premium, Exclusive)',
    'Previews protegidas com watermark',
    'Pagamento em 48h após a compra',
];

export default function Marketplace() {
    const ref = useReveal();
    return (
        <section className="marketplace section" id="marketplace">
            <div className="container" ref={ref}>
                <div className="marketplace__grid reveal">
                    <div className="marketplace__copy">
                        <div className="label-eyebrow">Marketplace de beats</div>
                        <h2 className="marketplace__title">
                            Compra e vende instrumentais sem sair da plataforma.
                        </h2>
                        <p className="marketplace__lede">
                            Produtores publicam beats, MCs descobrem-nos, e tu ficas com <strong>92%</strong> do
                            que vendes. Pagamentos seguros via MB Way, cartão e PayPal.
                        </p>
                        <ul className="marketplace__list">
                            {FEATURES.map((t, i) => (
                                <li key={i} className="marketplace__item">
                                    <span className="marketplace__check" aria-hidden="true">
                                        <svg width="10" height="10" viewBox="0 0 12 12">
                                            <path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    {t}
                                </li>
                            ))}
                        </ul>
                        <Link to="/marketplace" className="btn btn--primary">Explorar marketplace →</Link>
                    </div>

                    <div className="marketplace__panel card">
                        <div className="marketplace__panel-head">
                            <div className="marketplace__panel-url">marketplace.batuku.cv</div>
                            <div className="marketplace__panel-dots">
                                <span /><span /><span />
                            </div>
                        </div>
                        <div className="marketplace__beats">
                            {BEATS.map((b, i) => (
                                <div key={i} className="beat">
                                    <div className="beat__cover">
                                        <ArtistArtwork shape="circles" hue={b.hue} rounded={0} showGloss={false} />
                                    </div>
                                    <div className="beat__meta">
                                        <div className="beat__title">{b.title}</div>
                                        <div className="beat__sub">{b.producer} · {b.genre}</div>
                                    </div>
                                    <div className="beat__bpm">{b.bpm} BPM · {b.key}</div>
                                    <div className="beat__price">€{b.price.toFixed(2)}</div>
                                    <button className="beat__buy" type="button">Comprar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
