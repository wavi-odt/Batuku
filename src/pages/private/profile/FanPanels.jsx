/* ─────────────────────────────────────────────────────────────────
   FanPanels.jsx, Painéis das tabs do perfil de Fã.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../components/PublicComponets/ArtistArtwork'
import {
    CardTitle, BadgesGrid, PlaylistGrid, GenreBars,
    ActivityList, FollowingGrid,
} from './ProfileBlocks'

export function FanOverview({ fan }) {
    return (
        <div className="prof__grid">
            <div>
                <div className="prof-card prof__section-gap">
                    <CardTitle>Sobre</CardTitle>
                    <p className="prof__bio">{fan.bio}</p>
                </div>

                <div className="prof-card prof__section-gap">
                    <CardTitle link={`${fan.badges.filter(b => b.got).length} de ${fan.badges.length}`}>
                        Conquistas
                    </CardTitle>
                    <BadgesGrid badges={fan.badges.slice(0, 4)} />
                </div>

                <div className="prof-card">
                    <CardTitle link="Ver todas →">As minhas playlists</CardTitle>
                    <PlaylistGrid playlists={fan.playlists} />
                </div>
            </div>

            <div className="prof__col-side">
                <div className="prof-card">
                    <CardTitle>Géneros preferidos</CardTitle>
                    <GenreBars genres={fan.topGenres} />
                </div>

                <div className="prof-card">
                    <CardTitle>Ouvido recentemente</CardTitle>
                    {fan.recentlyPlayed.map((t, i) => (
                        <div key={i} className="playlist-item prof-recent">
                            <div className="playlist-item__cover prof-recent__cover">
                                <ArtistArtwork shape={t.shape} hue={t.hue} image={t.image} rounded={0} />
                            </div>
                            <div>
                                <div className="playlist-item__name prof-recent__name">{t.title}</div>
                                <div className="playlist-item__count">{t.artist}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function FanPlaylists({ fan }) {
    return (
        <div className="prof-card">
            <CardTitle link="+ Nova playlist">As minhas playlists · {fan.playlists.length}</CardTitle>
            <PlaylistGrid playlists={fan.playlists} />
        </div>
    );
}

export function FanAchievements({ fan }) {
    const got = fan.badges.filter(b => b.got).length;
    return (
        <div className="prof-card">
            <CardTitle link={`${got} de ${fan.badges.length} desbloqueados`}>Conquistas</CardTitle>
            <BadgesGrid badges={fan.badges} />
        </div>
    );
}

export function FanFollowing({ fan }) {
    return (
        <div className="prof-card">
            <CardTitle link={`${fan.followingList.length} artistas`}>A seguir</CardTitle>
            <FollowingGrid artists={fan.followingList} />
        </div>
    );
}

export function FanActivity({ fan }) {
    return (
        <div className="prof-card">
            <CardTitle>Atividade recente</CardTitle>
            <ActivityList items={fan.activity} />
        </div>
    );
}
