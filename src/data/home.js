/* ─────────────────────────────────────────────────────────────────
   data/home.js, Dados mock para a Home (Fã) e Dashboard (Artista).
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

export const homeData = {

    fan: {
        name: 'Rafael Reis',
        handle: '@rafareis',
        avatar: { shape: 'split', hue: 285 },
        role: 'fan',
        country: 'Cabo Verde',
        level: 7,
        points: 4280,
        nextLevelAt: 5000,
        rank: 142,
        streak: 12,
        badges: 8,
        following: 24,
    },

    artist: {
        name: 'Djossa',
        handle: '@djossa',
        avatar: { shape: 'circles', hue: 14 },
        role: 'artist',
        country: 'Cabo Verde',
        location: 'Praia',
        genre: 'Funaná',
        isVerified: true,
        verifiedOn: 'spotify',
        level: 14,
        points: 18420,
        nextLevelAt: 20000,
        rank: 1,
        followers: 4280,
        tracksPublished: 18,
    },

    continueListening: [
        { title: 'Mar Salgado',  artist: 'Djossa',     shape: 'circles', hue: 14,  progress: 64, duration: '3:42', image: DjossaImg },
        { title: 'Noite di Lua', artist: 'Naia',       shape: 'arch',    hue: 220, progress: 22, duration: '4:18', image: NaiaImg },
        { title: 'Riba Mar',     artist: 'Yuri Brava', shape: 'orbit',   hue: 145, progress: 88, duration: '2:56', image: YuriImg },
        { title: 'Tabanka 81',   artist: 'Madá',       shape: 'sun',     hue: 8,   progress: 41, duration: '3:24', image: MadaImg },
        { title: 'Sodade Beat',  artist: 'Bento Lima', shape: 'stripes', hue: 42,  progress: 12, duration: '3:08', image: BentoImg },
    ],

    recommended: [
        { title: 'Praia di Mar', artist: 'Inês d\u2019Praia', shape: 'split',     hue: 340, reason: 'Porque ouves Funaná' , image: InesImg },
        { title: 'Kola San Jon', artist: 'Sosó Mendes',       shape: 'triangles', hue: 195, reason: 'Novo de quem segues', image: SosoImg },
        { title: 'Lua Cheia',    artist: 'Khris T.',          shape: 'wave',      hue: 280, reason: 'Tendência em Mindelo', image: KhrisImg },
        { title: 'Morabeza',     artist: 'Naia',              shape: 'arch',      hue: 220, reason: 'Top da semana',        image: NaiaImg },
    ],

    followingArtists: [
        { name: 'Djossa',     genre: 'Funaná',    shape: 'circles', hue: 14,  isLive: true,  newTracks: 2 },
        { name: 'Naia',       genre: 'Morna',     shape: 'arch',    hue: 220, isLive: false, newTracks: 1 },
        { name: 'Yuri Brava', genre: 'Cabo Love', shape: 'orbit',   hue: 145, isLive: false, newTracks: 0 },
        { name: 'Madá',       genre: 'Tabanka',   shape: 'sun',     hue: 8,   isLive: false, newTracks: 3 },
        { name: 'Bento Lima', genre: 'Coladeira', shape: 'stripes', hue: 42,  isLive: false, newTracks: 0 },
    ],

    activity: [
        { type: 'badge',   text: 'Ganhaste o badge "Madrugador" 🌅',                               time: 'agora' },
        { type: 'follow',  text: 'Djossa começou a seguir-te',                                     time: 'há 2h' },
        { type: 'comment', text: 'Naia respondeu ao teu comentário em "Sodade"',                   time: 'há 5h' },
        { type: 'like',    text: 'Yuri Brava gostou da tua playlist "CV Roots"',                   time: 'ontem' },
        { type: 'level',   text: 'Subiste para o nível 7, desbloqueaste o destaque na homepage',  time: 'há 2 dias' },
    ],

    artistStats: {
        plays:     { value: 18420, delta: 12.4, label: 'Reproduções'  },
        followers: { value:  4280, delta:  6.8, label: 'Seguidores'   },
        points:    { value: 18420, delta:  3.2, label: 'Pontos'       },
        rank:      { value:     1, delta: -2,   label: 'Rank semanal' },
    },

    growth: Array.from({ length: 30 }, (_, i) => {
        const base = 240 + i * 8;
        const noise = Math.round(Math.sin(i * 0.7) * 60 + Math.cos(i * 0.3) * 30);
        return { day: i + 1, plays: base + noise };
    }),

    myTracks: [
        { title: 'Mar Salgado',   plays: 4820, likes: 318, comments: 42, trend: '+18%', shape: 'circles', hue: 14, image: DjossaImg },
        { title: 'Sodade di Mar', plays: 3640, likes: 245, comments: 31, trend: '+12%', shape: 'arch',    hue: 14, image: DjossaImg },
        { title: 'Funaná Vivo',   plays: 3120, likes: 198, comments: 22, trend: '+8%',  shape: 'sun',     hue: 14 },
        { title: 'Praia Quente',  plays: 2840, likes: 156, comments: 18, trend: '-3%',  shape: 'stripes', hue: 14, image: DjossaImg },
        { title: 'Coração di CV', plays: 2210, likes: 124, comments: 14, trend: '+22%', shape: 'split',   hue: 14, image: DjossaImg },
    ],

    topFans: [
        { name: 'Rafael R.', handle: '@rafareis',  plays: 142, hue: 285 },
        { name: 'Ana M.',    handle: '@ana_m',     plays: 118, hue: 165 },
        { name: 'João L.',   handle: '@joaolopes', plays:  92, hue: 105 },
        { name: 'Sofia P.',  handle: '@sofia_p',   plays:  87, hue:  45 },
        { name: 'Carlos D.', handle: '@carlos_d',  plays:  74, hue: 320 },
    ],

    pendingComments: [
        { user: 'Rafael R.', hue: 285, track: 'Mar Salgado',   text: 'Esta produção está top, qual o BPM?',     time: 'há 12 min' },
        { user: 'Ana M.',    hue: 165, track: 'Sodade di Mar', text: 'Pode entrar na minha playlist de manhã?', time: 'há 1h' },
        { user: 'João L.',   hue: 105, track: 'Funaná Vivo',   text: 'Vai haver concerto em Lisboa?',           time: 'há 3h' },
    ],

    beatSales: [
        { title: 'Mar Salgado',  buyer: 'rafareis',  price: 19.99, time: 'há 12 min' },
        { title: 'Noite di Lua', buyer: 'producer1', price: 24.99, time: 'há 4h' },
        { title: 'Riba Mar',     buyer: 'beatlover', price: 14.99, time: 'ontem' },
    ],

    monthlyRevenue: { value: 324.85, delta: '+24%' },

    fanNav: [
        { icon: 'home',    label: 'Início',      to: '/home' },
        { icon: 'compass', label: 'Descobrir',   to: '/discover' },
        { icon: 'library', label: 'Biblioteca',  to: '/library' },
        { icon: 'heart',   label: 'A seguir',    to: '/following',    badge: 6 },
        { icon: 'trophy',  label: 'Conquistas',  to: '/achievements' },
        { icon: 'store',   label: 'Marketplace', to: '/marketplace' },
        { icon: 'discord', label: 'Comunidade',  to: '/community' },
    ],

    artistNav: [
        { icon: 'chart',   label: 'Dashboard',         to: '/dashboard' },
        { icon: 'music',   label: 'As minhas faixas',  to: '/tracks' },
        { icon: 'compass', label: 'Analytics',         to: '/analytics' },
        { icon: 'store',   label: 'Marketplace',       to: '/marketplace', badge: 3 },
        { icon: 'users',   label: 'Os meus fãs',       to: '/fans' },
        { icon: 'comment', label: 'Comentários',       to: '/comments',    badge: 3 },
        { icon: 'discord', label: 'Comunidade',        to: '/community' },
    ],

    nowPlaying: {
        title: 'Mar Salgado',
        artist: 'Djossa',
        album: 'Funaná Vivo',
        shape: 'circles',
        hue: 14,
        image: DjossaImg,
        progress: 64,
        duration: '3:42',
        current: '2:21',
    },
};
