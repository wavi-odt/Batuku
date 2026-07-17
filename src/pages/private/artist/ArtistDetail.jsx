import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import '../DetailPage.css'

export default function ArtistDetail() {
    const { id } = useParams();
    const role = getRole() === 'artist' ? 'artist' : 'fan';

    const [artist,  setArtist]  = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/api/artists/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(setArtist)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <AppShell role={role}>
            <div className="detail-page">
                {loading && <div className="detail-loading">A carregar…</div>}
                {error   && <div className="detail-error">{error}</div>}
                {artist  && (
                    <>
                        <div className="detail-hero">
                            {artist.imageUrl
                                ? <img src={artist.imageUrl} alt={artist.name} className="detail-hero__img detail-hero__img--circle" />
                                : <div className="detail-hero__img detail-hero__img--circle" />
                            }
                            <div className="detail-hero__info">
                                {artist.genre && <div className="label-eyebrow">{artist.genre}</div>}
                                <h1 className="detail-hero__name">{artist.name}</h1>
                                {artist.city && <p className="detail-hero__sub">{artist.city}</p>}
                                {artist.bio  && <p className="detail-hero__bio">{artist.bio}</p>}
                                <div className="detail-stats">
                                    {artist.followers != null && (
                                        <div>
                                            <div className="detail-stat__value">{artist.followers.toLocaleString('pt-PT')}</div>
                                            <div className="detail-stat__label">Seguidores</div>
                                        </div>
                                    )}
                                    {artist.tracksCount != null && (
                                        <div>
                                            <div className="detail-stat__value">{artist.tracksCount}</div>
                                            <div className="detail-stat__label">Faixas</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {artist.tracks?.length > 0 && (
                            <section>
                                <h2 className="detail-section__title">Faixas populares</h2>
                                <ul className="detail-track-list">
                                    {artist.tracks.map((t, i) => (
                                        <li key={t.id ?? i} className="detail-track-item">
                                            <span className="detail-track-item__num">{i + 1}</span>
                                            {t.imageUrl && <img src={t.imageUrl} alt={t.title} className="detail-track-item__img" />}
                                            <div className="detail-track-item__info">
                                                <div className="detail-track-item__title">{t.title}</div>
                                                {t.plays != null && <div className="detail-track-item__artist">{t.plays.toLocaleString('pt-PT')} reproduções</div>}
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
