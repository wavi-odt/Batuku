// O CDN do Spotify guarda cada imagem em vários tamanhos; o tamanho vem no início do identificador.
// Em vez de descarregar sempre a de 640 px (para um avatar de 40 px), pedimos a mais pequena que chega.
const VARIANTS = [
    // artistas
    { from: 'ab6761610000e5eb', sizes: [[160, 'ab6761610000f178'], [320, 'ab67616100005174'], [640, 'ab6761610000e5eb']] },
    // capas de álbuns
    { from: 'ab67616d0000b273', sizes: [[64, 'ab67616d00004851'], [300, 'ab67616d00001e02'], [640, 'ab67616d0000b273']] },
]

/**
 * Devolve o URL do Spotify no tamanho mais pequeno que ainda serve para `cssPx` pixéis CSS
 * (com margem de 1,5x para ecrãs de alta densidade). URLs que não sejam do Spotify
 * (ou de um formato desconhecido) voltam inalterados.
 */
export function spotifySized(url, cssPx) {
    if (!url || !url.includes('i.scdn.co/image/')) return url
    const need = Math.ceil(cssPx * 1.5)
    for (const { from, sizes } of VARIANTS) {
        if (!url.includes(from)) continue
        const pick = sizes.find(([px]) => px >= need) ?? sizes[sizes.length - 1]
        return url.replace(from, pick[1])
    }
    return url
}
