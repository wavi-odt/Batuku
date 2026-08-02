/* ─────────────────────────────────────────────────────────────────
   FollowingFeed.jsx, Feed cronológico de atividade dos seguidos.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'

const TYPE_LABEL = {
    release: { dot: 'release', label: 'Lançamento' },
    live:    { dot: 'live',    label: 'Ao vivo'    },
    update:  { dot: 'update',  label: 'Atualização'},
};

export default function FollowingFeed({ items }) {
    return (
        <div>
            <div className="home__section-head" style={{ marginBottom: 16 }}>
                <div>
                    <h2 className="home__section-title">Atividade recente</h2>
                    <div className="home__section-sub">O que os teus artistas andaram a fazer</div>
                </div>
            </div>

            <div className="flw__feed">
                {items.map(item => {
                    const meta = TYPE_LABEL[item.type] || TYPE_LABEL.update;
                    return (
                        <div key={item.id} className="flw__feed-item">

                            {/* Avatar do artista */}
                            <div className="flw__feed-avatar">
                                <ArtistArtwork shape={item.shape} hue={item.hue} image={item.image} rounded={0} />
                            </div>

                            <div className="flw__feed-body">
                                <div className="flw__feed-header">
                                    <span className="flw__feed-artist">{item.artist}</span>
                                    <span className="flw__feed-action">{item.text}</span>
                                    <span className={`flw__feed-tag flw__feed-tag--${item.type}`}>
                                        {meta.label}
                                    </span>
                                    <span className="flw__feed-time">{item.time}</span>
                                </div>

                                {/* Cartão de conteúdo (faixa/EP) */}
                                {item.content && (
                                    <button type="button" className="flw__feed-content">
                                        <div className="flw__feed-content-thumb">
                                            <ArtistArtwork
                                                shape={item.content.shape}
                                                hue={item.content.hue}
                                                image={item.content.image}
                                                rounded={6}
                                            />
                                        </div>
                                        <span className="flw__feed-content-title">{item.content.title}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
