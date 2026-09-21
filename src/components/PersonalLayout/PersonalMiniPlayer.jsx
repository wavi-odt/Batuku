import { useEffect, useMemo, useRef, useState } from 'react'
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward, FaTimes,
    FaRandom, FaSyncAlt,
} from 'react-icons/fa'
import { HiVolumeUp } from 'react-icons/hi'
import './PersonalMiniPlayer.css'

function fmtTime(ms) {
    if (!ms && ms !== 0) return '0:00'
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function waveformBars(seed, n = 60) {
    let s = 0
    const str = String(seed ?? 'x')
    for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0
    return Array.from({ length: n }, () => {
        s = (s * 1664525 + 1013904223) >>> 0
        return 14 + (s % 72)
    })
}

const BAR_N = 60
const SVG_W = 298
const SVG_H = 28

function buildWavePath(bars) {
    const n   = bars.length
    const mid = SVG_H / 2
    const pts = bars.map((h, i) => {
        const x     = (i / (n - 1)) * SVG_W
        const halfH = ((h / 100) * SVG_H) / 2
        return { x, t: mid - halfH, b: mid + halfH }
    })
    // top — esquerda para direita
    let d = `M ${pts[0].x} ${pts[0].t}`
    for (let i = 1; i < n; i++) {
        const p = pts[i - 1], c = pts[i]
        const mx = (p.x + c.x) / 2
        d += ` C ${mx},${p.t} ${mx},${c.t} ${c.x},${c.t}`
    }
    // bottom — direita para esquerda
    d += ` L ${pts[n - 1].x},${pts[n - 1].b}`
    for (let i = n - 2; i >= 0; i--) {
        const c = pts[i], p = pts[i + 1]
        const mx = (c.x + p.x) / 2
        d += ` C ${mx},${p.b} ${mx},${c.b} ${c.x},${c.b}`
    }
    return d + ' Z'
}

function Waveform({ bars, pct, onClick }) {
    const pathD   = buildWavePath(bars)
    const playedW = (pct / 100) * SVG_W

    return (
        <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="none"
            className="pmp__waveform"
            onClick={onClick}
            role="slider"
            aria-label="Posição de reprodução"
            aria-valuenow={Math.round(pct)}
            tabIndex={0}
            onKeyDown={e => {
                const r = e.currentTarget.getBoundingClientRect()
                if (e.key === 'ArrowRight') onClick({ currentTarget: e.currentTarget, clientX: r.left + (pct / 100 + 0.05) * r.width })
                if (e.key === 'ArrowLeft')  onClick({ currentTarget: e.currentTarget, clientX: r.left + Math.max(0, pct / 100 - 0.05) * r.width })
            }}
        >
            <defs>
                <clipPath id="pmp-remaining">
                    <rect x={playedW} y="0" width={SVG_W} height={SVG_H} />
                </clipPath>
                <clipPath id="pmp-played">
                    <rect x="0" y="0" width={playedW} height={SVG_H} />
                </clipPath>
            </defs>
            <path d={pathD} fill="rgba(255,255,255,0.08)" clipPath="url(#pmp-remaining)" />
            <path d={pathD} fill="var(--p-accent)" clipPath="url(#pmp-played)" />
        </svg>
    )
}

export default function PersonalMiniPlayer({ tracks, currentIndex, onIndexChange, onClose, onPlayingChange }) {
    const track = (currentIndex !== null && currentIndex >= 0) ? (tracks?.[currentIndex] ?? null) : null

    const audioRef    = useRef(null)
    const volBarRef   = useRef(null)
    const draggingRef = useRef(false)
    const idxRef      = useRef(currentIndex)
    const tracksRef   = useRef(tracks)
    const changeRef   = useRef(onIndexChange)
    const repeatRef   = useRef(false)

    const [playing,  setPlaying]  = useState(false)
    const [position, setPosition] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume,   setVolume]   = useState(70)
    const [repeat,   setRepeat]   = useState(false)

    useEffect(() => { idxRef.current    = currentIndex  }, [currentIndex])
    useEffect(() => { tracksRef.current = tracks        }, [tracks])
    useEffect(() => { changeRef.current = onIndexChange }, [onIndexChange])
    useEffect(() => { repeatRef.current = repeat        }, [repeat])
    useEffect(() => { onPlayingChange?.(playing)        }, [playing, onPlayingChange])

    const bars = useMemo(() => waveformBars(track?.id), [track?.id])

    function ensureAudio() {
        if (audioRef.current) return audioRef.current
        const audio = new Audio()
        audio.volume = 0.7
        audio.addEventListener('play',           () => setPlaying(true))
        audio.addEventListener('pause',          () => setPlaying(false))
        audio.addEventListener('timeupdate',     () => setPosition(Math.floor(audio.currentTime * 1000)))
        audio.addEventListener('loadedmetadata', () => setDuration(Math.floor(audio.duration * 1000)))
        audio.addEventListener('ended', () => {
            setPlaying(false)
            if (repeatRef.current) { audio.currentTime = 0; audio.play().catch(() => {}); return }
            const next = idxRef.current + 1
            if (next < tracksRef.current.length) changeRef.current(next)
            else { setPosition(0); audio.currentTime = 0 }
        })
        audioRef.current = audio
        return audio
    }

    useEffect(() => {
        if (!track?.audioUrl) {
            audioRef.current?.pause()
            setPlaying(false); setPosition(0); setDuration(0)
            return
        }
        const audio = ensureAudio()
        audio.src = track.audioUrl
        setPosition(0); setDuration(0)
        audio.play().catch(() => {})
    }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume / 100
    }, [volume])

    useEffect(() => {
        function onMove(e) {
            if (!draggingRef.current || !volBarRef.current) return
            const r = volBarRef.current.getBoundingClientRect()
            setVolume(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100))
        }
        function onUp() { draggingRef.current = false }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup',   onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup',   onUp)
        }
    }, [])

    useEffect(() => () => { audioRef.current?.pause() }, [])

    function togglePlay() {
        const audio = ensureAudio()
        playing ? audio.pause() : audio.play().catch(() => {})
    }

    function handleWaveformClick(e) {
        if (!duration || !audioRef.current) return
        const r = e.currentTarget.getBoundingClientRect()
        audioRef.current.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (duration / 1000)
    }

    function handlePrev() {
        if (position > 3000 && audioRef.current) audioRef.current.currentTime = 0
        else if (currentIndex > 0) onIndexChange(currentIndex - 1)
    }

    function handleNext() {
        if (currentIndex < (tracks?.length ?? 0) - 1) onIndexChange(currentIndex + 1)
    }

    const pct     = duration > 0 ? (position / duration) * 100 : 0
    const hasPrev = currentIndex > 0 || position > 3000
    const hasNext = currentIndex < (tracks?.length ?? 0) - 1

    if (!track) return null

    return (
        <footer className="pmp">

            {/* Faixa */}
            <div className="pmp__track">
                <div className="pmp__cover">
                    {track.coverUrl
                        ? <img src={track.coverUrl} alt={track.title} />
                        : <div className="pmp__cover-empty" />
                    }
                </div>
                <div key={track.id} className="pmp__info">
                    <div className="pmp__title">{track.title}</div>
                    {track.author && <div className="pmp__sub">{track.author}</div>}
                </div>
            </div>

            {/* Controlos */}
            <div className="pmp__controls">
                <div className="pmp__btns">
                    <button type="button" className="pmp__btn pmp__btn--soon" disabled aria-label="Aleatório">
                        <FaRandom size={14} />
                    </button>
                    <button type="button" className="pmp__btn" onClick={handlePrev} disabled={!hasPrev} aria-label="Anterior">
                        <FaStepBackward size={16} />
                    </button>
                    <button type="button" className="pmp__btn pmp__btn--play" onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproduzir'}>
                        {playing ? <FaPause size={12} /> : <FaPlay size={12} />}
                    </button>
                    <button type="button" className="pmp__btn" onClick={handleNext} disabled={!hasNext} aria-label="Próxima">
                        <FaStepForward size={16} />
                    </button>
                    <button type="button" className={'pmp__btn' + (repeat ? ' is-active' : '')} onClick={() => setRepeat(r => !r)} aria-label="Repetir">
                        <FaSyncAlt size={14} />
                    </button>
                </div>
                <div className="pmp__progress">
                    <span className="pmp__time">{fmtTime(position)}</span>
                    <Waveform bars={bars} pct={pct} onClick={handleWaveformClick} />
                    <span className="pmp__time">{fmtTime(duration)}</span>
                </div>
            </div>

            {/* Volume + fechar */}
            <div className="pmp__extras">
                <div className="pmp__volume">
                    <HiVolumeUp size={16} />
                    <div
                        ref={volBarRef}
                        className="pmp__vol-bar"
                        role="slider"
                        aria-label="Volume"
                        aria-valuenow={volume}
                        onMouseDown={e => {
                            draggingRef.current = true
                            const r = volBarRef.current.getBoundingClientRect()
                            setVolume(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100))
                        }}
                    >
                        <div className="pmp__vol-fill" style={{ width: `${volume}%` }} />
                    </div>
                </div>
                <button type="button" className="pmp__close" onClick={onClose} aria-label="Fechar player">
                    <FaTimes size={11} />
                </button>
            </div>

        </footer>
    )
}
