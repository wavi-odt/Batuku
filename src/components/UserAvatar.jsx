import { useState } from 'react'
import { spotifySized } from '../utils/spotifyImg'

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
    const [useOriginal, setUseOriginal] = useState(false)   // se a versão pequena do Spotify não existir
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
                src={useOriginal ? imageUrl : spotifySized(imageUrl, size)}
                alt={name ?? ''}
                className={className}
                style={base}
                onError={() => (useOriginal || spotifySized(imageUrl, size) === imageUrl) ? setImgFailed(true) : setUseOriginal(true)}
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
