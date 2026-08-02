/* ─────────────────────────────────────────────────────────────────
   pages/fan/library/Library.jsx, Biblioteca do fã.
   ───────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react'
import { Link }              from 'react-router-dom'
import AppShell              from '../../../../components/HomeComponents/AppShell.jsx'
import { libraryData, LIBRARY_TRACKS } from '../../../../data/library.js'
import LibraryPlaylists      from './LibraryPlaylists.jsx'
import LibraryTracks         from './LibraryTracks.jsx'
import LibraryArtists        from './LibraryArtists.jsx'
import './Library.css'

const FILTERS = [
    { key: 'all',       label: 'Tudo'      },
    { key: 'playlists', label: 'Playlists' },
    { key: 'artists',   label: 'Artistas'  },
    { key: 'tracks',    label: 'Faixas'    },
];

const trackById = Object.fromEntries(LIBRARY_TRACKS.map(t => [t.id, t]));

export default function Library() {
    const [filter, setFilter] = useState('all');
    const d = libraryData;

    /* Estado central dos likes — determina o conteúdo dos Favoritos */
    const [liked, setLiked] = useState(() => new Set(d.likedTrackIds));

    const toggleLike = (id) => {
        setLiked(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    /* União de todas as faixas das minhas playlists (sem duplicados) */
    const myTracks = useMemo(() => {
        const countByTrack = {};
        d.myPlaylists.forEach(pl => {
            pl.trackIds.forEach(id => {
                countByTrack[id] = (countByTrack[id] || 0) + 1;
            });
        });
        return [...new Set(d.myPlaylists.flatMap(pl => pl.trackIds))]
            .map(id => ({ ...trackById[id], inPlaylists: countByTrack[id] }))
            .filter(t => t.id);
    }, [d.myPlaylists]);

    const show = (key) => filter === 'all' || filter === key;

    const totalPlaylists = d.myPlaylists.length + 1; /* +1 = Favoritos */

    return (
        <AppShell role="fan">

            {/* ─── Header ──────────────────────────────────────────── */}
            <div className="lib__header">
                <div>
                    <h1 className="lib__title">Biblioteca</h1>
                    <p className="lib__subtitle">
                        {totalPlaylists} playlists · {d.stats.savedArtists} artistas · {myTracks.length} faixas
                    </p>
                </div>
                <Link to="/playlists/new" className="btn btn--ghost btn--sm">
                    + Nova playlist
                </Link>
            </div>

            {/* ─── Filtros ─────────────────────────────────────────── */}
            <div className="lib__filters">
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        type="button"
                        className={`lib__filter${filter === f.key ? ' lib__filter--active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* ─── Secções ─────────────────────────────────────────── */}
            {show('playlists') && (
                <LibraryPlaylists
                    myPlaylists={d.myPlaylists}
                    savedPlaylists={d.savedPlaylists}
                    likedCount={liked.size}
                />
            )}

            {show('artists') && (
                <LibraryArtists artists={d.savedArtists} />
            )}

            {show('tracks') && (
                <LibraryTracks
                    tracks={myTracks}
                    liked={liked}
                    toggleLike={toggleLike}
                />
            )}

        </AppShell>
    );
}
