/* ─────────────────────────────────────────────────────────────────
   ProfileBlocks.jsx, Blocos reutilizáveis das tabs do perfil.
   Recebem dados via props (alimentados por data/profile.js → fetch).
   ───────────────────────────────────────────────────────────────── */

import { FaPlay, FaAward, FaUsers, FaRegComment, FaRegHeart } from 'react-icons/fa'
import { HiOutlineLibrary, HiArrowUp } from 'react-icons/hi'
import ArtistArtwork from '../../../components/PublicComponets/ArtistArtwork'
import { ARTISTS } from '../../../data/batuku.js'

const IMG_BY_NAME = Object.fromEntries(ARTISTS.map(a => [a.name, a.image]));

const BADGE_EMOJI = {
    sunrise: '🌅', fire: '🔥', compass: '🧭', heart: '❤️', star: '⭐',
    crown: '👑', ticket: '🎟️', gem: '💎', verified: '✓', users: '👥',
};

const ACTIVITY_ICON = {
    badge:    FaAward,
    follow:   FaUsers,
    comment:  FaRegComment,
    like:     FaRegHeart,
    level:    HiArrowUp,
    playlist: HiOutlineLibrary,
};

/* Cabeçalho de cartão com link opcional à direita */
export function CardTitle({ children, link }) {
    return (
        <h3 className="prof-card__title">
            {children}
            {link && <a className="prof-card__link" href="#">{link}</a>}
        </h3>
    );
}

export function BadgesGrid({ badges }) {
    return (
        <div className="badges-grid">
            {badges.map((b, i) => (
                <div key={i} className={'badge-item' + (b.got ? '' : ' is-locked')}>
                    <div className={'badge-item__icon badge-item__icon--' + b.tier}>
                        {BADGE_EMOJI[b.icon] || '🏅'}
                    </div>
                    <div className="badge-item__name">{b.name}</div>
                    <div className="badge-item__desc">{b.desc}</div>
                </div>
            ))}
        </div>
    );
}

export function PlaylistGrid({ playlists }) {
    return (
        <div className="playlist-grid">
            {playlists.map((pl, i) => (
                <button key={i} type="button" className="playlist-item">
                    <div className="playlist-item__cover">
                        <ArtistArtwork shape={pl.shape} hue={pl.hue} image={pl.image} rounded={0} />
                    </div>
                    <div>
                        <div className="playlist-item__name">{pl.name}</div>
                        <div className="playlist-item__count">{pl.tracks} faixas</div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export function FeaturedTracks({ tracks }) {
    return (
        <>
            {tracks.map((t, i) => (
                <div key={i} className="ftrack">
                    <div className="ftrack__n">{i + 1}</div>
                    <div className="ftrack__cover">
                        <ArtistArtwork shape={t.shape} hue={t.hue} image={t.image} rounded={0} />
                    </div>
                    <div>
                        <div className="ftrack__title">{t.title}</div>
                        <div className="ftrack__plays">{t.plays.toLocaleString('pt-PT')} reproduções</div>
                    </div>
                    <div className="ftrack__dur">{t.duration}</div>
                    <div className="ftrack__play"><FaPlay size={11} /></div>
                </div>
            ))}
        </>
    );
}

export function GenreBars({ genres }) {
    return (
        <>
            {genres.map((g, i) => (
                <div key={i} className="genre-row">
                    <div className="genre-row__head">
                        <span>{g.name}</span>
                        <span className="genre-row__pct">{g.pct}%</span>
                    </div>
                    <div className="genre-row__bar">
                        <div className="genre-row__fill"
                             style={{ width: `${g.pct}%`, background: `oklch(0.6 0.17 ${g.hue})` }} />
                    </div>
                </div>
            ))}
        </>
    );
}

export function ActivityList({ items }) {
    return (
        <div className="prof-activity">
            {items.map((a, i) => {
                const Icon = ACTIVITY_ICON[a.type] || FaAward;
                return (
                    <div key={i} className="activity__item">
                        <div className={'activity__dot activity__dot--' + a.type}>
                            <Icon size={14} />
                        </div>
                        <div className="activity__body">
                            <div className="activity__text">{a.text}</div>
                            <div className="activity__time">{a.time}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function FollowingGrid({ artists }) {
    return (
        <div className="prof-following">
            {artists.map((a, i) => (
                <div key={i} className="follow-card">
                    <div className="follow-card__avatar">
                        <ArtistArtwork shape={a.shape} hue={a.hue} image={IMG_BY_NAME[a.name]} rounded={0} />
                        {a.isLive && <span className="follow-card__live">● Ao vivo</span>}
                    </div>
                    <div className="follow-card__name">{a.name}</div>
                    <div className="follow-card__genre">{a.city} · {a.genre}</div>
                    <button type="button" className="prof-following__btn">A seguir</button>
                </div>
            ))}
        </div>
    );
}

/* Reutilizados pelo overview + tab "Sobre" do artista */
export function ArtistAbout({ artist }) {
    const about = artist.about || {};
    const isEmpty = !artist.bio && !about.location && !about.genre && !about.languages && !about.forHire;
    return (
        <div className="prof-card">
            <CardTitle>Sobre</CardTitle>
            {isEmpty
                ? <p className="prof__bio user-detail__empty">Sem informação disponível.</p>
                : <>
                    {artist.bio && <p className="prof__bio" style={{ marginBottom: 16 }}>{artist.bio}</p>}
                    {about.location  && <div className="about-row"><span className="about-row__label">Localização</span><span className="about-row__value">{about.location}</span></div>}
                    {about.genre     && <div className="about-row"><span className="about-row__label">Género</span><span className="about-row__value">{about.genre}</span></div>}
                    {about.languages && <div className="about-row"><span className="about-row__label">Línguas</span><span className="about-row__value">{about.languages}</span></div>}
                    {about.forHire && (
                        <div className="forhire">
                            <span className="forhire__dot" />
                            <div className="forhire__text">
                                <strong>Disponível para colaborações</strong>
                                <span>Beats por encomenda · features</span>
                            </div>
                        </div>
                    )}
                </>
            }
        </div>
    );
}

function buildSocialUrl(kind, handle) {
    if (!handle) return null;
    const h = handle.replace(/^@/, '');
    if (handle.startsWith('http')) return handle;
    switch (kind) {
        case 'instagram':  return `https://www.instagram.com/${h}`;
        case 'tiktok':     return `https://www.tiktok.com/@${h}`;
        case 'twitter':    return `https://twitter.com/${h}`;
        case 'soundcloud': return `https://soundcloud.com/${h}`;
        case 'youtube':    return `https://www.youtube.com/@${h}`;
        case 'facebook':   return `https://www.facebook.com/${h}`;
        case 'spotify':    return `https://open.spotify.com/artist/${h}`;
        default:           return null;
    }
}

export function ArtistLinks({ social }) {
    if (!social?.length) return null;
    return (
        <div className="prof-card">
            <CardTitle>Links</CardTitle>
            {social.map((s, i) => {
                const url = buildSocialUrl(s.kind, s.handle);
                return (
                    <a
                        key={i}
                        className="social-link"
                        href={url ?? '#'}
                        target={url ? '_blank' : undefined}
                        rel={url ? 'noopener noreferrer' : undefined}
                    >
                        <span className="social-link__handle">{s.handle}</span>
                        <span className="social-link__kind">{s.kind}</span>
                    </a>
                );
            })}
        </div>
    );
}
