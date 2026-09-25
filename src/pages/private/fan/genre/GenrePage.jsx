import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaPlay, FaArrowLeft }    from 'react-icons/fa'
import AppShell                from '../../../../components/HomeComponents/AppShell.jsx'
import ArtistArtwork           from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { API, getToken }       from '../../../../utils/auth.js'
import { usePlayer }           from '../../../../context/PlayerContext.jsx'
import { useGenres }           from '../../../../context/GenresContext.jsx'
import './GenrePage.css'

const SHAPES     = ['circles', 'orbit', 'arch', 'sun', 'triangles', 'wave', 'stripes', 'split']
const shapeFromId = id => SHAPES[Number(id) % SHAPES.length]
const hueFromId   = id => (Number(id) * 137) % 360

function daysLabel(iso) {
    if (!iso) return ''
    const n = Math.floor((Date.now() - new Date(iso)) / 86400000)
    if (n <= 0) return 'Hoje'
    if (n === 1) return 'Há 1 dia'
    if (n < 7)   return `Há ${n} dias`
    const w = Math.floor(n / 7)
    return w === 1 ? 'Há 1 semana' : `Há ${w} semanas`
}

export default function GenrePage() {
    const { id }       = useParams()
    const navigate     = useNavigate()
    const { setTrack } = usePlayer()
    const { genresMundiais, genresCaboverde } = useGenres()

    const allGenres = [...genresMundiais, ...genresCaboverde]
    const genre     = allGenres.find(g => String(g.id) === String(id))

    const [tracks,   setTracks]   = useState([])
    const [releases, setReleases] = useState([])
    const [loading,  setLoading]  = useState(true)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        const headers = getToken() ? { Authorization: `Bearer ${getToken()}` } : {}
        Promise.all([
            fetch(`${API}/api/genres/${id}/tracks`,   { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/genres/${id}/releases`, { headers }).then(r => r.ok ? r.json() : []),
        ])
        .then(([t, r]) => {
            setTracks(Array.isArray(t) ? t : [])
            setReleases(Array.isArray(r) ? r : [])
        })
        .finally(() => setLoading(false))
    }, [id])

    const hue = genre?.hue ?? 220

    return (
        <AppShell role="fan">
            {/* ─── Hero ─────────────────────────────────────────── */}
            <div className="genre__hero" style={{ '--genre-hue': hue }}>
                <button type="button" className="genre__back" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={12} /> Descobrir
                </button>
                <h1 className="genre__title">{genre?.label ?? '—'}</h1>
                <p className="genre__meta">
                    {tracks.length} {tracks.length === 1 ? 'faixa' : 'faixas'}
                    {releases.length > 0 && ` · ${releases.length} lançamento${releases.length !== 1 ? 's' : ''}`}
                </p>
            </div>

            {/* ─── Faixas ───────────────────────────────────────── */}
            {!loading && tracks.length > 0 && (
                <section className="home__section">
                    <div className="home__section-head">
                        <div>
                            <h2 className="home__section-title">Faixas</h2>
                            <div className="home__section-sub">Todas as faixas deste género</div>
                        </div>
                    </div>
                    <div className="genre__grid">
                        {tracks.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                className="track-card"
                                onClick={() => t.audioUrl && setTrack({ ...t, name: t.title }, tracks.map(q => ({ ...q, name: q.title })))}
                            >
                                <div className="track-card__cover">
                                    <ArtistArtwork
                                        shape={shapeFromId(t.id)}
                                        hue={hueFromId(t.id)}
                                        image={t.coverUrl ?? null}
                                        rounded={10}
                                    />
                                    <span className="track-card__play" aria-hidden="true">
                                        <FaPlay size={12} />
                                    </span>
                                </div>
                                <div className="track-card__title">{t.title}</div>
                                <div className="track-card__artist">{t.artistName}</div>
                                <div className="track-card__date">{daysLabel(t.createdAt)}</div>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── Lançamentos ──────────────────────────────────── */}
            {!loading && releases.length > 0 && (
                <section className="home__section">
                    <div className="home__section-head">
                        <div>
                            <h2 className="home__section-title">Lançamentos</h2>
                            <div className="home__section-sub">Álbuns, EPs e singles</div>
                        </div>
                    </div>
                    <div className="genre__grid">
                        {releases.map(r => (
                            <Link
                                key={r.id}
                                to={`/releases/${r.id}`}
                                className="track-card"
                            >
                                <div className="track-card__cover">
                                    <ArtistArtwork
                                        shape={shapeFromId(r.id)}
                                        hue={hueFromId(r.id)}
                                        image={r.coverUrl ?? null}
                                        rounded={10}
                                    />
                                </div>
                                <div className="track-card__title">{r.title}</div>
                                <div className="track-card__artist">{r.artistName}</div>
                                <div className="track-card__date">{r.albumType}</div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {!loading && tracks.length === 0 && releases.length === 0 && (
                <div className="genre__empty">
                    Ainda não há música neste género.
                </div>
            )}
        </AppShell>
    )
}
