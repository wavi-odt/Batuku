import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaUserPlus, FaUserCheck, FaPlay } from 'react-icons/fa'
import { SiSpotify } from 'react-icons/si'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import { CardTitle } from '../profile/ProfileBlocks'
import { usePlayer } from '../../../context/PlayerContext'
import '../profile/Profile.css'
import '../DetailPage.css'

const TABS = ['Faixas', 'Sobre'];

function fmtMs(ms) {
    if (!ms) return '—';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function ArtistDetail() {
    const { id } = useParams();
    const shellRole = getRole() === 'artist' ? 'artist' : 'fan';

    const [artist,    setArtist]    = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState('');
    const [active,    setActive]    = useState(0);
    const [following, setFollowing] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [topTracks, setTopTracks] = useState([]);
    const { track: currentTrack, setTrack } = usePlayer();

    useEffect(() => {
        const auth = { headers: { Authorization: `Bearer ${getToken()}` } };
        Promise.all([
            fetch(`http://localhost:8080/api/artists/${id}`, auth),
            fetch(`http://localhost:8080/api/artist-follows/${id}/status`, auth),
            fetch(`http://localhost:8080/api/artists/${id}/top-tracks?market=PT`, auth),
        ])
            .then(([artistRes, statusRes, topRes]) => Promise.all([
                artistRes.ok ? artistRes.json() : Promise.reject(new Error(`Erro ${artistRes.status}`)),
                statusRes.ok ? statusRes.json() : Promise.resolve(null),
                topRes.ok ? topRes.json() : Promise.resolve([]),
            ]))
            .then(([artistData, statusData, topData]) => {
                setArtist(artistData);
                setFollowing(statusData?.following ?? artistData.isFollowing ?? false);
                setFollowers(statusData?.followers ?? artistData.followers ?? 0);
                setTopTracks(Array.isArray(topData) ? topData : []);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

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

    const hue           = artist.hue ?? 320;
    const coverGradient = `linear-gradient(120deg, oklch(0.42 0.16 ${hue}), oklch(0.40 0.15 ${(hue + 60) % 360}))`;

    const stats = [
        { v: followers != null ? followers.toLocaleString('pt-PT') : '—', l: 'Seguidores' },
        { v: artist.tracksCount != null ? artist.tracksCount : '—',       l: 'Faixas' },
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
                                    const res = await fetch(`http://localhost:8080/api/artist-follows/${id}`, {
                                        method: next ? 'POST' : 'DELETE',
                                        headers: { Authorization: `Bearer ${getToken()}` },
                                    });
                                    if (!res.ok) throw new Error();
                                    const data = await res.json();
                                    setFollowers(data.followers);
                                    setFollowing(data.following ?? next);
                                } catch { /* mantém estado */ }
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

                    {/* Faixas */}
                    {active === 0 && (
                        <div className="prof-card">
                            {topTracks.length > 0 ? (
                                <>
                                    <CardTitle>
                                        <span>Top Faixas · {topTracks.length}</span>
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
                                                            artistName: artist.name,
                                                            coverUrl:   t.coverUrl,
                                                            durationMs: t.durationMs,
                                                            spotifyUrl: t.spotifyUrl,
                                                            source:     'spotify',
                                                        },
                                                        topTracks.map(tr => ({
                                                            spotifyId:  tr.spotifyId,
                                                            name:       tr.name,
                                                            artistName: artist.name,
                                                            coverUrl:   tr.coverUrl,
                                                            durationMs: tr.durationMs,
                                                            spotifyUrl: tr.spotifyUrl,
                                                            source:     'spotify',
                                                        }))
                                                    )}
                                                >
                                                    <div className="strack__num-wrap">
                                                        <span className="strack__num">{i + 1}</span>
                                                        <span className="strack__play-icon">
                                                            <FaPlay size={11} />
                                                        </span>
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
                                </>
                            ) : artist.tracks?.length > 0 ? (
                                <>
                                    <CardTitle>Faixas populares · {artist.tracks.length}</CardTitle>
                                    <ul className="detail-track-list">
                                        {artist.tracks.map((t, i) => (
                                            <li key={t.id ?? i} className="detail-track-item">
                                                <span className="detail-track-item__num">{i + 1}</span>
                                                {t.imageUrl && (
                                                    <img src={t.imageUrl} alt={t.title} className="detail-track-item__img" />
                                                )}
                                                <div className="detail-track-item__info">
                                                    <div className="detail-track-item__title">{t.title}</div>
                                                    {t.plays != null && (
                                                        <div className="detail-track-item__artist">
                                                            {t.plays.toLocaleString('pt-PT')} reproduções
                                                        </div>
                                                    )}
                                                </div>
                                                {t.duration && (
                                                    <span className="detail-track-item__dur">{t.duration}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className="prof__bio user-detail__empty">Sem faixas disponíveis.</p>
                            )}
                        </div>
                    )}

                    {/* Sobre */}
                    {active === 1 && (
                        <div className="prof-card">
                            <CardTitle>Sobre</CardTitle>
                            {artist.bio
                                ? <p className="prof__bio">{artist.bio}</p>
                                : <p className="prof__bio user-detail__empty">Sem descrição.</p>
                            }
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
