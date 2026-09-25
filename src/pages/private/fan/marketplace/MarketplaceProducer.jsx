import { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaPlay, FaPause } from 'react-icons/fa'
import { API, getToken }       from '../../../../utils/auth.js'
import ArtistArtwork           from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import BeatUploadModal         from './BeatUploadModal.jsx'
import BeatEditModal           from './BeatEditModal.jsx'
import './MarketplaceProducer.css'

export default function MarketplaceProducer({ playing, onPlay }) {
    const [myBeats,    setMyBeats]    = useState([])
    const [stats,      setStats]      = useState({ beats: 0, sales: 0, plays: 0, revenue: 0 })
    const [loading,    setLoading]    = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [editBeat,   setEditBeat]   = useState(null)
    const [confirmDel, setConfirmDel] = useState(null)

    const loadData = () => {
        const headers = { Authorization: `Bearer ${getToken()}` }
        setLoading(true)
        Promise.all([
            fetch(`${API}/api/marketplace/my-beats`, { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/marketplace/my-stats`, { headers }).then(r => r.ok ? r.json() : {}),
        ])
        .then(([beats, s]) => {
            setMyBeats(Array.isArray(beats) ? beats : [])
            setStats({ beats: s.beats ?? 0, sales: s.sales ?? 0, plays: s.plays ?? 0, revenue: s.revenue ?? 0 })
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }

    useEffect(() => { loadData() }, [])

    const handleUploaded = beat => {
        setMyBeats(prev => [beat, ...prev])
        setStats(prev => ({ ...prev, beats: prev.beats + 1 }))
    }

    const handleSaved = updated =>
        setMyBeats(prev => prev.map(b => b.id === updated.id ? updated : b))

    const handleDelete = async id => {
        try {
            await fetch(`${API}/api/marketplace/beats/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            setMyBeats(prev => prev.filter(b => b.id !== id))
            setStats(prev => ({ ...prev, beats: Math.max(0, prev.beats - 1) }))
        } catch (e) { console.error(e) }
        setConfirmDel(null)
    }

    return (
        <>
            {showUpload && (
                <BeatUploadModal onClose={() => setShowUpload(false)} onUploaded={handleUploaded} />
            )}
            {editBeat && (
                <BeatEditModal beat={editBeat} onClose={() => setEditBeat(null)} onSaved={handleSaved} />
            )}
            {confirmDel && (
                <div className="mkt-prod__confirm-backdrop">
                    <div className="mkt-prod__confirm">
                        <p className="mkt-prod__confirm-msg">
                            Eliminar <strong>{confirmDel.title}</strong>? Esta ação é permanente.
                        </p>
                        <div className="mkt-prod__confirm-btns">
                            <button type="button" className="mkt-prod__confirm-cancel"
                                    onClick={() => setConfirmDel(null)}>Cancelar</button>
                            <button type="button" className="mkt-prod__confirm-del"
                                    onClick={() => handleDelete(confirmDel.id)}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mkt-prod">

                {/* ─── Stats ───────────────────────────────────────── */}
                <div className="mkt-prod__stats">
                    <div className="mkt-prod__stat">
                        <span className="mkt-prod__stat-val">{stats.beats}</span>
                        <span className="mkt-prod__stat-label">Beats</span>
                    </div>
                    <div className="mkt-prod__stat">
                        <span className="mkt-prod__stat-val">{Number(stats.plays).toLocaleString('pt-PT')}</span>
                        <span className="mkt-prod__stat-label">Reproduções</span>
                    </div>
                    <div className="mkt-prod__stat">
                        <span className="mkt-prod__stat-val">{stats.sales}</span>
                        <span className="mkt-prod__stat-label">Vendas</span>
                    </div>
                    <div className="mkt-prod__stat mkt-prod__stat--revenue">
                        <span className="mkt-prod__stat-val">€{Number(stats.revenue).toFixed(2)}</span>
                        <span className="mkt-prod__stat-label">Receita total</span>
                    </div>
                </div>

                {/* ─── Barra de ação ───────────────────────────────── */}
                <div className="mkt-prod__upload-bar">
                    <div>
                        <p className="mkt-prod__upload-title">Os teus beats</p>
                        <p className="mkt-prod__upload-sub">Gere e publica os teus beats no marketplace</p>
                    </div>
                    <button type="button" className="mkt-prod__upload-btn" onClick={() => setShowUpload(true)}>
                        + Publicar beat
                    </button>
                </div>

                {/* ─── Lista ───────────────────────────────────────── */}
                {loading ? (
                    <p className="mkt-prod__empty">A carregar…</p>
                ) : myBeats.length === 0 ? (
                    <div className="mkt-prod__empty-state">
                        <p className="mkt-prod__empty">Ainda não publicaste nenhum beat.</p>
                        <p style={{ fontSize: 13, color: 'var(--color-ink-mute)' }}>
                            Clica em "Publicar beat" para começar.
                        </p>
                    </div>
                ) : (
                    <div className="mkt-prod__beat-list">
                        <div className="mkt-prod__beat-header">
                            <div />
                            <div className="mkt-prod__col">Título</div>
                            <div className="mkt-prod__col">Género</div>
                            <div className="mkt-prod__col">BPM · Tom</div>
                            <div className="mkt-prod__col mkt-prod__col--right">Reproduções</div>
                            <div className="mkt-prod__col mkt-prod__col--right">Vendas</div>
                            <div className="mkt-prod__col mkt-prod__col--right">Lease</div>
                            <div />
                        </div>

                        {myBeats.map(beat => {
                            const isPlaying = playing === beat.id
                            const isSold    = beat.soldExclusively
                            return (
                            <div key={beat.id} className={`mkt-prod__beat-row${isPlaying ? ' mkt-prod__beat-row--playing' : ''}${isSold ? ' mkt-prod__beat-row--sold' : ''}`}>
                                <div className="mkt-prod__beat-cover">
                                    <ArtistArtwork
                                        shape="circles"
                                        hue={beat.hue ?? 200}
                                        image={beat.image}
                                        rounded={0}
                                        showGloss={false}
                                    />
                                    {!isSold && (
                                        <button
                                            type="button"
                                            className="mkt-prod__beat-play"
                                            aria-label={isPlaying ? 'Pausar' : 'Pré-ouvir'}
                                            onClick={() => onPlay?.(isPlaying ? null : beat.id)}
                                        >
                                            {isPlaying ? <FaPause /> : <FaPlay />}
                                        </button>
                                    )}
                                </div>
                                <div className="mkt-prod__beat-info">
                                    <div className="mkt-prod__beat-title">{beat.title}</div>
                                    {isSold
                                        ? <span className="mkt-prod__beat-sold-badge">Vendido</span>
                                        : beat.isNew && <span className="mkt__beat-new">novo</span>
                                    }
                                </div>
                                <div className="mkt-prod__beat-genre">{beat.genre ?? '—'}</div>
                                <div className="mkt-prod__beat-bpm">
                                    {beat.bpm ?? '—'}{beat.key ? ` · ${beat.key}` : ''}
                                </div>
                                <div className="mkt-prod__beat-num">
                                    {(beat.plays ?? 0).toLocaleString('pt-PT')}
                                </div>
                                <div className="mkt-prod__beat-num">{beat.sales ?? 0}</div>
                                <div className="mkt-prod__beat-price">
                                    {isSold ? '—' : beat.prices?.lease != null ? `€${beat.prices.lease.toFixed(2)}` : '—'}
                                </div>
                                <div className="mkt-prod__beat-actions">
                                    <button type="button" className="mkt-prod__action-btn"
                                            aria-label="Editar" disabled={isSold}
                                            onClick={() => !isSold && setEditBeat(beat)}>
                                        <FaEdit size={13} />
                                    </button>
                                    <button type="button" className="mkt-prod__action-btn mkt-prod__action-btn--del"
                                            aria-label="Eliminar" disabled={isSold}
                                            onClick={() => !isSold && setConfirmDel(beat)}>
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </div>
        </>
    )
}
