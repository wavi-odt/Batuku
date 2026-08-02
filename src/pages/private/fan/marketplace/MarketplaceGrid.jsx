/* ─────────────────────────────────────────────────────────────────
   MarketplaceGrid.jsx, Lista de beats com seleção de licença.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay, FaPause, FaShoppingCart, FaCheck } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

const LIC_KEYS   = ['lease', 'premium', 'exclusive'];
const LIC_ABBREV = { lease: 'L', premium: 'P', exclusive: 'E' };
const LIC_LABELS = { lease: 'Lease', premium: 'Premium', exclusive: 'Excl.' };

export default function MarketplaceGrid({ beats, licenses, playing, onPlay, onLicense, cartIds, onCart }) {
    return (
        <div>
            {/* Column headers */}
            <div className="mkt__beat-header">
                <div />
                <div className="mkt__beat-col-label">Título</div>
                <div className="mkt__beat-col-label">Género</div>
                <div className="mkt__beat-col-label">BPM · Tom</div>
                <div className="mkt__beat-col-label">Licença</div>
                <div className="mkt__beat-col-label" style={{ textAlign: 'right' }}>Preço</div>
                <div />
            </div>

            <div className="mkt__beat-list">
                {beats.map(beat => {
                    const lic     = licenses[beat.id] ?? 'lease';
                    const price   = beat.prices[lic];
                    const inCart  = cartIds.has(beat.id);
                    const playing_ = playing === beat.id;

                    return (
                        <div
                            key={beat.id}
                            className={[
                                'mkt__beat-row',
                                inCart   ? 'mkt__beat-row--in-cart' : '',
                                playing_ ? 'mkt__beat-row--playing'  : '',
                            ].filter(Boolean).join(' ')}
                        >
                            {/* Cover + play */}
                            <div className="mkt__beat-cover">
                                <ArtistArtwork
                                    shape="circles"
                                    hue={beat.hue}
                                    image={beat.image}
                                    rounded={0}
                                    showGloss={false}
                                />
                                <button
                                    type="button"
                                    className="mkt__beat-play"
                                    aria-label={playing_ ? 'Pausar' : 'Pré-ouvir'}
                                    onClick={() => onPlay(playing_ ? null : beat.id)}
                                >
                                    {playing_ ? <FaPause /> : <FaPlay />}
                                </button>
                            </div>

                            {/* Info */}
                            <div className="mkt__beat-info">
                                <div className="mkt__beat-title">
                                    {beat.title}
                                    {beat.isNew && <span className="mkt__beat-new">novo</span>}
                                </div>
                                <div className="mkt__beat-producer">{beat.producer}</div>
                            </div>

                            {/* Genre */}
                            <div className="mkt__beat-genre">{beat.genre}</div>

                            {/* BPM · Key */}
                            <div className="mkt__beat-bpm">{beat.bpm} · {beat.key}</div>

                            {/* License selector */}
                            <div className="mkt__beat-licenses">
                                {LIC_KEYS.map(k => (
                                    <button
                                        key={k}
                                        type="button"
                                        className={`mkt__beat-lic-btn${lic === k ? ' mkt__beat-lic-btn--active' : ''}`}
                                        title={`${LIC_LABELS[k]} · €${beat.prices[k].toFixed(2)}`}
                                        onClick={() => onLicense(beat.id, k)}
                                    >
                                        {LIC_ABBREV[k]}
                                    </button>
                                ))}
                            </div>

                            {/* Price */}
                            <div className="mkt__beat-price">€{price.toFixed(2)}</div>

                            {/* Cart toggle */}
                            <button
                                type="button"
                                className={`mkt__beat-cart-btn${inCart ? ' mkt__beat-cart-btn--in-cart' : ''}`}
                                aria-label={inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
                                onClick={() => onCart(beat, lic, price)}
                            >
                                {inCart ? <FaCheck /> : <FaShoppingCart />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
