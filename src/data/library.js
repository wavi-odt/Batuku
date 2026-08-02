/* ─────────────────────────────────────────────────────────────────
   data/library.js, Dados mock para a Biblioteca do fã.
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

/* Pool de todas as faixas disponíveis na biblioteca */
export const LIBRARY_TRACKS = [
    { id: 't-1',  title: 'Mar Salgado',   artist: 'Djossa',       duration: '3:42', shape: 'circles',   hue: 14,  image: DjossaImg },
    { id: 't-2',  title: 'Noite di Lua',  artist: 'Naia',         duration: '4:18', shape: 'arch',      hue: 220, image: NaiaImg   },
    { id: 't-3',  title: 'Riba Mar',      artist: 'Yuri Brava',   duration: '2:56', shape: 'orbit',     hue: 145, image: YuriImg   },
    { id: 't-4',  title: 'Tabanka 81',    artist: 'Madá',         duration: '3:24', shape: 'sun',       hue: 8,   image: MadaImg   },
    { id: 't-5',  title: 'Sodade Beat',   artist: 'Bento Lima',   duration: '3:08', shape: 'stripes',   hue: 42,  image: BentoImg  },
    { id: 't-6',  title: 'Praia di Mar',  artist: "Inês d'Praia", duration: '3:55', shape: 'split',     hue: 340, image: InesImg   },
    { id: 't-7',  title: 'Kola San Jon',  artist: 'Sosó Mendes',  duration: '4:02', shape: 'triangles', hue: 195, image: SosoImg   },
    { id: 't-8',  title: 'Lua Cheia',     artist: 'Khris T.',     duration: '3:31', shape: 'wave',      hue: 280, image: KhrisImg  },
    { id: 't-9',  title: 'Morabeza',      artist: 'Naia',         duration: '5:12', shape: 'arch',      hue: 220, image: NaiaImg   },
    { id: 't-10', title: 'Funaná Vivo',   artist: 'Djossa',       duration: '3:20', shape: 'circles',   hue: 14,  image: DjossaImg },
];

export const libraryData = {

    stats: {
        savedArtists: 24,
    },

    /* IDs das faixas com like → vão para a playlist Favoritos */
    likedTrackIds: ['t-1', 't-2', 't-6', 't-8', 't-10'],

    /* Playlists criadas pelo fã (cada uma com as suas faixas) */
    myPlaylists: [
        {
            id: 'pl-1', title: 'CV Roots',       isPublic: true,
            shape: 'split',     hue: 285, image: null,
            trackIds: ['t-1', 't-3', 't-5', 't-7', 't-9'],
        },
        {
            id: 'pl-2', title: 'Funaná Vibes',   isPublic: false,
            shape: 'circles',   hue: 14,  image: DjossaImg,
            trackIds: ['t-1', 't-2', 't-4', 't-10'],
        },
        {
            id: 'pl-3', title: 'Morna de Noite', isPublic: true,
            shape: 'arch',      hue: 220, image: NaiaImg,
            trackIds: ['t-2', 't-3', 't-9'],
        },
        {
            id: 'pl-4', title: 'Workout Beats',  isPublic: false,
            shape: 'orbit',     hue: 145, image: null,
            trackIds: ['t-4', 't-5', 't-6', 't-7', 't-8'],
        },
        {
            id: 'pl-5', title: 'Relax Flow',     isPublic: true,
            shape: 'wave',      hue: 200, image: null,
            trackIds: ['t-2', 't-6', 't-9', 't-10'],
        },
        {
            id: 'pl-6', title: 'Cabo Love',      isPublic: false,
            shape: 'triangles', hue: 340, image: InesImg,
            trackIds: ['t-1', 't-3', 't-6'],
        },
    ],

    /* Playlists de outros utilizadores que o fã guardou */
    savedPlaylists: [
        { id: 'pl-7', title: 'Top Batuku',       owner: 'batuku',  shape: 'stripes',   hue: 42,  image: null,      trackIds: [] },
        { id: 'pl-8', title: 'Mindelo Sessions', owner: 'djossa',  shape: 'circles',   hue: 14,  image: DjossaImg, trackIds: [] },
        { id: 'pl-9', title: 'Tarde Quente',     owner: 'naia_cv', shape: 'arch',      hue: 220, image: NaiaImg,   trackIds: [] },
    ],

    savedArtists: [
        { name: 'Djossa',       genre: 'Funaná',    followers: 4280, isLive: true,  newTracks: 2, shape: 'circles',   hue: 14,  image: DjossaImg },
        { name: 'Naia',         genre: 'Morna',     followers: 3120, isLive: false, newTracks: 1, shape: 'arch',      hue: 220, image: NaiaImg   },
        { name: 'Yuri Brava',   genre: 'Cabo Love', followers: 1870, isLive: false, newTracks: 0, shape: 'orbit',     hue: 145, image: YuriImg   },
        { name: 'Madá',         genre: 'Tabanka',   followers: 2340, isLive: false, newTracks: 3, shape: 'sun',       hue: 8,   image: MadaImg   },
        { name: 'Bento Lima',   genre: 'Coladeira', followers:  890, isLive: false, newTracks: 0, shape: 'stripes',   hue: 42,  image: BentoImg  },
        { name: "Inês d'Praia", genre: 'Funaná',    followers: 1540, isLive: false, newTracks: 1, shape: 'split',     hue: 340, image: InesImg   },
        { name: 'Sosó Mendes',  genre: 'Coladeira', followers: 2010, isLive: true,  newTracks: 0, shape: 'triangles', hue: 195, image: SosoImg   },
        { name: 'Khris T.',     genre: 'Cabo Love', followers: 1230, isLive: false, newTracks: 2, shape: 'wave',      hue: 280, image: KhrisImg  },
    ],
};
