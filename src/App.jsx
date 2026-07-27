import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { PlayerProvider } from './context/PlayerContext'
import { usePlayer } from './context/PlayerContext'
import MiniPlayer from './components/HomeComponents/MiniPlayer'
import Landing from './pages/public/Landing'
import NotFound from './pages/Denied/notFound'
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import Dashboard from "./pages/private/artist/artistHome/Dashboard.jsx";
import FanHome from "./pages/private/fan/fanHome/Home.jsx";
import Profile from "./pages/private/profile/Profile.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OAuthCallback from "./pages/public/OAuthCallback.jsx";
import AdminHome from "./pages/private/admin/AdminHome.jsx";
import ArtistImport from "./pages/private/admin/ArtistImport.jsx";
import ArtistDetail from "./pages/private/artist/ArtistDetail.jsx";
import TrackDetail from "./pages/private/track/TrackDetail.jsx";
import PlaylistDetail from "./pages/private/playlist/PlaylistDetail.jsx";
import UserDetail from "./pages/private/user/UserDetail.jsx";
import ClaimProfile from "./pages/private/artist/ClaimProfile.jsx";
import { getRole } from "./utils/auth.js";

function ProfileRouter() {
    return <Profile role={getRole()} />;
}

// Layout route que mantém o MiniPlayer montado entre navegações privadas
function PlayerLayer() {
    const { track } = usePlayer()

    useEffect(() => {
        document.body.classList.toggle('has-player', !!track)
        return () => document.body.classList.remove('has-player')
    }, [track])

    return (
        <>
            <Outlet />
            <MiniPlayer />
        </>
    )
}

function App() {
    return (
        <PlayerProvider>
            <BrowserRouter>
                <Routes>
                    {/* Públicas */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login"           element={<Login />} />
                    <Route path="/register"        element={<Register />} />
                    <Route path="/oauth2/callback" element={<OAuthCallback />} />

                    {/* Admin (sem player) */}
                    <Route path="/admin"              element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
                    <Route path="/admin/artist-import" element={<ProtectedRoute role="admin"><ArtistImport /></ProtectedRoute>} />

                    {/* Privadas — MiniPlayer persiste entre estas rotas */}
                    <Route element={<PlayerLayer />}>
                        <Route path="/home"        element={<RoleRoute roles={['fan']}><FanHome /></RoleRoute>} />
                        <Route path="/dashboard"   element={<RoleRoute roles={['artist']}><Dashboard /></RoleRoute>} />
                        <Route path="/profile"     element={<RoleRoute roles={['fan', 'artist']}><ProfileRouter /></RoleRoute>} />
                        <Route path="/artists/:id"    element={<RoleRoute roles={['fan', 'artist']}><ArtistDetail /></RoleRoute>} />
                        <Route path="/claim-profile"  element={<RoleRoute roles={['artist']}><ClaimProfile /></RoleRoute>} />
                        <Route path="/tracks/:id"     element={<RoleRoute roles={['fan', 'artist']}><TrackDetail /></RoleRoute>} />
                        <Route path="/playlists/:id"  element={<RoleRoute roles={['fan', 'artist']}><PlaylistDetail /></RoleRoute>} />
                        <Route path="/users/:id"      element={<RoleRoute roles={['fan', 'artist']}><UserDetail /></RoleRoute>} />
                    </Route>

                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </PlayerProvider>
    )
}

export default App
