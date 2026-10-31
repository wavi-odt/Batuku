import { useState } from 'react'
import { FaMusic } from 'react-icons/fa'

// As capas aparecem sempre junto do título/nome em texto, por isso são decorativas:
// repetir o nome no alt faria o leitor de ecrã lê-lo duas vezes.
// priority: imagem principal da página (LCP): carrega já e com prioridade alta, sem lazy-load.
export default function CoverImg({ src, className, style, iconSize = 14, priority = false }) {
    const [failed, setFailed] = useState(false)

    if (src && !failed) {
        return (
            <img
                src={src}
                alt=""
                className={className}
                style={style}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : undefined}
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
