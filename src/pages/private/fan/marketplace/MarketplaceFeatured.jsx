/* ─────────────────────────────────────────────────────────────────
   MarketplaceFeatured.jsx, Card hero do beat em destaque.
   ───────────────────────────────────────────────────────────────── */

import { useState }   from 'react'
import ArtistArtwork  from '../../../../components/PublicComponets/ArtistArtwork.jsx'

const LICENSE_KEYS = ['lease', 'premium', 'exclusive'];
const LICENSE_LABELS = { lease: 'Lease', premium: 'Premium', exclusive: 'Exclusiva' };

export default function MarketplaceFeatured({ beat, onCart, inCart }) {
    const [license, setLicense] = useState('lease');

    const price = beat.prices[license];

    return (
        <div
            className="mkt__featured"
            style={{ '--feat-hue': beat.hue }}
        >
            <div className="mkt__feat-cover">
                <ArtistArtwork
                    shape="circles"
                    hue={beat.hue}
                    image={beat.image}
                    rounded={0}
                    showGloss={false}
                />
            </div>

            <div className="mkt__feat-body">
                <div className="mkt__feat-eyebrow">Beat em Destaque</div>
                <h2 className="mkt__feat-title">{beat.title}</h2>
                <p className="mkt__feat-producer">{beat.producer}</p>

                <div className="mkt__feat-tags">
                    <span className="mkt__feat-tag">{beat.genre}</span>
                    <span className="mkt__feat-tag">{beat.bpm} BPM</span>
                    <span className="mkt__feat-tag">{beat.key}</span>
                    {beat.mood && <span className="mkt__feat-tag">{beat.mood}</span>}
                </div>

                <p className="mkt__feat-desc">{beat.desc}</p>
            </div>

            <div className="mkt__feat-aside">
                <div className="mkt__feat-license-group">
                    {LICENSE_KEYS.map(k => (
                        <button
                            key={k}
                            type="button"
                            className={`mkt__feat-license-btn${license === k ? ' mkt__feat-license-btn--active' : ''}`}
                            onClick={() => setLicense(k)}
                        >
                            <span className="mkt__feat-license-name">{LICENSE_LABELS[k]}</span>
                            <span className="mkt__feat-license-price">€{beat.prices[k].toFixed(2)}</span>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className="mkt__feat-buy"
                    onClick={() => onCart(beat, license, price)}
                >
                    {inCart ? '✓ No carrinho' : `Comprar · €${price.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
}
