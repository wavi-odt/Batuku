/* ─────────────────────────────────────────────────────────────────
   FanPanels.jsx, Painéis das tabs do perfil de Fã.
   Playlists, artistas seguidos e géneros vêm da API real.
   Badges e atividade ficam em mock até haver endpoints.
   ───────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaMusic, FaUser } from 'react-icons/fa'
import { API, getToken } from '../../../utils/auth.js'
import {
    CardTitle, BadgesGrid, GenreBars, ActivityList,
} from './ProfileBlocks'

/* ─── Hooks ───────────────────────────────────────────────────────── */
function useFanPlaylists() {
    const [playlists, setPlaylists] = useState([])
    const [loading,   setLoading]   = useState(true)
    useEffect(() => {
        fetch(`${API}/api/playlists/my`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setPlaylists(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])
    return { playlists, loading }
}

function useFanFollowing() {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch(`${API}/api/artist-follows/my`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setArtists(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])
    return { artists, loading }
}

/* ─── Ouvido recentemente ────────────────────────────────────────── */
function useFanRecentlyPlayed() {
    const [tracks,  setTracks]  = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch(`${API}/api/users/me/recently-played`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setTracks(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])
    return { tracks, loading }
}

/* ─── Géneros preferidos (por reproduções reais) ─────────────────── */
const GENRE_HUES = {
    'funaná':    14,  'morna':     220, 'coladeira': 42,
    'cabo love': 145, 'kizomba':   280, 'tabanka':   8,
    'batuque':   340, 'kola':      195, 'zouk':      260,
    'semba':     30,  'kuduro':    60,  'afrobeats': 100,
}

function useFanTopGenres() {
    const [genres,  setGenres]  = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch(`${API}/api/users/me/top-genres`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => setGenres(
                (Array.isArray(data) ? data : []).map((g, i) => ({
                    name: g.name,
                    pct:  g.pct,
                    hue:  GENRE_HUES[g.name.toLowerCase()] ?? (i * 55 + 14),
                }))
            ))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])
    return { genres, loading }
}

/* ─── Cards reutilizáveis ─────────────────────────────────────────── */
function PlaylistCard({ pl }) {
    const count = pl.trackCount ?? 0
    if (pl.systemGenerated) {
        return (
            <Link to={`/playlists/${pl.id}`} className="playlist-item">
                <div className="playlist-item__cover playlist-item__cover--fav">
                    <FaHeart size={16} />
                </div>
                <div>
                    <div className="playlist-item__name">Favoritos</div>
                    <div className="playlist-item__count">{count} faixas</div>
                </div>
            </Link>
        )
    }
    return (
        <Link to={`/playlists/${pl.id}`} className="playlist-item">
            <div className="playlist-item__cover">
                {pl.coverUrl
                    ? <img src={pl.coverUrl} alt={pl.name} className="playlist-item__cover-img" />
                    : <div className="playlist-item__cover-empty"><FaMusic size={14} /></div>
                }
            </div>
            <div>
                <div className="playlist-item__name">{pl.name}</div>
                <div className="playlist-item__count">{count} faixas</div>
            </div>
        </Link>
    )
}

function ArtistCard({ a }) {
    return (
        <Link to={`/artists/${a.id}`} className="follow-card">
            <div className="follow-card__avatar">
                {a.avatarUrl
                    ? <img src={a.avatarUrl} alt={a.name} className="follow-card__avatar-img" />
                    : <div className="follow-card__avatar-empty"><FaUser size={20} /></div>
                }
            </div>
            <div className="follow-card__name">{a.name}</div>
            {a.genre && <div className="follow-card__genre">{a.genre}</div>}
        </Link>
    )
}

