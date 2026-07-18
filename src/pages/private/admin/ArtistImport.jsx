import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../utils/auth.js'
import './AdminHome.css'
import './ArtistImport.css'

const API = 'http://localhost:8080/api/admin/artist-profiles'

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
            setResults(prev => prev.map(a => a.id === spotifyArtistId ? { ...a, imported: true } : a));
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-page__inner">
                <header className="admin-head">
                    <div className="admin-head__row">
                        <div>
                            <Link to="/admin" className="admin-back">← Administração</Link>
                            <h1 className="admin-head__title">Importar artistas</h1>
                            <p className="admin-head__sub">Pesquisa e importa perfis de artistas a partir do Spotify.</p>
                        </div>
                    </div>
                </header>

                <form className="artist-import__search" onSubmit={handleSearch}>
                    <input
                        className="input"
                        type="text"
                        placeholder="Nome do artista…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button className="btn btn--primary" type="submit" disabled={loading}>
                        {loading ? 'A procurar…' : 'Procurar'}
                    </button>
                </form>

                {error && <p className="artist-import__error">{error}</p>}

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

                            <button
                                className={`btn ${artist.imported ? 'btn--ghost' : 'btn--primary'}`}
                                onClick={() => handleImport(artist.id)}
                                disabled={artist.imported}
                            >
                                {artist.imported ? 'Importado' : 'Importar'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
