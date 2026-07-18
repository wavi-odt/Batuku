import { Link } from 'react-router-dom'
import { HiBadgeCheck } from 'react-icons/hi'
import { SiSpotify } from 'react-icons/si'
import './VerifyBanner.css'

const PROVIDER_LABEL = {
    spotify: 'Spotify',
    apple:   'Apple Music',
};

export default function VerifyBanner({ provider }) {
    if (provider) {
        const label = PROVIDER_LABEL[provider] || provider;
        return (
            <div className="verify-card verify-card--verified">
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
