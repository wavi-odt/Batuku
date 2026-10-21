/* ─────────────────────────────────────────────────────────────────
   Ticker, Marquee horizontal de géneros musicais. Decorativo.
   ───────────────────────────────────────────────────────────────── */

import { useGenres } from '../../context/GenresContext.jsx'
import './ticker.css'

export default function Ticker() {
    const { allNames } = useGenres()
    return (
        <div className="ticker">
            <div className="ticker__track">
                {[...allNames, ...allNames].map((g, i) => (
                    <span key={i} className="ticker__item">
                        <span className="ticker__dot" />
                        {g}
                    </span>
                ))}
            </div>
        </div>
    );
}
