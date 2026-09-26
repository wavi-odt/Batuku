import { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FaTrophy, FaUserPlus, FaUserCheck, FaPlay, FaMusic, FaGlobe, FaUser } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { useToast } from '../../../context/ToastContext'
import { CardTitle, BadgesGrid, GenreBars } from '../profile/ProfileBlocks'
import '../profile/Profile.css'
import '../DetailPage.css'
import '../fan/library/Library.css'

const TABS = ['Visão geral', 'Playlists', 'Conquistas', 'A seguir'];

const GENRE_HUES = {
    'funaná': 14, 'morna': 220, 'coladeira': 42,
    'cabo love': 145, 'kizomba': 280, 'tabanka': 8,
    'batuque': 340, 'kola': 195, 'zouk': 260,
    'semba': 30, 'kuduro': 60, 'afrobeat': 22,
};

function tierFromPoints(pts) {
    if (pts <= 200)  return 'coral';
    if (pts <= 500)  return 'ocean';
    if (pts <= 700)  return 'mustard';
    if (pts <= 1000) return 'gold';
    if (pts <= 2000) return 'green';
    return 'pink';
}

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const shellRole = getRole() === 'artist' ? 'artist' : 'fan';
    const { showToast } = useToast();
    const currentUser = useCurrentUser();

    const [user,             setUser]             = useState(null);
    const [loading,          setLoading]          = useState(true);
    const [error,            setError]            = useState('');
    const [searchParams, setSearchParams]         = useSearchParams();
    const active    = parseInt(searchParams.get('tab') ?? '0', 10) || 0;
    const setActive = (val) => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('tab', String(val)); return p });
    const [following,        setFollowing]        = useState(false);
    const [followers,        setFollowers]        = useState(0);
    const [publicPlaylists,  setPublicPlaylists]  = useState([]);
    const [followingArtists, setFollowingArtists] = useState([]);
    const [userTopGenres,    setUserTopGenres]    = useState([]);
    const [userRecentTracks, setUserRecentTracks] = useState([]);

    useEffect(() => {
        const auth = { headers: { Authorization: `Bearer ${getToken()}` } };
        setLoading(true);
        setActive(0);

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, auth)
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(async data => {
                if (data.artistProfileId) {
                    navigate(`/artists/${data.artistProfileId}`, { replace: true })
                    return
                }
                setUser(data);
                setFollowing(data.isFollowing ?? false);
                setFollowers(data.followers ?? 0);

                const safeArr = r => r.ok ? r.json() : [];
                const base = import.meta.env.VITE_API_BASE_URL;
                const [pls, followed, genres, recent] = await Promise.all([
                    fetch(`${base}/api/playlists/user/${id}`,        auth).then(safeArr).catch(() => []),
                    fetch(`${base}/api/artist-follows/user/${id}`,   auth).then(safeArr).catch(() => []),
                    fetch(`${base}/api/users/${id}/top-genres`,      auth).then(safeArr).catch(() => []),
                    fetch(`${base}/api/users/${id}/recently-played`, auth).then(safeArr).catch(() => []),
                ]);
                setPublicPlaylists(Array.isArray(pls)     ? pls     : []);
                setFollowingArtists(Array.isArray(followed) ? followed : []);
                setUserTopGenres(Array.isArray(genres) ? genres.map((g, i) => ({
                    name: g.name,
                    pct:  g.pct,
                    hue:  GENRE_HUES[g.name.toLowerCase()] ?? (i * 55 + 14),
                })) : []);
                setUserRecentTracks(Array.isArray(recent) ? recent : []);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    async function toggleFollow() {
        const next = !following;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/follows/${id}`, {
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

    const isMe       = currentUser?.id != null && String(currentUser.id) === String(id);
    const safeActive = Math.min(active, TABS.length - 1);
    const activeTab  = TABS[safeActive];

    const badges = (user.badges ?? []).map(b => ({
        id:   b.id,
        icon: b.iconUrl,
        name: b.name,
        desc: b.description,
        xp:   b.pointsRequired,
        tier: b.got ? tierFromPoints(b.pointsRequired) : 'locked',
        got:  b.got,
        meta: b.got
            ? (b.earnedAt ? new Date(b.earnedAt).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' }) : '')
            : `${(user.points ?? 0).toLocaleString('pt-PT')} / ${b.pointsRequired.toLocaleString('pt-PT')} pts`,
    }));

    const stats = [
        { v: (user.points ?? 0).toLocaleString('pt-PT'),      l: 'Pontos' },
        { v: user.rank != null ? '#' + user.rank : '',          l: 'Rank semanal' },
        { v: user.badgesCount ?? 0,                            l: 'Badges' },
        { v: (user.following ?? 0).toLocaleString('pt-PT'),    l: 'A seguir' },
        { v: followers.toLocaleString('pt-PT'),                l: 'Seguidores' },
    ];

    return (
        <AppShell role={shellRole}>
            <div style={{ marginTop: -8 }}>

                {/* ── Cover ─────────────────────────────────────────────── */}
                <div className="prof__cover">
                    <div className="prof__cover-art" style={{ background: 'linear-gradient(120deg, oklch(0.42 0.16 285), oklch(0.40 0.15 220))' }} />
                    <div className="prof__cover-grad" />
                </div>

                {/* ── Header ────────────────────────────────────────────── */}
                <div className="prof__header">
                    <div className="prof__avatar">
                        {user.imageUrl
                            ? <img src={user.imageUrl} alt={user.name} className="prof__avatar-img" />
                            : <div className="prof__avatar-placeholder"><FaUser size={32} /></div>
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
                            {user.handle   && <span className="prof__meta-handle">{user.handle}</span>}
                            {user.location && <><span className="prof__meta-dot" /><span>{user.location}</span></>}
                            {user.joined   && <><span className="prof__meta-dot" /><span>Membro desde {user.joined}</span></>}
                        </div>
                    </div>

                    {!isMe && (
                        <div className="prof__actions">
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
                        </div>
                    )}
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
                            className={'prof__tab' + (i === safeActive ? ' is-active' : '')}
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
                                {badges.length > 0 && (
                                    <div className="prof-card prof__section-gap">
                                        <CardTitle link={`${badges.filter(b => b.got).length} de ${badges.length}`}>
                                            Conquistas
                                        </CardTitle>
                                        <BadgesGrid badges={badges.slice(0, 4)} />
                                    </div>
                                )}
                                <div className="prof-card">
                                    <CardTitle>Playlists</CardTitle>
                                    {publicPlaylists.length > 0
                                        ? <div className="lib__playlist-grid" style={{ marginTop: 14 }}>
                                            {publicPlaylists.slice(0, 4).map(pl => (
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
                                        : <p className="prof__bio user-detail__empty">Sem playlists públicas.</p>
                                    }
                                </div>
                            </div>

                            <div className="prof__col-side">
                                {userTopGenres.length > 0 && (
                                    <div className="prof-card">
                                        <CardTitle>Géneros preferidos</CardTitle>
                                        <GenreBars genres={userTopGenres} />
                                    </div>
                                )}
                                {followingArtists.length > 0 && (
                                    <div className="prof-card">
                                        <CardTitle>A seguir</CardTitle>
                                        <div className="prof-following prof-following--compact">
                                            {followingArtists.slice(0, 6).map(a => (
                                                <Link key={a.id} to={`/artists/${a.id}`} className="follow-card">
                                                    <div className="follow-card__avatar">
                                                        {a.avatarUrl
                                                            ? <img src={a.avatarUrl} alt={a.name} className="follow-card__avatar-img" />
                                                            : <div className="follow-card__avatar-empty"><FaUser size={20} /></div>
                                                        }
                                                    </div>
                                                    <div className="follow-card__name">{a.name}</div>
                                                    {a.genre && <div className="follow-card__genre">{a.genre}</div>}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {userRecentTracks.length > 0 && (
                                    <div className="prof-card">
                                        <CardTitle>Ouvido recentemente</CardTitle>
                                        {userRecentTracks.slice(0, 5).map(t => (
                                            <div key={t.trackId} className="playlist-item prof-recent">
                                                <div className="playlist-item__cover prof-recent__cover">
                                                    {t.coverUrl
                                                        ? <img src={t.coverUrl} alt={t.title} className="playlist-item__cover-img" />
                                                        : <div className="playlist-item__cover-empty"><FaMusic size={12} /></div>
                                                    }
                                                </div>
                                                <div>
                                                    <div className="playlist-item__name prof-recent__name">{t.title}</div>
                                                    <div className="playlist-item__count">{t.artistName}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
                                {userTopGenres.length > 0 && (
                                    <div className="prof-card">
                                        <CardTitle>Géneros preferidos</CardTitle>
                                        <GenreBars genres={userTopGenres} />
                                    </div>
                                )}
                                {userRecentTracks.length > 0 && (
                                    <div className="prof-card">
                                        <CardTitle>Ouvido recentemente</CardTitle>
                                        {userRecentTracks.slice(0, 5).map(t => (
                                            <div key={t.trackId} className="playlist-item prof-recent">
                                                <div className="playlist-item__cover prof-recent__cover">
                                                    {t.coverUrl
                                                        ? <img src={t.coverUrl} alt={t.title} className="playlist-item__cover-img" />
                                                        : <div className="playlist-item__cover-empty"><FaMusic size={12} /></div>
                                                    }
                                                </div>
                                                <div>
                                                    <div className="playlist-item__name prof-recent__name">{t.title}</div>
                                                    <div className="playlist-item__count">{t.artistName}</div>
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

                    {/* A seguir */}
                    {activeTab === 'A seguir' && (
                        <div className="prof-card">
                            <CardTitle>A seguir · {followingArtists.length}</CardTitle>
                            {followingArtists.length === 0
                                ? <p className="prof__bio user-detail__empty">Ainda não segue nenhum artista.</p>
                                : <div className="prof-following">
                                    {followingArtists.map(a => (
                                        <Link key={a.id} to={`/artists/${a.id}`} className="follow-card">
                                            <div className="follow-card__avatar">
                                                {a.avatarUrl
                                                    ? <img src={a.avatarUrl} alt={a.name} className="follow-card__avatar-img" />
                                                    : <div className="follow-card__avatar-empty"><FaUser size={20} /></div>
                                                }
                                            </div>
                                            <div className="follow-card__name">{a.name}</div>
                                            {a.genre && <div className="follow-card__genre">{a.genre}</div>}
                                        </Link>
                                    ))}
                                  </div>
                            }
                        </div>
                    )}

                </div>
            </div>
        </AppShell>
    );
}
