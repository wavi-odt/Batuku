/* ─────────────────────────────────────────────────────────────────
   Ticker, Marquee horizontal de géneros musicais. Decorativo.
   ───────────────────────────────────────────────────────────────── */

import { GENRES } from '../../data/batuku.js'
import './ticker.css'

export default function Ticker() {
    return (
        <div className="ticker">
            <div className="ticker__track">
                {[...GENRES, ...GENRES].map((g, i) => (
                    <span key={i} className="ticker__item">
                        <span className="ticker__dot" />
                        {g}
                    </span>
                ))}
            </div>
        </div>
    );
}
