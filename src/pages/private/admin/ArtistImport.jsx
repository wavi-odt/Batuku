import { useState, useEffect } from 'react'
import { getToken } from '../../../utils/auth.js'
import AdminShell from './AdminShell.jsx'
import './AdminHome.css'
import './ArtistImport.css'

const API = `${import.meta.env.VITE_API_BASE_URL}/api/admin/artist-profiles`

function UnmappedGenresSection() {
    const [genres,  setGenres]  = useState([])
    const [loading, setLoading] = useState(true)
    const [busy,    setBusy]    = useState(null)

    useEffect(() => {
        fetch(`${API}/unmapped-genres`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.ok ? r.json() : [])
            .then(data => setGenres(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    async function promote(id) {
        setBusy(id)
        try {
            const res = await fetch(`${API}/unmapped-genres/${id}/promote`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            setGenres(prev => prev.filter(g => g.id !== id))
        } catch { /* silently */ } finally { setBusy(null) }
    }

    async function dismiss(id) {
        setBusy(id)
        try {
            const res = await fetch(`${API}/unmapped-genres/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            if (!res.ok) throw new Error()
            setGenres(prev => prev.filter(g => g.id !== id))
        } catch { /* silently */ } finally { setBusy(null) }
    }

    if (loading || genres.length === 0) return null

    return (
        <section className="admin-section" style={{ marginTop: 'var(--space-8)' }}>
            <h2 className="admin-section__title">Géneros não mapeados</h2>
            <p className="admin-section__sub">
                Géneros vindos do Spotify sem correspondência na lista canónica do Batuku.
                Promove para adicionar à lista ou ignora para descartar.
            </p>
            <div className="artist-import__unmapped-list">
                {genres.map(g => (
                    <div key={g.id} className="artist-import__unmapped-row">
                        <div className="artist-import__unmapped-info">
                            <span className="artist-import__unmapped-name">{g.name}</span>
                            <span className="artist-import__unmapped-count">{g.occurrences}×</span>
                        </div>
                        <div className="artist-import__unmapped-actions">
                            <button
                                type="button"
                                className="btn btn--primary"
                                disabled={busy === g.id}
                                onClick={() => promote(g.id)}
                            >
                                Promover
                            </button>
                            <button
                                type="button"
                                className="btn-ghost"
                                disabled={busy === g.id}
                                onClick={() => dismiss(g.id)}
                            >
                                Ignorar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

function formatFollowers(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`
    return n.toLocaleString('pt-PT')
}

export default function ArtistImport() {
    const [query, setQuery]       = useState('');
    const [results, setResults]   = useState([]);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');

    async function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/search?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            setResults(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleImport(spotifyArtistId) {
        try {
            const res = await fetch(`${API}/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ spotifyArtistId }),
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const data = await res.json();
            setResults(prev => prev.map(a =>
                a.id === spotifyArtistId
                    ? { ...a, imported: true, unmappedGenres: data.unmappedGenres ?? [] }
                    : a
            ));
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <AdminShell>
            <div className="admin-page__inner">
                <header className="admin-head">
                    <h1 className="admin-head__title">Importar artistas</h1>
                    <p className="admin-head__sub">Pesquisa e importa perfis de artistas a partir do Spotify.</p>
                </header>

                <form className="artist-import__search" onSubmit={handleSearch}>
                    <input
                        className="input"
                        type="text"
                        placeholder="Nome do artista ou URL do Spotify…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button className="btn btn--primary" type="submit" disabled={loading}>
                        {loading ? 'A procurar…' : 'Procurar'}
                    </button>
                </form>
                <p className="admin-migration__desc" style={{ marginTop: 'var(--space-2)' }}>
                    Cola o URL do perfil Spotify do artista (ex: <em>open.spotify.com/artist/…</em>) para encontrar um perfil específico entre vários com o mesmo nome.
                </p>

                {error && <p className="artist-import__error">{error}</p>}

                <UnmappedGenresSection />

                <ul className="artist-import__list">
                    {results.map(artist => (
                        <li key={artist.id} className="artist-import__item">
                            <div className="artist-import__avatar">
                                {artist.imageUrl
                                    ? <img src={artist.imageUrl} alt={artist.name} className="artist-import__img" />
                                    : <span className="artist-import__initials">{artist.name?.[0]?.toUpperCase() ?? '?'}</span>
                                }
                            </div>

                            <div className="artist-import__info">
                                <div className="artist-import__name">{artist.name}</div>

                                {artist.genres?.length > 0 && (
                                    <div className="artist-import__genres">
                                        {artist.genres.slice(0, 4).map(g => (
                                            <span key={g} className="artist-import__tag">{g}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="artist-import__meta">
                                    {artist.followers != null && (
                                        <span>{formatFollowers(artist.followers)} seguidores</span>
                                    )}
                                    {artist.popularity != null && (
                                        <span className="artist-import__pop">
                                            <span className="artist-import__pop-track">
                                                <span
                                                    className="artist-import__pop-fill"
                                                    style={{ width: `${artist.popularity}%` }}
                                                />
                                            </span>
                                            {artist.popularity}
                                        </span>
                                    )}
                                    {artist.spotifyUrl && (
                                        <a
                                            href={artist.spotifyUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="artist-import__spotify"
                                        >
                                            ↗ Spotify
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                <button
                                    className={`btn ${artist.imported ? 'btn--ghost' : 'btn--primary'}`}
                                    onClick={() => handleImport(artist.id)}
                                    disabled={artist.imported}
                                >
                                    {artist.imported ? 'Importado' : 'Importar'}
                                </button>
                                {artist.imported && artist.unmappedGenres?.length > 0 && (
                                    <div className="artist-import__unmapped">
                                        <span>⚠️ Géneros não mapeados:</span>
                                        {artist.unmappedGenres.map(g => (
                                            <span key={g} className="artist-import__tag artist-import__tag--warn">{g}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminShell>
    );
}
