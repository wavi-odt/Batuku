import { useEffect, useState, Fragment } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaTrophy, FaUserPlus, FaUserCheck, FaPlay, FaCompactDisc, FaRegComment, FaMusic, FaGlobe } from 'react-icons/fa'
import { SiSpotify } from 'react-icons/si'
import AppShell from '../../../components/HomeComponents/AppShell'
import ArtistArtwork from '../../../components/PublicComponets/ArtistArtwork'
import { API, getToken, getRole } from '../../../utils/auth.js'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { useToast } from '../../../context/ToastContext'
import {
    CardTitle, BadgesGrid, PlaylistGrid, ActivityList, GenreBars, ArtistAbout, ArtistLinks,
} from '../profile/ProfileBlocks'
import { usePlayer } from '../../../context/PlayerContext'
import LikeButton from '../../../components/LikeButton'
import TrackMenu from '../../../components/TrackMenu'
import TrackComments from '../../../components/TrackComments'
import '../profile/Profile.css'
import '../DetailPage.css'
import '../release/ReleaseDetail.css'
import '../fan/library/Library.css'

const TYPE_LABEL  = { ALBUM: 'Álbum', EP: 'EP', MIXTAPE: 'Mixtape', SINGLE: 'Single' };

const FAN_TABS    = ['Playlists', 'Conquistas', 'Atividade'];
const ARTIST_TABS = ['Visão geral', 'Faixas', 'Lançamentos', 'Sobre', 'Conquistas'];

