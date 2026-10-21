import { useState, useRef } from 'react'
import { FaPlay, FaPause, FaTrash, FaHeart, FaHeadphones, FaRegComment, FaPen, FaCheck, FaTimes, FaCamera } from 'react-icons/fa'
import NowPlayingEq from '../../../../components/NowPlayingEq.jsx'
import { HiOutlineMusicNote } from 'react-icons/hi'
import { usePlayer } from '../../../../context/PlayerContext.jsx'
import { useToast } from '../../../../context/ToastContext.jsx'
import { useGenres } from '../../../../context/GenresContext.jsx'
import ConfirmModal from '../../../../components/ConfirmModal.jsx'
import CoverImg from '../../../../components/CoverImg.jsx'
import { API, getToken } from '../../../../utils/auth.js'
import { fmtMs, fmtDateLong, fmtNum } from '../../../../utils/formatters'

const STATUS_LABEL = { PUBLISHED: 'Publicada', SCHEDULED: 'Agendada', DRAFT: 'Rascunho' }

function EditRow({ track, onSave, onUpdate, onCancel }) {
    const [title,          setTitle]          = useState(track.title)
    const [genre,          setGenre]          = useState(track.genreName ?? '')
    const [coverPreview,   setCoverPreview]   = useState(track.coverUrl)
    const [saving,         setSaving]         = useState(false)
    const [uploadingCover, setUploadingCover] = useState(false)
    const { showToast } = useToast()
    const { allNames: GENRES } = useGenres()
    const coverRef = useRef(null)
    const canEditCover = !track.belongsToRelease

    async function handleCoverChange(e) {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) { showToast('A capa não pode ultrapassar 5 MB.', 'error'); return }
        setUploadingCover(true)
        try {
            const body = new FormData()
            body.append('cover', file)
            const res = await fetch(`${API}/api/tracks/${track.id}/cover`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${getToken()}` },
                body,
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setCoverPreview(updated.coverUrl)
            onUpdate(updated)
            showToast('Capa actualizada!')
        } catch {
            showToast('Erro ao actualizar a capa. Tenta novamente.', 'error')
        } finally {
            setUploadingCover(false)
            e.target.value = ''
        }
    }

    async function save() {
        if (!title.trim() || saving) return
        setSaving(true)
        try {
            const res = await fetch(`${API}/api/tracks/${track.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ title: title.trim(), genre }),
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            onSave(updated)
        } catch {
            showToast('Erro ao guardar. Tenta novamente.', 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="trk__row trk__row--editing">
            <div
                className={'trk__cover' + (canEditCover ? ' trk__cover--editable' : ' cover-hover')}
                onClick={canEditCover ? () => coverRef.current?.click() : undefined}
            >
                <CoverImg src={coverPreview} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {canEditCover && (
                    <div className={'trk__cover-edit' + (uploadingCover ? ' trk__cover-edit--loading' : '')}>
                        {uploadingCover ? <div className="trk__cover-spinner" /> : <FaCamera size={12} />}
                    </div>
                )}
                <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
            </div>

            <div className="trk__edit-fields">
                <input
                    className="trk__edit-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && save()}
                    placeholder="Título"
                    required
                    autoFocus
                />
                <select
                    className="trk__edit-select"
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                >
                    <option value="">Sem género</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            <div style={{ gridColumn: '3 / -1', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                <button type="button" className="trk__action-btn" onClick={onCancel} title="Cancelar">
                    <FaTimes size={13} />
                </button>
                <button type="button" className="trk__action-btn trk__action-btn--save" onClick={save} disabled={saving || !title.trim()} title="Guardar">
                    <FaCheck size={13} />
                </button>
            </div>
        </div>
    )
}

export default function TracksList({ tracks, loading, onDelete, onUpdate, artistProfileId }) {
    const { track: currentTrack, setTrack, togglePlayRef } = usePlayer()
    const { showToast } = useToast()
    const { allNames: GENRES } = useGenres()
    const [confirmTrack, setConfirmTrack] = useState(null)
    const [deleting,     setDeleting]     = useState(false)
    const [editId,       setEditId]       = useState(null)

    async function confirmDelete() {
        setDeleting(true)
        try {
            await onDelete(confirmTrack.id)
            setConfirmTrack(null)
        } catch {
            showToast('Erro ao eliminar a faixa. Tenta novamente.', 'error')
            setConfirmTrack(null)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="trk__table">
                <div className="trk__empty"><div className="trk__empty-sub">A carregar faixas…</div></div>
            </div>
        )
    }

    if (tracks.length === 0) {
        return (
            <div className="trk__table">
                <div className="trk__empty">
                    <div className="trk__empty-icon"><HiOutlineMusicNote size={48} /></div>
                    <div className="trk__empty-title">Sem faixas</div>
                    <div className="trk__empty-sub">Tenta outro filtro ou publica a tua primeira faixa.</div>
                </div>
            </div>
        )
    }

    const queue = tracks.map(t => ({
        id: t.id, name: t.title, coverUrl: t.coverUrl,
        artistName: t.artistName ?? null,
        artistProfileId: t.artistProfileId ?? artistProfileId ?? null,
        durationMs: t.durationMs, audioUrl: t.audioUrl, source: 'upload', playContext: 'direct',
    }))

    return (
        <>
        <div className="trk__table">
            <div className="trk__row trk__row--head">
                <div />
                <div>Faixa</div>
                <div>Estado</div>
                <div className="trk__col-r trk__col-icon"><FaHeadphones size={11} /></div>
                <div className="trk__col-r trk__col-icon"><FaHeart size={10} /></div>
                <div className="trk__col-r trk__col-icon"><FaRegComment size={10} /></div>
                <div className="trk__col-r">Dur.</div>
                <div />
            </div>

            {tracks.map((t, i) => {
                const isPlaying = currentTrack?.audioUrl === t.audioUrl && !!t.audioUrl

                if (editId === t.id) {
                    return (
                        <EditRow
                            key={t.id}
                            track={t}
                            onSave={updated => { onUpdate(updated); setEditId(null) }}
                            onUpdate={onUpdate}
                            onCancel={() => setEditId(null)}
                        />
                    )
                }

                return (
                    <div key={t.id} className={'trk__row' + (isPlaying ? ' trk__row--playing' : '')}>

                        <div className={`trk__cover cover-hover${isPlaying ? ' trk__cover--active' : ''}`} onClick={() => {
                            if (!t.audioUrl) return
                            if (currentTrack?.id === t.id) { togglePlayRef.current?.(); return }
                            setTrack(queue[i], queue)
                        }}>
                            <CoverImg src={t.coverUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {t.audioUrl && (
                                <button type="button" className="trk__play-overlay" aria-label={isPlaying ? 'A reproduzir' : 'Reproduzir'}>
                                    {isPlaying ? <NowPlayingEq /> : <FaPlay size={12} />}
                                </button>
                            )}
                        </div>

                        <div className="trk__info">
                            <div className="trk__name">{t.title}</div>
                            <div className="trk__album">
                                {t.genreName
                                    ? t.genreName
                                    : <span className="trk__album--mute">Sem género</span>
                                }
                            </div>
                        </div>

                        <div>
                            <span className={`trk__status trk__status--${(t.status ?? 'published').toLowerCase()}`}>
                                {STATUS_LABEL[t.status] ?? 'Publicada'}
                            </span>
                            {t.status === 'SCHEDULED' && t.scheduledAt && (
                                <div style={{ fontSize: 10, color: 'var(--color-ink-mute)', marginTop: 3 }}>
                                    {fmtDateLong(t.scheduledAt)}
                                </div>
                            )}
                        </div>

                        <div className="trk__num">{fmtNum(t.playCount)}</div>
                        <div className="trk__num">{fmtNum(t.likeCount)}</div>
                        <div className="trk__num">{fmtNum(t.commentCount)}</div>
                        <div className="trk__num">{fmtMs(t.durationMs)}</div>

                        <div className="trk__actions">
                            <button
                                type="button"
                                className="trk__action-btn"
                                title="Editar faixa"
                                onClick={() => setEditId(t.id)}
                            >
                                <FaPen size={11} />
                            </button>
                            <button
                                type="button"
                                className="trk__action-btn trk__action-btn--delete"
                                title="Eliminar faixa"
                                onClick={() => { setEditId(null); setConfirmTrack(t) }}
                            >
                                <FaTrash size={11} />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>

        {confirmTrack && (
            <ConfirmModal
                title="Eliminar faixa"
                message={`Tens a certeza que queres eliminar «${confirmTrack.title}»? Esta ação não pode ser desfeita.`}
                confirmLabel="Eliminar"
                loading={deleting}
                onConfirm={confirmDelete}
                onClose={() => setConfirmTrack(null)}
            />
        )}
        </>
    )
}
