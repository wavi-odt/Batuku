import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import './Toast.css'

const ToastCtx = createContext(null)

function ToastBanner({ message, type, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 3500)
        return () => clearTimeout(t)
    }, [onDone])

    return createPortal(
        <div className={`toast toast--${type}`}>
            {type === 'success'
                ? <FaCheckCircle size={14} />
                : <FaExclamationCircle size={14} />}
            <span>{message}</span>
        </div>,
        document.body
    )
}

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null)

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type, id: Date.now() })
    }, [])

    return (
        <ToastCtx.Provider value={{ showToast }}>
            {children}
            {toast && (
                <ToastBanner
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onDone={() => setToast(null)}
                />
            )}
        </ToastCtx.Provider>
    )
}

export const useToast = () => useContext(ToastCtx)
