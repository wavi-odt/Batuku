/* ─────────────────────────────────────────────────────────────────
   FollowingLive.jsx → A ouvir agora.
   Mostra o que as pessoas/artistas que segues estão a ouvir
   neste momento, estilo "Friend Activity" do Spotify.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay } from 'react-icons/fa'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

export default function FollowingNowListening({ items }) {
    if (!items.length) return null;

    return (
        <section className="flw__now-section">
            <div className="flw__now-header">
                <h2 className="flw__now-title">A ouvir agora</h2>
                <span className="flw__now-badge">{items.length} pessoas</span>
            </div>

            <div className="flw__now-list">
                {items.map((item, i) => (
                    <div key={i} className="flw__now-row">

                        {/* Avatar do utilizador */}
                        <div className="flw__now-user-avatar">
                            <ArtistArtwork
                                shape={item.userShape}
                                hue={item.userHue}
                                image={item.userImage}
                                rounded={0}
                                showGloss={false}
                            />
                        </div>

                        {/* Nome */}
                        <div className="flw__now-user-info">
                            <span className="flw__now-user-name">{item.user}</span>
                            <span className="flw__now-user-handle">{item.handle}</span>
                        </div>

                        {/* Seta separadora */}
                        <span className="flw__now-arrow" aria-hidden="true">→</span>

                        {/* Thumbnail da faixa */}
                        <div className="flw__now-track-thumb">
                            <ArtistArtwork
                                shape={item.trackShape}
                                hue={item.trackHue}
                                image={item.trackImage}
                                rounded={6}
                            />
                        </div>

                        {/* Info da faixa */}
                        <div className="flw__now-track-info">
                            <span className="flw__now-track-title">{item.track}</span>
                            <span className="flw__now-track-artist">{item.artist}</span>
                        </div>

                        {/* Tempo + play */}
                        <span className="flw__now-since">{item.since}</span>
                        <button
                            type="button"
                            className="flw__now-play"
                            aria-label={`Ouvir ${item.track}`}
                        >
                            <FaPlay size={9} />
                        </button>

                    </div>
                ))}
            </div>
        </section>
    );
}
