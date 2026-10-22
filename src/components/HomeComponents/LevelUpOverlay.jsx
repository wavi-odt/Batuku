import { useEffect, useRef, useState } from 'react'
import { FaTrophy } from 'react-icons/fa'
import { API, getToken } from '../../utils/auth'
import { useNotifications } from '../../context/NotificationsContext'
import './LevelUpOverlay.css'

export default function LevelUpOverlay() {
    const { notifications, loaded } = useNotifications()
    const seenIds  = useRef(new Set())
    const snapRef  = useRef(false)
    const timerRef = useRef(null)
    const fillRef  = useRef(null)
    const [data,    setData]    = useState(null)
    const [closing, setClosing] = useState(false)

    function dismiss() {
        clearTimeout(timerRef.current)
        setClosing(true)
        timerRef.current = setTimeout(() => { setData(null); setClosing(false) }, 280)
    }

    useEffect(() => {
        if (!loaded) {
            snapRef.current = false
            seenIds.current.clear()
            return
        }

        // Transição false → true: marcar todos os IDs existentes como vistos (histórico)
        if (!snapRef.current) {
            snapRef.current = true
            for (const n of notifications) {
                seenIds.current.add(n.id)
            }
            return
        }

        // loaded já era true: verificar novas notificações LEVEL_UP
        const newLevelUps = notifications.filter(
            n => n.type === 'LEVEL_UP' && !seenIds.current.has(n.id)
        )
        if (newLevelUps.length === 0) return

        for (const n of newLevelUps) {
            seenIds.current.add(n.id)
        }

        const token = getToken()
        if (!token) return

        fetch(`${API}/api/gamification/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.ok ? r.json() : null)
            .then(prof => {
                if (!prof) return
                const xpTotal = (prof.experiencePoints ?? 0) + (prof.pointsToNextLevel ?? 0)
                clearTimeout(timerRef.current)
                setClosing(false)
                setData({
                    level:   prof.level,
                    xpPct:   xpTotal > 0 ? Math.round((prof.experiencePoints / xpTotal) * 100) : 0,
                    xpLabel: `${prof.experiencePoints ?? 0} / ${xpTotal} XP`,
                })
                timerRef.current = setTimeout(dismiss, 4000)
            })
            .catch(() => {})
    }, [notifications, loaded])

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
