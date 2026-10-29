import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export default function ScrollManager() {
    const location     = useLocation()
    const navType      = useNavigationType()
    const prevPathname = useRef(location.pathname)

    useEffect(() => {
        const sameRoute = location.pathname === prevPathname.current
        prevPathname.current = location.pathname

        if (navType === 'POP') {
            const saved = sessionStorage.getItem(`scroll:${location.key}`)
            if (saved != null) {
                requestAnimationFrame(() =>
                    window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' })
                )
            }
        } else if (!sameRoute) {
            window.scrollTo({ top: 0, behavior: 'instant' })
        }

        return () => {
            sessionStorage.setItem(`scroll:${location.key}`, String(window.scrollY))
        }
    }, [location.key, navType])

    return null
}
