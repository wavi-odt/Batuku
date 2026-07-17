import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/public/Landing'
import NotFound from './pages/Denied/notFound'
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import Dashboard from "./pages/private/artist/artistHome/Dashboard.jsx";
import FanHome from "./pages/private/fan/fanHome/Home.jsx";
import Profile from "./pages/private/profile/Profile.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import OAuthCallback from "./pages/public/OAuthCallback.jsx";
import AdminHome from "./pages/private/admin/AdminHome.jsx";
import { getRole } from "./utils/auth.js";

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
                <Route path="/home"        element={<RoleRoute roles={['fan']}><FanHome /></RoleRoute>} />
                <Route path="/dashboard"   element={<RoleRoute roles={['artist']}><Dashboard /></RoleRoute>} />
                <Route path="/admin"       element={<RoleRoute roles={['admin']}><AdminHome /></RoleRoute>} />

                <Route path="/profile"     element={<RoleRoute roles={['fan', 'artist']}><ProfileRouter /></RoleRoute>} />
                <Route path="/artists"     element={<RoleRoute roles={['fan', 'artist']}><div className="p-8">Artistas - em breve</div></RoleRoute>} />
                <Route path="/marketplace" element={<RoleRoute roles={['fan', 'artist']}><div className="p-8">Marketplace - em breve</div></RoleRoute>} />
                <Route path="/community"   element={<RoleRoute roles={['fan', 'artist']}><div className="p-8">Comunidade - em breve</div></RoleRoute>} />

                <Route path="/*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
