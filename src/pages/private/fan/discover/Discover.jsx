/* ─────────────────────────────────────────────────────────────────
   pages/fan/discover/Discover.jsx, Página de descoberta de música.
   ───────────────────────────────────────────────────────────────── */

import { useState, useEffect }  from 'react'
import AppShell                  from '../../../../components/HomeComponents/AppShell.jsx'
import { API, getToken }         from '../../../../utils/auth.js'
import { useGenres }             from '../../../../context/GenresContext.jsx'
import DiscoverFeatured          from './DiscoverFeatured.jsx'
import DiscoverGenres            from './DiscoverGenres.jsx'
import DiscoverReleases          from './DiscoverReleases.jsx'
import DiscoverCharts            from './DiscoverCharts.jsx'
import DiscoverSpotlight         from './DiscoverSpotlight.jsx'

import '../fanHome/ContinueListening.css'
import './Discover.css'

export default function Discover() {
    const [tracks,  setTracks]  = useState([])
    const [artists, setArtists] = useState([])
    const { genresMundiais, genresCaboverde } = useGenres()

    useEffect(() => {
        const headers = { Authorization: `Bearer ${getToken()}` }
        Promise.all([
            fetch(`${API}/api/tracks`,            { headers }).then(r => r.ok ? r.json() : []),
            fetch(`${API}/api/artists/suggested`, { headers }).then(r => r.ok ? r.json() : []),
        ])
        .then(([trackData, artistData]) => {
            setTracks(Array.isArray(trackData)   ? trackData   : [])
            setArtists(Array.isArray(artistData) ? artistData : [])
        })
        .catch(console.error)
    }, [])

    const byLikes  = [...tracks].sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
    const byDate   = [...tracks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const featured = byLikes[0] ?? null
    const charts   = byLikes.slice(0, 10)
    const releases = byDate.slice(0, 6)


    return (
        <AppShell role="fan">
            <DiscoverFeatured track={featured} allTracks={byLikes} />
            <DiscoverGenres
                genresMundiais={genresMundiais}
                genresCaboverde={genresCaboverde}
            />
            {releases.length > 0 && <DiscoverReleases tracks={releases} queue={byDate} />}
            {charts.length  > 0 && <DiscoverCharts   tracks={charts} />}
            {artists.length > 0 && <DiscoverSpotlight artists={artists} />}
        </AppShell>
    )
}
