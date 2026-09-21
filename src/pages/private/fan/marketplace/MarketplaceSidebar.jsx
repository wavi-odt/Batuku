/* ─────────────────────────────────────────────────────────────────
   MarketplaceSidebar.jsx — Carrinho + Top Produtores.
   ───────────────────────────────────────────────────────────────── */

import { useState }   from 'react'
import ArtistArtwork  from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { API, getToken } from '../../../../utils/auth.js'
import { useToast }   from '../../../../context/ToastContext.jsx'

const LIC_LABELS = { lease: 'Lease', premium: 'Premium', exclusive: 'Exclusiva' }

export default function MarketplaceSidebar({ cart, onRemove, onClearCart, producers }) {
    const { showToast } = useToast()
    const total = cart.reduce((s, i) => s + i.price, 0)

    const [checking, setChecking] = useState(false)
    const [done,     setDone]     = useState(false)
    const [result,   setResult]   = useState(null)

    const handleCheckout = async () => {
        setChecking(true)
        const succeeded = []
        const failed    = []
        for (const item of cart) {
            try {
                const res = await fetch(`${API}/api/marketplace/purchase`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        beatId:      item.beat.id,
                        licenseType: item.license.toUpperCase(),
                    }),
                })
                if (res.ok) succeeded.push(item)
                else        failed.push(item)
            } catch {
                failed.push(item)
            }
        }
        onClearCart(succeeded.map(i => i.beat.id))
        setResult({ succeeded, failed })
        setDone(true)
        setChecking(false)
        if (succeeded.length > 0)
            showToast(`${succeeded.length} beat${succeeded.length > 1 ? 's' : ''} adquirido${succeeded.length > 1 ? 's' : ''} com sucesso!`)
        if (failed.length > 0)
            showToast(`${failed.length} beat${failed.length > 1 ? 's' : ''} não ${failed.length > 1 ? 'puderam' : 'pôde'} ser comprado${failed.length > 1 ? 's' : ''}.`, 'error')
    }

    const resetCart = () => { setDone(false); setResult(null) }

    return (
        <>
            {/* ─── Carrinho ─────────────────────────────────────── */}
            <div className="mkt__cart">
                <div className="mkt__cart-head">
                    <span className="mkt__cart-title">Carrinho</span>
                    {cart.length > 0 && !done && (
                        <span className="mkt__cart-count">{cart.length}</span>
                    )}
                </div>

                {/* Estado: sucesso */}
                {done && result && (
                    <div className="mkt__cart-result">
                        {result.succeeded.length > 0 && (
                            <div className="mkt__cart-result-ok">
                                <div className="mkt__cart-result-icon">✓</div>
                                <p className="mkt__cart-result-msg">
                                    {result.succeeded.length === 1
                                        ? '1 beat adquirido com sucesso!'
                                        : `${result.succeeded.length} beats adquiridos!`}
                                </p>
                                <ul className="mkt__cart-result-list">
                                    {result.succeeded.map(i => (
                                        <li key={i.beat.id}>{i.beat.title} · {LIC_LABELS[i.license]}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {result.failed.length > 0 && (
                            <div className="mkt__cart-result-fail">
                                <p>{result.failed.length} item(ns) falharam. Tenta novamente.</p>
                            </div>
                        )}
                        <button type="button" className="mkt__cart-checkout mkt__cart-checkout--outline"
                                onClick={resetCart}>
                            Continuar a comprar
                        </button>
                    </div>
                )}

                {/* Estado: carrinho vazio */}
                {!done && cart.length === 0 && (
                    <div className="mkt__cart-empty">
                        <div className="mkt__cart-empty-icon">🛒</div>
                        <div>O teu carrinho está vazio</div>
                    </div>
                )}

                {/* Estado: itens no carrinho */}
                {!done && cart.length > 0 && (
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
                                        disabled={checking}
                                    >×</button>
                                </div>
                            ))}
                        </div>

                        <hr className="mkt__cart-divider" />

                        <div className="mkt__cart-total">
                            <span>Total</span>
                            <span className="mkt__cart-total-val">€{total.toFixed(2)}</span>
                        </div>

                        <button
                            type="button"
                            className="mkt__cart-checkout"
                            disabled={checking}
                            onClick={handleCheckout}
                        >
                            {checking ? 'A processar…' : 'Finalizar compra →'}
                        </button>
                    </>
                )}
            </div>

            {/* ─── Top Produtores ──────────────────────────────── */}
            {producers.length > 0 && (
                <div className="mkt__producers">
                    <div className="mkt__prod-head">
                        <span className="mkt__prod-title">Top Produtores</span>
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
                                    <div className="mkt__prod-rating">★ {p.rating.toFixed(1)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
