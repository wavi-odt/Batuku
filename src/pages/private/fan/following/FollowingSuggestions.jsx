/* ─────────────────────────────────────────────────────────────────
   FollowingSuggestions.jsx, Artistas sugeridos para seguir.
   ───────────────────────────────────────────────────────────────── */

import { useState }  from 'react'
import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

export default function FollowingSuggestions({ artists }) {
    const [followed, setFollowed] = useState(new Set());

    const toggle = (name) => {
        setFollowed(prev => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
    };

    return (
        <div className="flw__suggest-card">
            <div className="flw__roster-head">
                <span className="flw__roster-heading">Podes também gostar de</span>
            </div>

            <div className="flw__suggest-list">
                {artists.map((a, i) => (
                    <div key={i} className="flw__suggest-row">
                        <div className="flw__suggest-avatar">
                            <ArtistArtwork shape={a.shape} hue={a.hue} image={a.image} rounded={0} />
                        </div>
                        <div className="flw__suggest-info">
                            <div className="flw__suggest-name">{a.name}</div>
                            <div className="flw__suggest-reason">{a.reason}</div>
                        </div>
                        <button
                            type="button"
                            className={`flw__suggest-btn${followed.has(a.name) ? ' flw__suggest-btn--following' : ''}`}
                            onClick={() => toggle(a.name)}
                        >
                            {followed.has(a.name) ? 'A seguir' : '+ Seguir'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
