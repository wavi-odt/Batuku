import { Navigate, useLocation } from 'react-router-dom'
import { getRole, isPendingClaim, isAwaitingValidation } from '../utils/auth.js'

export default function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem('token');
    const { pathname } = useLocation();

    if (!token) {
        return isAwaitingValidation()
            ? <Navigate to="/aguardar-validacao" replace />
            : <Navigate to="/login" replace />;
    }

    if (isPendingClaim() && pathname !== '/claim-profile') {
        return <Navigate to="/aguardar-validacao" replace />;
    }

    if (role && getRole() !== role) return <Navigate to="/home" replace />;
    return children;
}
