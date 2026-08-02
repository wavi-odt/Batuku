/* ─────────────────────────────────────────────────────────────────
   CommunitySidebar.jsx, Online agora + Tags em tendência.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

export default function CommunitySidebar({ onlineNow, trendingTags, totalOnline }) {
    return (
        <>
            {/* ─── Online agora ─────────────────────────────────── */}
            <div className="com__online">
                <div className="com__online-head">
                    <span className="com__online-dot" />
                    <span className="com__online-title">Online agora</span>
                    <span className="com__online-count">{totalOnline} membros</span>
                </div>

                <div className="com__online-list">
                    {onlineNow.map(m => (
                        <div key={m.user} className="com__online-row">
                            <div className="com__online-avatar">
                                <ArtistArtwork
                                    shape={m.shape}
                                    hue={m.hue}
                                    image={m.image}
                                    rounded={0}
                                    showGloss={false}
                                />
                                <span className="com__online-status-dot" aria-hidden="true" />
                            </div>
                            <div className="com__online-info">
                                <div className="com__online-user">{m.handle}</div>
                                <div className="com__online-activity">{m.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Tags em tendência ────────────────────────────── */}
            <div className="com__trending">
                <div className="com__trending-title">Tendências</div>
                <div className="com__trending-list">
                    {trendingTags.map(t => (
                        <div key={t.tag} className="com__trending-row">
                            <span className="com__trending-tag">{t.tag}</span>
                            <span className="com__trending-count">{t.posts} posts</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
