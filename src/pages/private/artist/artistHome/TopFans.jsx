/* ─────────────────────────────────────────────────────────────────
   TopFans.jsx, Lista dos fãs que mais ouvem o artista.
   ───────────────────────────────────────────────────────────────── */

import ArtistArtwork from '../../../../components/PublicComponets/ArtistArtwork.jsx'
import './TopFans.css'

export default function TopFans({ fans }) {
    return (
        <div className="fans-card">
            <h3 className="fans-card__title">
                Top fãs esta semana
                <a href="#" className="dash__head-link">Ver todos →</a>
            </h3>
            {fans.map((f, i) => (
                <div key={i} className="fans-row">
                    <div className={'fans-row__rank' + (i === 0 ? ' fans-row__rank--gold' : '')}>
                        #{i + 1}
                    </div>
                    <div className="fans-row__avatar">
                        <ArtistArtwork shape="split" hue={f.hue} image={f.image} rounded={0} />
                    </div>
                    <div className="fans-row__info">
                        <div className="fans-row__name">{f.name}</div>
                        <div className="fans-row__handle">{f.handle}</div>
                    </div>
                    <div className="fans-row__plays">{f.plays} plays</div>
                </div>
            ))}
        </div>
    );
}
