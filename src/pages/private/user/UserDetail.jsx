import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaTrophy, FaUserPlus, FaUserCheck } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import ArtistArtwork from '../../../components/PublicComponets/ArtistArtwork'
import { getToken, getRole } from '../../../utils/auth.js'
import {
    CardTitle, BadgesGrid, PlaylistGrid, ActivityList, GenreBars,
} from '../profile/ProfileBlocks'
import '../profile/Profile.css'

const TABS = ['Playlists', 'Conquistas', 'Atividade'];

/* Normaliza dados da API para o shape esperado pelos ProfileBlocks */
function toPlaylist(p) {
    return { ...p, image: p.imageUrl ?? null, shape: p.shape ?? 'circles', hue: p.hue ?? 220, tracks: p.trackCount ?? p.tracks ?? 0 };
}
function toTrack(t) {
    return { ...t, image: t.imageUrl ?? null, shape: t.shape ?? 'arch', hue: t.hue ?? 200 };
}

export default function UserDetail() {
    const { id } = useParams();
    const shellRole = getRole() === 'artist' ? 'artist' : 'fan';

    const [user,      setUser]      = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState('');
    const [active,    setActive]    = useState(0);
    const [following,  setFollowing]  = useState(false);
    const [followers,  setFollowers]  = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8080/api/users/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(data => {
                setUser(data);
                setFollowing(data.isFollowing ?? false);
                setFollowers(data.followers ?? 0);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    async function toggleFollow() {
        const next = !following;
        try {
            const res = await fetch(`http://localhost:8080/api/follows/${id}`, {
                method: next ? 'POST' : 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFollowers(data.followers);
            setFollowing(next);
        } catch {
            // não altera o estado se o servidor falhar
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

    const hue            = user.avatar?.hue ?? 285;
    const coverGradient  = `linear-gradient(120deg, oklch(0.42 0.16 ${hue}), oklch(0.40 0.15 ${(hue + 60) % 360}))`;
    const playlists      = (user.playlists      ?? []).map(toPlaylist);
    const recentlyPlayed = (user.recentlyPlayed ?? []).map(toTrack);
    const badges         = user.badges    ?? [];
    const activity       = user.activity  ?? [];
    const topGenres      = user.topGenres ?? [];

    const stats = [
        { v: user.points    != null ? user.points.toLocaleString('pt-PT') : '—', l: 'Pontos' },
        { v: user.rank      != null ? '#' + user.rank : '—',                     l: 'Rank semanal' },
        { v: user.badgesCount ?? '—',                                             l: 'Badges' },
        { v: user.following ?? '—',                                                       l: 'A seguir' },
        { v: followers != null ? followers.toLocaleString('pt-PT') : '—',            l: 'Seguidores' },
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

                    {/* Playlists */}
                    {active === 0 && (
                        playlists.length > 0 ? (
                            <div className="prof__grid">
                                <div>
                                    {user.bio && (
                                        <div className="prof-card prof__section-gap">
                                            <CardTitle>Sobre</CardTitle>
                                            <p className="prof__bio">{user.bio}</p>
                                        </div>
                                    )}
                                    <div className="prof-card">
                                        <CardTitle>Playlists · {playlists.length}</CardTitle>
                                        <PlaylistGrid playlists={playlists} />
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
                        ) : (
                            <>
                                {user.bio && (
                                    <div className="prof-card prof__section-gap">
                                        <CardTitle>Sobre</CardTitle>
                                        <p className="prof__bio">{user.bio}</p>
                                    </div>
                                )}
                                <div className="prof-card">
                                    <p className="prof__bio user-detail__empty">Sem playlists públicas.</p>
                                </div>
                            </>
                        )
                    )}

                    {/* Conquistas */}
                    {active === 1 && (
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
                    {active === 2 && (
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
