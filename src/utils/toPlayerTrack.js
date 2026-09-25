/** Converte um TrackResponse do backend no objecto esperado pelo PlayerContext. */
export function toPlayerTrack(t) {
    const spotifyId = t.source === 'SPOTIFY_PREVIEW'
        ? t.spotifyUrl?.split('/track/')?.[1]?.split('?')[0] ?? null
        : null
    return {
        id:              t.id,
        name:            t.title,
        artistName:      t.artistName,
        artistProfileId: t.artistProfileId ?? null,
        coverUrl:        t.coverUrl ?? null,
        audioUrl:        t.source !== 'SPOTIFY_PREVIEW' ? (t.audioUrl ?? null) : null,
        spotifyId,
        source:          t.source === 'SPOTIFY_PREVIEW' ? 'spotify' : 'upload',
    }
}
