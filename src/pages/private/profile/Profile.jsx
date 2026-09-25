/* ─────────────────────────────────────────────────────────────────
   pages/profile/Profile.jsx, Página "O meu perfil" (Fã + Artista).

   Tabs funcionais; cada painel lê de data/profile.js.
   Recebe `role` por prop (default 'fan'). Quando ligares o backend,
   passa o role do utilizador autenticado e troca o import dos mocks
   por um fetch que devolva o mesmo shape (ver data/profile.js).
   ───────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaTrophy, FaCheckCircle, FaCamera, FaCog, FaUser } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import { profileData } from '../../../data/profile'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { API, getToken } from '../../../utils/auth.js'
import {
    FanOverview, FanPlaylists, FanAchievements, FanFollowing,
} from './FanPanels'
import {
    ArtistOverview, ArtistTracks, ArtistAboutPanel, ArtistReleases,
} from './ArtistPanels'
import AvatarUploader from './AvatarUploader'
import EditProfileModal from './EditProfileModal'
import './Profile.css'

/* ─── Gamificação ─────────────────────────────────────────────────── */
function tierFromPoints(pts) {
    if (pts <= 200)  return 'coral';
    if (pts <= 500)  return 'ocean';
    if (pts <= 700)  return 'mustard';
    if (pts <= 1000) return 'gold';
    if (pts <= 2000) return 'green';
    return 'pink';
}

