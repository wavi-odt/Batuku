/* ─────────────────────────────────────────────────────────────────
   DiscoverGenres.jsx, Géneros mundiais + cabo-verdianos.
   ───────────────────────────────────────────────────────────────── */

import { useState }                    from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function GenreGroup({ label, labelClass = '', gridClass = '', genres, showCount, initialCount, isOpen, onToggle }) {
    const [showAll, setShowAll] = useState(false)
    const navigate = useNavigate()

    const visible = initialCount && !showAll ? genres.slice(0, initialCount) : genres
    const hidden  = initialCount ? genres.length - initialCount : 0

    return (
        <div className="disc__genre-group">
            <button
                type="button"
                className="disc__genre-toggle"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span className={`disc__genres-label ${labelClass}`}>{label}</span>
                <span className={`disc__genre-chevron${isOpen ? ' disc__genre-chevron--open' : ''}`}>›</span>
            </button>

            <div className={`disc__genre-list${isOpen ? ' disc__genre-list--open' : ''}`}>
                <div className="disc__genre-list__inner">
                    <div className={`disc__genres ${gridClass}`}>
                        {visible.map(g => (
                            <button
                                key={g.id}
                                type="button"
                                className="disc__genre"
                                style={{ '--genre-hue': g.hue }}
                                onClick={() => navigate(`/genres/${g.id}`)}
                            >
                                <span className="disc__genre-name">{g.label}</span>
                                {showCount && (
                                    <span className="disc__genre-count">{g.tracks.toLocaleString('pt-PT')} faixas</span>
                                )}
                            </button>
                        ))}
                    </div>
                    {hidden > 0 && (
                        <button type="button" className="disc__genre-more" onClick={() => setShowAll(v => !v)}>
                            {showAll ? 'Ver menos' : `Ver mais (${hidden})`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function DiscoverGenres({ genresMundiais, genresCaboverde }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const openParam = searchParams.get('open') ?? ''

    const toggle = (key) => {
        const current = openParam ? openParam.split(',').filter(Boolean) : []
        const next    = current.includes(key) ? current.filter(k => k !== key) : [...current, key]
        const updated = new URLSearchParams(searchParams)
        if (next.length === 0) updated.delete('open')
        else updated.set('open', next.join(','))
        setSearchParams(updated)
    }

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Géneros</h2>
                    <div className="home__section-sub">Explora música por estilo</div>
                </div>
            </div>

            <GenreGroup
                label="Mundiais"
                gridClass="disc__genres--world"
                genres={genresMundiais}
                showCount={false}
                initialCount={12}
                isOpen={openParam.includes('mundiais')}
                onToggle={() => toggle('mundiais')}
            />
            <GenreGroup
                label="Cabo Verde"
                labelClass="disc__genres-label--cv"
                genres={genresCaboverde}
                showCount={false}
                isOpen={openParam.includes('caboverde')}
                onToggle={() => toggle('caboverde')}
            />
        </section>
    )
}
