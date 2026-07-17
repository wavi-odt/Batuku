import { useState, useRef } from 'react'
import { FaTimes, FaCamera, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import './AvatarUploader.css'

// Base URL: define VITE_API_BASE_URL em .env; fallback para localhost em dev
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export default function AvatarUploader({ currentAvatarUrl, isArtist, onSuccess, onClose }) {
    const [preview, setPreview]   = useState(null)
    const [file, setFile]         = useState(null)
    const [error, setError]       = useState(null)
    const [loading, setLoading]   = useState(false)
    const inputRef = useRef(null)

    function pickFile(selected) {
        if (!selected) return
        setError(null)

        if (!selected.type.startsWith('image/')) {
            setError('Apenas imagens são permitidas (JPEG, PNG, WebP, etc.).')
            return
        }
        if (selected.size > MAX_SIZE) {
            setError('O ficheiro não pode ultrapassar 5 MB.')
            return
        }

        setFile(selected)
        setPreview(URL.createObjectURL(selected))
    }

    function handleInputChange(e) {
        pickFile(e.target.files?.[0])
    }

    function handleDrop(e) {
        e.preventDefault()
        pickFile(e.dataTransfer.files?.[0])
    }

    async function handleUpload() {
        if (!file) return

        const token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('file', file)

        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`${API_BASE}/api/media/avatar`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error ?? `Erro ${res.status}, tenta novamente.`)
                return
            }

            onSuccess(data.avatarUrl)
            onClose()
        } catch {
            setError('Falha na ligação ao servidor. Verifica a tua rede e tenta novamente.')
        } finally {
            setLoading(false)
        }
    }

    const avatarClass = 'av-up__avatar' + (isArtist ? ' av-up__avatar--artist' : '')

    return (
        <div className="av-up-overlay" onClick={onClose}>
            <div
                className="av-up-modal"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Alterar avatar"
            >
                {/* Header */}
                <div className="av-up-modal__header">
                    <span className="av-up-modal__title">Alterar avatar</span>
                    <button
                        type="button"
                        className="av-up-modal__close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <FaTimes size={15} />
                    </button>
                </div>

                {/* Body */}
                <div className="av-up-modal__body">
                    {/* Pré-visualização */}
                    <div className={avatarClass}>
                        {preview || currentAvatarUrl ? (
                            <img src={preview ?? currentAvatarUrl} alt="Pré-visualização" />
                        ) : (
                            <span className="av-up__placeholder"><FaCamera size={30} /></span>
                        )}
                    </div>

                    {/* Zona de seleção / drag-and-drop */}
                    <div
                        className={'av-up-drop' + (preview ? ' av-up-drop--ready' : '')}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="av-up-drop__input"
                            onChange={handleInputChange}
                        />

                        {preview ? (
                            <p className="av-up-drop__hint">
                                <strong>{file.name}</strong>
                                <span className="av-up-drop__sub"> · Clica para trocar</span>
                            </p>
                        ) : (
                            <>
                                <FaCamera size={20} className="av-up-drop__icon" />
                                <p className="av-up-drop__hint">
                                    Arrasta uma imagem ou <strong>clica para selecionar</strong>
                                </p>
                                <p className="av-up-drop__sub">JPEG · PNG · WebP · GIF &nbsp;·&nbsp; máx. 5 MB</p>
                            </>
                        )}
                    </div>

                    {/* Mensagem de erro */}
                    {error && (
                        <div className="av-up-error" role="alert">
                            <FaExclamationTriangle size={13} />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="av-up-modal__footer">
                    <button
                        type="button"
                        className="btn-ghost"
                        style={{ padding: '10px 18px', fontSize: 14 }}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '10px 18px', fontSize: 14 }}
                        disabled={!file || loading}
                        onClick={handleUpload}
                    >
                        {loading ? <span className="av-up-spinner" /> : <FaCheck size={13} />}
                        {loading ? 'A enviar…' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
