/* ─────────────────────────────────────────────────────────────────
   pages/fan/discover/Discover.jsx, Página de descoberta de música.
   ───────────────────────────────────────────────────────────────── */

import AppShell             from '../../../../components/HomeComponents/AppShell.jsx'
import { discoverData }     from '../../../../data/discover.js'
import DiscoverFeatured     from './DiscoverFeatured.jsx'
import DiscoverGenres       from './DiscoverGenres.jsx'
import DiscoverReleases     from './DiscoverReleases.jsx'
import DiscoverCharts       from './DiscoverCharts.jsx'
import DiscoverEditorial    from './DiscoverEditorial.jsx'
import DiscoverSpotlight    from './DiscoverSpotlight.jsx'

/* importar CSS de ContinueListening porque reutilizamos .track-card */
import '../fanHome/ContinueListening.css'
import './Discover.css'

const d = discoverData;

export default function Discover() {
    return (
        <AppShell role="fan">

            {/* ─── Spotlight ───────────────────────────────────────── */}
            <DiscoverFeatured featured={d.featured} />

            {/* ─── Géneros ─────────────────────────────────────────── */}
            <DiscoverGenres genres={d.genres} />

            {/* ─── Novos lançamentos ───────────────────────────────── */}
            <DiscoverReleases releases={d.newReleases} />

            {/* ─── Charts ──────────────────────────────────────────── */}
            <DiscoverCharts charts={d.charts} />

            {/* ─── Playlists editoriais ────────────────────────────── */}
            <DiscoverEditorial playlists={d.editorial} />

            {/* ─── Artistas em destaque ────────────────────────────── */}
            <DiscoverSpotlight artists={d.spotlightArtists} />

        </AppShell>
    );
}
