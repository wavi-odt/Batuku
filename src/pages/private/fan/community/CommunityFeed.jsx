/* ─────────────────────────────────────────────────────────────────
   CommunityFeed.jsx, Feed de posts/threads da comunidade.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

const TYPE_LABELS = {
    collab:    'Collab',
    playlist:  'Playlist',
    questao:   'Questão',
    highlight: 'Destaque',
    novidade:  'Novidade',
};

export default function CommunityFeed({ posts }) {
    return (
        <div>
            <div className="com__feed-head">
                <span className="com__feed-title">Feed da comunidade</span>
                <a href="#" className="home__section-link" style={{ fontSize: 12 }}>Ver tudo →</a>
            </div>

            <div className="com__post-list">
                {posts.map(post => (
                    <article key={post.id} className="com__post">
                        <div className="com__post-header">
                            <div className="com__post-avatar">
                                <ArtistArtwork
                                    shape={post.shape}
                                    hue={post.hue}
                                    image={post.image}
                                    rounded={0}
                                    showGloss={false}
                                />
                            </div>
                            <div className="com__post-meta">
                                <div className="com__post-user">{post.handle}</div>
                                <div className="com__post-time-channel">
                                    {post.time} · <span className="com__post-channel">{post.channel}</span>
                                </div>
                            </div>
                            <span className={`com__post-type com__post-type--${post.type}`}>
                                {TYPE_LABELS[post.type]}
                            </span>
                        </div>

                        <h3 className="com__post-title">{post.title}</h3>
                        <p className="com__post-excerpt">{post.excerpt}</p>

                        <div className="com__post-foot">
                            {post.tags.map(t => (
                                <span key={t} className="com__post-tag">{t}</span>
                            ))}
                            <span className="com__post-spacer" />
                            <div className="com__post-reactions">
                                <span className="com__post-reaction">💬 {post.replies}</span>
                                <span className="com__post-reaction">❤️ {post.reactions}</span>
                            </div>
                            <a href="#" className="com__post-link">Ver →</a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
