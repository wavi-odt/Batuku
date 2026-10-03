import { useState, useEffect } from 'react'
import { BsStars } from 'react-icons/bs'
import { API, getToken } from '../../../../utils/auth.js'
import './WeeklySummary.css'

export default function WeeklySummary() {
    const [summary,   setSummary]   = useState(null)
    const [loading,   setLoading]   = useState(true)
    const [error,     setError]     = useState(false)

    useEffect(() => {
        fetch(`${API}/api/stats/weekly-summary`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => setSummary(data.summary))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [])

    if (error || (!loading && !summary)) return null

    return (
        <div className="weekly-summary">
            <div className="weekly-summary__badge">
                <BsStars size={12} />
                Resumo semanal
            </div>
            {loading ? (
                <div className="weekly-summary__skeleton">
                    <div className="weekly-summary__skel-line" />
                    <div className="weekly-summary__skel-line weekly-summary__skel-line--short" />
                </div>
            ) : (
                <p className="weekly-summary__text">{summary}</p>
            )}
        </div>
    )
}
