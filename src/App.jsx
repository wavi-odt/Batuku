import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { PlayerProvider } from './context/PlayerContext'
import { usePlayer } from './context/PlayerContext'
import { PublishProvider } from './context/PublishContext'
import { ToastProvider } from './context/ToastContext'
import { LikeProvider } from './context/LikeContext'
import { PlaylistLikeProvider } from './context/PlaylistLikeContext'
import { PendingCommentsProvider } from './context/PendingCommentsContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { GenresProvider } from './context/GenresContext'
import MiniPlayer      from './components/HomeComponents/MiniPlayer'
import BottomNav       from './components/HomeComponents/BottomNav'
import LevelUpOverlay  from './components/HomeComponents/LevelUpOverlay'
import PublishModal from './pages/private/artist/Publish.jsx'
import Landing from './pages/public/Landing'
import NotFound from './pages/Denied/notFound'
import RoleRoute from "./components/RoleRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppShell from "./components/HomeComponents/AppShell.jsx";
import ScrollManager from "./components/ScrollManager.jsx";
import { getRole } from "./utils/auth.js";

// Páginas carregadas a pedido (code splitting): cada rota gera o seu próprio ficheiro JS
const Login             = lazy(() => import('./pages/public/Login.jsx'))
const Register          = lazy(() => import('./pages/public/Register.jsx'))
const ForgotPassword    = lazy(() => import('./pages/public/ForgotPassword.jsx'))
const ResetPassword     = lazy(() => import('./pages/public/ResetPassword.jsx'))
const Terms             = lazy(() => import('./pages/public/Terms.jsx'))
const Privacy           = lazy(() => import('./pages/public/Privacy.jsx'))
const Dashboard         = lazy(() => import('./pages/private/artist/artistHome/Dashboard.jsx'))
const FanHome           = lazy(() => import('./pages/private/fan/fanHome/Home.jsx'))
const Profile           = lazy(() => import('./pages/private/profile/Profile.jsx'))
const OAuthCallback     = lazy(() => import('./pages/public/OAuthCallback.jsx'))
const AguardarValidacao = lazy(() => import('./pages/public/AguardarValidacao.jsx'))
const VerifyEmail       = lazy(() => import('./pages/public/VerifyEmail.jsx'))
const AutoLogin         = lazy(() => import('./pages/public/AutoLogin.jsx'))
const AdminHome         = lazy(() => import('./pages/private/admin/AdminHome.jsx'))
const ArtistImport      = lazy(() => import('./pages/private/admin/ArtistImport.jsx'))
const AdminClaims       = lazy(() => import('./pages/private/admin/AdminClaims.jsx'))
const ArtistDetail      = lazy(() => import('./pages/private/artist/ArtistDetail.jsx'))
const ReleaseDetail     = lazy(() => import('./pages/private/release/ReleaseDetail.jsx'))
const PlaylistDetail    = lazy(() => import('./pages/private/playlist/PlaylistDetail.jsx'))
const PlaylistCreate    = lazy(() => import('./pages/private/playlist/PlaylistCreate.jsx'))
const UserDetail        = lazy(() => import('./pages/private/user/UserDetail.jsx'))
const ClaimProfile      = lazy(() => import('./pages/private/artist/ClaimProfile.jsx'))
const Library           = lazy(() => import('./pages/private/fan/library/Library.jsx'))
const MyUploads         = lazy(() => import('./pages/private/personal/MyUploads.jsx'))
const ProjectDetail     = lazy(() => import('./pages/private/personal/ProjectDetail.jsx'))
const SharedTrack       = lazy(() => import('./pages/public/SharedTrack.jsx'))
const SharedProject     = lazy(() => import('./pages/public/SharedProject.jsx'))
const Discover          = lazy(() => import('./pages/private/fan/discover/Discover.jsx'))
const GenrePage         = lazy(() => import('./pages/private/fan/genre/GenrePage.jsx'))
const Following         = lazy(() => import('./pages/private/fan/following/Following.jsx'))
const Achievements      = lazy(() => import('./pages/private/fan/achievements/Achievements.jsx'))
const Marketplace       = lazy(() => import('./pages/private/fan/marketplace/Marketplace.jsx'))
const Community         = lazy(() => import('./pages/private/fan/community/Community.jsx'))
const Tracks            = lazy(() => import('./pages/private/artist/tracks/Tracks.jsx'))
const Analytics         = lazy(() => import('./pages/private/artist/stats/Analytics.jsx'))
const Fans              = lazy(() => import('./pages/private/artist/fans/Fans.jsx'))
const Comments          = lazy(() => import('./pages/private/artist/comments/Comments.jsx'))

// Mostrado apenas enquanto o ficheiro da rota ainda não chegou
function RouteFallback() {
    return <div style={{ minHeight: '100vh', background: 'var(--color-bg, #0A0A0B)' }} aria-busy="true" />
}

function ProfileRouter() {
    return <Profile role={getRole()} />;
}

// Layout route que mantém o MiniPlayer montado entre navegações privadas
function PlayerLayer() {
    const { track } = usePlayer()
    const role = getRole() ?? 'fan'

    useEffect(() => {
        document.body.classList.toggle('has-player', !!track)
        return () => document.body.classList.remove('has-player')
    }, [track])

    return (
        <>
            <Outlet />
            <MiniPlayer />
            <BottomNav role={role} />
            <LevelUpOverlay />
        </>
    )
}

