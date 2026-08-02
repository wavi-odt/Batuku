/* ─────────────────────────────────────────────────────────────────
   FollowingRoster.jsx, Lista compacta de todos os artistas seguidos.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

function fmt(n) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
}

export default function FollowingRoster({ artists }) {
    return (
        <div className="flw__roster-card">
            <div className="flw__roster-head">
                <span className="flw__roster-heading">Artistas que segues</span>
                <span className="flw__roster-count">{artists.length}</span>
            </div>

            <div className="flw__roster-list">
                {artists.map((a, i) => (
                    <div key={i} className="flw__roster-row">
                        <div className="flw__roster-avatar">
                            <ArtistArtwork shape={a.shape} hue={a.hue} image={a.image} rounded={0} />
                            {a.isLive && <span className="flw__roster-live-ring" />}
                        </div>
                        <div className="flw__roster-info">
                            <div className="flw__roster-name">{a.name}</div>
                            <div className="flw__roster-genre">{a.genre} · {fmt(a.followers)} seg.</div>
                        </div>
                        <div className="flw__roster-status">
                            {a.isLive
                                ? <span className="flw__roster-status--live">● Ao vivo</span>
                                : a.newTracks > 0
                                    ? <span className="flw__roster-status--new">+{a.newTracks}</span>
                                    : <span className="flw__roster-status--idle">{a.lastActive}</span>
                            }
                        </div>
                    </div>
                ))}
            </div>

            <a href="#" className="flw__roster-manage">Gerir artistas →</a>
        </div>
    );
}
