import { Navigate } from 'react-router-dom'
import { getRole } from '../utils/auth.js'

export default function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    if (role && getRole() !== role) return <Navigate to="/home" replace />;
    return children;
}
