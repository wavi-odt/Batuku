import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export default function ScrollManager() {
    const location = useLocation()
    const navType  = useNavigationType()

    useEffect(() => {
        if (navType === 'POP') {
            const saved = sessionStorage.getItem(`scroll:${location.key}`)
            if (saved != null) {
                // aguarda o render da página antes de restaurar
                requestAnimationFrame(() =>
                    window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' })
                )
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' })
        }

        return () => {
            sessionStorage.setItem(`scroll:${location.key}`, String(window.scrollY))
        }
    }, [location.key, navType])

    return null
}
