import { useEffect, useRef, useState } from 'react'
import { FaTrophy } from 'react-icons/fa'
import { API, getToken } from '../../utils/auth'
import './LevelUpOverlay.css'

const LS_KEY = 'batuku_known_level'

function readStoredLevel() {
    const v = parseInt(localStorage.getItem(LS_KEY) ?? '0', 10)
    return v > 0 ? v : null
}

export default function LevelUpOverlay() {
    const prevLevelRef = useRef(readStoredLevel())
    const timerRef     = useRef(null)
    const fillRef      = useRef(null)
    const [data,      setData]      = useState(null)
    const [closing,   setClosing]   = useState(false)

    function dismiss() {
        clearTimeout(timerRef.current)
        setClosing(true)
        timerRef.current = setTimeout(() => { setData(null); setClosing(false) }, 280)
    }

    useEffect(() => {
        async function onUpdate() {
            const token = getToken()
            if (!token) return
            try {
                const res = await fetch(`${API}/api/gamification/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) return
                const prof = await res.json()
                const newLevel = prof.level

                if (prevLevelRef.current !== null && newLevel > prevLevelRef.current) {
                    const xpTotal = (prof.experiencePoints ?? 0) + (prof.pointsToNextLevel ?? 0)
                    clearTimeout(timerRef.current)
                    setClosing(false)
                    setData({
                        level:   newLevel,
                        xpPct:   xpTotal > 0 ? Math.round((prof.experiencePoints / xpTotal) * 100) : 0,
                        xpLabel: `${prof.experiencePoints ?? 0} / ${xpTotal} XP`,
                    })
                    timerRef.current = setTimeout(dismiss, 4000)
                }

                prevLevelRef.current = newLevel
                try { localStorage.setItem(LS_KEY, String(newLevel)) } catch { /* ignora */ }
            } catch { /* ignora */ }
        }

        window.addEventListener('batuku:gamification-updated', onUpdate)
        return () => {
            window.removeEventListener('batuku:gamification-updated', onUpdate)
            clearTimeout(timerRef.current)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!fillRef.current) return
        if (!data) { fillRef.current.style.width = '0%'; return }
        const t = setTimeout(() => {
            if (fillRef.current) fillRef.current.style.width = `${data.xpPct}%`
        }, 500)
        return () => clearTimeout(t)
    }, [data])

    if (!data) return null

    return (
        <div className={`lvlup${closing ? ' lvlup--closing' : ''}`} onClick={dismiss}>
            <div className="lvlup__card">
                <FaTrophy className="lvlup__icon" />
                <p className="lvlup__label">LEVEL UP</p>
                <p className="lvlup__number">{data.level}</p>
                <div className="lvlup__xp-wrap">
                    <div className="lvlup__xp-bar">
                        <div className="lvlup__xp-fill" ref={fillRef} />
                    </div>
                    <p className="lvlup__xp-text">{data.xpLabel}</p>
                </div>
            </div>
        </div>
    )
}
