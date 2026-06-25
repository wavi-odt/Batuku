/* ─────────────────────────────────────────────────────────────────
   pages/profile/Profile.jsx — Página "O meu perfil" (Fã + Artista).

   Tabs funcionais; cada painel lê de data/profile.js.
   Recebe `role` por prop (default 'fan'). Quando ligares o backend,
   passa o role do utilizador autenticado e troca o import dos mocks
   por um fetch que devolva o mesmo shape (ver data/profile.js).
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTrophy, FaCheckCircle, FaPlus, FaCog } from 'react-icons/fa'
import AppShell from '../../../components/HomeComponents/AppShell'
import ArtistArtwork from '../../../components/PublicComponets/ArtistArtwork'
import { profileData } from '../../../data/profile'
import {
    FanOverview, FanPlaylists, FanAchievements, FanFollowing, FanActivity,
} from './FanPanels'
import {
    ArtistOverview, ArtistTracks, ArtistAboutPanel, ArtistAchievements,
} from './ArtistPanels'
import './Profile.css'

/* ─── Tab maps ────────────────────────────────────────────────────── */
const FAN_TABS = [
    { label: 'Visão geral', Panel: FanOverview },
    { label: 'Playlists',   Panel: FanPlaylists },
    { label: 'Conquistas',  Panel: FanAchievements },
    { label: 'A seguir',    Panel: FanFollowing },
    { label: 'Atividade',   Panel: FanActivity },
];

const ARTIST_TABS = [
    { label: 'Visão geral', Panel: ArtistOverview },
    { label: 'Faixas',      Panel: ArtistTracks },
    { label: 'Sobre',       Panel: ArtistAboutPanel },
    { label: 'Conquistas',  Panel: ArtistAchievements },
];

/* ─── Header ──────────────────────────────────────────────────────── */
function ProfileHeader({ role, data }) {
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
                <div className={'prof__avatar' + (isArtist ? ' prof__avatar--artist' : '')}>
                    <ArtistArtwork shape={data.avatar.shape} hue={data.avatar.hue} rounded={0} />
                    <span className="prof__avatar-edit"><FaPlus size={13} /></span>
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
                        <span className="prof__meta-dot" />
                        <span>{isArtist ? data.about.genre : data.country}</span>
                        <span className="prof__meta-dot" />
                        <span>{data.location}</span>
                        <span className="prof__meta-dot" />
                        <span>Membro desde {data.joined}</span>
                    </div>
                </div>

                <div className="prof__actions">
                    {isArtist && (
                        <button type="button" className="btn-ghost" style={{ padding: '10px 16px', fontSize: 14 }}>
                            Ver como público
                        </button>
                    )}
                    <Link to="/settings" className="btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
                        <FaCog size={14} /> Editar perfil
                    </Link>
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
            { v: data.points.toLocaleString('pt-PT'), l: 'Pontos' },
            { v: '#' + data.rank, l: 'Rank' },
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
    const tabs = role === 'artist' ? ARTIST_TABS : FAN_TABS;
    const data = role === 'artist' ? profileData.artist : profileData.fan;
    const [active, setActive] = useState(0);

    const ActivePanel = tabs[active].Panel;

    return (
        <AppShell role={role}>
            <div style={{ marginTop: -8 }}>
                <ProfileHeader role={role} data={data} />
                <ProfileStats role={role} data={data} />

                <div className="prof__tabs">
                    {tabs.map((t, i) => (
                        <button
                            key={t.label}
                            type="button"
                            className={'prof__tab' + (i === active ? ' is-active' : '')}
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
        </AppShell>
    );
}
