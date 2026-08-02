import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { PlayerProvider } from './context/PlayerContext'
import { usePlayer } from './context/PlayerContext'
import { PublishProvider } from './context/PublishContext'
import MiniPlayer from './components/HomeComponents/MiniPlayer'
import PublishModal from './pages/private/artist/Publish.jsx'
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
import AdminClaims from "./pages/private/admin/AdminClaims.jsx";
import ArtistDetail from "./pages/private/artist/ArtistDetail.jsx";

import PlaylistDetail from "./pages/private/playlist/PlaylistDetail.jsx";
import PlaylistCreate from "./pages/private/playlist/PlaylistCreate.jsx";

import UserDetail from "./pages/private/user/UserDetail.jsx";
import ClaimProfile from "./pages/private/artist/ClaimProfile.jsx";
import Library      from "./pages/private/fan/library/Library.jsx";
import Discover     from "./pages/private/fan/discover/Discover.jsx";
import Following    from "./pages/private/fan/following/Following.jsx";
import Achievements  from "./pages/private/fan/achievements/Achievements.jsx";
import Marketplace   from "./pages/private/fan/marketplace/Marketplace.jsx";
import Community     from "./pages/private/fan/community/Community.jsx";
import Tracks        from "./pages/private/artist/tracks/Tracks.jsx";
import Analytics     from "./pages/private/artist/analytics/Analytics.jsx";
import Fans          from "./pages/private/artist/fans/Fans.jsx";
import Comments      from "./pages/private/artist/comments/Comments.jsx";

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
            <PublishProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Públicas */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login"           element={<Login />} />
                        <Route path="/register"        element={<Register />} />
                        <Route path="/oauth2/callback" element={<OAuthCallback />} />

                        {/* Admin (sem player) */}
                        <Route path="/admin"               element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
                        <Route path="/admin/artist-import" element={<ProtectedRoute role="admin"><ArtistImport /></ProtectedRoute>} />
                        <Route path="/admin/claims"        element={<ProtectedRoute role="admin"><AdminClaims /></ProtectedRoute>} />

                        {/* Privadas — MiniPlayer persiste entre estas rotas */}
                        <Route element={<PlayerLayer />}>
                            <Route path="/home"           element={<RoleRoute roles={['fan']}><FanHome /></RoleRoute>} />
                            <Route path="/library"        element={<RoleRoute roles={['fan']}><Library /></RoleRoute>} />
                            <Route path="/discover"       element={<RoleRoute roles={['fan']}><Discover /></RoleRoute>} />
                            <Route path="/following"      element={<RoleRoute roles={['fan']}><Following /></RoleRoute>} />
                            <Route path="/achievements"   element={<RoleRoute roles={['fan']}><Achievements /></RoleRoute>} />
                            <Route path="/marketplace"    element={<RoleRoute roles={['fan', 'artist']}><Marketplace /></RoleRoute>} />
                            <Route path="/community"      element={<RoleRoute roles={['fan', 'artist']}><Community /></RoleRoute>} />
                            <Route path="/tracks"         element={<RoleRoute roles={['artist']}><Tracks /></RoleRoute>} />
                            <Route path="/analytics"      element={<RoleRoute roles={['artist']}><Analytics /></RoleRoute>} />
                            <Route path="/fans"           element={<RoleRoute roles={['artist']}><Fans /></RoleRoute>} />
                            <Route path="/comments"       element={<RoleRoute roles={['artist']}><Comments /></RoleRoute>} />
                            <Route path="/dashboard"      element={<RoleRoute roles={['artist']}><Dashboard /></RoleRoute>} />
                            <Route path="/profile"        element={<RoleRoute roles={['fan', 'artist']}><ProfileRouter /></RoleRoute>} />
                            <Route path="/settings"       element={<Navigate to="/profile" replace />} />
                            <Route path="/artists/:id"    element={<RoleRoute roles={['fan', 'artist']}><ArtistDetail /></RoleRoute>} />
                            <Route path="/claim-profile"  element={<RoleRoute roles={['artist']}><ClaimProfile /></RoleRoute>} />
                            <Route path="/playlists/new"  element={<RoleRoute roles={['fan', 'artist']}><PlaylistCreate /></RoleRoute>} />
                            <Route path="/playlists/:id"  element={<RoleRoute roles={['fan', 'artist']}><PlaylistDetail /></RoleRoute>} />
                            <Route path="/users/:id"      element={<RoleRoute roles={['fan', 'artist']}><UserDetail /></RoleRoute>} />
                        </Route>

                        <Route path="/*" element={<NotFound />} />
                    </Routes>

                    {/* Modal global — renderizado fora das rotas via portal */}
                    <PublishModal />
                </BrowserRouter>
            </PublishProvider>
        </PlayerProvider>
    )
}

export default App
