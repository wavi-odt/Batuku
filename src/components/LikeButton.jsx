import { useEffect } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useLikes } from '../context/LikeContext'
import './LikeButton.css'

/**
 * Botão de like sincronizado globalmente via LikeContext.
 *
 * Props:
 *   trackId   — ID da track (obrigatório)
 *   variant   — 'default' (com contador) | 'icon' (só ícone, estilo player)
 *   size      — tamanho do ícone em px (opcional; default: 16 em icon, 13 em default)
 */
export default function LikeButton({ trackId, variant = 'default', size }) {
    const { likes, fetchLikeStatus, toggleLike } = useLikes()

    const { liked = false, count = 0 } = likes[String(trackId)] ?? {}
    const iconSize  = size ?? (variant === 'icon' ? 16 : 13)
    const showCount = false

    // fetchLikeStatus é estável (useCallback sem deps variáveis),
    // por isso incluí-la aqui não causa re-runs desnecessários.
    useEffect(() => {
        fetchLikeStatus(trackId)
    }, [trackId, fetchLikeStatus])

    function toggle(e) {
        e.stopPropagation()
        toggleLike(trackId)
    }

    return (
        <button
            type="button"
            className={
                'like-btn' +
                (variant === 'icon' ? ' like-btn--icon' : '') +
                (liked ? ' like-btn--active' : '')
            }
            onClick={toggle}
            aria-label={liked ? 'Remover like' : 'Dar like'}
        >
            {liked ? <FaHeart size={iconSize} /> : <FaRegHeart size={iconSize} />}
            {showCount && count > 0 && (
                <span className="like-btn__count">{count}</span>
            )}
        </button>
    )
}
