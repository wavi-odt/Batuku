import { useState } from 'react'
import { FaMusic } from 'react-icons/fa'

export default function CoverImg({ src, alt, className, style, iconSize = 14 }) {
    const [failed, setFailed] = useState(false)

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={alt ?? ''}
                className={className}
                style={style}
                loading="lazy"
                decoding="async"
                onError={() => setFailed(true)}
            />
        )
    }

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface-2)',
                ...style,
            }}
        >
            <FaMusic size={iconSize} style={{ color: 'var(--color-ink-mute)' }} />
        </div>
    )
}
