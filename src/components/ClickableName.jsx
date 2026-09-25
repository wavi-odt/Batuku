import { Link } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'

/**
 * Renders a clickable name that navigates to the correct profile.
 * - If it matches the logged-in user → /profile
 * - If artistProfileId is set       → /artists/:artistProfileId
 * - If userId is set                → /users/:userId
 * - Otherwise                       → plain <span>
 *
 * Always calls e.stopPropagation() so it doesn't trigger parent click handlers (e.g. play).
 */
export default function ClickableName({ userId, artistProfileId, name, className, style }) {
    const me = useCurrentUser()

    const isMe =
        (userId        != null && String(userId)        === String(me?.id)) ||
        (artistProfileId != null && String(artistProfileId) === String(me?.artistProfileId))

    const to = isMe
        ? '/profile'
        : artistProfileId
            ? `/artists/${artistProfileId}`
            : userId
                ? `/users/${userId}`
                : null

    if (!to) return <span className={className} style={style}>{name}</span>

    return (
        <Link
            to={to}
            className={'cname' + (className ? ` ${className}` : '')}
            style={style}
            onClick={e => e.stopPropagation()}
        >
            {name}
        </Link>
    )
}
