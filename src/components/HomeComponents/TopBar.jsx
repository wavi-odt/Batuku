/* ─────────────────────────────────────────────────────────────────
   TopBar.jsx, Barra superior: pesquisa, notificações, avatar.
   Mostra botão "Publicar" extra para artistas.
   ───────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { HiSearch, HiBell, HiPlus } from 'react-icons/hi'
import { homeData } from '../../data/home'
import ArtistArtwork from '../PublicComponets/ArtistArtwork'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import './TopBar.css'

export default function TopBar({ role = 'fan', notifications = true }) {
    const mockUser = role === 'artist' ? homeData.artist : homeData.fan;
    const realUser = useCurrentUser();
    const user     = mockUser;
    const placeholder = role === 'artist'
        ? 'Procurar nas tuas faixas, fãs, comentários…'
        : 'Procurar artistas, faixas, géneros…';

    return (
        <header className="topbar">
            <div className="topbar__search">
                <HiSearch size={16} className="topbar__search-icon" />
                <input
                    type="search"
                    className="topbar__search-input"
                    placeholder={placeholder}
                    aria-label="Pesquisar"
                />
            </div>

            <div className="topbar__spacer" />

            {role === 'artist' && (
                <Link to="/publish" className="topbar__publish">
                    <HiPlus size={16} /> Publicar
                </Link>
            )}

            <button className="topbar__action" aria-label="Notificações">
                <HiBell size={18} />
                {notifications && <span className="topbar__action-dot" />}
            </button>

            <Link to={role === 'artist' ? '/artist/profile' : '/profile'} className="topbar__avatar" aria-label="O meu perfil">
                {realUser?.picture
                    ? <img src={realUser.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    : <ArtistArtwork shape={user.avatar.shape} hue={user.avatar.hue} rounded={0} />}
            </Link>
        </header>
    );
}
