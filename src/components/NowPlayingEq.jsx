import { usePlayer } from '../context/PlayerContext'

export default function NowPlayingEq({ className = '' }) {
    const { isPlaying } = usePlayer()
    return (
        <span className={`eq${isPlaying ? '' : ' eq--paused'}${className ? ' ' + className : ''}`} aria-label="A tocar">
            <i></i><i></i><i></i>
        </span>
    )
}
