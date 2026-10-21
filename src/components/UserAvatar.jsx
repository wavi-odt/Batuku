import { useState } from 'react'

function hueFromId(id)   { return (Number(id) * 137) % 360 }
function hueFromStr(str) {
    let n = 0
    for (const c of str ?? '') n = (n * 31 + c.charCodeAt(0)) & 0xffff
    return n % 360
}

/**
 * Avatar circular genérico.
 * Mostra imagem se disponível; caso contrário, círculo colorido com inicial.
 *
 * Props:
 *   id        — ID numérico (para cor consistente por utilizador)
 *   name      — nome (para inicial e cor fallback se id não disponível)
 *   imageUrl  — URL da imagem (opcional)
 *   size      — tamanho em px (default: 36)
 *   className — classe extra para o elemento raiz
 *   style     — estilos inline extra
 */
export default function UserAvatar({ id, name, imageUrl, size = 36, className, style }) {
    const [imgFailed, setImgFailed] = useState(false)
    const hue = id != null ? hueFromId(id) : hueFromStr(name)
    const base = {
        width:        size,
        height:       size,
        borderRadius: '50%',
        flexShrink:   0,
        objectFit:    'cover',
        ...style,
    }

    if (imageUrl && !imgFailed) {
        return (
            <img
                src={imageUrl}
                alt={name ?? ''}
                className={className}
                style={base}
                onError={() => setImgFailed(true)}
            />
        )
    }

    return (
        <div
            className={className}
            style={{
                ...base,
                background:     `hsl(${hue} 52% 42%)`,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                color:          '#fff',
                fontWeight:     700,
                fontSize:       Math.round(size * 0.4),
            }}
        >
            {(name?.[0] ?? '?').toUpperCase()}
        </div>
    )
}
