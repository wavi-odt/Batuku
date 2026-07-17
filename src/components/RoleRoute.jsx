import { Navigate } from 'react-router-dom'
import { getRole } from '../utils/auth.js'

const roleHome = { fan: '/home', artist: '/dashboard', admin: '/admin' };

export default function RoleRoute({ children, roles }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    const role = getRole();
    if (!roles.includes(role)) return <Navigate to={roleHome[role] ?? '/login'} replace />;
    return children;
}
