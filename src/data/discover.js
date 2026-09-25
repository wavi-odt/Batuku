/* ─────────────────────────────────────────────────────────────────
   data/discover.js, Dados mock para a página Descobrir.
   Substituir por chamadas reais quando o backend estiver pronto.
   ───────────────────────────────────────────────────────────────── */

import DjossaImg from '../assets/artists/djossa.png'
import NaiaImg   from '../assets/artists/naia.png'
import BentoImg  from '../assets/artists/Bento Lima.png'
import InesImg   from '../assets/artists/Inês.png'
import YuriImg   from '../assets/artists/Yuri Brava.png'
import KhrisImg  from '../assets/artists/Khris T.png'
import MadaImg   from '../assets/artists/Madá.png'
import SosoImg   from '../assets/artists/Sosó Mendes.png'

export const discoverData = {

    /* ─── Spotlight (artista/faixa em destaque) ──────────────────── */
    featured: {
        badge:       'Álbum da semana',
        title:       'Funaná di Mar',
        artist:      'Djossa',
        description: 'O álbum mais ouvido em Cabo Verde esta semana. Djossa volta com uma fusão inédita de funaná tradicional e produção moderna.',
        listeners:   12480,
        plays:       48200,
        shape:       'circles',
        hue:         14,
        image:       DjossaImg,
    },

    /* ─── Géneros mundiais ───────────────────────────────────────── */
    genresMundiais: [
        { id: 'pop',        label: 'Pop',         hue: 340 },
        { id: 'hiphop',     label: 'Hip-Hop',     hue: 28  },
        { id: 'soul',       label: 'Soul',        hue: 290 },
        { id: 'electronic', label: 'Electrónica', hue: 200 },
        { id: 'afrobeat',   label: 'Afrobeat',    hue: 22  },
        { id: 'afrohouse',  label: 'Afrohouse',   hue: 35  },
        { id: 'afrotech',   label: 'Afrotech',    hue: 195 },
        { id: 'reggae',     label: 'Reggae',      hue: 130 },
        { id: 'jazz',       label: 'Jazz',        hue: 240 },
        { id: 'rock',       label: 'Rock',        hue: 5   },
        { id: 'latin',      label: 'Latin',       hue: 15  },
        { id: 'kizomba',    label: 'Kizomba',     hue: 320 },
        { id: 'gospel',     label: 'Gospel',      hue: 55  },
        { id: 'classical',  label: 'Clássico',    hue: 260 },
    ],

    /* ─── Géneros cabo-verdianos ─────────────────────────────────── */
    genresCaboverde: [
        { id: 'funana',    label: 'Funaná',    hue: 14,  tracks: 840 },
        { id: 'morna',     label: 'Morna',     hue: 220, tracks: 620 },
        { id: 'coladeira', label: 'Coladeira', hue: 42,  tracks: 520 },
        { id: 'cabo-love', label: 'Cabo Love', hue: 145, tracks: 430 },
        { id: 'tabanka',   label: 'Tabanka',   hue: 8,   tracks: 310 },
        { id: 'batuku',    label: 'Batuku',    hue: 185, tracks: 210 },
        { id: 'kotxi-po',  label: 'Kotxi Po',  hue: 95,  tracks: 140 },
    ],

    /* ─── Charts (top 10 semanal) ───────────────────────────────── */
    /* prevRank: 0 = nova entrada */
    charts: [
        { rank: 1,  prevRank: 2,  title: 'Mar Salgado',    artist: 'Djossa',       plays: '48.2K', shape: 'circles',   hue: 14,  image: DjossaImg },
        { rank: 2,  prevRank: 1,  title: 'Noite di Lua',   artist: 'Naia',         plays: '41.8K', shape: 'arch',      hue: 220, image: NaiaImg   },
        { rank: 3,  prevRank: 5,  title: 'Riba Mar',       artist: 'Yuri Brava',   plays: '37.5K', shape: 'orbit',     hue: 145, image: YuriImg   },
        { rank: 4,  prevRank: 4,  title: 'Tabanka 81',     artist: 'Madá',         plays: '31.2K', shape: 'sun',       hue: 8,   image: MadaImg   },
        { rank: 5,  prevRank: 8,  title: 'Sodade Beat',    artist: 'Bento Lima',   plays: '28.9K', shape: 'stripes',   hue: 42,  image: BentoImg  },
        { rank: 6,  prevRank: 3,  title: 'Praia di Mar',   artist: "Inês d'Praia", plays: '26.4K', shape: 'split',     hue: 340, image: InesImg   },
        { rank: 7,  prevRank: 0,  title: 'Kola San Jon',   artist: 'Sosó Mendes',  plays: '22.1K', shape: 'triangles', hue: 195, image: SosoImg   },
        { rank: 8,  prevRank: 6,  title: 'Lua Cheia',      artist: 'Khris T.',     plays: '19.8K', shape: 'wave',      hue: 280, image: KhrisImg  },
        { rank: 9,  prevRank: 10, title: 'Morabeza',       artist: 'Naia',         plays: '17.3K', shape: 'arch',      hue: 220, image: NaiaImg   },
        { rank: 10, prevRank: 7,  title: 'Funaná Vivo',    artist: 'Djossa',       plays: '15.6K', shape: 'circles',   hue: 14,  image: DjossaImg },
    ],

    /* ─── Novos lançamentos ──────────────────────────────────────── */
    newReleases: [
        { id: 'r-1', title: 'Funaná di Mar',    artist: 'Djossa',       type: 'Álbum',  daysAgo: 2,  shape: 'circles',   hue: 14,  image: DjossaImg },
        { id: 'r-2', title: 'Sodade EP',        artist: 'Naia',         type: 'EP',     daysAgo: 5,  shape: 'arch',      hue: 220, image: NaiaImg   },
        { id: 'r-3', title: 'Riba Mar',         artist: 'Yuri Brava',   type: 'Single', daysAgo: 7,  shape: 'orbit',     hue: 145, image: YuriImg   },
        { id: 'r-4', title: 'Beats do Mindelo', artist: 'Khris T.',     type: 'EP',     daysAgo: 12, shape: 'wave',      hue: 280, image: KhrisImg  },
        { id: 'r-5', title: 'Kola San Jon',     artist: 'Sosó Mendes',  type: 'Single', daysAgo: 14, shape: 'triangles', hue: 195, image: SosoImg   },
    ],

    /* ─── Playlists editoriais do Batuku ─────────────────────────── */
    editorial: [
        { id: 'ed-1', title: 'Top Batuku',       description: 'As faixas mais ouvidas da semana',    tracks: 50, updatedAt: 'Hoje',       shape: 'stripes',   hue: 42,  image: null      },
        { id: 'ed-2', title: 'Funaná Essencial', description: 'O melhor do funaná clássico e novo',  tracks: 32, updatedAt: 'Ontem',      shape: 'circles',   hue: 14,  image: DjossaImg },
        { id: 'ed-3', title: 'Morna de Noite',   description: 'Para noites calmas e de sodade',      tracks: 28, updatedAt: 'Há 3 dias',  shape: 'arch',      hue: 220, image: NaiaImg   },
        { id: 'ed-4', title: 'Novos Talentos',   description: 'Artistas emergentes de Cabo Verde',   tracks: 20, updatedAt: 'Há 1 sem',   shape: 'triangles', hue: 195, image: SosoImg   },
    ],

    /* ─── Artistas em destaque ───────────────────────────────────── */
    spotlightArtists: [
        { name: 'Sosó Mendes',  genre: 'Coladeira', listeners: 2010, isVerified: true,  newRelease: 'Kola San Jon',      shape: 'triangles', hue: 195, image: SosoImg   },
        { name: 'Khris T.',     genre: 'Cabo Love', listeners: 1230, isVerified: false, newRelease: 'Beats do Mindelo',  shape: 'wave',      hue: 280, image: KhrisImg  },
        { name: "Inês d'Praia", genre: 'Funaná',    listeners: 1540, isVerified: true,  newRelease: 'Praia di Mar',      shape: 'split',     hue: 340, image: InesImg   },
        { name: 'Madá',         genre: 'Tabanka',   listeners: 2340, isVerified: false, newRelease: null,                shape: 'sun',       hue: 8,   image: MadaImg   },
    ],
};