/* ─── Painéis ─────────────────────────────────────────────────────── */
export function FanOverview({ fan }) {
    const { playlists, loading: loadingPl } = useFanPlaylists()
    const { artists,   loading: loadingAr } = useFanFollowing()
    const { genres,    loading: loadingGn } = useFanTopGenres()
    const { tracks: recentTracks, loading: loadingRc } = useFanRecentlyPlayed()

    const previewPlaylists = playlists.slice(0, 4)
    const previewArtists   = artists.slice(0, 6)

    return (
        <div className="prof__grid">
            <div>
                <div className="prof-card prof__section-gap">
                    <CardTitle link={`${fan.badges.filter(b => b.got).length} de ${fan.badges.length}`}>
                        Conquistas
                    </CardTitle>
                    <BadgesGrid badges={fan.badges.slice(0, 4)} />
                </div>

                <div className="prof-card">
                    <CardTitle>Playlists</CardTitle>
                    {loadingPl
                        ? <p className="ftrack__empty">A carregar…</p>
                        : previewPlaylists.length > 0
                            ? <div className="playlist-grid">
                                {previewPlaylists.map(pl => <PlaylistCard key={pl.id} pl={pl} />)}
                              </div>
                            : <p className="ftrack__empty">Ainda não tens playlists.</p>
                    }
                </div>
            </div>

            <div className="prof__col-side">
                <div className="prof-card">
                    <CardTitle>Géneros preferidos</CardTitle>
                    {loadingGn
                        ? <p className="ftrack__empty">A carregar…</p>
                        : genres.length > 0
                            ? <GenreBars genres={genres} />
                            : <p className="ftrack__empty">Ouve música para ver os teus géneros.</p>
                    }
                </div>

                <div className="prof-card">
                    <CardTitle>A seguir</CardTitle>
                    {loadingAr
                        ? <p className="ftrack__empty">A carregar…</p>
                        : previewArtists.length > 0
                            ? <div className="prof-following prof-following--compact">
                                {previewArtists.map(a => <ArtistCard key={a.id} a={a} />)}
                              </div>
                            : <p className="ftrack__empty">Ainda não segues nenhum artista.</p>
                    }
                </div>

                <div className="prof-card">
                    <CardTitle>Ouvido recentemente</CardTitle>
                    {loadingRc
                        ? <p className="ftrack__empty">A carregar…</p>
                        : recentTracks.length === 0
                            ? <p className="ftrack__empty">Ainda não ouviste nenhuma faixa.</p>
                            : recentTracks.slice(0, 5).map(t => (
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
                            ))
                    }
                </div>
            </div>
        </div>
    )
}

export function FanPlaylists() {
    const { playlists, loading } = useFanPlaylists()

    if (loading) return <div className="prof-card"><p className="ftrack__empty">A carregar…</p></div>

    const favoritos  = playlists.find(p => p.systemGenerated)
    const myPlaylists = playlists.filter(p => p.owner && !p.systemGenerated)
    const saved      = playlists.filter(p => !p.owner && !p.systemGenerated)
    const total      = (favoritos ? 1 : 0) + myPlaylists.length

    return (
        <div className="prof-card">
            <CardTitle>As minhas playlists · {total}</CardTitle>
            {total === 0
                ? <p className="ftrack__empty">Ainda não tens playlists criadas.</p>
                : <div className="playlist-grid">
                    {favoritos && <PlaylistCard pl={favoritos} />}
                    {myPlaylists.map(pl => <PlaylistCard key={pl.id} pl={pl} />)}
                  </div>
            }

            {saved.length > 0 && (
                <div style={{ marginTop: 24 }}>
                    <CardTitle>Guardadas · {saved.length}</CardTitle>
                    <div className="playlist-grid">
                        {saved.map(pl => <PlaylistCard key={pl.id} pl={pl} />)}
                    </div>
                </div>
            )}
        </div>
    )
}

export function FanAchievements({ fan }) {
    const got = fan.badges.filter(b => b.got).length;
    return (
        <div className="prof-card">
            <CardTitle link={`${got} de ${fan.badges.length} desbloqueados`}>Conquistas</CardTitle>
            <BadgesGrid badges={fan.badges} />
        </div>
    );
}

export function FanFollowing() {
    const { artists, loading } = useFanFollowing()
    return (
        <div className="prof-card">
            <CardTitle>A seguir · {loading ? '…' : artists.length}</CardTitle>
            {loading
                ? <p className="ftrack__empty">A carregar…</p>
                : artists.length === 0
                    ? <p className="ftrack__empty">Ainda não segues nenhum artista.</p>
                    : <div className="prof-following">
                        {artists.map(a => <ArtistCard key={a.id} a={a} />)}
                      </div>
            }
        </div>
    )
}

export function FanActivity({ fan }) {
    return (
        <div className="prof-card">
            <CardTitle>Atividade recente</CardTitle>
            <ActivityList items={fan.activity} />
        </div>
    );
}
