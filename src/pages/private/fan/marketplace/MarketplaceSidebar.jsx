/* ─────────────────────────────────────────────────────────────────
   MarketplaceSidebar.jsx, Carrinho + Top Produtores na sidebar.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

const LIC_LABELS = { lease: 'Lease', premium: 'Premium', exclusive: 'Exclusiva' };

export default function MarketplaceSidebar({ cart, onRemove, producers }) {
    const total = cart.reduce((s, i) => s + i.price, 0);

    return (
        <>
            {/* ─── Carrinho ─────────────────────────────────────── */}
            <div className="mkt__cart">
                <div className="mkt__cart-head">
                    <span className="mkt__cart-title">Carrinho</span>
                    {cart.length > 0 && (
                        <span className="mkt__cart-count">{cart.length}</span>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="mkt__cart-empty">
                        <div className="mkt__cart-empty-icon">🛒</div>
                        <div>O teu carrinho está vazio</div>
                    </div>
                ) : (
                    <>
                        <div className="mkt__cart-items">
                            {cart.map(item => (
                                <div key={item.beat.id} className="mkt__cart-item">
                                    <div className="mkt__cart-item-cover">
                                        <ArtistArtwork
                                            shape="circles"
                                            hue={item.beat.hue}
                                            image={item.beat.image}
                                            rounded={0}
                                            showGloss={false}
                                        />
                                    </div>
                                    <div className="mkt__cart-item-info">
                                        <div className="mkt__cart-item-title">{item.beat.title}</div>
                                        <div className="mkt__cart-item-lic">{LIC_LABELS[item.license]}</div>
                                    </div>
                                    <span className="mkt__cart-item-price">€{item.price.toFixed(2)}</span>
                                    <button
                                        type="button"
                                        className="mkt__cart-item-remove"
                                        aria-label="Remover"
                                        onClick={() => onRemove(item.beat.id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <hr className="mkt__cart-divider" />

                        <div className="mkt__cart-total">
                            <span>Total</span>
                            <span className="mkt__cart-total-val">€{total.toFixed(2)}</span>
                        </div>

                        <button type="button" className="mkt__cart-checkout">
                            Finalizar compra →
                        </button>
                    </>
                )}
            </div>

            {/* ─── Top Produtores ──────────────────────────────── */}
            <div className="mkt__producers">
                <div className="mkt__prod-head">
                    <span className="mkt__prod-title">Top Produtores</span>
                    <a href="#" className="home__section-link" style={{ fontSize: 12 }}>Ver todos →</a>
                </div>

                <div className="mkt__prod-list">
                    {producers.map(p => (
                        <div key={p.id} className="mkt__prod-row">
                            <div className="mkt__prod-avatar">
                                <ArtistArtwork
                                    shape={p.shape}
                                    hue={p.hue}
                                    image={p.image}
                                    rounded={0}
                                    showGloss={false}
                                />
                                {p.isVerified && (
                                    <span className="mkt__prod-verified" aria-label="Verificado">✓</span>
                                )}
                            </div>
                            <div className="mkt__prod-info">
                                <div className="mkt__prod-name">{p.name}</div>
                                <div className="mkt__prod-genre">{p.genre} · {p.beats} beats</div>
                            </div>
                            <div className="mkt__prod-meta">
                                <div className="mkt__prod-sales">{p.sales} vendas</div>
                                <div className="mkt__prod-rating">★ {p.rating}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
