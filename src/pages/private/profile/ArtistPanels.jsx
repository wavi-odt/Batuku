import { useState, useEffect, Fragment } from 'react'
import { FaPlay, FaCompactDisc, FaRegComment } from 'react-icons/fa'
import { SiSpotify } from 'react-icons/si'
import { Link } from 'react-router-dom'
import { API, getToken } from '../../../utils/auth.js'
import { usePlayer } from '../../../context/PlayerContext'
import { usePublish } from '../../../context/PublishContext'
import { useMyTracks } from '../../../hooks/useMyTracks'
import { useMyReleases } from '../../../hooks/useMyReleases'
import {
    CardTitle, BadgesGrid,
    ArtistAbout, ArtistLinks,
} from './ProfileBlocks'
import LikeButton from '../../../components/LikeButton'
import TrackMenu from '../../../components/TrackMenu'
import TrackComments from '../../../components/TrackComments'
import '../DetailPage.css'
import '../release/ReleaseDetail.css'

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

function LocalTrackList({ tracks, artistName }) {
    const { track: currentTrack, setTrack } = usePlayer();
    const [openCommentTrack, setOpenCommentTrack] = useState(null);

    function toggleComments(e, trackId) {
        e.stopPropagation();
        setOpenCommentTrack(prev => prev === trackId ? null : trackId);
    }

    if (!tracks.length) return null;

    const queue = tracks.map(tr => ({
        id: tr.id, name: tr.title, artistName,
        coverUrl: tr.coverUrl, durationMs: tr.durationMs, audioUrl: tr.audioUrl, source: 'upload',
    }));

    return (
        <ul className="strack-list">
            {tracks.map((t, i) => {
                const isPlaying    = currentTrack?.audioUrl === t.audioUrl;
                const commentsOpen = openCommentTrack === t.id;
                return (
                    <Fragment key={t.id}>
                        <li
                            className={'strack strack--playable' + (isPlaying ? ' is-playing' : '') + (commentsOpen ? ' strack--comments-open' : '')}
                            onClick={() => setTrack(queue[i], queue)}
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
    );
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

const TYPE_LABEL = { ALBUM: 'Álbum', EP: 'EP', MIXTAPE: 'Mixtape', SINGLE: 'Single' };

function ReleaseCard({ release }) {
    const label = TYPE_LABEL[release.albumType] ?? release.albumType;
    const count = release.tracks?.length ?? 0;
    return (
        <Link to={`/releases/${release.id}`} className="rel-card rel-card--link">
            <div className="rel-card__cover">
                {release.coverUrl
                    ? <img src={release.coverUrl} alt={release.title} />
                    : <div className="rel-card__cover-placeholder"><FaCompactDisc size={28} /></div>
                }
                <span className="rel-card__badge">{label}</span>
            </div>
            <div className="rel-card__info">
                <div className="rel-card__title" title={release.title}>{release.title}</div>
                <div className="rel-card__sub">{count} {count === 1 ? 'faixa' : 'faixas'}</div>
            </div>
        </Link>
    );
}

export function ArtistOverview({ artist }) {
    const { publishVersion } = usePublish();
    const { tracks: localTracks } = useMyTracks(artist.artistProfileId, publishVersion);
    const { releases } = useMyReleases(artist.artistProfileId, publishVersion);

    return (
        <div className="prof__grid">
            <div>
                <div className="prof-card prof__section-gap">
                    {localTracks.length > 0 ? (
                        <>
                            <CardTitle>Faixas · {localTracks.length}</CardTitle>
                            <LocalTrackList tracks={localTracks} artistName={artist.name} />
                            {artist.spotifyArtistId && (
                                <>
                                    <CardTitle style={{ marginTop: 16 }}>
                                        <span>Top via Spotify</span>
                                        <span className="strack-source">
                                            <SiSpotify size={12} style={{ color: '#1DB954' }} /> via Spotify
                                        </span>
                                    </CardTitle>
                                    <SpotifyTrackList artistProfileId={artist.artistProfileId} artistName={artist.name} />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <CardTitle>
                                <span>Top Faixas</span>
                                <span className="strack-source">
                                    <SiSpotify size={12} style={{ color: '#1DB954' }} /> via Spotify
                                </span>
                            </CardTitle>
                            <SpotifyTrackList artistProfileId={artist.artistProfileId} artistName={artist.name} />
                        </>
                    )}
                </div>
                {releases.length > 0 && (
                    <div className="prof-card prof__section-gap">
                        <CardTitle>Lançamentos · {releases.length}</CardTitle>
                        <div className="rel-grid">
                            {releases.map(r => <ReleaseCard key={r.id} release={r} />)}
                        </div>
                    </div>
                )}
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
    const { publishVersion } = usePublish();
    const { tracks: localTracks, loading } = useMyTracks(artist.artistProfileId, publishVersion);
    const { tracks: spotifyTracks } = useTopTracks(artist.artistProfileId);

    const hasLocal   = localTracks.length > 0;
    const hasSpotify = spotifyTracks.length > 0;

    if (loading) return <div className="prof-card"><p className="ftrack__empty">A carregar…</p></div>;

    return (
        <div className="prof-card">
            {hasLocal && (
                <>
                    <CardTitle>Faixas publicadas · {localTracks.length}</CardTitle>
                    <LocalTrackList tracks={localTracks} artistName={artist.name} />
                </>
            )}

            {hasSpotify && (
                <div style={hasLocal ? { marginTop: 24 } : undefined}>
                    <CardTitle>
                        <span>Top via Spotify · {spotifyTracks.length}</span>
                        <span className="strack-source">
                            <SiSpotify size={12} style={{ color: '#1DB954' }} /> via Spotify
                        </span>
                    </CardTitle>
                    <SpotifyTrackList artistProfileId={artist.artistProfileId} artistName={artist.name} />
                </div>
            )}

            {!hasLocal && !hasSpotify && (
                <p className="ftrack__empty">Sem faixas disponíveis.</p>
            )}
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

export function ArtistReleases({ artist }) {
    const { publishVersion } = usePublish();
    const { releases, loading } = useMyReleases(artist.artistProfileId, publishVersion);

    if (loading) return <div className="prof-card"><p className="ftrack__empty">A carregar…</p></div>;

    if (!releases.length) return (
        <div className="prof-card">
            <p className="ftrack__empty">Sem lançamentos publicados.</p>
        </div>
    );

    return (
        <div className="prof-card">
            <CardTitle>Lançamentos · {releases.length}</CardTitle>
            <div className="rel-grid rel-grid--full">
                {releases.map(r => <ReleaseCard key={r.id} release={r} />)}
            </div>
        </div>
    );
}
