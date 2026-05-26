import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/public/Landing'

import NotFound from './pages/Denied/notFound'
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* temporárias */}
                <Route path="/home" element={<div className="p-8">Home - em breve</div>} />
                <Route path="/artists" element={<div className="p-8">Artistas - em breve</div>} />
                <Route path="/marketplace" element={<div className="p-8">Marketplace - em breve</div>} />
                <Route path="/community" element={<div className="p-8">Comunidade - em breve</div>} />

                {/*Route not defined*/}
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
