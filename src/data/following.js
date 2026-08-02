/* ─────────────────────────────────────────────────────────────────
   data/following.js, Dados mock para a página A Seguir.
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

export const followingData = {

    /* ─── A ouvir agora (pessoas/artistas que segues) ───────────── */
    nowListening: [
        {
            user: 'Rafael R.',  handle: '@rafareis',  userShape: 'split',     userHue: 285, userImage: null,
            track: 'Mar Salgado',   artist: 'Djossa',      trackShape: 'circles',   trackHue: 14,  trackImage: DjossaImg, since: 'agora',
        },
        {
            user: 'Ana M.',     handle: '@ana_m',     userShape: 'orbit',     userHue: 165, userImage: null,
            track: 'Noite di Lua',  artist: 'Naia',        trackShape: 'arch',      trackHue: 220, trackImage: NaiaImg,   since: 'há 2 min',
        },
        {
            user: 'Djossa',     handle: '@djossa',    userShape: 'circles',   userHue: 14,  userImage: DjossaImg,
            track: 'Sodade Beat',   artist: 'Bento Lima',  trackShape: 'stripes',   trackHue: 42,  trackImage: BentoImg,  since: 'há 5 min',
        },
        {
            user: 'Naia',       handle: '@naia_cv',   userShape: 'arch',      userHue: 220, userImage: NaiaImg,
            track: 'Tabanka 81',    artist: 'Madá',        trackShape: 'sun',       trackHue: 8,   trackImage: MadaImg,   since: 'há 11 min',
        },
        {
            user: 'João L.',    handle: '@joaolopes', userShape: 'triangles', userHue: 105, userImage: null,
            track: 'Lua Cheia',     artist: 'Khris T.',    trackShape: 'wave',      trackHue: 280, trackImage: KhrisImg,  since: 'há 18 min',
        },
    ],

    /* ─── Novos conteúdos dos artistas seguidos ──────────────────── */
    newContent: [
        { id: 'n-1', title: 'Mar Salgado',      artist: 'Djossa',      type: 'Faixa', timeAgo: 'há 2h',     shape: 'circles',   hue: 14,  image: DjossaImg },
        { id: 'n-2', title: 'Noite di Lua',     artist: 'Naia',        type: 'Faixa', timeAgo: 'há 5h',     shape: 'arch',      hue: 220, image: NaiaImg   },
        { id: 'n-3', title: 'Tabanka 81 EP',    artist: 'Madá',        type: 'EP',    timeAgo: 'ontem',     shape: 'sun',       hue: 8,   image: MadaImg   },
        { id: 'n-4', title: 'Beats do Mindelo', artist: 'Khris T.',    type: 'EP',    timeAgo: 'há 3 dias', shape: 'wave',      hue: 280, image: KhrisImg  },
        { id: 'n-5', title: 'Coladeira Nova',   artist: 'Bento Lima',  type: 'Faixa', timeAgo: 'há 5 dias', shape: 'stripes',   hue: 42,  image: BentoImg  },
    ],

    /* ─── Roster completo de artistas seguidos ───────────────────── */
    roster: [
        { name: 'Djossa',      genre: 'Funaná',    followers: 4280, isLive: true,  newTracks: 2, lastActive: 'Ao vivo agora', shape: 'circles',   hue: 14,  image: DjossaImg },
        { name: 'Naia',        genre: 'Morna',     followers: 3120, isLive: false, newTracks: 1, lastActive: 'há 5h',        shape: 'arch',      hue: 220, image: NaiaImg   },
        { name: 'Yuri Brava',  genre: 'Cabo Love', followers: 1870, isLive: false, newTracks: 0, lastActive: 'há 2 dias',   shape: 'orbit',     hue: 145, image: YuriImg   },
        { name: 'Madá',        genre: 'Tabanka',   followers: 2340, isLive: false, newTracks: 3, lastActive: 'ontem',       shape: 'sun',       hue: 8,   image: MadaImg   },
        { name: 'Bento Lima',  genre: 'Coladeira', followers:  890, isLive: false, newTracks: 0, lastActive: 'há 5 dias',   shape: 'stripes',   hue: 42,  image: BentoImg  },
        { name: 'Khris T.',    genre: 'Cabo Love', followers: 1230, isLive: false, newTracks: 2, lastActive: 'há 1 semana', shape: 'wave',      hue: 280, image: KhrisImg  },
        { name: 'Sosó Mendes', genre: 'Coladeira', followers: 2010, isLive: true,  newTracks: 0, lastActive: 'Ao vivo agora', shape: 'triangles', hue: 195, image: SosoImg  },
    ],

    /* ─── Feed de atividade dos artistas seguidos ────────────────── */
    /* type: 'release' | 'live' | 'update' */
    feed: [
        {
            id: 'f-1', artist: 'Djossa', shape: 'circles', hue: 14, image: DjossaImg,
            type: 'release', text: 'lançou uma nova faixa', time: 'há 2h',
            content: { title: 'Mar Salgado', image: DjossaImg, shape: 'circles', hue: 14 },
        },
        {
            id: 'f-2', artist: 'Naia', shape: 'arch', hue: 220, image: NaiaImg,
            type: 'release', text: 'lançou uma nova faixa', time: 'há 5h',
            content: { title: 'Noite di Lua', image: NaiaImg, shape: 'arch', hue: 220 },
        },
        {
            id: 'f-3', artist: 'Sosó Mendes', shape: 'triangles', hue: 195, image: SosoImg,
            type: 'live', text: 'foi ao vivo · 67 a ouvir', time: 'há 8h',
            content: null,
        },
        {
            id: 'f-4', artist: 'Madá', shape: 'sun', hue: 8, image: MadaImg,
            type: 'release', text: 'lançou um EP', time: 'ontem',
            content: { title: 'Tabanka 81 EP', image: MadaImg, shape: 'sun', hue: 8 },
        },
        {
            id: 'f-5', artist: 'Yuri Brava', shape: 'orbit', hue: 145, image: YuriImg,
            type: 'update', text: 'atualizou o perfil', time: 'há 2 dias',
            content: null,
        },
        {
            id: 'f-6', artist: 'Bento Lima', shape: 'stripes', hue: 42, image: BentoImg,
            type: 'release', text: 'lançou uma nova faixa', time: 'há 5 dias',
            content: { title: 'Coladeira Nova', image: BentoImg, shape: 'stripes', hue: 42 },
        },
    ],

    /* ─── Sugestões de artistas a seguir ────────────────────────── */
    suggestions: [
        { name: "Inês d'Praia",        genre: 'Funaná',    followers: 1540, reason: 'Porque ouves Funaná',    shape: 'split',     hue: 340, image: InesImg  },
        { name: 'Khris T.',             genre: 'Cabo Love', followers: 1230, reason: 'Tendência esta semana',  shape: 'wave',      hue: 280, image: KhrisImg },
        { name: 'Finaçon Collective',   genre: 'Finaçon',   followers:  640, reason: 'Porque segues Madá',     shape: 'split',     hue: 95,  image: null     },
        { name: 'DJ Mindelo',           genre: 'Cabo Love', followers:  410, reason: 'Novo no Batuku',         shape: 'orbit',     hue: 190, image: null     },
    ],
};