function formatEarned(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ─── Tab maps ────────────────────────────────────────────────────── */
const FAN_TABS = [
    { label: 'Visão geral', Panel: FanOverview },
    { label: 'Playlists',   Panel: FanPlaylists },
    { label: 'Conquistas',  Panel: FanAchievements },
    { label: 'A seguir',    Panel: FanFollowing },
];

const ARTIST_TABS = [
    { label: 'Visão geral',  Panel: ArtistOverview },
    { label: 'Faixas',       Panel: ArtistTracks },
    { label: 'Lançamentos',  Panel: ArtistReleases },
    { label: 'Sobre',        Panel: ArtistAboutPanel },
];

/* ─── Header ──────────────────────────────────────────────────────── */
function ProfileHeader({ role, data, avatarUrl, onAvatarEdit, onEditProfile }) {
    const isArtist = role === 'artist';
    return (
        <>
            <div className={'prof__cover' + (isArtist ? ' prof__cover--artist' : '')}>
                <div
                    className="prof__cover-art"
                    style={{
                        background: isArtist
                            ? 'linear-gradient(120deg, oklch(0.45 0.17 14), oklch(0.40 0.13 42))'
                            : 'linear-gradient(120deg, oklch(0.42 0.16 285), oklch(0.40 0.15 220))',
                    }}
                />
                <div className="prof__cover-grad" />
                <button type="button" className="prof__cover-edit"><FaCog size={13} /> Editar capa</button>
            </div>

            <div className="prof__header">
                <div
                    className={'prof__avatar' + (isArtist ? ' prof__avatar--artist' : '')}
                    role="button"
                    tabIndex={0}
                    onClick={onAvatarEdit}
                    onKeyDown={e => e.key === 'Enter' && onAvatarEdit()}
                    title="Alterar avatar"
                    style={{ cursor: 'pointer' }}
                >
                    {avatarUrl
                        ? <img src={avatarUrl} alt="Avatar" className="prof__avatar-img" />
                        : <div className="prof__avatar-placeholder"><FaUser size={32} /></div>
                    }
                    <span className="prof__avatar-edit"><FaCamera size={13} /></span>
                </div>

                <div className="prof__identity">
                    <div className="prof__name-row">
                        <h1 className="prof__name">{data.name}</h1>
                        {isArtist
                            ? <span className="prof__verified"><FaCheckCircle size={12} /> Verificado</span>
                            : <span className="prof__level-chip"><FaTrophy size={11} /> Nível {data.level}</span>}
                    </div>
                    <div className="prof__meta">
                        <span className="prof__meta-handle">{data.handle}</span>
                        {(isArtist ? data.about?.genre : data.country) && (
                            <><span className="prof__meta-dot" /><span>{isArtist ? data.about.genre : data.country}</span></>
                        )}
                        {data.location && (
                            <><span className="prof__meta-dot" /><span>{data.location}</span></>
                        )}
                        {data.joined && (
                            <><span className="prof__meta-dot" /><span>Membro desde {data.joined}</span></>
                        )}
                    </div>
                </div>

                <div className="prof__actions">
                    {isArtist && (
                        <button type="button" className="btn-ghost" style={{ padding: '10px 16px', fontSize: 14 }}>
                            Ver como público
                        </button>
                    )}
                    <button type="button" className="btn-primary" style={{ padding: '10px 18px', fontSize: 14 }} onClick={onEditProfile}>
                        <FaCog size={14} /> Editar perfil
                    </button>
                </div>
            </div>
        </>
    );
}

/* ─── Stats strip ─────────────────────────────────────────────────── */
function ProfileStats({ role, data }) {
    const stats = role === 'artist'
        ? [
            { v: data.followers.toLocaleString('pt-PT'), l: 'Seguidores' },
            { v: data.monthlyListeners.toLocaleString('pt-PT'), l: 'Ouvintes/mês' },
            { v: data.tracksPublished, l: 'Faixas' },
        ]
        : [
            { v: data.points.toLocaleString('pt-PT'), l: 'Pontos' },
            { v: '#' + data.rank, l: 'Rank semanal' },
            { v: data.badgesCount, l: 'Badges' },
            { v: data.following, l: 'A seguir' },
            { v: data.followers, l: 'Seguidores' },
        ];

    return (
        <div className="prof__stats">
            {stats.map((s, i) => (
                <div key={i} className="prof__stat">
                    <div className="prof__stat-v">{s.v}</div>
                    <div className="prof__stat-l">{s.l}</div>
                </div>
            ))}
        </div>
    );
}


/* ─── Page ────────────────────────────────────────────────────────── */
export default function Profile({ role = 'fan' }) {
    const tabs    = role === 'artist' ? ARTIST_TABS : FAN_TABS;
    const mock    = role === 'artist' ? profileData.artist : profileData.fan;
    const realUser = useCurrentUser();

    const [searchParams, setSearchParams]   = useSearchParams()
    const active    = parseInt(searchParams.get('tab') ?? '0', 10) || 0
    const setActive = (val) => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('tab', String(val)); return p })
    const [avatarUrl, setAvatarUrl]         = useState(null);
    const [showUploader, setShowUploader]   = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userOverrides, setUserOverrides] = useState({});
    const [artistMe, setArtistMe]           = useState(null);
    const [realStats, setRealStats]         = useState({ followers: null, following: null, tracksPublished: null, monthlyListeners: null });
    const [gamifProfile, setGamifProfile]   = useState(null);
    const [allBadges,    setAllBadges]      = useState([]);

    useEffect(() => {
        if (realUser?.picture) setAvatarUrl(realUser.picture);
    }, [realUser?.picture]);

    useEffect(() => {
        const token = getToken();
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        Promise.all([
            fetch(`${API}/api/gamification/me`,     { headers }).then(r => r.ok ? r.json() : null),
            fetch(`${API}/api/gamification/badges`, { headers }).then(r => r.ok ? r.json() : []),
        ]).then(([prof, badges]) => {
            setGamifProfile(prof);
            setAllBadges(Array.isArray(badges) ? badges : []);
        }).catch(() => {});
    }, []);

    function refreshArtistMe() {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch(`${API}/api/artists/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(me => { if (me) setArtistMe(me); })
            .catch(() => {});
    }

    useEffect(() => {
        if (role !== 'artist') return;
        refreshArtistMe();
    }, [role]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        if (role === 'artist' && artistMe?.id) {
            Promise.all([
                fetch(`${API}/api/artist-follows/${artistMe.id}/status`, { headers }).then(r => r.ok ? r.json() : null),
                fetch(`${API}/api/tracks/artist/${artistMe.id}`, { headers }).then(r => r.ok ? r.json() : null),
                fetch(`${API}/api/artists/${artistMe.id}`, { headers }).then(r => r.ok ? r.json() : null),
            ]).then(([followStatus, tracks, artistDetail]) => {
                setRealStats(prev => ({
                    ...prev,
                    ...(followStatus?.followers        != null && { followers:        followStatus.followers }),
                    ...(Array.isArray(tracks)                 && { tracksPublished:   tracks.length }),
                    ...(artistDetail?.monthlyListeners != null && { monthlyListeners: artistDetail.monthlyListeners }),
                }));
            }).catch(() => {});
        } else if (role === 'fan' && realUser?.id) {
            fetch(`${API}/api/users/${realUser.id}`, { headers })
                .then(r => r.ok ? r.json() : null)
                .then(userData => {
                    if (!userData) return;
                    setRealStats(prev => ({
                        ...prev,
                        ...(userData.followers != null && { followers: userData.followers }),
                        ...(userData.following != null && { following: userData.following }),
                    }));
                }).catch(() => {});
        }
    }, [role, artistMe?.id, realUser?.id]);

    const earnedIds  = new Set((gamifProfile?.badges ?? []).map(b => b.id));
    const earnedMap  = Object.fromEntries((gamifProfile?.badges ?? []).map(b => [b.id, b]));
    const realBadges = allBadges.length > 0
        ? allBadges.map(b => {
            const got    = earnedIds.has(b.id);
            const earned = earnedMap[b.id];
            return {
                id:   b.id,
                icon: b.iconUrl,
                name: b.name,
                desc: b.description,
                xp:   b.pointsRequired,
                tier: got ? tierFromPoints(b.pointsRequired) : 'locked',
                got,
                meta: got
                    ? formatEarned(earned?.earnedAt)
                    : `${(gamifProfile?.totalPoints ?? 0).toLocaleString('pt-PT')} / ${b.pointsRequired.toLocaleString('pt-PT')} pts`,
            };
        })
        : null;

    const artistAbout = role === 'artist' ? {
        location:  artistMe?.location                            || null,
        genre:     artistMe?.genres?.length ? artistMe.genres.join(' · ')       : null,
        languages: artistMe?.languages?.length ? artistMe.languages.join(', ')  : null,
        forHire:   false,
    } : {};

    const data = {
        ...mock,
        ...(realUser?.name     && { name:     realUser.name }),
        ...(realUser?.handle   && { handle:   realUser.handle }),
        ...(realUser?.joined   && { joined:   realUser.joined }),
        ...(role === 'artist'
            ? {
                bio:      artistMe?.bio      ?? null,
                location: artistMe?.location ?? null,
                about:    artistAbout,
                social:   (artistMe?.links ?? []).map(l => ({ kind: l.kind, handle: l.handle })),
                ...(realStats.followers        != null && { followers:        realStats.followers }),
                ...(realStats.tracksPublished  != null && { tracksPublished:  realStats.tracksPublished }),
                ...(realStats.monthlyListeners != null && { monthlyListeners: realStats.monthlyListeners }),
            }
            : {
                ...(realUser?.bio      && { bio:      realUser.bio }),
                ...(realUser?.location && { country: realUser.location, location: realUser.location }),
                ...(realStats.followers != null && { followers: realStats.followers }),
                ...(realStats.following != null && { following: realStats.following }),
            }
        ),
        ...(realBadges   && { badges:      realBadges }),
        ...(gamifProfile && {
            points:      gamifProfile.totalPoints,
            rank:        gamifProfile.rank,
            badgesCount: (gamifProfile.badges ?? []).length,
        }),
        spotifyArtistId:  realUser?.spotifyArtistId  ?? null,
        artistProfileId:  realUser?.artistProfileId  ?? null,
        ...userOverrides,
    };

    const safeActive  = Math.min(active, tabs.length - 1);
    const ActivePanel = tabs[safeActive].Panel;

    return (
        <AppShell role={role}>
            <div style={{ marginTop: -8 }}>
                <ProfileHeader
                    role={role}
                    data={data}
                    avatarUrl={avatarUrl}
                    onAvatarEdit={() => setShowUploader(true)}
                    onEditProfile={() => setShowEditModal(true)}
                />
                <ProfileStats role={role} data={data} />

                <div className="prof__tabs">
                    {tabs.map((t, i) => (
                        <button
                            key={t.label}
                            type="button"
                            className={'prof__tab' + (i === safeActive ? ' is-active' : '')}
                            onClick={() => setActive(i)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="prof__body">
                    <ActivePanel
                        fan={role === 'fan' ? data : undefined}
                        artist={role === 'artist' ? data : undefined}
                    />
                </div>
            </div>

            {showUploader && (
                <AvatarUploader
                    currentAvatarUrl={avatarUrl}
                    isArtist={role === 'artist'}
                    onSuccess={url => setAvatarUrl(url)}
                    onClose={() => setShowUploader(false)}
                />
            )}

            {showEditModal && (
                <EditProfileModal
                    role={role}
                    onClose={() => setShowEditModal(false)}
                    onProfileUpdated={updates => setUserOverrides(prev => ({ ...prev, ...updates }))}
                    onArtistSaved={refreshArtistMe}
                />
            )}
        </AppShell>
    );
}