function fmtMs(ms) {
    if (!ms) return '—';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function toPlaylist(p) {
    return { ...p, image: p.imageUrl ?? null, shape: p.shape ?? 'circles', hue: p.hue ?? 220, tracks: p.trackCount ?? p.tracks ?? 0 };
}
function toTrack(t) {
    return { ...t, image: t.imageUrl ?? null, shape: t.shape ?? 'arch', hue: t.hue ?? 200 };
}

export default function UserDetail() {
    const { id } = useParams();
    const shellRole = getRole() === 'artist' ? 'artist' : 'fan';
    const { track: currentTrack, setTrack } = usePlayer();
    const { showToast } = useToast()
    const currentUser = useCurrentUser()

    const [user,        setUser]        = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState('');
    const [active,      setActive]      = useState(0);
    const [following,   setFollowing]   = useState(false);
    const [followers,   setFollowers]   = useState(0);
    const [localTracks,      setLocalTracks]      = useState([]);
    const [topTracks,        setTopTracks]        = useState([]);
    const [releases,         setReleases]         = useState([]);
    const [artistProfile,    setArtistProfile]    = useState(null);
    const [resolvedArtistId, setResolvedArtistId] = useState(null);
    const [openCommentTrack, setOpenCommentTrack] = useState(null);
    const [publicPlaylists,  setPublicPlaylists]  = useState([]);

    useEffect(() => {
        const auth = { headers: { Authorization: `Bearer ${getToken()}` } };
        setLoading(true);
        setActive(0);

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, auth)
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(async data => {
                setUser(data);
                setFollowing(data.isFollowing ?? false);
                setFollowers(data.followers ?? 0);

                const aid = data.artistProfileId ?? null;
                setResolvedArtistId(aid);
                if (aid) {
                    const safeJson = r => r.ok ? r.json() : [];
                    const safeObj = r => r.ok ? r.json() : null;
                    const [local, top, rels, ap] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tracks/artist/${aid}`, auth).then(safeJson).catch(() => []),
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/artists/${aid}/top-tracks?market=PT`, auth).then(safeJson).catch(() => []),
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/releases/artist/${aid}`, auth).then(safeJson).catch(() => []),
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/artists/${aid}`, auth).then(safeObj).catch(() => null),
                    ]);
                    const uploaded = Array.isArray(local) ? local.filter(t => t.audioUrl) : [];
                    setLocalTracks(uploaded);
                    setTopTracks(Array.isArray(top) ? top : []);
                    setReleases(Array.isArray(rels) ? rels : []);
                    setArtistProfile(ap ?? null);
                } else {
                    setLocalTracks([]);
                    setTopTracks([]);
                    setReleases([]);
                    setArtistProfile(null);
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/playlists/user/${id}`, auth)
                        .then(r => r.ok ? r.json() : [])
                        .then(data => setPublicPlaylists(Array.isArray(data) ? data : []))
                        .catch(() => {});
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    async function toggleFollow() {
        const next = !following;
        const url = resolvedArtistId
            ? `${import.meta.env.VITE_API_BASE_URL}/api/artist-follows/${resolvedArtistId}`
            : `${import.meta.env.VITE_API_BASE_URL}/api/follows/${id}`;
        try {
            const res = await fetch(url, {
                method: next ? 'POST' : 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFollowers(data.followers);
            setFollowing(next);
            showToast(next ? `A seguir ${user.name}` : `Deixaste de seguir ${user.name}`);
        } catch {
            showToast('Erro ao atualizar follow', 'error');
        }
    }

    function toggleComments(e, trackId) {
        e.stopPropagation();
        setOpenCommentTrack(prev => prev === trackId ? null : trackId);
    }

    if (loading) return (
        <AppShell role={shellRole}>
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-ink-mute)' }}>A carregar…</div>
        </AppShell>
    );

    if (error || !user) return (
        <AppShell role={shellRole}>
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-danger)' }}>
                {error || 'Utilizador não encontrado.'}
            </div>
        </AppShell>
    );

    const isArtist      = !!resolvedArtistId;
    const isMe          = currentUser?.id != null && String(currentUser.id) === String(id);
    const tabs          = isArtist ? ARTIST_TABS : FAN_TABS;
    const activeTab     = tabs[active];
    const hue           = user.avatar?.hue ?? 285;
    const coverGradient = `linear-gradient(120deg, oklch(0.42 0.16 ${hue}), oklch(0.40 0.15 ${(hue + 60) % 360}))`;
    const playlists     = (user.playlists      ?? []).map(toPlaylist);
    const recentlyPlayed = (user.recentlyPlayed ?? []).map(toTrack);
    const badges        = user.badges    ?? [];
    const activity      = user.activity  ?? [];
    const topGenres     = user.topGenres ?? [];

    const stats = isArtist
        ? [
            { v: followers != null ? followers.toLocaleString('pt-PT') : '—', l: 'Seguidores' },
            { v: user.following != null ? user.following.toLocaleString('pt-PT') : '—', l: 'A seguir' },
            { v: localTracks.length > 0 ? localTracks.length : '—', l: 'Faixas' },
        ]
        : [
            { v: user.points    != null ? user.points.toLocaleString('pt-PT') : '—', l: 'Pontos' },
            { v: user.rank      != null ? '#' + user.rank : '—',                     l: 'Rank semanal' },
            { v: user.badgesCount ?? '—',                                             l: 'Badges' },
            { v: user.following != null ? user.following.toLocaleString('pt-PT') : '—', l: 'A seguir' },
            { v: followers != null ? followers.toLocaleString('pt-PT') : '—',        l: 'Seguidores' },
        ];

    return (
        <AppShell role={shellRole}>
            <div style={{ marginTop: -8 }}>

                {/* ── Cover ─────────────────────────────────────────────── */}
                <div className="prof__cover">
                    <div className="prof__cover-art" style={{ background: coverGradient }} />
                    <div className="prof__cover-grad" />
                </div>

                {/* ── Header ────────────────────────────────────────────── */}
                <div className="prof__header">
                    <div className="prof__avatar">
                        {user.imageUrl
                            ? <img src={user.imageUrl} alt={user.name} className="prof__avatar-img" />
                            : <ArtistArtwork shape={user.avatar?.shape ?? 'split'} hue={hue} rounded={0} />
                        }
                    </div>

                    <div className="prof__identity">
                        <div className="prof__name-row">
                            <h1 className="prof__name">{user.name}</h1>
                            {user.level != null && (
                                <span className="prof__level-chip">
                                    <FaTrophy size={11} /> Nível {user.level}
                                </span>
                            )}
                        </div>
                        <div className="prof__meta">
                            {user.handle && <span className="prof__meta-handle">{user.handle}</span>}
                            {user.country && <><span className="prof__meta-dot" /><span>{user.country}</span></>}
                            {user.location && <><span className="prof__meta-dot" /><span>{user.location}</span></>}
                            {user.joined && <><span className="prof__meta-dot" /><span>Membro desde {user.joined}</span></>}
                        </div>
                    </div>

                    {!isMe && <div className="prof__actions">
                        <button
                            type="button"
                            className={following ? 'btn-ghost' : 'btn-primary'}
                            style={{ padding: '10px 18px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 7 }}
                            onClick={toggleFollow}
                        >
                            {following
                                ? <><FaUserCheck size={13} /> A seguir</>
                                : <><FaUserPlus  size={13} /> Seguir</>
                            }
                        </button>
                    </div>}
                </div>

                {/* ── Stats ─────────────────────────────────────────────── */}
                <div className="prof__stats">
                    {stats.map((s, i) => (
                        <div key={i} className="prof__stat">
                            <div className="prof__stat-v">{s.v}</div>
                            <div className="prof__stat-l">{s.l}</div>
                        </div>
                    ))}
                </div>

                {/* ── Tabs ──────────────────────────────────────────────── */}
                <div className="prof__tabs">
                    {tabs.map((label, i) => (
                        <button
                            key={label}
                            type="button"
                            className={'prof__tab' + (i === active ? ' is-active' : '')}
                            onClick={() => setActive(i)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── Content ───────────────────────────────────────────── */}
                <div className="prof__body">

                    {/* Visão geral (apenas artistas) */}
                    {activeTab === 'Visão geral' && (() => {
                        const ap = artistProfile;
                        const about = {
                            location:  ap?.location ?? ap?.city ?? null,
                            genre:     Array.isArray(ap?.genres) ? ap.genres.join(' · ') : (ap?.genre ?? null),
                            languages: Array.isArray(ap?.languages) ? ap.languages.join(', ') : null,
                            forHire:   false,
                        };
                        const social = Array.isArray(ap?.links) ? ap.links : [];
                        const localQueue = localTracks.map(tr => ({
                            id: tr.id, name: tr.title, artistName: user.name,
                            coverUrl: tr.coverUrl, durationMs: tr.durationMs, audioUrl: tr.audioUrl, source: 'upload', playContext: 'artist',
                        }));
                        return (
                            <div className="prof__grid">
                                <div>
                                    <div className="prof-card prof__section-gap">
                                        {localTracks.length > 0 && (
                                            <>
                                                <CardTitle>Faixas · {localTracks.length}</CardTitle>
                                                <ul className="strack-list">
                                                    {localTracks.map((t, i) => {
                                                        const isPlaying    = currentTrack?.audioUrl === t.audioUrl;
                                                        const commentsOpen = openCommentTrack === t.id;
                                                        return (
                                                            <Fragment key={t.id}>
                                                                <li
                                                                    className={'strack strack--playable' + (isPlaying ? ' is-playing' : '') + (commentsOpen ? ' strack--comments-open' : '')}
                                                                    onClick={() => setTrack({ id: t.id, name: t.title, artistName: user.name, coverUrl: t.coverUrl, durationMs: t.durationMs, audioUrl: t.audioUrl, source: 'upload' }, localQueue)}>
                                                                    <div className="strack__num-wrap">
                                                                        <span className="strack__num">{i + 1}</span>
                                                                        <span className="strack__play-icon"><FaPlay size={11} /></span>
                                                                    </div>
                                                                    {t.coverUrl ? <img src={t.coverUrl} alt={t.title} className="strack__cover" /> : <div className="strack__cover strack__cover--placeholder" />}
                                                                    <div className="strack__info">
                                                                        <div className="strack__title">{t.title}</div>
                                                                        <div className="strack__sub">{isPlaying ? 'A reproduzir…' : fmtMs(t.durationMs)}</div>
                                                                    </div>
                                                                    <LikeButton trackId={t.id} />
                                                                    <button
                                                                        type="button"
                                                                        className={'rel-comment-btn' + (commentsOpen ? ' rel-comment-btn--active' : '')}
                                                                        onClick={e => toggleComments(e, t.id)}
                                                                        aria-label="Comentários"
                                                                    >
                                                                        <FaRegComment size={13} />
                                                                    </button>
                                                                    <TrackMenu trackId={t.id} />
                                                                    <span className="strack__dur">{fmtMs(t.durationMs)}</span>
                                                                </li>
                                                                {commentsOpen && (
                                                                    <li className="strack-comments-row">
                                                                        <TrackComments trackId={t.id} trackTitle={t.title} />
                                                                    </li>
                                                                )}
                                                            </Fragment>
                                                        );
                                                    })}
                                                </ul>
                                            </>
                                        )}
                                        {topTracks.length > 0 && (
                                            <div style={localTracks.length > 0 ? { marginTop: 24 } : undefined}>
                                                <CardTitle>
                                                    <span>Top via Spotify · {topTracks.length}</span>
                                                    <span className="strack-source"><SiSpotify size={12} style={{ color: '#1DB954' }} /> via Spotify</span>
                                                </CardTitle>
                                                <ul className="strack-list">
                                                    {topTracks.map((t, i) => {
                                                        const isPlaying = currentTrack?.spotifyId === t.spotifyId;
                                                        return (
                                                            <li key={t.spotifyId ?? i}
                                                                className={'strack strack--playable' + (isPlaying ? ' is-playing' : '')}
                                                                onClick={() => setTrack(
                                                                    { spotifyId: t.spotifyId, name: t.name, artistName: user.name, coverUrl: t.coverUrl, durationMs: t.durationMs, spotifyUrl: t.spotifyUrl, source: 'spotify' },
                                                                    topTracks.map(tr => ({ spotifyId: tr.spotifyId, name: tr.name, artistName: user.name, coverUrl: tr.coverUrl, durationMs: tr.durationMs, spotifyUrl: tr.spotifyUrl, source: 'spotify' }))
                                                                )}>
                                                                <div className="strack__num-wrap">
                                                                    <span className="strack__num">{i + 1}</span>
                                                                    <span className="strack__play-icon"><FaPlay size={11} /></span>
                                                                </div>
                                                                {t.coverUrl ? <img src={t.coverUrl} alt={t.name} className="strack__cover" /> : <div className="strack__cover strack__cover--placeholder" />}
                                                                <div className="strack__info">
                                                                    <div className="strack__title">{t.name}</div>
                                                                    <div className="strack__sub">{isPlaying ? 'A reproduzir…' : fmtMs(t.durationMs)}</div>
                                                                </div>
                                                                <span className="strack__dur">{fmtMs(t.durationMs)}</span>
                                                                {t.spotifyUrl && (
                                                                    <a href={t.spotifyUrl} target="_blank" rel="noopener noreferrer" className="strack__spotify" onClick={e => e.stopPropagation()} title="Abrir no Spotify">
                                                                        <SiSpotify size={15} />
                                                                    </a>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                        {localTracks.length === 0 && topTracks.length === 0 && (
                                            <p className="prof__bio user-detail__empty">Sem faixas disponíveis.</p>
                                        )}
                                    </div>
                                    {releases.length > 0 && (
                                        <div className="prof-card prof__section-gap">
                                            <CardTitle>Lançamentos · {releases.length}</CardTitle>
                                            <div className="rel-grid">
                                                {releases.map(r => {
                                                    const label = TYPE_LABEL[r.albumType] ?? r.albumType;
                                                    const count = r.tracks?.length ?? 0;
                                                    return (
                                                        <Link key={r.id} to={`/releases/${r.id}`} className="rel-card rel-card--link">
                                                            <div className="rel-card__cover">
                                                                {r.coverUrl ? <img src={r.coverUrl} alt={r.title} /> : <div className="rel-card__cover-placeholder"><FaCompactDisc size={28} /></div>}
                                                                <span className="rel-card__badge">{label}</span>
                                                            </div>
                                                            <div className="rel-card__info">
                                                                <div className="rel-card__title" title={r.title}>{r.title}</div>
                                                                <div className="rel-card__sub">{count} {count === 1 ? 'faixa' : 'faixas'}</div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="prof__col-side">
                                    <ArtistAbout artist={{ bio: ap?.bio ?? null, about }} />
                                    <ArtistLinks social={social} />
                                </div>
                            </div>
                        );
                    })()}

                    {/* Faixas (apenas artistas) */}
                    {activeTab === 'Faixas' && (
                        <div className="prof-card">
                            {localTracks.length > 0 && (() => {
                                const localQueue = localTracks.map(tr => ({
                                    id: tr.id, name: tr.title, artistName: user.name,
                                    coverUrl: tr.coverUrl, durationMs: tr.durationMs, audioUrl: tr.audioUrl, source: 'upload',
                                }));
                                return (
                                <>
                                    <CardTitle>Faixas publicadas · {localTracks.length}</CardTitle>
                                    <ul className="strack-list">
                                        {localTracks.map((t, i) => {
                                            const isPlaying    = currentTrack?.audioUrl === t.audioUrl;
                                            const commentsOpen = openCommentTrack === t.id;
                                            return (
                                                <Fragment key={t.id}>
                                                    <li
                                                        className={'strack strack--playable' + (isPlaying ? ' is-playing' : '') + (commentsOpen ? ' strack--comments-open' : '')}
                                                        onClick={() => setTrack(localQueue[i], localQueue)}
                                                    >
                                                        <div className="strack__num-wrap">
                                                            <span className="strack__num">{i + 1}</span>
                                                            <span className="strack__play-icon"><FaPlay size={11} /></span>
                                                        </div>
                                                        {t.coverUrl
                                                            ? <img src={t.coverUrl} alt={t.title} className="strack__cover" />
                                                            : <div className="strack__cover strack__cover--placeholder" />
                                                        }
                                                        <div className="strack__info">
                                                            <div className="strack__title">{t.title}</div>
                                                            <div className="strack__sub">
                                                                {isPlaying ? 'A reproduzir…' : fmtMs(t.durationMs)}
                                                            </div>
                                                        </div>
                                                        <LikeButton trackId={t.id} />
                                                        <button
                                                            type="button"
                                                            className={'rel-comment-btn' + (commentsOpen ? ' rel-comment-btn--active' : '')}
                                                            onClick={e => toggleComments(e, t.id)}
                                                            aria-label="Comentários"
                                                        >
                                                            <FaRegComment size={13} />
                                                        </button>
                                                        <TrackMenu trackId={t.id} />
                                                        <span className="strack__dur">{fmtMs(t.durationMs)}</span>
                                                    </li>
                                                    {commentsOpen && (
                                                        <li className="strack-comments-row">
                                                            <TrackComments trackId={t.id} trackTitle={t.title} />
                                                        </li>
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                    </ul>
                                </>
                                );
                            })()}

                            {topTracks.length > 0 && (
                                <div style={localTracks.length > 0 ? { marginTop: 24 } : undefined}>
                                    <CardTitle>
                                        <span>Top via Spotify · {topTracks.length}</span>
                                        <span className="strack-source">
                                            <SiSpotify size={12} style={{ color: '#1DB954' }} />
                                            via Spotify
                                        </span>
                                    </CardTitle>
                                    <ul className="strack-list">
                                        {topTracks.map((t, i) => {
                                            const isPlaying = currentTrack?.spotifyId === t.spotifyId;
                                            return (
                                                <li
                                                    key={t.spotifyId ?? i}
                                                    className={'strack strack--playable' + (isPlaying ? ' is-playing' : '')}
                                                    onClick={() => setTrack(
                                                        {
                                                            spotifyId:  t.spotifyId,
                                                            name:       t.name,
                                                            artistName: user.name,
                                                            coverUrl:   t.coverUrl,
                                                            durationMs: t.durationMs,
                                                            spotifyUrl: t.spotifyUrl,
                                                            source:     'spotify',
                                                        },
                                                        topTracks.map(tr => ({
                                                            spotifyId:  tr.spotifyId,
                                                            name:       tr.name,
                                                            artistName: user.name,
                                                            coverUrl:   tr.coverUrl,
                                                            durationMs: tr.durationMs,
                                                            spotifyUrl: tr.spotifyUrl,
                                                            source:     'spotify',
                                                        }))
                                                    )}
                                                >
                                                    <div className="strack__num-wrap">
                                                        <span className="strack__num">{i + 1}</span>
                                                        <span className="strack__play-icon"><FaPlay size={11} /></span>
                                                    </div>
                                                    {t.coverUrl
                                                        ? <img src={t.coverUrl} alt={t.name} className="strack__cover" />
                                                        : <div className="strack__cover strack__cover--placeholder" />
                                                    }
                                                    <div className="strack__info">
                                                        <div className="strack__title">{t.name}</div>
                                                        <div className="strack__sub">
                                                            {isPlaying ? 'A reproduzir…' : fmtMs(t.durationMs)}
                                                        </div>
                                                    </div>
                                                    <span className="strack__dur">{fmtMs(t.durationMs)}</span>
                                                    {t.spotifyUrl && (
                                                        <a
                                                            href={t.spotifyUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="strack__spotify"
                                                            onClick={e => e.stopPropagation()}
                                                            title="Abrir no Spotify"
                                                        >
                                                            <SiSpotify size={15} />
                                                        </a>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {localTracks.length === 0 && topTracks.length === 0 && (
                                <p className="prof__bio user-detail__empty">Sem faixas disponíveis.</p>
                            )}
                        </div>
                    )}

                    {/* Lançamentos (apenas artistas) */}
                    {activeTab === 'Lançamentos' && (
                        <div className="prof-card">
                            {releases.length > 0 ? (
                                <>
                                    <CardTitle>Lançamentos · {releases.length}</CardTitle>
                                    <div className="rel-grid rel-grid--full">
                                        {releases.map(r => {
                                            const label = TYPE_LABEL[r.albumType] ?? r.albumType;
                                            const count = r.tracks?.length ?? 0;
                                            return (
                                                <Link key={r.id} to={`/releases/${r.id}`} className="rel-card rel-card--link">
                                                    <div className="rel-card__cover">
                                                        {r.coverUrl
                                                            ? <img src={r.coverUrl} alt={r.title} />
                                                            : <div className="rel-card__cover-placeholder"><FaCompactDisc size={28} /></div>
                                                        }
                                                        <span className="rel-card__badge">{label}</span>
                                                    </div>
                                                    <div className="rel-card__info">
                                                        <div className="rel-card__title" title={r.title}>{r.title}</div>
                                                        <div className="rel-card__sub">{count} {count === 1 ? 'faixa' : 'faixas'}</div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <p className="prof__bio user-detail__empty">Sem lançamentos publicados.</p>
                            )}
                        </div>
                    )}

                    {/* Sobre (apenas artistas) */}
                    {activeTab === 'Sobre' && (() => {
                        const ap = artistProfile;
                        const about = {
                            location:  ap?.location ?? ap?.city ?? null,
                            genre:     Array.isArray(ap?.genres) ? ap.genres.join(' · ') : (ap?.genre ?? null),
                            languages: Array.isArray(ap?.languages) ? ap.languages.join(', ') : null,
                            forHire:   false,
                        };
                        const social = Array.isArray(ap?.links) ? ap.links : [];
                        return (
                            <div className="prof__grid">
                                <ArtistAbout artist={{ bio: ap?.bio ?? null, about }} />
                                <div className="prof__col-side">
                                    <ArtistLinks social={social} />
                                </div>
                            </div>
                        );
                    })()}

                    {/* Playlists */}
                    {activeTab === 'Playlists' && (
                        <div className="prof__grid">
                            <div>
                                {user.bio && (
                                    <div className="prof-card prof__section-gap">
                                        <CardTitle>Sobre</CardTitle>
                                        <p className="prof__bio">{user.bio}</p>
                                    </div>
                                )}
                                <div className="prof-card">
                                    {publicPlaylists.length > 0 ? (
                                        <>
                                            <CardTitle>Playlists · {publicPlaylists.length}</CardTitle>
                                            <div className="lib__playlist-grid" style={{ marginTop: 14 }}>
                                                {publicPlaylists.map(pl => (
                                                    <Link key={pl.id} to={`/playlists/${pl.id}`} className="lib__pl-card">
                                                        <div className="lib__pl-cover lib__pl-cover--img" style={{ marginBottom: 10 }}>
                                                            {pl.coverUrl
                                                                ? <img src={pl.coverUrl} alt={pl.name} className="lib__pl-cover-img" />
                                                                : <div className="lib__pl-cover-empty"><FaMusic size={26} /></div>
                                                            }
                                                            <span className="lib__pl-play" aria-hidden="true"><FaPlay size={11} /></span>
                                                        </div>
                                                        <div className="lib__pl-title">{pl.name}</div>
                                                        <div className="lib__pl-meta">
                                                            <FaGlobe size={9} /> Pública · {pl.trackCount ?? 0} {pl.trackCount === 1 ? 'faixa' : 'faixas'}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="prof__bio user-detail__empty">Sem playlists públicas.</p>
                                    )}
                                </div>
                            </div>

                            <div className="prof__col-side">
                                {topGenres.length > 0 && (
                                    <div className="prof-card">
                                        <CardTitle>Géneros preferidos</CardTitle>
                                        <GenreBars genres={topGenres} />
                                    </div>
                                )}
                                {recentlyPlayed.length > 0 && (
                                    <div className="prof-card">
                                        <CardTitle>Ouvido recentemente</CardTitle>
                                        {recentlyPlayed.map((t, i) => (
                                            <div key={i} className="playlist-item prof-recent">
                                                <div className="playlist-item__cover prof-recent__cover">
                                                    <ArtistArtwork shape={t.shape} hue={t.hue} image={t.image} rounded={0} />
                                                </div>
                                                <div>
                                                    <div className="playlist-item__name prof-recent__name">{t.title}</div>
                                                    <div className="playlist-item__count">{t.artist}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Conquistas */}
                    {activeTab === 'Conquistas' && (
                        <div className="prof-card">
                            {badges.length > 0
                                ? <>
                                    <CardTitle link={`${badges.filter(b => b.got).length} de ${badges.length} desbloqueados`}>
                                        Conquistas
                                    </CardTitle>
                                    <BadgesGrid badges={badges} />
                                  </>
                                : <p className="prof__bio user-detail__empty">Sem conquistas ainda.</p>
                            }
                        </div>
                    )}

                    {/* Atividade */}
                    {activeTab === 'Atividade' && (
                        <div className="prof-card">
                            {activity.length > 0
                                ? <>
                                    <CardTitle>Atividade recente</CardTitle>
                                    <ActivityList items={activity} />
                                  </>
                                : <p className="prof__bio user-detail__empty">Sem atividade recente.</p>
                            }
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
