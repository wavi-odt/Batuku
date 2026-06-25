/* ─────────────────────────────────────────────────────────────────
   ArtistPanels.jsx — Painéis das tabs do perfil de Artista.
   ───────────────────────────────────────────────────────────────── */

import {
    CardTitle, BadgesGrid, FeaturedTracks,
    ArtistAbout, ArtistLinks,
} from './ProfileBlocks'

export function ArtistOverview({ artist }) {
    return (
        <div className="prof__grid">
            <div>
                <div className="prof-card prof__section-gap">
                    <CardTitle link="Ver todas →">Faixas em destaque</CardTitle>
                    <FeaturedTracks tracks={artist.featuredTracks} />
                </div>
                <div className="prof-card">
                    <CardTitle link={`${artist.badges.filter(b => b.got).length} de ${artist.badges.length}`}>
                        Conquistas
                    </CardTitle>
                    <BadgesGrid badges={artist.badges} />
                </div>
            </div>
            <div className="prof__col-side">
                <ArtistAbout artist={artist} />
                <ArtistLinks social={artist.social} />
            </div>
        </div>
    );
}

export function ArtistTracks({ artist }) {
    return (
        <div className="prof-card">
            <CardTitle link="+ Publicar faixa">Todas as faixas · {artist.featuredTracks.length}</CardTitle>
            <FeaturedTracks tracks={artist.featuredTracks} />
        </div>
    );
}

export function ArtistAboutPanel({ artist }) {
    return (
        <div className="prof__grid">
            <ArtistAbout artist={artist} />
            <div className="prof__col-side">
                <ArtistLinks social={artist.social} />
            </div>
        </div>
    );
}

export function ArtistAchievements({ artist }) {
    const got = artist.badges.filter(b => b.got).length;
    return (
        <div className="prof-card">
            <CardTitle link={`${got} de ${artist.badges.length} desbloqueados`}>Conquistas</CardTitle>
            <BadgesGrid badges={artist.badges} />
        </div>
    );
}
