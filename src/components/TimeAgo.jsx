import { useState, useEffect } from 'react'
import { timeAgo } from '../utils/timeAgo.js'

export default function TimeAgo({ isoStr, className }) {
    const [label, setLabel] = useState(() => timeAgo(isoStr))

    useEffect(() => {
        setLabel(timeAgo(isoStr))
        const id = setInterval(() => setLabel(timeAgo(isoStr)), 60_000)
        return () => clearInterval(id)
    }, [isoStr])

    return <time dateTime={isoStr} className={className}>{label}</time>
}
