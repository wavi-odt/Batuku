/* ─────────────────────────────────────────────────────────────────
   MiniPlayer.jsx — Player sticky no fundo da app.
   Estado local para play/pause. Liga ao backend através de props futuras.
   ───────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaRandom, FaSyncAlt,
} from 'react-icons/fa'
import { HiHeart, HiVolumeUp, HiArrowsExpand } from 'react-icons/hi'
import { homeData } from '../../data/home'
import ArtistArtwork from '../PublicComponets/ArtistArtwork'
import './MiniPlayer.css'

export default function MiniPlayer() {
    const np = homeData.nowPlaying;
    const [playing, setPlaying] = useState(true);
    const [liked, setLiked] = useState(false);

    return (
        <footer className="player">

            {/* Track info */}
            <div className="player__track">
                <div className="player__cover">
                    <ArtistArtwork shape={np.shape} hue={np.hue} rounded={0} />
                </div>
                <div className="player__info">
                    <div className="player__title">{np.title}</div>
                    <div className="player__artist">{np.artist} · {np.album}</div>
                </div>
                <button
                    type="button"
                    className={'player__btn' + (liked ? ' is-liked' : '')}
                    onClick={() => setLiked(v => !v)}
                    aria-label={liked ? 'Remover gosto' : 'Gostar'}
                >
                    <HiHeart size={16} />
                </button>
            </div>

            {/* Playback controls */}
            <div className="player__controls">
                <div className="player__btns">
                    <button type="button" className="player__btn" aria-label="Aleatório"><FaRandom size={14} /></button>
                    <button type="button" className="player__btn" aria-label="Anterior"><FaStepBackward size={16} /></button>
                    <button
                        type="button"
                        className="player__btn player__btn--play"
                        onClick={() => setPlaying(p => !p)}
                        aria-label={playing ? 'Pausar' : 'Reproduzir'}
                    >
                        {playing ? <FaPause size={12} /> : <FaPlay size={12} />}
                    </button>
                    <button type="button" className="player__btn" aria-label="Próxima"><FaStepForward size={16} /></button>
                    <button type="button" className="player__btn" aria-label="Repetir"><FaSyncAlt size={14} /></button>
                </div>
                <div className="player__progress">
                    <span className="player__time">{np.current}</span>
                    <div className="player__bar" role="slider" aria-label="Posição da faixa">
                        <div className="player__bar-fill" style={{ width: `${np.progress}%` }} />
                    </div>
                    <span className="player__time">{np.duration}</span>
                </div>
            </div>

            {/* Extras (volume, expand) */}
            <div className="player__extras">
                <button type="button" className="player__btn" aria-label="Expandir">
                    <HiArrowsExpand size={16} />
                </button>
                <div className="player__volume">
                    <HiVolumeUp size={16} />
                    <div className="player__volume-bar">
                        <div className="player__volume-fill" style={{ width: '68%' }} />
                    </div>
                </div>
            </div>
        </footer>
    );
}
