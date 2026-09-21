import { FaMusic, FaPlay, FaHeadphones } from 'react-icons/fa'
import { Link }                          from 'react-router-dom'
import { usePlayer }                     from '../../../../context/PlayerContext'
import { toPlayerTrack }                 from '../../../../utils/toPlayerTrack'

export default function FollowingSpotlight({ track, roster }) {
    const { setTrack } = usePlayer()

    if (track) {
        const pt = toPlayerTrack(track)
        return (
            <div className="flw__spotlight-card">
                <div className="flw__spotlight-head">
                    <span className="flw__roster-heading">Lançamento em destaque</span>
                </div>

                <button
                    type="button"
                    className="flw__spotlight-row"
                    onClick={() => setTrack(pt)}
                >
                    <div className="flw__spotlight-thumb">
                        {track.coverUrl
                            ? <img src={track.coverUrl} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div className="flw__spotlight-thumb-fallback"><FaMusic size={16} /></div>
                        }
                    </div>
                    <div className="flw__spotlight-info">
                        <span className="flw__spotlight-title">{track.title}</span>
                        <Link
                            to={`/artists/${track.artistProfileId}`}
                            className="flw__spotlight-artist"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onClick={e => e.stopPropagation()}
                        >
                            {track.artistName}
                        </Link>
                        <span className="flw__spotlight-plays">
                            <FaHeadphones size={9} style={{ marginRight: 4 }} />
                            {(track.playCount ?? 0).toLocaleString('pt-PT')} reproduções
                        </span>
                    </div>
                    <div className="flw__spotlight-play"><FaPlay size={10} /></div>
                </button>
            </div>
        )
    }

    if (roster.length > 0) {
        const genres = [...new Set(roster.map(a => a.genre).filter(Boolean))].slice(0, 8)
        return (
            <div className="flw__spotlight-card">
                <div className="flw__spotlight-head">
                    <span className="flw__roster-heading">Géneros que ouves</span>
                </div>
                <div className="flw__genres">
                    {genres.map(g => <span key={g} className="flw__genre-pill">{g}</span>)}
                    {genres.length === 0 && (
                        <p style={{ fontSize: 13, color: 'var(--color-ink-mute)', margin: 0 }}>
                            Ainda sem géneros definidos.
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return null
}
