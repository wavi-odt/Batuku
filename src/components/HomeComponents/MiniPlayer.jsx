import { useEffect, useRef, useState } from 'react'
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaRandom, FaSyncAlt,
} from 'react-icons/fa'
import { HiHeart, HiVolumeUp } from 'react-icons/hi'
import { SiSpotify } from 'react-icons/si'
import { usePlayer } from '../../context/PlayerContext'
import './MiniPlayer.css'

function fmtTime(ms) {
    if (!ms && ms !== 0) return '0:00'
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function MiniPlayer() {
    const { track, nextTrack, prevTrack, hasNext, hasPrev } = usePlayer()

    // ── Spotify iFrame ────────────────────────────────────────────────
    const embedRef       = useRef(null)
    const ctrlRef        = useRef(null)
    const apiRef         = useRef(null)
    const pendingRef     = useRef(null)
    const lastPlayPosRef = useRef(0)
    const playingRef     = useRef(false)
    const lastTickRef    = useRef(0)

    // ── Direct audio (<audio> element, used for Batuku uploads) ──────
    const audioRef       = useRef(null)

    // ── Shared ────────────────────────────────────────────────────────
    const volBarRef      = useRef(null)
    const draggingRef    = useRef(false)
    const repeatRef      = useRef(false)
    const nextTrackRef   = useRef(nextTrack)
    const volumeRef      = useRef(70)
    const userPausedRef  = useRef(false)
    const isSpotifyRef   = useRef(false)

    const [playing,    setPlaying]    = useState(false)
    const [position,   setPosition]   = useState(0)   // always ms
    const [duration,   setDuration]   = useState(0)   // always ms
    const [liked,      setLiked]      = useState(false)
    const [volume,     setVolume]     = useState(70)
    const [repeat,     setRepeat]     = useState(false)
    const [audioError, setAudioError] = useState(null)

    useEffect(() => { repeatRef.current    = repeat    }, [repeat])
    useEffect(() => { nextTrackRef.current = nextTrack }, [nextTrack])

    // Volume: native for direct audio, best-effort postMessage for Spotify
    function applyVolume(vol) {
        if (audioRef.current) audioRef.current.volume = vol
        const iframe = embedRef.current?.querySelector('iframe')
        if (iframe?.contentWindow) {
            try { iframe.contentWindow.postMessage(JSON.stringify({ command: { endpoint: 'set_volume', volume: vol } }), '*') } catch (_) {}
            try { iframe.contentWindow.postMessage(JSON.stringify({ type: 'set_volume', volume: vol }), '*') } catch (_) {}
        }
    }

    // Spotify embed container (hidden, appended to body)
    useEffect(() => {
        const el = document.createElement('div')
        el.style.cssText = 'position:fixed;bottom:0;left:0;width:1px;height:1px;overflow:hidden;pointer-events:none'
        document.body.appendChild(el)
        embedRef.current = el
        return () => {
            try { ctrlRef.current?.pause?.() } catch (_) {}
            try { ctrlRef.current?.destroy?.() } catch (_) {}
            ctrlRef.current = null
            audioRef.current?.pause()
            if (document.body.contains(el)) document.body.removeChild(el)
            embedRef.current = null
        }
    }, [])

    // Load Spotify iFrame API once
    useEffect(() => {
        if (window._SpotifyIFrameAPI) {
            apiRef.current = window._SpotifyIFrameAPI
            return
        }
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            window._SpotifyIFrameAPI = IFrameAPI
            apiRef.current = IFrameAPI
            if (pendingRef.current) {
                initController(IFrameAPI, pendingRef.current)
                pendingRef.current = null
            }
        }
        if (!document.getElementById('spotify-iframe-api')) {
            const s = document.createElement('script')
            s.id  = 'spotify-iframe-api'
            s.src = 'https://open.spotify.com/embed/iframe-api/v1'
            s.async = true
            document.head.appendChild(s)
        }
    }, [])

    function initController(IFrameAPI, uri) {
        IFrameAPI.createController(
            embedRef.current,
            { uri, height: '80' },
            (ctrl) => {
                ctrlRef.current = ctrl
                applyVolume(volumeRef.current / 100)
                ctrl.addListener('playback_update', ({ data }) => {
                    setPlaying(!data.isPaused)
                    // Spotify sometimes returns seconds, sometimes ms; >3600 means ms
                    const inMs = data.duration > 3600
                    setPosition(inMs ? data.position : data.position * 1000)
                    if (data.duration > 0) setDuration(inMs ? data.duration : data.duration * 1000)

                    if (!data.isPaused && data.position > 0) {
                        lastPlayPosRef.current = data.position
                        lastTickRef.current    = Date.now()
                        playingRef.current     = true
                    } else if (data.isPaused) {
                        playingRef.current = false
                        if (!userPausedRef.current && lastPlayPosRef.current > 0) {
                            lastPlayPosRef.current = 0
                            if (repeatRef.current) {
                                ctrl.seek(0)
                                setTimeout(() => ctrl.togglePlay?.() ?? ctrl.play(), 100)
                            } else {
                                nextTrackRef.current?.()
                            }
                        }
                    }
                })
                ctrl.play()
            }
        )
    }

    // Create <audio> element once and wire up events
    function getAudio() {
        if (audioRef.current) return audioRef.current
        const audio = new Audio()
        audio.volume = volumeRef.current / 100
        audio.addEventListener('play',            () => setPlaying(true))
        audio.addEventListener('pause',           () => setPlaying(false))
        audio.addEventListener('timeupdate',      () => setPosition(Math.floor(audio.currentTime * 1000)))
        audio.addEventListener('loadedmetadata',  () => setDuration(Math.floor(audio.duration   * 1000)))
        audio.addEventListener('ended', () => {
            setPlaying(false)
            if (repeatRef.current) {
                audio.currentTime = 0
                audio.play().catch(() => {})
            } else {
                nextTrackRef.current?.()
            }
        })
        audio.addEventListener('error', () => {
            const err = audio.error
            console.error('[MiniPlayer] Erro de áudio — código:', err?.code, '| mensagem:', err?.message)
            setAudioError('Não foi possível carregar esta faixa.')
        })
        audioRef.current = audio
        return audio
    }

    // Load track when it changes
    useEffect(() => {
        lastPlayPosRef.current = 0
        userPausedRef.current  = false
        setAudioError(null)

        if (!track) {
            ctrlRef.current?.pause?.()
            audioRef.current?.pause()
            setPlaying(false)
            setPosition(0)
            setDuration(0)
            return
        }

        if (track.audioUrl) {
            // ── Direct audio mode (Batuku uploads) ──
            isSpotifyRef.current = false
            ctrlRef.current?.pause?.()
            setPosition(0)
            setDuration(0)
            const audio = getAudio()
            audio.src = track.audioUrl
            audio.play().catch(() => {})
        } else if (track.spotifyId) {
            // ── Spotify iFrame mode ──
            isSpotifyRef.current = true
            audioRef.current?.pause()
            const uri = `spotify:track:${track.spotifyId}`
            if (!apiRef.current) { pendingRef.current = uri; return }
            if (!ctrlRef.current) {
                initController(apiRef.current, uri)
            } else {
                ctrlRef.current.loadUri(uri)
                ctrlRef.current.play()
            }
        }
    }, [track])

    useEffect(() => {
        volumeRef.current = volume
        applyVolume(volume / 100)
    }, [volume])

    // Global drag for volume bar
    useEffect(() => {
        function onMove(e) {
            if (!draggingRef.current || !volBarRef.current) return
            const r   = volBarRef.current.getBoundingClientRect()
            const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
            setVolume(Math.round(pct * 100))
        }
        function onUp() { draggingRef.current = false }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup',   onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup',   onUp)
        }
    }, [])

    // Polling fallback: Spotify's playback_update doesn't fire at natural track end
    useEffect(() => {
        const id = setInterval(() => {
            if (!isSpotifyRef.current || !playingRef.current || userPausedRef.current) return
            if (Date.now() - lastTickRef.current < 2000) return
            if (lastPlayPosRef.current <= 0) return
            playingRef.current     = false
            lastPlayPosRef.current = 0
            setPlaying(false)
            if (repeatRef.current) {
                ctrlRef.current?.seek(0)
                setTimeout(() => ctrlRef.current?.togglePlay?.() ?? ctrlRef.current?.play(), 100)
            } else {
                nextTrackRef.current?.()
            }
        }, 500)
        return () => clearInterval(id)
    }, [])

    function togglePlay() {
        if (!track) return
        userPausedRef.current = playing
        if (track.audioUrl && audioRef.current) {
            playing ? audioRef.current.pause() : audioRef.current.play().catch(() => {})
        } else if (ctrlRef.current) {
            const ctrl = ctrlRef.current
            if (typeof ctrl.togglePlay === 'function') ctrl.togglePlay()
            else if (playing) ctrl.pause()
            else ctrl.play()
        }
    }

    function handleSeek(e) {
        if (!duration) return
        const r     = e.currentTarget.getBoundingClientRect()
        const ratio = (e.clientX - r.left) / r.width
        if (track?.audioUrl && audioRef.current) {
            audioRef.current.currentTime = (ratio * duration) / 1000
        } else if (ctrlRef.current) {
            ctrlRef.current.seek((ratio * duration) / 1000)
        }
    }

    function handlePrev() {
        if (position / 1000 > 3) {
            if (track?.audioUrl && audioRef.current) {
                audioRef.current.currentTime = 0
            } else {
                ctrlRef.current?.seek(0)
                ctrlRef.current?.play()
            }
        } else {
            prevTrack()
        }
    }

    function handleVolDown(e) {
        draggingRef.current = true
        const r   = volBarRef.current.getBoundingClientRect()
        const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
        setVolume(Math.round(pct * 100))
    }

    const pct = duration > 0 ? (position / duration) * 100 : 0

    return (
        <footer className="player">

            {/* Track info */}
            <div className="player__track">
                <div className="player__cover-wrap">
                    <div className="player__cover">
                        {track?.coverUrl
                            ? <img src={track.coverUrl} alt={track.name}
                                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', background: 'var(--color-surface)' }} />
                        }
                    </div>
                    {track?.source === 'spotify' && (
                        <div className="player__spotify-badge" title="Via Spotify">
                            <SiSpotify size={9} />
                        </div>
                    )}
                </div>
                <div className="player__info">
                    <div className="player__title">{track?.name ?? 'Nada a reproduzir'}</div>
                    <div className="player__artist">{track?.artistName ?? '—'}</div>
                </div>
                <button
                    type="button"
                    className={'player__btn' + (liked ? ' is-liked' : '')}
                    onClick={() => setLiked(v => !v)}
                    aria-label={liked ? 'Remover gosto' : 'Gostar'}
                >
                    <HiHeart size={16} />
                </button>
            </div>

            {/* Playback controls */}
            <div className="player__controls">
                <div className="player__btns">
                    {/* TODO: shuffle — embaralhar a queue restante (PlayerContext.shuffleQueue) */}
                    <button
                        type="button"
                        className="player__btn player__btn--soon"
                        aria-label="Aleatório (em breve)"
                        title="Aleatório — em breve"
                        disabled
                    >
                        <FaRandom size={14} />
                    </button>
                    <button
                        type="button"
                        className="player__btn"
                        aria-label="Anterior"
                        onClick={handlePrev}
                        disabled={!track}
                    >
                        <FaStepBackward size={16} />
                    </button>
                    <button
                        type="button"
                        className="player__btn player__btn--play"
                        onClick={togglePlay}
                        aria-label={playing ? 'Pausar' : 'Reproduzir'}
                        disabled={!track}
                    >
                        {playing ? <FaPause size={12} /> : <FaPlay size={12} />}
                    </button>
                    <button
                        type="button"
                        className="player__btn"
                        aria-label="Próxima"
                        onClick={nextTrack}
                        disabled={!hasNext}
                    >
                        <FaStepForward size={16} />
                    </button>
                    <button
                        type="button"
                        className={'player__btn' + (repeat ? ' is-active' : '')}
                        aria-label="Repetir"
                        onClick={() => setRepeat(r => !r)}
                    >
                        <FaSyncAlt size={14} />
                    </button>
                </div>
                {audioError && (
                    <div className="player__audio-error" role="alert">{audioError}</div>
                )}
                <div className="player__progress">
                    <span className="player__time">{fmtTime(position)}</span>
                    <div className="player__bar" role="slider" aria-label="Posição da faixa" onClick={handleSeek}>
                        <div className="player__bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="player__time">{fmtTime(duration)}</span>
                </div>
            </div>

            {/* Volume */}
            <div className="player__extras">
                <div className="player__volume">
                    <HiVolumeUp size={16} />
                    <div
                        ref={volBarRef}
                        className="player__volume-bar"
                        role="slider"
                        aria-label="Volume"
                        aria-valuenow={volume}
                        onMouseDown={handleVolDown}
                    >
                        <div className="player__volume-fill" style={{ width: `${volume}%` }} />
                    </div>
                </div>
            </div>

        </footer>
    )
}
