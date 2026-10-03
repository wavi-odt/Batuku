import { useEffect } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { usePlaylistLikes } from '../context/PlaylistLikeContext'
import './LikeButton.css'

export default function PlaylistLikeButton({ playlistId, variant = 'default', size }) {
    const { likes, fetchLikeStatus, toggleLike } = usePlaylistLikes()

    const { liked = false, count = 0 } = likes[String(playlistId)] ?? {}
    const iconSize = size ?? (variant === 'icon' ? 16 : 13)

    useEffect(() => {
        fetchLikeStatus(playlistId)
    }, [playlistId, fetchLikeStatus])

    function toggle(e) {
        e.stopPropagation()
        toggleLike(playlistId)
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
            {count > 0 && <span className="like-btn__count">{count}</span>}
        </button>
    )
}
