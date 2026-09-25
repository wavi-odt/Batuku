/* ─────────────────────────────────────────────────────────────────
   DiscoverSpotlight.jsx, Artistas em destaque para descobrir.
   ───────────────────────────────────────────────────────────────── */

import { useState }  from 'react'
import { Link }      from 'react-router-dom'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { API, getToken } from '../../../../utils/auth.js'

const SHAPES = ['circles', 'orbit', 'arch', 'sun', 'triangles', 'wave', 'stripes', 'split']
const shapeFromId = id => SHAPES[Number(id) % SHAPES.length]
const hueFromId   = id => (Number(id) * 137) % 360

function fmt(n) {
    return (n ?? 0) >= 1000 ? `${((n ?? 0) / 1000).toFixed(1)}K` : (n ?? 0).toString()
}

function primaryStat(a) {
    if (a.monthlyListeners != null) return { value: fmt(a.monthlyListeners), label: 'ouvintes/mês' }
    if (a.followerCount    != null) return { value: fmt(a.followerCount),    label: 'seguidores'   }
    return { value: '0', label: 'seguidores' }
}

export default function DiscoverSpotlight({ artists }) {
    const [followed, setFollowed] = useState(new Set())
    const [loading,  setLoading]  = useState(new Set())

    async function handleFollow(id) {
        if (loading.has(id) || followed.has(id)) return
        setLoading(prev => new Set([...prev, id]))
        try {
            const res = await fetch(`${API}/api/artist-follows/${id}`, {
                method:  'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (res.ok) setFollowed(prev => new Set([...prev, id]))
        } finally {
            setLoading(prev => { const s = new Set(prev); s.delete(id); return s })
        }
    }

    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">Artistas em destaque</h2>
                    <div className="home__section-sub">Descobre novos artistas cabo-verdianos</div>
                </div>
            </div>

            <div className="disc__spotlight">
                {artists.map(a => (
                    <div key={a.id} className="disc__spot-card">
                        <Link to={`/artists/${a.id}`} className="disc__spot-avatar">
                            <ArtistArtwork
                                shape={shapeFromId(a.id)}
                                hue={hueFromId(a.id)}
                                image={a.avatarUrl ?? null}
                                rounded={0}
                            />
                        </Link>
                        <Link to={`/artists/${a.id}`} className="disc__spot-name">
                            {a.name}
                        </Link>
                        <div className="disc__spot-genre">{a.genre ?? ''}</div>
                        <div className="disc__spot-listeners">
                            {(() => { const s = primaryStat(a); return `${s.value} ${s.label}` })()}
                        </div>
                        <span className="disc__spot-gap" />
                        <button
                            type="button"
                            className={`btn btn--ghost btn--sm disc__spot-follow${followed.has(a.id) ? ' disc__spot-follow--done' : ''}`}
                            disabled={loading.has(a.id) || followed.has(a.id)}
                            onClick={() => handleFollow(a.id)}
                        >
                            {followed.has(a.id) ? 'A seguir ✓' : loading.has(a.id) ? '…' : '+ Seguir'}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}
