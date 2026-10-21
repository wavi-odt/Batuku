import { createLikeStore } from './createLikeStore.jsx'

const { Provider: PlaylistLikeProvider, useStore: usePlaylistLikes } = createLikeStore('/api/playlist-likes')

export { PlaylistLikeProvider, usePlaylistLikes }
