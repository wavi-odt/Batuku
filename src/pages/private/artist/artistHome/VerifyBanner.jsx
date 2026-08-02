import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiBadgeCheck } from 'react-icons/hi'
import { SiSpotify } from 'react-icons/si'
import { getToken } from '../../../../utils/auth.js'
import './VerifyBanner.css'

const PROVIDER_LABEL = {
    spotify: 'Spotify',
    apple:   'Apple Music',
};

export default function VerifyBanner({ provider }) {
    const [claimPending, setClaimPending] = useState(false);

    useEffect(() => {
        if (provider) return;
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/artist-claims/me`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => res.ok ? res.json() : [])
            .then(list => { if (list.some(c => c.status === 'PENDING')) setClaimPending(true); })
            .catch(() => {});
    }, [provider]);

    if (provider) return null;

    if (claimPending) {
        return (
            <div className="verify-card verify-card--pending">
                <div className="verify-card__icon verify-card__icon--pending">
                    <SiSpotify size={20} />
                </div>
                <div className="verify-card__body">
                    <p className="verify-card__title">Pedido em avaliação</p>
                    <p className="verify-card__sub">
                        O teu pedido de verificação está a ser analisado pelo admin.
                        Receberás uma notificação quando for processado.
                    </p>
                </div>
                <span className="verify-card__claim-btn verify-card__claim-btn--pending">
                    A ser avaliado
                </span>
            </div>
        );
    }

    return (
        <div className="verify-card verify-card--unverified">
            <div className="verify-card__icon verify-card__icon--spotify">
                <SiSpotify size={20} />
            </div>
            <div className="verify-card__body">
                <p className="verify-card__title">Liga o teu perfil Spotify</p>
                <p className="verify-card__sub">
                    Verifica a tua identidade para reclamar o teu perfil Spotify,
                    desbloquear publicações e aparecer na descoberta.
                </p>
            </div>
            <Link to="/claim-profile" className="verify-card__claim-btn">
                Reclamar perfil →
            </Link>
        </div>
    );
}