function App() {
    return (
        <PlayerProvider>
            <ToastProvider>
            <GenresProvider>
            <NotificationsProvider>
            <LikeProvider>
            <PlaylistLikeProvider>
            <PendingCommentsProvider>
            <PublishProvider>
                <BrowserRouter>
                    <ScrollManager />
                    <Suspense fallback={<RouteFallback />}>
                    <Routes>
                        {/* Públicas */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login"            element={<Login />} />
                        <Route path="/register"         element={<Register />} />
                        <Route path="/forgot-password"  element={<ForgotPassword />} />
                        <Route path="/reset-password"   element={<ResetPassword />} />
                        <Route path="/terms"            element={<Terms />} />
                        <Route path="/privacy"          element={<Privacy />} />
                        <Route path="/oauth2/callback"      element={<OAuthCallback />} />
                        <Route path="/aguardar-validacao"  element={<AguardarValidacao />} />
                        <Route path="/verify-email"        element={<VerifyEmail />} />
                        <Route path="/auto-login"          element={<AutoLogin />} />
                        <Route path="/p/:token"        element={<SharedTrack />} />
                        <Route path="/proj/:token"     element={<SharedProject />} />
                        <Route path="/artist-claim"    element={<ClaimProfile />} />

                        {/* Pessoal, qualquer utilizador autenticado, sem MiniPlayer */}
                        <Route path="/pessoal"                  element={<ProtectedRoute><MyUploads /></ProtectedRoute>} />
                        <Route path="/pessoal/projetos/:id"     element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />

                        {/* Admin (sem player) */}
                        <Route path="/admin"               element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
                        <Route path="/admin/artist-import" element={<ProtectedRoute role="admin"><ArtistImport /></ProtectedRoute>} />
                        <Route path="/admin/claims"        element={<ProtectedRoute role="admin"><AdminClaims /></ProtectedRoute>} />

                        {/* Privadas, MiniPlayer persiste entre estas rotas */}
                        <Route element={<PlayerLayer />}>
                            <Route element={<AppShell />}>
                                <Route path="/home"           element={<RoleRoute roles={['fan']}><FanHome /></RoleRoute>} />
                                <Route path="/library"        element={<RoleRoute roles={['fan']}><Library /></RoleRoute>} />
                                <Route path="/discover"       element={<RoleRoute roles={['fan']}><Discover /></RoleRoute>} />
                                <Route path="/genres/:id"     element={<RoleRoute roles={['fan']}><GenrePage /></RoleRoute>} />
                                <Route path="/following"      element={<RoleRoute roles={['fan']}><Following /></RoleRoute>} />
                                <Route path="/achievements"   element={<RoleRoute roles={['fan']}><Achievements /></RoleRoute>} />
                                <Route path="/marketplace" element={<RoleRoute roles={['fan', 'artist']}><Marketplace /></RoleRoute>} />
                                <Route path="/community"      element={<RoleRoute roles={['fan', 'artist']}><Community /></RoleRoute>} />
                                <Route path="/tracks"         element={<RoleRoute roles={['artist']}><Tracks /></RoleRoute>} />
                                <Route path="/analytics"      element={<RoleRoute roles={['artist']}><Analytics /></RoleRoute>} />
                                <Route path="/fans"           element={<RoleRoute roles={['artist']}><Fans /></RoleRoute>} />
                                <Route path="/comments"       element={<RoleRoute roles={['artist']}><Comments /></RoleRoute>} />
                                <Route path="/dashboard"      element={<RoleRoute roles={['artist']}><Dashboard /></RoleRoute>} />
                                <Route path="/profile"        element={<RoleRoute roles={['fan', 'artist']}><ProfileRouter /></RoleRoute>} />
                                <Route path="/settings"       element={<Navigate to="/profile" replace />} />
                                <Route path="/artists/:id"    element={<RoleRoute roles={['fan', 'artist']}><ArtistDetail /></RoleRoute>} />
                                <Route path="/releases/:id"  element={<RoleRoute roles={['fan', 'artist']}><ReleaseDetail /></RoleRoute>} />
                                <Route path="/claim-profile"  element={<RoleRoute roles={['fan', 'artist']}><ClaimProfile /></RoleRoute>} />
                                <Route path="/playlists/new"  element={<RoleRoute roles={['fan', 'artist']}><PlaylistCreate /></RoleRoute>} />
                                <Route path="/playlists/:id"  element={<RoleRoute roles={['fan', 'artist']}><PlaylistDetail /></RoleRoute>} />
                                <Route path="/users/:id"      element={<RoleRoute roles={['fan', 'artist']}><UserDetail /></RoleRoute>} />
                            </Route>
                        </Route>

                        <Route path="/*" element={<NotFound />} />
                    </Routes>
                    </Suspense>

                    {/* Modal global, renderizado fora das rotas via portal */}
                    <PublishModal />
                </BrowserRouter>
            </PublishProvider>
            </PendingCommentsProvider>
            </PlaylistLikeProvider>
            </LikeProvider>
            </NotificationsProvider>
            </GenresProvider>
            </ToastProvider>
        </PlayerProvider>
    )
}

export default App
