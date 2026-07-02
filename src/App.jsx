import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/public/Landing'
import NotFound from './pages/Denied/notFound'
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import Dashboard from "./pages/private/artist/artistHome/Dashboard.jsx";
import FanHome from "./pages/private/fan/fanHome/Home.jsx";
import Profile from "./pages/private/profile/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OAuthCallback from "./pages/public/OAuthCallback.jsx";
import { getRole } from "./utils/auth.js";

function HomeRouter() {
    return getRole() === 'artist' ? <Navigate to="/dashboard" replace /> : <FanHome />;
}

function ProfileRouter() {
    return <Profile role={getRole()} />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Públicas */}
                <Route path="/" element={<Landing />} />
                <Route path="/login"           element={<Login />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/oauth2/callback" element={<OAuthCallback />} />

                {/* Privadas */}
                <Route path="/home"        element={<ProtectedRoute><HomeRouter /></ProtectedRoute>} />
                <Route path="/profile"     element={<ProtectedRoute><ProfileRouter /></ProtectedRoute>} />
                <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/artists"     element={<ProtectedRoute><div className="p-8">Artistas - em breve</div></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><div className="p-8">Marketplace - em breve</div></ProtectedRoute>} />
                <Route path="/community"   element={<ProtectedRoute><div className="p-8">Comunidade - em breve</div></ProtectedRoute>} />

                <Route path="/*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
