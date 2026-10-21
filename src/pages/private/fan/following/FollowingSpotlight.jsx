import { FaPlay, FaHeadphones } from 'react-icons/fa'
import { usePlayer }                     from '../../../../context/PlayerContext'
import { toPlayerTrack }                 from '../../../../utils/toPlayerTrack'
import NowPlayingEq                      from '../../../../components/NowPlayingEq.jsx'
import CoverImg                          from '../../../../components/CoverImg.jsx'

export default function FollowingSpotlight({ track, roster }) {
    const { setTrack, track: currentTrack, togglePlayRef } = usePlayer()

    if (track) {
        const pt       = toPlayerTrack(track, 'following')
        const isActive = currentTrack?.id === track.id

        function handleClick() {
            if (isActive) { togglePlayRef.current?.(); return }
            setTrack(pt)
        }

        return (
            <div className="flw__spotlight-card">
                <button
                    type="button"
                    className="flw__spotlight-row"
                    onClick={handleClick}
                >
                    <div className="flw__spotlight-head">
                        <span className="flw__roster-heading">Lançamento em destaque</span>
                    </div>

                    <div className="flw__spotlight-track">
                        <div className={`flw__spotlight-thumb${isActive ? ' flw__spotlight-thumb--active' : ''}`}>
                            <CoverImg src={track.coverUrl} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} iconSize={16} />
                            {isActive && <span className="track-card__eq-wrap"><NowPlayingEq /></span>}
                        </div>
                        <div className="flw__spotlight-info">
                            <span className="flw__spotlight-title">{track.title}</span>
                            <span className="flw__spotlight-artist">{track.artistName}</span>
                            <span className="flw__spotlight-plays">
                                <FaHeadphones size={9} style={{ marginRight: 4 }} />
                                {(track.playCount ?? 0).toLocaleString('pt-PT')} reproduções
                            </span>
                        </div>
                        {!isActive && <div className="flw__spotlight-play"><FaPlay size={10} /></div>}
                    </div>
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
