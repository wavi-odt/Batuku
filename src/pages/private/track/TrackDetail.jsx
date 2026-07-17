import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppShell from '../../../components/HomeComponents/AppShell'
import { getToken, getRole } from '../../../utils/auth.js'
import '../DetailPage.css'

export default function TrackDetail() {
    const { id } = useParams();
    const role = getRole() === 'artist' ? 'artist' : 'fan';

    const [track,   setTrack]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/api/tracks/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); return res.json(); })
            .then(setTrack)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <AppShell role={role}>
            <div className="detail-page">
                {loading && <div className="detail-loading">A carregar…</div>}
                {error   && <div className="detail-error">{error}</div>}
                {track   && (
                    <div className="detail-hero">
                        {track.imageUrl
                            ? <img src={track.imageUrl} alt={track.title} className="detail-hero__img" />
                            : <div className="detail-hero__img" />
                        }
                        <div className="detail-hero__info">
                            {track.genre && <div className="label-eyebrow">{track.genre}</div>}
                            <h1 className="detail-hero__name">{track.title}</h1>
                            {track.artist && (
                                <p className="detail-hero__sub">
                                    {track.artistId
                                        ? <Link to={`/artists/${track.artistId}`} className="link">{track.artist}</Link>
                                        : track.artist
                                    }
                                </p>
                            )}
                            <div className="detail-stats">
                                {track.plays != null && (
                                    <div>
                                        <div className="detail-stat__value">{track.plays.toLocaleString('pt-PT')}</div>
                                        <div className="detail-stat__label">Reproduções</div>
                                    </div>
                                )}
                                {track.likes != null && (
                                    <div>
                                        <div className="detail-stat__value">{track.likes.toLocaleString('pt-PT')}</div>
                                        <div className="detail-stat__label">Gostos</div>
                                    </div>
                                )}
                                {track.duration && (
                                    <div>
                                        <div className="detail-stat__value">{track.duration}</div>
                                        <div className="detail-stat__label">Duração</div>
                                    </div>
                                )}
                                {track.bpm && (
                                    <div>
                                        <div className="detail-stat__value">{track.bpm}</div>
                                        <div className="detail-stat__label">BPM</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
