import { usePlayer } from '../context/PlayerContext'

/* ── Mappers: API shape → player track object ─────────────────────── */

export function recentToTrack(t, playContext = 'fan') {
    return {
        id:              t.trackId,
        name:            t.title,
        artistName:      t.artistName,
        artistProfileId: t.artistId ?? null,
        coverUrl:        t.coverUrl ?? null,
        audioUrl:        t.audioUrl ?? null,
        spotifyId:       t.spotifyId ?? null,
        playContext,
    }
}

export function uploadToTrack(t, artistName, artistProfileId, playContext = 'artist') {
    return {
        id:              t.id,
        name:            t.title,
        artistName:      t.artistName ?? artistName,
        artistProfileId: t.artistProfileId ?? artistProfileId ?? null,
        coverUrl:        t.coverUrl ?? null,
        durationMs:      t.durationMs,
        audioUrl:        t.audioUrl,
        source:          'upload',
        playContext,
    }
}

export function spotifyToTrack(t, artistName, playContext = 'artist') {
    return {
        spotifyId:  t.spotifyId,
        name:       t.name,
        artistName: t.artistName ?? artistName,
        coverUrl:   t.coverUrl ?? null,
        durationMs: t.durationMs,
        spotifyUrl: t.spotifyUrl,
        source:     'spotify',
        playContext,
    }
}

/* ── Hook ─────────────────────────────────────────────────────────── */

export function usePlayQueue() {
    const { track: currentTrack, setTrack, togglePlayRef } = usePlayer()

    function playRecent(t, list, playContext = 'fan') {
        if (!t.audioUrl && !t.spotifyId) return
        if (currentTrack?.id === t.trackId) { togglePlayRef.current?.(); return }
        const toTrack = x => recentToTrack(x, playContext)
        setTrack(toTrack(t), list.filter(x => x.audioUrl || x.spotifyId).map(toTrack))
    }

    return { currentTrack, setTrack, playRecent }
}
