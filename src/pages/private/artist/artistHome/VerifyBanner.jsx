/* ─────────────────────────────────────────────────────────────────
   VerifyBanner.jsx — Confirma estado de artista verificado.
   ───────────────────────────────────────────────────────────────── */

import { HiBadgeCheck } from 'react-icons/hi'
import './VerifyBanner.css'

const PROVIDER_LABEL = {
    spotify: 'Spotify',
    apple:   'Apple Music',
};

export default function VerifyBanner({ provider = 'spotify' }) {
    const label = PROVIDER_LABEL[provider] || 'Spotify';
    return (
        <div className="verify-card">
            <div className="verify-card__icon">
                <HiBadgeCheck size={22} />
            </div>
            <div className="verify-card__body">
                <p className="verify-card__title">Artista verificado via {label} ✓</p>
                <p className="verify-card__sub">
                    A tua conta está ligada ao {label} Artists. Podes publicar livremente,
                    vender beats e aparecer na descoberta.
                </p>
            </div>
            <button type="button" className="verify-card__btn">Gerir ligação</button>
        </div>
    );
}
