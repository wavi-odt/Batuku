import { useEffect, useRef, useState } from 'react'
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaRandom, FaSyncAlt,
} from 'react-icons/fa'
import { HiHeart, HiVolumeUp } from 'react-icons/hi'
import { SiSpotify } from 'react-icons/si'
import { usePlayer } from '../../context/PlayerContext'
import './MiniPlayer.css'

// Spotify devolve a posição/duração em milissegundos (valores > 3600 indicam ms)
function fmtTime(val, asMs) {
    if (!val && val !== 0) return '0:00'
    const s = asMs ? Math.floor(val / 1000) : Math.floor(val)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function MiniPlayer() {
    const { track, nextTrack, prevTrack, hasNext, hasPrev } = usePlayer()

    const embedRef     = useRef(null)
    const ctrlRef      = useRef(null)
    const apiRef       = useRef(null)
    const pendingRef   = useRef(null)
    const volBarRef    = useRef(null)
    const draggingRef  = useRef(false)
    const repeatRef    = useRef(false)
    const nextTrackRef = useRef(nextTrack)
    const posRef          = useRef(0)
    const durRef          = useRef(0)
    const lastPlayPosRef  = useRef(0)
    const userPausedRef   = useRef(false)
    const playingRef      = useRef(false)   // espelho de playing para o intervalo de polling
    const lastTickRef     = useRef(0)       // timestamp do último update enquanto tocava

    const [playing,  setPlaying]  = useState(false)
    const [position, setPosition] = useState(0)
    const [duration, setDuration] = useState(0)
    const [liked,    setLiked]    = useState(false)
    const [volume,   setVolume]   = useState(70)
    const [repeat,   setRepeat]   = useState(false)

    useEffect(() => { repeatRef.current   = repeat    }, [repeat])
    useEffect(() => { nextTrackRef.current = nextTrack }, [nextTrack])

    // Spotify por vezes devolve ms em vez de segundos
    const isMs = duration > 3600

    // Container do embed adicionado ao body para não interferir com o layout
    useEffect(() => {
        const el = document.createElement('div')
        el.style.cssText = 'position:fixed;bottom:0;left:0;width:1px;height:1px;overflow:hidden;pointer-events:none'
        document.body.appendChild(el)
        embedRef.current = el
        return () => {
            if (document.body.contains(el)) document.body.removeChild(el)
            embedRef.current = null
        }
    }, [])

    // Carrega o Spotify iFrame API uma única vez
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
                ctrl.addListener('playback_update', ({ data }) => {
                    setPlaying(!data.isPaused)
                    setPosition(data.position)
                    posRef.current = data.position

                    if (data.duration > 0) {
                        setDuration(data.duration)
                        durRef.current = data.duration
                    }

                    if (!data.isPaused && data.position > 0) {
                        lastPlayPosRef.current = data.position
                        lastTickRef.current    = Date.now()
                        playingRef.current     = true
                    } else if (data.isPaused) {
                        playingRef.current = false
                        // Spotify pausou sem ser o utilizador → preview acabou ou faixa terminou
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

    // Quando a faixa do contexto muda, carrega e reproduz
    useEffect(() => {
        if (!track) return
        const uri = `spotify:track:${track.spotifyId}`
        if (!apiRef.current) {
            pendingRef.current = uri
            return
        }
        lastPlayPosRef.current = 0
        userPausedRef.current  = false
        if (!ctrlRef.current) {
            initController(apiRef.current, uri)
        } else {
            ctrlRef.current.loadUri(uri)
            ctrlRef.current.play()
        }
    }, [track])

    // Controlo de volume (funciona se a API do Spotify o suportar)
    useEffect(() => {
        ctrlRef.current?.setVolume?.(volume / 100)
    }, [volume])

    // Drag global para a barra de volume
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

    // Polling: playback_update não dispara quando a faixa acaba naturalmente.
    // Se não recebemos nenhum tick de "a tocar" há mais de 2s e estávamos perto do fim → próxima faixa.
    useEffect(() => {
        const id = setInterval(() => {
            const elapsed = Date.now() - lastTickRef.current
            if (!playingRef.current || userPausedRef.current) return
            if (elapsed < 2000) return
            const lastPos = lastPlayPosRef.current
            const dur     = durRef.current
            if (lastPos > 0 && dur > 0) {
                playingRef.current    = false
                lastPlayPosRef.current = 0
                setPlaying(false)
                if (repeatRef.current) {
                    ctrlRef.current?.seek(0)
                    setTimeout(() => ctrlRef.current?.togglePlay?.() ?? ctrlRef.current?.play(), 100)
                } else {
                    nextTrackRef.current?.()
                }
            }
        }, 500)
        return () => clearInterval(id)
    }, [])

    function togglePlay() {
        const ctrl = ctrlRef.current
        if (!ctrl) return
        // userPausedRef=true quando vamos pausar, false quando vamos resumir
        userPausedRef.current = playing
        if (typeof ctrl.togglePlay === 'function') {
            ctrl.togglePlay()
        } else if (playing) {
            ctrl.pause()
        } else {
            const pos = lastPlayPosRef.current
            const dur = durRef.current
            if (pos > 0) ctrl.seek(dur > 3600 ? pos / 1000 : pos)
            ctrl.play()
        }
    }

    function handleSeek(e) {
        if (!ctrlRef.current || !duration) return
        const r     = e.currentTarget.getBoundingClientRect()
        const ratio = (e.clientX - r.left) / r.width
        // ctrl.seek() espera segundos; se os valores estiverem em ms, converte
        ctrlRef.current.seek(isMs ? (ratio * duration) / 1000 : ratio * duration)
    }

    function handleVolDown(e) {
        draggingRef.current = true
        const r   = volBarRef.current.getBoundingClientRect()
        const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
        setVolume(Math.round(pct * 100))
    }

    function handlePrev() {
        if (!ctrlRef.current) return
        const posSeconds = isMs ? position / 1000 : position
        // Se já passaram mais de 3 segundos, reinicia a faixa; senão vai para a anterior
        if (posSeconds > 3) {
            ctrlRef.current.seek(0)
            ctrlRef.current.play()
        } else {
            prevTrack()
        }
    }

    const pct = duration > 0 ? (position / duration) * 100 : 0

    return (
        <footer className="player">

            {/* Info da faixa */}
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

            {/* Controlos de reprodução */}
            <div className="player__controls">
                <div className="player__btns">
                    <button type="button" className="player__btn" aria-label="Aleatório">
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
                <div className="player__progress">
                    <span className="player__time">{fmtTime(position, isMs)}</span>
                    <div className="player__bar" role="slider" aria-label="Posição da faixa" onClick={handleSeek}>
                        <div className="player__bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="player__time">{fmtTime(duration, isMs)}</span>
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
