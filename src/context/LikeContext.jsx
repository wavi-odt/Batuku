import { createLikeStore } from './createLikeStore.jsx'

const { Provider: LikeProvider, useStore: useLikes } = createLikeStore('/api/likes', {
    onToggle(key, next) {
        if (next) window.dispatchEvent(new Event('batuku:gamification-updated'))
        else window.dispatchEvent(new CustomEvent('batuku:track-unliked', { detail: { trackId: key } }))
    },
})

export { LikeProvider, useLikes }
