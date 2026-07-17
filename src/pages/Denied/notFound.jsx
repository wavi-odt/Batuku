/* ─────────────────────────────────────────────────────────────────
   NotFound.jsx, Página 404.
   Visual rich: capas a flutuar, headline editorial, CTA para voltar.
   Usa apenas tokens + global.css. Sem dependências novas.
   ───────────────────────────────────────────────────────────────── */

import { Link, useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiHome, HiSearch } from 'react-icons/hi'
import { ARTISTS } from '../../data/batuku'
import ArtistArtwork from '../../components/PublicComponets/ArtistArtwork'
import './notFound.css'

export default function NotFound() {
    const navigate = useNavigate();

    /* Capas flutuantes (decorativas), posições absolutas em %.
       Cada uma com rotação + delay diferentes na animação. */
    const FLOATERS = [
        { top:  '8%', left:   '6%', size: 110, rot: -12, delay: '0s',   ...ARTISTS[0] },
        { top: '18%', left:  '78%', size: 140, rot:   8, delay: '0.4s', ...ARTISTS[1] },
        { top: '62%', left:   '4%', size: 130, rot:  10, delay: '0.8s', ...ARTISTS[2] },
        { top: '70%', left:  '82%', size: 120, rot:  -6, delay: '1.2s', ...ARTISTS[3] },
        { top: '38%', left:   '2%', size:  82, rot:  18, delay: '0.6s', ...ARTISTS[4] },
        { top: '40%', left:  '90%', size:  88, rot: -16, delay: '1.0s', ...ARTISTS[5] },
    ];

    return (
        <main className="nf">
            <div className="nf__bg" aria-hidden="true" />

            <div className="nf__floaters" aria-hidden="true">
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
            </div>

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
                        onClick={() => navigate(-1)}
                    >
                        <HiArrowLeft size={16} /> Voltar atrás
                    </button>
                    <Link to="/" className="btn btn--primary">
                        <HiHome size={16} /> Ir para o início
                    </Link>
                    <Link to="/artists" className="btn btn--ghost">
                        <HiSearch size={16} /> Explorar artistas
                    </Link>
                </div>

                <p className="nf__hint">
                    Se achas que isto é um erro nosso,{' '}
                    <Link to="/contact" className="link--coral">avisa-nos</Link>.
                </p>
            </div>
        </main>
    );
}
