import { Navigate, useLocation } from 'react-router-dom'
import { getRole, isPendingClaim, isAwaitingValidation } from '../utils/auth.js'

const roleHome = { fan: '/home', artist: '/dashboard', admin: '/admin' };

export default function RoleRoute({ children, roles }) {
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

    const role = getRole();
    if (!roles.includes(role)) return <Navigate to={roleHome[role] ?? '/login'} replace />;
    return children;
}
