/* ─────────────────────────────────────────────────────────────────
   NotFound.jsx, Página 404.
   Visual rich: capas a flutuar, headline editorial, CTA para voltar.
   Usa apenas tokens + global.css. Sem dependências novas.
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import { usePlayer } from '../../context/PlayerContext'
import ArtistArtwork from '../../components/PublicComponets/ArtistArtwork'
import './notFound.css'

const SHAPE_KEYS = ['circles', 'arch', 'stripes', 'split', 'orbit', 'wave', 'sun', 'triangles'];
function strHash(s) { let h = 0; for (const c of s) h = ((h * 31) + c.charCodeAt(0)) >>> 0; return h; }
function artistToProps(a) { const h = strHash(a.name); return { hue: h % 360, shape: SHAPE_KEYS[h % SHAPE_KEYS.length] }; }

const LAYOUTS = [
    { top:  '8%', left:   '6%', size: 110, rot: -12, delay: '0s'   },
    { top: '18%', left:  '78%', size: 140, rot:   8, delay: '0.4s' },
    { top: '62%', left:   '4%', size: 130, rot:  10, delay: '0.8s' },
    { top: '70%', left:  '82%', size: 120, rot:  -6, delay: '1.2s' },
    { top: '38%', left:   '2%', size:  82, rot:  18, delay: '0.6s' },
    { top: '40%', left:  '90%', size:  88, rot: -16, delay: '1.0s' },
];

export default function NotFound() {
    const navigate = useNavigate();
    const { setTrack } = usePlayer()
    const [heroArtists, setHeroArtists] = useState(null);

    useEffect(() => { setTrack(null) }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/artists/hero`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setHeroArtists(Array.isArray(data) && data.length >= 6 ? data : []))
            .catch(() => setHeroArtists([]));
    }, []);

    const FLOATERS = (heroArtists ?? []).slice(0, 6).map((a, i) => ({
        ...LAYOUTS[i],
        ...artistToProps(a),
        image: a.imageUrl ?? null,
    }));

    return (
        <main className="nf">
            <div className="nf__bg" aria-hidden="true" />

            {FLOATERS.length > 0 && <div className="nf__floaters" aria-hidden="true">
                {FLOATERS.map((f, i) => (
                    <div
                        key={i}
                        className="nf__floater"
                        style={{
                            top: f.top,
                            left: f.left,
                            width: f.size,
                            height: f.size,
                            transform: `rotate(${f.rot}deg)`,
                            animationDelay: f.delay,
                        }}
                    >
                        <ArtistArtwork shape={f.shape} hue={f.hue} image={f.image} rounded={12} showGloss={false} />
                    </div>
                ))}
            </div>}

            <div className="container nf__inner">

                <div className="nf__code" aria-hidden="true">404</div>

                <div className="label-eyebrow nf__eyebrow">Erro 404 · Página não encontrada</div>

                <h1 className="nf__title">
                    Esta faixa <span className="nf__title-accent">não toca</span> aqui.
                </h1>

                <p className="nf__lede">
                    O link que seguiste pode ter mudado, expirado ou nunca ter existido.
                    Volta atrás ou explora outros artistas, há muito por descobrir.
                </p>

                <div className="nf__actions">
                    <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
                    >
                        <HiArrowLeft size={16} /> Voltar atrás
                    </button>
                </div>

            </div>
        </main>
    );
}
