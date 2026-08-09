import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FaExclamationTriangle } from 'react-icons/fa'
import './ConfirmModal.css'

export default function ConfirmModal({ title, message, confirmLabel = 'Confirmar', onConfirm, onClose, loading }) {
    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return createPortal(
        <div className="cm-overlay" onClick={onClose}>
            <div className="cm-modal" onClick={e => e.stopPropagation()}>
                <div className="cm-icon">
                    <FaExclamationTriangle size={20} />
                </div>
                <h3 className="cm-title">{title}</h3>
                {message && <p className="cm-message">{message}</p>}
                <div className="cm-footer">
                    <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button type="button" className="cm-btn-danger" onClick={onConfirm} disabled={loading}>
                        {loading ? 'A remover…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
