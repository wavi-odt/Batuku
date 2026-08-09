import { useEffect, useState, Fragment } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { FaUserPlus, FaUserCheck, FaPlay, FaCompactDisc, FaRegComment } from 'react-icons/fa'
import { SiSpotify } from 'react-icons/si'
import AppShell from '../../../components/HomeComponents/AppShell'
import { API, getToken, getRole } from '../../../utils/auth.js'
import { useToast } from '../../../context/ToastContext'
import { CardTitle, BadgesGrid, ArtistAbout, ArtistLinks } from '../profile/ProfileBlocks'
import { usePlayer } from '../../../context/PlayerContext'
import LikeButton from '../../../components/LikeButton'
import TrackMenu from '../../../components/TrackMenu'
import TrackComments from '../../../components/TrackComments'
import '../profile/Profile.css'
import '../DetailPage.css'
import '../release/ReleaseDetail.css'

const TABS = ['Visão geral', 'Faixas', 'Lançamentos', 'Sobre', 'Conquistas'];
const TYPE_LABEL = { ALBUM: 'Álbum', EP: 'EP', MIXTAPE: 'Mixtape', SINGLE: 'Single' };

function fmtMs(ms) {
    if (!ms) return '—';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function ArtistDetail() {
    const { id } = useParams();
    const shellRole = getRole() === 'artist' ? 'artist' : 'fan';

    const { showToast } = useToast()
    const [artist,           setArtist]           = useState(null);
    const [loading,          setLoading]          = useState(true);
    const [error,            setError]            = useState('');
    const [active,           setActive]           = useState(0);
    const [following,        setFollowing]        = useState(false);
    const [followers,        setFollowers]        = useState(0);
    const [topTracks,        setTopTracks]        = useState([]);
    const [localTracks,      setLocalTracks]      = useState([]);
    const [releases,         setReleases]         = useState([]);
    const [openCommentTrack, setOpenCommentTrack] = useState(null);
    const { track: currentTrack, setTrack } = usePlayer();

    useEffect(() => {
        const auth = { headers: { Authorization: `Bearer ${getToken()}` } };
        Promise.all([
            fetch(`${API}/api/artists/${id}`, auth),
            fetch(`${API}/api/artist-follows/${id}/status`, auth),
            fetch(`${API}/api/artists/${id}/top-tracks?market=PT`, auth),
            fetch(`${API}/api/tracks/artist/${id}`, auth),
            fetch(`${API}/api/releases/artist/${id}`, auth),
        ])
            .then(([artistRes, statusRes, topRes, localRes, releasesRes]) => Promise.all([
                artistRes.ok ? artistRes.json() : Promise.reject(new Error(`Erro ${artistRes.status}`)),
                statusRes.ok ? statusRes.json() : Promise.resolve(null),
                topRes.ok ? topRes.json() : Promise.resolve([]),
                localRes.ok ? localRes.json() : Promise.resolve([]),
                releasesRes.ok ? releasesRes.json() : Promise.resolve([]),
            ]))
            .then(([artistData, statusData, topData, localData, releasesData]) => {
                setArtist(artistData);
                setFollowing(statusData?.following ?? artistData.isFollowing ?? false);
                setFollowers(statusData?.followers ?? artistData.followers ?? 0);
                setTopTracks(Array.isArray(topData) ? topData : []);
                const uploaded = Array.isArray(localData) ? localData.filter(t => t.audioUrl) : [];
                setLocalTracks(uploaded);
                setReleases(Array.isArray(releasesData) ? releasesData : []);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    function toggleComments(e, trackId) {
        e.stopPropagation();
        setOpenCommentTrack(prev => prev === trackId ? null : trackId);
    }

    if (loading) return (
        <AppShell role={shellRole}>
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-ink-mute)' }}>A carregar…</div>
        </AppShell>
    );

    if (error || !artist) return (
        <AppShell role={shellRole}>
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-danger)' }}>
                {error || 'Artista não encontrado.'}
            </div>
        </AppShell>
    );

    if (artist.userId) return <Navigate to={`/users/${artist.userId}`} replace />;

    const activeTab      = TABS[active];
    const hue            = artist.hue ?? 320;
    const coverGradient  = `linear-gradient(120deg, oklch(0.42 0.16 ${hue}), oklch(0.40 0.15 ${(hue + 60) % 360}))`;

    const about = {
        location:  artist.city ?? null,
        genre:     Array.isArray(artist.genres) && artist.genres.length > 0
                       ? artist.genres.join(' · ')
                       : (artist.genre ?? null),
        languages: Array.isArray(artist.languages) && artist.languages.length > 0
                       ? artist.languages.join(', ')
                       : null,
        forHire:   false,
    };
    const social = Array.isArray(artist.links) ? artist.links : [];

    const localQueue = localTracks.map(tr => ({
        id:          tr.id,
        name:        tr.title,
        artistName:  artist.name,
        coverUrl:    tr.coverUrl,
        durationMs:  tr.durationMs,
        audioUrl:    tr.audioUrl,
        source:      'upload',
        playContext: 'artist',
    }));

    const stats = [
        { v: followers != null ? followers.toLocaleString('pt-PT') : '—', l: 'Seguidores' },
        { v: artist.tracksCount != null ? artist.tracksCount : '—',       l: 'Faixas' },
    ];

    function TracksList({ nameKey = 'title' }) {
        return (
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
                                    ? <img src={t.coverUrl} alt={t[nameKey]} className="strack__cover" />
                                    : <div className="strack__cover strack__cover--placeholder" />
                                }
                                <div className="strack__info">
                                    <div className="strack__title">{t[nameKey]}</div>
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
                                    <TrackComments trackId={t.id} trackTitle={t[nameKey]} />
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ul>
        );
    }

    function SpotifyList() {
        return (
            <ul className="strack-list">
                {topTracks.map((t, i) => {
                    const isPlaying = currentTrack?.spotifyId === t.spotifyId;
                    return (
                        <li
                            key={t.spotifyId ?? i}
                            className={'strack strack--playable' + (isPlaying ? ' is-playing' : '')}
                            onClick={() => setTrack(
                                { spotifyId: t.spotifyId, name: t.name, artistName: artist.name, coverUrl: t.coverUrl, durationMs: t.durationMs, spotifyUrl: t.spotifyUrl, source: 'spotify', playContext: 'artist' },
                                topTracks.map(tr => ({ spotifyId: tr.spotifyId, name: tr.name, artistName: artist.name, coverUrl: tr.coverUrl, durationMs: tr.durationMs, spotifyUrl: tr.spotifyUrl, source: 'spotify', playContext: 'artist' }))
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
        );
    }

    function ReleasesGrid({ full = false }) {
        return (
            <div className={`rel-grid${full ? ' rel-grid--full' : ''}`}>
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
        );
    }

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
                    <div className="prof__avatar prof__avatar--artist">
                        {artist.imageUrl
                            ? <img src={artist.imageUrl} alt={artist.name} className="prof__avatar-img" />
                            : <div style={{
                                width: '100%', height: '100%',
                                background: 'var(--color-bg-2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 'var(--fs-3xl)', fontWeight: 'var(--fw-bold)',
                                color: 'var(--color-ink-mute)',
                              }}>
                                {artist.name?.[0]?.toUpperCase() ?? '?'}
                              </div>
                        }
                    </div>

                    <div className="prof__identity">
                        <div className="prof__name-row">
                            <h1 className="prof__name">{artist.name}</h1>
                            {artist.genre && (
                                <span className="prof__level-chip">{artist.genre}</span>
                            )}
                        </div>
                        <div className="prof__meta">
                            {artist.city && <span>{artist.city}</span>}
                        </div>
                    </div>

                    <div className="prof__actions">
                        <button
                            type="button"
                            className={following ? 'btn-ghost' : 'btn-primary'}
                            style={{ padding: '10px 18px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 7 }}
                            onClick={async () => {
                                const next = !following;
                                try {
                                    const res = await fetch(`${API}/api/artist-follows/${id}`, {
                                        method: next ? 'POST' : 'DELETE',
                                        headers: { Authorization: `Bearer ${getToken()}` },
                                    });
                                    if (!res.ok) throw new Error();
                                    const data = await res.json();
                                    setFollowers(data.followers);
                                    setFollowing(data.following ?? next);
                                    showToast(next ? `A seguir ${artist.name}` : `Deixaste de seguir ${artist.name}`);
                                } catch {
                                    showToast('Erro ao atualizar follow', 'error');
                                }
                            }}
                        >
                            {following
                                ? <><FaUserCheck size={13} /> A seguir</>
                                : <><FaUserPlus  size={13} /> Seguir</>
                            }
                        </button>
                    </div>
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
                    {TABS.map((label, i) => (
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

                    {/* Visão geral */}
                    {activeTab === 'Visão geral' && (
                        <div className="prof__grid">
                            <div>
                                <div className="prof-card prof__section-gap">
                                    {localTracks.length > 0 && (
                                        <>
                                            <CardTitle>Faixas · {localTracks.length}</CardTitle>
                                            <TracksList />
                                        </>
                                    )}
                                    {topTracks.length > 0 && (
                                        <div style={localTracks.length > 0 ? { marginTop: 24 } : undefined}>
                                            <CardTitle>
                                                <span>Top via Spotify · {topTracks.length}</span>
                                                <span className="strack-source"><SiSpotify size={12} style={{ color: '#1DB954' }} /> via Spotify</span>
                                            </CardTitle>
                                            <SpotifyList />
                                        </div>
                                    )}
                                    {localTracks.length === 0 && topTracks.length === 0 && (
                                        <p className="prof__bio user-detail__empty">Sem faixas disponíveis.</p>
                                    )}
                                </div>
                                {releases.length > 0 && (
                                    <div className="prof-card prof__section-gap">
                                        <CardTitle>Lançamentos · {releases.length}</CardTitle>
                                        <ReleasesGrid />
                                    </div>
                                )}
                            </div>
                            <div className="prof__col-side">
                                <ArtistAbout artist={{ bio: artist.bio, about }} />
                                <ArtistLinks social={social} />
                            </div>
                        </div>
                    )}

                    {/* Faixas */}
                    {activeTab === 'Faixas' && (
                        <div className="prof-card">
                            {localTracks.length > 0 && (
                                <>
                                    <CardTitle>Faixas publicadas · {localTracks.length}</CardTitle>
                                    <TracksList />
                                </>
                            )}
                            {topTracks.length > 0 && (
                                <div style={localTracks.length > 0 ? { marginTop: 24 } : undefined}>
                                    <CardTitle>
                                        <span>Top via Spotify · {topTracks.length}</span>
                                        <span className="strack-source">
                                            <SiSpotify size={12} style={{ color: '#1DB954' }} />
                                            via Spotify
                                        </span>
                                    </CardTitle>
                                    <SpotifyList />
                                </div>
                            )}
                            {localTracks.length === 0 && topTracks.length === 0 && (
                                <p className="prof__bio user-detail__empty">Sem faixas disponíveis.</p>
                            )}
                        </div>
                    )}

                    {/* Lançamentos */}
                    {activeTab === 'Lançamentos' && (
                        <div className="prof-card">
                            {releases.length > 0 ? (
                                <>
                                    <CardTitle>Lançamentos · {releases.length}</CardTitle>
                                    <ReleasesGrid full />
                                </>
                            ) : (
                                <p className="prof__bio user-detail__empty">Sem lançamentos publicados.</p>
                            )}
                        </div>
                    )}

                    {/* Sobre */}
                    {activeTab === 'Sobre' && (
                        <div className="prof__grid">
                            <ArtistAbout artist={{ bio: artist.bio, about }} />
                            <div className="prof__col-side">
                                <ArtistLinks social={social} />
                            </div>
                        </div>
                    )}

                    {/* Conquistas */}
                    {activeTab === 'Conquistas' && (
                        <div className="prof-card">
                            <p className="prof__bio user-detail__empty">Sem conquistas ainda.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
