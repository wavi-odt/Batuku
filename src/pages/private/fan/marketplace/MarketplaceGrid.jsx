/* ─────────────────────────────────────────────────────────────────
   MarketplaceGrid.jsx, Lista de beats com seleção de licença.
   ───────────────────────────────────────────────────────────────── */

import { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaShoppingCart, FaCheck, FaHandshake, FaChevronDown } from 'react-icons/fa'
import NowPlayingEq from '../../../../components/NowPlayingEq.jsx'
import ArtistArtwork from '../../../../components/PublicComponents/ArtistArtwork.jsx'
import ClickableName from '../../../../components/ClickableName.jsx'

const LIC_KEYS   = ['lease', 'premium', 'exclusive'];
const LIC_ABBREV = { lease: 'L', premium: 'P', exclusive: 'E' };
const LIC_LABELS = { lease: 'Lease', premium: 'Premium', exclusive: 'Excl.' };

function LicDropdown({ beatId, lic, prices, exclusiveNegotiable, onLicense }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        function onDown(e) {
            if (!ref.current?.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [open])

    return (
        <div className="mkt__lic-drop" ref={ref}>
            <button
                type="button"
                className={`mkt__lic-drop__btn${open ? ' mkt__lic-drop__btn--open' : ''}`}
                onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
            >
                {LIC_LABELS[lic]}
                <FaChevronDown size={9} className={`mkt__lic-drop__chevron${open ? ' mkt__lic-drop__chevron--open' : ''}`} />
            </button>

            {open && (
                <div className="mkt__lic-drop__menu" onClick={e => e.stopPropagation()}>
                    {LIC_KEYS.map(k => (
                        <button
                            key={k}
                            type="button"
                            className={`mkt__lic-drop__option${lic === k ? ' mkt__lic-drop__option--active' : ''}`}
                            onClick={() => { onLicense(beatId, k); setOpen(false) }}
                        >
                            <span>{LIC_LABELS[k]}</span>
                            <span className="mkt__lic-drop__price">
                                {k === 'exclusive' && exclusiveNegotiable ? 'Negociar' : `€${prices[k].toFixed(2)}`}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function MarketplaceGrid({
    beats,
    licenses = {},
    playing,
    onPlay,
    onLicense = () => {},
    cartIds,
    onCart = () => {},
    onOffer = () => {},
    readOnly = false,
}) {
    const headerCls = `mkt__beat-header${readOnly ? ' mkt__beat-header--readonly' : ''}`

    return (
        <div>
            {/* Column headers */}
            <div className={headerCls}>
                <div />
                <div className="mkt__beat-col-label">Título</div>
                <div className="mkt__beat-col-label mkt__beat-col--genre">Género</div>
                <div className="mkt__beat-col-label mkt__beat-col--bpm">BPM · Tom</div>
                {!readOnly && (
                    <>
                        <div className="mkt__beat-col-label mkt__beat-col--lic">Licença</div>
                        <div className="mkt__beat-col-label mkt__lic-drop-spacer">Licença</div>
                    </>
                )}
                <div className="mkt__beat-col-label" style={{ textAlign: 'right' }}>Preço</div>
                {!readOnly && <div />}
            </div>

            <div className="mkt__beat-list">
                {beats.map(beat => {
                    const lic      = licenses[beat.id] ?? 'lease';
                    const price    = beat.prices[lic];
                    const inCart   = cartIds ? cartIds.has(beat.id) : false;
                    const playing_ = playing === beat.id;

                    const rowCls = [
                        'mkt__beat-row',
                        readOnly                   ? 'mkt__beat-row--readonly'  : '',
                        !readOnly && inCart         ? 'mkt__beat-row--in-cart'   : '',
                        playing_                   ? 'mkt__beat-row--playing'   : '',
                    ].filter(Boolean).join(' ')

                    return (
                        <div key={beat.id} className={rowCls}>
                            {/* Cover + play */}
                            <div className="mkt__beat-cover cover-hover">
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
                                    {playing_ ? <NowPlayingEq /> : <FaPlay />}
                                </button>
                            </div>

                            {/* Info */}
                            <div className="mkt__beat-info">
                                <div className="mkt__beat-title">
                                    {beat.title}
                                    {beat.isNew && <span className="mkt__beat-new">novo</span>}
                                </div>
                                <div className="mkt__beat-producer">
                                    <ClickableName userId={beat.producerId} name={beat.producer} />
                                </div>
                            </div>

                            {/* Genre */}
                            <div className="mkt__beat-genre">{beat.genre}</div>

                            {/* BPM · Key */}
                            <div className="mkt__beat-bpm">{beat.bpm} · {beat.key}</div>

                            {/* License selector (hidden in readOnly) */}
                            {!readOnly && (
                                <>
                                    <div className="mkt__beat-licenses">
                                        {LIC_KEYS.map(k => (
                                            <button
                                                key={k}
                                                type="button"
                                                className={`mkt__beat-lic-btn${lic === k ? ' mkt__beat-lic-btn--active' : ''}`}
                                                title={k === 'exclusive' && beat.exclusiveNegotiable ? `${LIC_LABELS[k]} · Negociar` : `${LIC_LABELS[k]} · €${beat.prices[k].toFixed(2)}`}
                                                onClick={() => onLicense(beat.id, k)}
                                            >
                                                {LIC_ABBREV[k]}
                                            </button>
                                        ))}
                                    </div>
                                    <LicDropdown
                                        beatId={beat.id}
                                        lic={lic}
                                        prices={beat.prices}
                                        exclusiveNegotiable={beat.exclusiveNegotiable}
                                        onLicense={onLicense}
                                    />
                                </>
                            )}

                            {/* Price */}
                            <div className="mkt__beat-price">
                                {lic === 'exclusive' && beat.exclusiveNegotiable
                                    ? <span className="mkt__beat-price--negotiate">Negociar</span>
                                    : `€${price.toFixed(2)}`
                                }
                            </div>

                            {/* Cart / Offer button (hidden in readOnly) */}
                            {!readOnly && (
                                lic === 'exclusive' && beat.exclusiveNegotiable ? (
                                    <button
                                        type="button"
                                        className="mkt__beat-offer-btn"
                                        aria-label="Fazer proposta"
                                        title="Fazer proposta de compra exclusiva"
                                        onClick={() => onOffer(beat)}
                                    >
                                        <FaHandshake />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className={`mkt__beat-cart-btn${inCart ? ' mkt__beat-cart-btn--in-cart' : ''}`}
                                        aria-label={inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
                                        onClick={() => onCart(beat, lic, price)}
                                    >
                                        {inCart ? <FaCheck /> : <FaShoppingCart />}
                                    </button>
                                )
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
