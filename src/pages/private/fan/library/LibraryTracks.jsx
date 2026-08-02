/* ─────────────────────────────────────────────────────────────────
   LibraryTracks.jsx, Todas as faixas das minhas playlists.
   O coração liga/desliga a presença na playlist Favoritos.
   ───────────────────────────────────────────────────────────────── */

import { FaPlay, FaHeart } from 'react-icons/fa'
import ArtistArtwork       from '../../../../components/PublicComponets/ArtistArtwork.jsx'

export default function LibraryTracks({ tracks, liked, toggleLike }) {
    return (
        <section className="home__section">
            <div className="home__section-head">
                <div>
                    <h2 className="home__section-title">As minhas faixas</h2>
                    <div className="home__section-sub">
                        {tracks.length} faixas únicas em todas as playlists
                    </div>
                </div>
            </div>

            <div className="lib__track-list">
                {tracks.map((t, i) => (
                    <div key={t.id} className="lib__track-row">
                        <span className="lib__track-num">{i + 1}</span>

                        <div className="lib__track-thumb">
                            <ArtistArtwork shape={t.shape} hue={t.hue} image={t.image} rounded={6} />
                            <button type="button" className="lib__track-play" aria-label="Reproduzir">
                                <FaPlay size={10} />
                            </button>
                        </div>

                        <div className="lib__track-info">
                            <div className="lib__track-title">{t.title}</div>
                            <div className="lib__track-artist">{t.artist}</div>
                        </div>

                        <div className="lib__track-playlists">
                            {t.inPlaylists === 1
                                ? '1 playlist'
                                : `${t.inPlaylists} playlists`}
                        </div>

                        <button
                            type="button"
                            className={`lib__track-like${liked.has(t.id) ? ' lib__track-like--active' : ''}`}
                            onClick={() => toggleLike(t.id)}
                            aria-label={liked.has(t.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                            title={liked.has(t.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                        >
                            <FaHeart size={13} />
                        </button>

                        <div className="lib__track-duration">{t.duration}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
