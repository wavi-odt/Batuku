import { useState, useEffect } from 'react'
import { FaPlay } from 'react-icons/fa'
import { SiSpotify } from 'react-icons/si'
import { getToken } from '../../../utils/auth.js'
import { usePlayer } from '../../../context/PlayerContext'
import {
    CardTitle, BadgesGrid,
    ArtistAbout, ArtistLinks,
} from './ProfileBlocks'
import '../DetailPage.css'

const API = import.meta.env.VITE_API_BASE_URL

function fmtMs(ms) {
    if (!ms) return '—';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function useTopTracks(artistProfileId) {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!artistProfileId) return;
        setLoading(true);
        fetch(`${API}/api/artists/${artistProfileId}/top-tracks?market=PT`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setTracks(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [artistProfileId]);

    return { tracks, loading };
}

function SpotifyTrackList({ artistProfileId, artistName }) {
    const { tracks, loading } = useTopTracks(artistProfileId);
    const { track: currentTrack, setTrack } = usePlayer();

    if (!artistProfileId) return <p className="ftrack__empty">Perfil Spotify não ligado.</p>;
    if (loading)          return <p className="ftrack__empty">A carregar…</p>;
    if (!tracks.length)   return <p className="ftrack__empty">Sem faixas disponíveis.</p>;

    return (
        <ul className="strack-list">
            {tracks.map((t, i) => {
                const isPlaying = currentTrack?.spotifyId === t.spotifyId;
                return (
                    <li
                        key={t.spotifyId ?? i}
                        className={'strack strack--playable' + (isPlaying ? ' is-playing' : '')}
                        onClick={() => setTrack(
                            {
                                spotifyId:  t.spotifyId,
                                name:       t.name,
                                artistName,
                                coverUrl:   t.coverUrl,
                                durationMs: t.durationMs,
                                spotifyUrl: t.spotifyUrl,
                                source:     'spotify',
                            },
                            tracks.map(tr => ({
                                spotifyId:  tr.spotifyId,
                                name:       tr.name,
                                artistName,
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
                            <div className="strack__sub">{isPlaying ? 'A reproduzir…' : fmtMs(t.durationMs)}</div>
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
    );
}

export function ArtistOverview({ artist }) {
    return (
        <div className="prof__grid">
            <div>
                <div className="prof-card prof__section-gap">
                    <CardTitle>
                        <span>Top Faixas</span>
                        <span className="strack-source">
                            <SiSpotify size={12} style={{ color: '#1DB954' }} /> via Spotify
                        </span>
                    </CardTitle>
                    <SpotifyTrackList artistProfileId={artist.artistProfileId} artistName={artist.name} />
                </div>
                <div className="prof-card">
                    <CardTitle link={`${artist.badges.filter(b => b.got).length} de ${artist.badges.length}`}>
                        Conquistas
                    </CardTitle>
                    <BadgesGrid badges={artist.badges} />
                </div>
            </div>
            <div className="prof__col-side">
                <ArtistAbout artist={artist} />
                <ArtistLinks social={artist.social} />
            </div>
        </div>
    );
}

export function ArtistTracks({ artist }) {
    const { tracks } = useTopTracks(artist.artistProfileId);
    return (
        <div className="prof-card">
            <CardTitle>
                <span>Top Faixas · {tracks.length}</span>
                <span className="strack-source">
                    <SiSpotify size={12} style={{ color: '#1DB954' }} /> via Spotify
                </span>
            </CardTitle>
            <SpotifyTrackList artistProfileId={artist.artistProfileId} artistName={artist.name} />
        </div>
    );
}

export function ArtistAboutPanel({ artist }) {
    return (
        <div className="prof__grid">
            <ArtistAbout artist={artist} />
            <div className="prof__col-side">
                <ArtistLinks social={artist.social} />
            </div>
        </div>
    );
}

export function ArtistAchievements({ artist }) {
    const got = artist.badges.filter(b => b.got).length;
    return (
        <div className="prof-card">
            <CardTitle link={`${got} de ${artist.badges.length} desbloqueados`}>Conquistas</CardTitle>
            <BadgesGrid badges={artist.badges} />
        </div>
    );
}
