import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../utils/auth.js'
import './AdminHome.css'
import './ArtistImport.css'

const API = 'http://localhost:8080/api/admin/artist-profiles'

export default function ArtistImport() {
    const [query, setQuery]     = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [imported, setImported] = useState(new Set());

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
            setImported(prev => new Set([...prev, spotifyArtistId]));
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
                            {artist.imageUrl && (
                                <img src={artist.imageUrl} alt={artist.name} className="artist-import__img" />
                            )}
                            <div className="artist-import__info">
                                <div className="artist-import__name">{artist.name}</div>
                                {artist.genres?.length > 0 && (
                                    <div className="artist-import__genres">{artist.genres.join(', ')}</div>
                                )}
                                <div className="artist-import__meta">
                                    {artist.followers != null && (
                                        <span>{artist.followers.toLocaleString('pt-PT')} seguidores</span>
                                    )}
                                    {artist.spotifyUrl && (
                                        <a
                                            href={artist.spotifyUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="artist-import__spotify"
                                        >
                                            Spotify ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                            <button
                                className={`btn ${imported.has(artist.id) ? 'btn--ghost' : 'btn--primary'}`}
                                onClick={() => handleImport(artist.id)}
                                disabled={imported.has(artist.id)}
                            >
                                {imported.has(artist.id) ? 'Importado' : 'Importar'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
