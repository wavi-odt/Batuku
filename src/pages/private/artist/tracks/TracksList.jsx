/* ─────────────────────────────────────────────────────────────────
   TracksList.jsx, Tabela de faixas do artista com ações de gestão.
   ───────────────────────────────────────────────────────────────── */

import { Link }         from 'react-router-dom'
import { FaPlay, FaPause, FaEdit, FaChartBar, FaUpload } from 'react-icons/fa'
import ArtistArtwork    from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import { usePublish }   from '../../../../context/PublishContext.jsx'

const STATUS_LABEL = { published: 'Publicada', draft: 'Rascunho', scheduled: 'Agendada' };

function dateLabel(track) {
    if (track.status === 'scheduled') return `Agenda: ${track.scheduledAt}`;
    if (track.status === 'published')  return track.publishedAt;
    return '—';
}

export default function TracksList({ tracks, playing, onPlay }) {
    const { openPublish } = usePublish();
    if (tracks.length === 0) {
        return (
            <div className="trk__table">
                <div className="trk__empty">
                    <div className="trk__empty-icon">🎵</div>
                    <div className="trk__empty-title">Sem faixas</div>
                    <div className="trk__empty-sub">Tenta outro filtro ou publica a tua primeira faixa.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="trk__table">
            {/* ─── Header da tabela ─────────────────────────────── */}
            <div className="trk__row trk__row--head">
                <div />
                <div>Faixa</div>
                <div>Género</div>
                <div>Estado</div>
                <div className="trk__col-r">Reprod./sem.</div>
                <div className="trk__col-r">Likes</div>
                <div className="trk__col-r">Coment.</div>
                <div className="trk__col-r">Ações</div>
            </div>

            {tracks.map(t => {
                const isPlaying = playing === t.id;
                const trendCls  = !t.trend ? 'trk__trend--null'
                    : t.trend.startsWith('-') ? 'trk__trend--down' : 'trk__trend--up';

                return (
                    <div key={t.id} className="trk__row">

                        {/* Cover + play */}
                        <div className="trk__cover" onClick={() => onPlay(isPlaying ? null : t.id)}>
                            <ArtistArtwork
                                shape="circles"
                                hue={t.hue}
                                image={t.image}
                                rounded={0}
                                showGloss={false}
                            />
                            <button
                                type="button"
                                className="trk__play-overlay"
                                aria-label={isPlaying ? 'Pausar' : 'Pré-ouvir'}
                            >
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                        </div>

                        {/* Título + álbum */}
                        <div className="trk__info">
                            <div className="trk__name">{t.title}</div>
                            <div className="trk__album">{t.album ?? 'Single'}</div>
                        </div>

                        {/* Género */}
                        <div className="trk__genre">{t.genre}</div>

                        {/* Estado */}
                        <div>
                            <span className={`trk__status trk__status--${t.status}`}>
                                {STATUS_LABEL[t.status]}
                            </span>
                            <div style={{ fontSize: 10, color: 'var(--color-ink-mute)', marginTop: 3 }}>
                                {dateLabel(t)}
                            </div>
                        </div>

                        {/* Reproduções desta semana + tendência */}
                        <div className="trk__plays">
                            <div className="trk__plays-week">
                                {t.plays.week.toLocaleString('pt-PT')}
                                {t.trend && (
                                    <span className={`trk__trend ${trendCls}`}>{t.trend}</span>
                                )}
                            </div>
                            <div className="trk__plays-total">
                                {t.plays.total.toLocaleString('pt-PT')} total
                            </div>
                        </div>

                        {/* Likes */}
                        <div className="trk__num">{t.likes > 0 ? t.likes : '—'}</div>

                        {/* Comentários */}
                        <div className="trk__num">{t.comments > 0 ? t.comments : '—'}</div>

                        {/* Ações */}
                        <div className="trk__actions">
                            <button
                                type="button"
                                className="trk__action-btn"
                                title="Editar faixa"
                                onClick={openPublish}
                            >
                                <FaEdit />
                            </button>
                            <Link
                                to="/analytics"
                                className="trk__action-btn"
                                title="Ver analytics"
                            >
                                <FaChartBar />
                            </Link>
                            {t.status === 'draft' && (
                                <button
                                    type="button"
                                    className="trk__action-btn trk__action-btn--publish"
                                    title="Publicar agora"
                                >
                                    <FaUpload />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
