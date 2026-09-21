import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa'
import './Toast.css'

const ToastCtx = createContext(null)

const ICONS = {
    success: FaCheckCircle,
    error:   FaTimesCircle,
    warning: FaExclamationTriangle,
    info:    FaInfoCircle,
}

const DURATION = 3500

function ToastItem({ toast, onDismiss }) {
    const Icon = ICONS[toast.type] ?? ICONS.info

    return (
        <div className={`toast toast--${toast.type}${toast.removing ? ' toast--out' : ''}`}>
            <Icon size={15} className="toast__icon" />
            <span className="toast__msg">{toast.message}</span>
            <button type="button" className="toast__close" onClick={() => onDismiss(toast.id)} aria-label="Fechar">
                <FaTimes size={10} />
            </button>
            <span className="toast__bar" style={{ animationDuration: `${DURATION}ms` }} />
        </div>
    )
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const timers = useRef({})

    const dismiss = useCallback((id) => {
        clearTimeout(timers.current[id])
        delete timers.current[id]
        setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t))
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 280)
    }, [])

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev.slice(-3), { id, message, type, removing: false }])
        timers.current[id] = setTimeout(() => dismiss(id), DURATION)
    }, [dismiss])

    return (
        <ToastCtx.Provider value={{ showToast }}>
            {children}
            {createPortal(
                <div className="toast-stack">
                    {toasts.map(t => (
                        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
                    ))}
                </div>,
                document.body
            )}
        </ToastCtx.Provider>
    )
}

export const useToast = () => useContext(ToastCtx)
