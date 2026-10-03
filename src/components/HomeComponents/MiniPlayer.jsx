import { useEffect, useRef, useState } from 'react'
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaRandom, FaSyncAlt,
} from 'react-icons/fa'
import { HiVolumeUp } from 'react-icons/hi'
import { MdOpenInFull, MdCloseFullscreen } from 'react-icons/md'
import ClickableName from '../ClickableName'
import { SiSpotify } from 'react-icons/si'
import { usePlayer } from '../../context/PlayerContext'
import { API, getToken } from '../../utils/auth'
import LikeButton from '../LikeButton'
import TrackMenu from '../TrackMenu'
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

    // ── Play tracking ─────────────────────────────────────────────────
    const playIdRef      = useRef(null)   // ID do registo Play devolvido pelo servidor
    const positionMsRef  = useRef(0)      // posição actual em ms (actualizada por timeupdate)
    const durationMsRef  = useRef(0)      // duração total em ms

    // ── Shared ────────────────────────────────────────────────────────
    const volBarRef      = useRef(null)
    const volBarExpRef   = useRef(null)
    const seekBarRef     = useRef(null)
    const seekBarExpRef  = useRef(null)
    const expRef         = useRef(null)
    const expBodyRef     = useRef(null)
    const swipeStartYRef = useRef(null)
    const swipeActiveRef = useRef(false)
    const swipeDeltaRef  = useRef(0)
    const draggingRef    = useRef(false)
    const draggingBarRef = useRef(null)
    const draggingSeekRef = useRef(false)
    const dragSeekBarRef  = useRef(null)
    const dragSeekPosRef  = useRef(0)
    const repeatRef      = useRef(false)
    const nextTrackRef   = useRef(nextTrack)
    const volumeRef      = useRef(70)
    const userPausedRef  = useRef(false)
    const isSpotifyRef   = useRef(false)

    const [swipeDelta,    setSwipeDelta]    = useState(0)
    const [swipeSnapping, setSwipeSnapping] = useState(false)
    const [playing,    setPlaying]    = useState(false)
    const [position,   setPosition]   = useState(0)   // always ms
    const [duration,   setDuration]   = useState(0)   // always ms
    const [volume,     setVolume]     = useState(70)
    const [repeat,     setRepeat]     = useState(false)
    const [audioError, setAudioError] = useState(null)
    const [expanded,   setExpanded]   = useState(false)

    useEffect(() => { repeatRef.current    = repeat    }, [repeat])
    useEffect(() => { nextTrackRef.current = nextTrack }, [nextTrack])
    useEffect(() => {
        document.body.style.overflow = expanded ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [expanded])

    function getCountry() {
        return (navigator.language || 'xx-XX').split('-')[1]?.toUpperCase() ?? 'XX'
    }

    function sendCompletion(playId, durationMs, isFullPlay) {
        if (!playId) return
        fetch(`${API}/api/plays/${playId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ durationPlayed: Math.floor(durationMs), isFullPlay }),
        })
            .then(r => { if (r.ok) window.dispatchEvent(new Event('batuku:gamification-updated')) })
            .catch(() => {})
    }

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
                    const inMs = data.duration > 3600
                    if (!draggingSeekRef.current)
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
        audio.addEventListener('timeupdate', () => {
            if (draggingSeekRef.current) return
            const ms = Math.floor(audio.currentTime * 1000)
            positionMsRef.current = ms
            setPosition(ms)
        })
        audio.addEventListener('loadedmetadata', () => {
            const ms = Math.floor(audio.duration * 1000)
            durationMsRef.current = ms
            setDuration(ms)
        })
        audio.addEventListener('ended', () => {
            sendCompletion(playIdRef.current, durationMsRef.current, true)
            playIdRef.current = null
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
            console.error('[MiniPlayer] Erro de áudio, código:', err?.code, ', mensagem:', err?.message)
            setAudioError('Não foi possível carregar esta faixa.')
        })
        audioRef.current = audio
        return audio
    }

    // Parar o MiniPlayer quando outro player (ex: marketplace) tomar o controlo
    useEffect(() => {
        function onExternalAudioStart(e) {
            if (e.detail?.source === 'main') return
            ctrlRef.current?.pause?.()
            audioRef.current?.pause()
            userPausedRef.current = true
            setPlaying(false)
        }
        window.addEventListener('batuku:audio-start', onExternalAudioStart)
        return () => window.removeEventListener('batuku:audio-start', onExternalAudioStart)
    }, [])

    // Load track when it changes
    useEffect(() => {
        // Completar registo da faixa anterior
        if (playIdRef.current && positionMsRef.current > 0) {
            sendCompletion(playIdRef.current, positionMsRef.current, false)
        }
        playIdRef.current   = null
        positionMsRef.current = 0
        durationMsRef.current = 0

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
            window.dispatchEvent(new CustomEvent('batuku:audio-start', { detail: { source: 'main' } }))
            const audio = getAudio()
            audio.src = track.audioUrl
            audio.play().catch(() => {})
            if (track.id) {
                fetch(`${API}/api/tracks/${track.id}/play`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ country: getCountry(), context: track.playContext ?? 'direct' }),
                })
                    .then(r => r.ok ? r.json() : null)
                    .then(d => { if (d?.playId) playIdRef.current = d.playId })
                    .catch(() => {})
            }
        } else if (track.spotifyId) {
            // ── Spotify iFrame mode ──
            isSpotifyRef.current = true
            audioRef.current?.pause()
            window.dispatchEvent(new CustomEvent('batuku:audio-start', { detail: { source: 'main' } }))
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

    // Global drag — volume e seek, mouse e touch
    useEffect(() => {
        function clientX(e) { return e.touches ? e.touches[0].clientX : e.clientX }

        function onMove(e) {
            if (draggingRef.current && draggingBarRef.current) {
                if (e.cancelable) e.preventDefault()
                const r   = draggingBarRef.current.getBoundingClientRect()
                const pct = Math.max(0, Math.min(1, (clientX(e) - r.left) / r.width))
                setVolume(Math.round(pct * 100))
            }
            if (draggingSeekRef.current && dragSeekBarRef.current) {
                if (e.cancelable) e.preventDefault()
                const r     = dragSeekBarRef.current.getBoundingClientRect()
                const ratio = Math.max(0, Math.min(1, (clientX(e) - r.left) / r.width))
                dragSeekPosRef.current = ratio * durationMsRef.current
                setPosition(Math.round(dragSeekPosRef.current))
            }
        }

        function onUp() {
            draggingRef.current    = false
            draggingBarRef.current = null
            if (draggingSeekRef.current) {
                draggingSeekRef.current = false
                const ms = dragSeekPosRef.current
                if (!isSpotifyRef.current && audioRef.current) {
                    audioRef.current.currentTime = ms / 1000
                } else if (isSpotifyRef.current && ctrlRef.current) {
                    ctrlRef.current.seek(ms / 1000)
                }
                dragSeekBarRef.current = null
            }
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup',   onUp)
        window.addEventListener('touchmove', onMove, { passive: false })
        window.addEventListener('touchend',  onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup',   onUp)
            window.removeEventListener('touchmove', onMove)
            window.removeEventListener('touchend',  onUp)
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

    function startSeek(bar, cx) {
        if (!durationMsRef.current || !bar) return
        const r     = bar.getBoundingClientRect()
        const ratio = Math.max(0, Math.min(1, (cx - r.left) / r.width))
        dragSeekPosRef.current  = ratio * durationMsRef.current
        draggingSeekRef.current = true
        dragSeekBarRef.current  = bar
        setPosition(Math.round(dragSeekPosRef.current))
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
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        draggingRef.current    = true
        draggingBarRef.current = volBarRef.current
        const r   = volBarRef.current.getBoundingClientRect()
        const pct = Math.max(0, Math.min(1, (cx - r.left) / r.width))
        setVolume(Math.round(pct * 100))
    }

    // Swipe para baixo para fechar o player expandido
    useEffect(() => {
        if (!expanded) return
        const el = expRef.current
        if (!el) return
        function onTouchMove(e) {
            if (swipeStartYRef.current === null) return
            const delta = e.touches[0].clientY - swipeStartYRef.current
            if (!swipeActiveRef.current) {
                if (delta > 8)  { swipeActiveRef.current = true }
                else if (delta < -5) { swipeStartYRef.current = null; return }
                else return
            }
            if (delta > 0) {
                if (e.cancelable) e.preventDefault()
                swipeDeltaRef.current = delta
                setSwipeDelta(delta)
            }
        }
        el.addEventListener('touchmove', onTouchMove, { passive: false })
        return () => el.removeEventListener('touchmove', onTouchMove)
    }, [expanded])

    function onExpTouchStart(e) {
        const scrollTop = expBodyRef.current?.scrollTop ?? 0
        if (scrollTop > 0) return
        swipeStartYRef.current = e.touches[0].clientY
        swipeActiveRef.current = false
        swipeDeltaRef.current  = 0
        setSwipeSnapping(false)
    }

    function onExpTouchEnd() {
        if (!swipeActiveRef.current) { swipeStartYRef.current = null; return }
        const delta = swipeDeltaRef.current
        swipeStartYRef.current = null
        swipeActiveRef.current = false
        if (delta > 120) {
            setExpanded(false)
            setSwipeDelta(0)
        } else {
            setSwipeSnapping(true)
            setSwipeDelta(0)
            setTimeout(() => setSwipeSnapping(false), 280)
        }
    }

    function handleVolExpDown(e) {
        if (!volBarExpRef.current) return
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        draggingRef.current    = true
        draggingBarRef.current = volBarExpRef.current
        const r   = volBarExpRef.current.getBoundingClientRect()
        const pct = Math.max(0, Math.min(1, (cx - r.left) / r.width))
        setVolume(Math.round(pct * 100))
    }

    const togglePlayRef = useRef(null)
    togglePlayRef.current = togglePlay

    useEffect(() => {
        function onKeyDown(e) {
            if (e.code !== 'Space' && e.key !== ' ') return
            const tag = document.activeElement?.tagName.toLowerCase()
            if (tag === 'input' || tag === 'textarea' || tag === 'select' || document.activeElement?.isContentEditable) return
            e.preventDefault()
            togglePlayRef.current?.()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    const pct = duration > 0 ? (position / duration) * 100 : 0

    return (
        <>
        {expanded && track && (
            <div
                ref={expRef}
                className="player__exp"
                onTouchStart={onExpTouchStart}
                onTouchEnd={onExpTouchEnd}
                style={
                    swipeDelta > 0
                        ? { transform: `translateY(${swipeDelta}px)`, opacity: Math.max(0.2, 1 - swipeDelta / 350), transition: 'none' }
                        : swipeSnapping
                            ? { transform: 'translateY(0)', opacity: 1, transition: 'transform 260ms ease, opacity 260ms ease' }
                            : undefined
                }
            >
                <div
                    className="player__exp-bg"
                    style={track.coverUrl ? { backgroundImage: `url(${track.coverUrl})` } : undefined}
                />
                <button
                    type="button"
                    className="player__exp-close"
                    onClick={() => setExpanded(false)}
                    aria-label="Minimizar player"
                >
                    <MdCloseFullscreen size={16} />
                </button>
                <div ref={expBodyRef} className="player__exp-body">
                    <div className="player__exp-cover">
                        {track.coverUrl
                            ? <img src={track.coverUrl} alt={track.name} />
                            : <div className="player__exp-cover-empty" />
                        }
                    </div>
                    <div className="player__exp-info">
                        <div className="player__exp-title">{track.name ?? 'Sem título'}</div>
                        <div className="player__exp-artist">
                            <ClickableName
                                artistProfileId={track.artistProfileId}
                                name={track.artistName ?? ''}
                            />
                        </div>
                    </div>
                    <div className="player__exp-btns">
                        <div className="player__exp-btns-side">
                            <button type="button" className="player__btn player__btn--soon" disabled aria-label="Aleatório">
                                <FaRandom size={14} />
                            </button>
                            <button type="button" className="player__btn" onClick={handlePrev} disabled={!track} aria-label="Anterior">
                                <FaStepBackward size={16} />
                            </button>
                        </div>
                        <button type="button" className="player__btn player__btn--play player__btn--play-lg" onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproduzir'}>
                            {playing ? <FaPause size={16} /> : <FaPlay size={16} />}
                        </button>
                        <div className="player__exp-btns-side player__exp-btns-side--right">
                            <button type="button" className="player__btn" onClick={nextTrack} disabled={!hasNext} aria-label="Próxima">
                                <FaStepForward size={16} />
                            </button>
                            <button type="button" className={'player__btn' + (repeat ? ' is-active' : '')} onClick={() => setRepeat(r => !r)} aria-label="Repetir">
                                <FaSyncAlt size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="player__exp-progress">
                        <span className="player__time">{fmtTime(position)}</span>
                        <div
                            ref={seekBarExpRef}
                            className="player__exp-bar"
                            role="slider"
                            aria-label="Posição da faixa"
                            onMouseDown={e => startSeek(seekBarExpRef.current, e.clientX)}
                            onTouchStart={e => { e.preventDefault(); startSeek(seekBarExpRef.current, e.touches[0].clientX) }}
                        >
                            <div className="player__exp-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="player__time">{fmtTime(duration)}</span>
                    </div>
                    <div className="player__exp-volume">
                        <HiVolumeUp size={16} />
                        <div
                            ref={volBarExpRef}
                            className="player__exp-vol-bar"
                            role="slider"
                            aria-label="Volume"
                            aria-valuenow={volume}
                            onMouseDown={handleVolExpDown}
                            onTouchStart={handleVolExpDown}
                        >
                            <div className="player__exp-vol-fill" style={{ width: `${volume}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        )}
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
                    {!track?.audioUrl && track?.spotifyId && (
                        <div className="player__spotify-badge" title="Via Spotify">
                            <SiSpotify size={9} />
                        </div>
                    )}
                </div>
                <div className="player__info">
                    <div className="player__title">{track?.name ?? 'Nada a reproduzir'}</div>
                    <div className="player__artist">
                        <ClickableName
                            artistProfileId={track?.artistProfileId}
                            name={track?.artistName ?? ''}
                        />
                    </div>
                </div>
                {track?.id && <LikeButton trackId={track.id} variant="icon" />}
            </div>

            {/* Playback controls */}
            <div className="player__controls">
                <div className="player__btns">
                    {/* TODO: shuffle, embaralhar a queue restante (PlayerContext.shuffleQueue) */}
                    <button
                        type="button"
                        className="player__btn player__btn--soon"
                        aria-label="Aleatório (em breve)"
                        title="Aleatório (em breve)"
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
                        className={'player__btn player__btn--repeat' + (repeat ? ' is-active' : '')}
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
                    <div
                        ref={seekBarRef}
                        className="player__bar"
                        role="slider"
                        aria-label="Posição da faixa"
                        onMouseDown={e => startSeek(seekBarRef.current, e.clientX)}
                        onTouchStart={e => { e.preventDefault(); startSeek(seekBarRef.current, e.touches[0].clientX) }}
                    >
                        <div className="player__bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="player__time">{fmtTime(duration)}</span>
                </div>
            </div>

            {/* Volume + menu + expandir */}
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
                        onTouchStart={handleVolDown}
                    >
                        <div className="player__volume-fill" style={{ width: `${volume}%` }} />
                    </div>
                </div>
                {track?.id && <TrackMenu trackId={track.id} artistProfileId={track.artistProfileId} />}
                <button
                    type="button"
                    className="player__expand-btn"
                    onClick={() => setExpanded(e => !e)}
                    aria-label={expanded ? 'Minimizar player' : 'Expandir player'}
                    title={expanded ? 'Minimizar' : 'Expandir'}
                >
                    {expanded ? <MdCloseFullscreen size={14} /> : <MdOpenInFull size={14} />}
                </button>
            </div>

        </footer>
        </>
    )
}
