import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import '../DetailPage.css'

export default function PlaylistDetail() {
    const { id } = useParams();
    const role = getRole() === 'artist' ? 'artist' : 'fan';

    const [playlist, setPlaylist] = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/api/playlists/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(setPlaylist)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <AppShell role={role}>
            <div className="detail-page">
                {loading && <div className="detail-loading">A carregar…</div>}
                {error   && <div className="detail-error">{error}</div>}
                {playlist && (
                    <>
                        <div className="detail-hero">
                            {playlist.imageUrl
                                ? <img src={playlist.imageUrl} alt={playlist.name} className="detail-hero__img" />
                                : <div className="detail-hero__img" />
                            }
                            <div className="detail-hero__info">
                                <div className="label-eyebrow">Playlist</div>
                                <h1 className="detail-hero__name">{playlist.name}</h1>
                                {playlist.description && (
                                    <p className="detail-hero__bio">{playlist.description}</p>
                                )}
                                <div className="detail-stats">
                                    {playlist.trackCount != null && (
                                        <div>
                                            <div className="detail-stat__value">{playlist.trackCount}</div>
                                            <div className="detail-stat__label">Faixas</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {playlist.tracks?.length > 0 && (
                            <section>
                                <h2 className="detail-section__title">Faixas</h2>
                                <ul className="detail-track-list">
                                    {playlist.tracks.map((t, i) => (
                                        <li key={t.id ?? i} className="detail-track-item">
                                            <span className="detail-track-item__num">{i + 1}</span>
                                            {t.imageUrl && <img src={t.imageUrl} alt={t.title} className="detail-track-item__img" />}
                                            <div className="detail-track-item__info">
                                                <div className="detail-track-item__title">
                                                    {t.id
                                                        ? <Link to={`/tracks/${t.id}`} className="link">{t.title}</Link>
                                                        : t.title
                                                    }
                                                </div>
                                                {t.artist && <div className="detail-track-item__artist">{t.artist}</div>}
                                            </div>
                                            {t.duration && <span className="detail-track-item__dur">{t.duration}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </>
                )}
            </div>
        </AppShell>
    );
}
