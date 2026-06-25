/* ─────────────────────────────────────────────────────────────────
   BecomeArtistBanner.jsx — CTA inline para o fã se tornar artista.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { FaMusic } from 'react-icons/fa'
import './BecomeArtistBanner.css'

export default function BecomeArtistBanner() {
    return (
        <div className="become-artist">
            <div className="become-artist__icon">
                <FaMusic size={20} />
            </div>
            <div className="become-artist__body">
                <p className="become-artist__title">Também és artista?</p>
                <p className="become-artist__sub">
                    Liga a tua conta de Spotify ou Apple Music para te tornares artista
                    verificado e desbloquear analytics, marketplace e mais visibilidade.
                </p>
            </div>
            <Link to="/verify-artist" className="become-artist__btn">
                Tornar-me artista →
            </Link>
        </div>
    );
}
