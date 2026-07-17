import DjossaImg   from '../assets/artists/djossa.png'
import NaiaImg     from '../assets/artists/naia.png'
import MadaImg     from '../assets/artists/Madá.png'
import Playlist0   from '../assets/playlists/img.png'
import Playlist1   from '../assets/playlists/img_1.png'
import Playlist2   from '../assets/playlists/img_2.png'
import Playlist3   from '../assets/playlists/img_3.png'

/* ─────────────────────────────────────────────────────────────────
   data/profile.js, Dados do perfil (Fã + Artista).

   ⚠️  TUDO AQUI É MOCK. Para ligar ao backend, substitui o objeto
   `profileData` pelo resultado de um fetch. Estrutura sugerida:

       const { data } = await api.get(`/users/${id}/profile`);
       // data deve ter o mesmo shape que profileData.fan / .artist

   Os componentes do perfil leem só deste ficheiro, não precisas
   de tocar em mais lado nenhum quando ligares a API.
   ───────────────────────────────────────────────────────────────── */

export const profileData = {

    /* ═══ FÃ ═══════════════════════════════════════════════════════ */
    fan: {
        // identidade
        name: 'Rafael Reis',
        handle: '@rafareis',
        avatar: { shape: 'split', hue: 285 },
        country: 'Cabo Verde',
        location: 'Roterdão, NL',
        joined: 'março 2025',
        bio: 'Fã de Funaná e Morna desde sempre. Faço playlists para a diáspora em Roterdão. Sodade é também futuro.',

        // stats
        level: 7,
        points: 4280,
        rank: 142,
        badgesCount: 8,
        following: 24,
        followers: 86,

        topGenres: [
            { name: 'Funaná',    pct: 42, hue: 14 },
            { name: 'Morna',     pct: 28, hue: 220 },
            { name: 'Cabo Love', pct: 18, hue: 145 },
            { name: 'Coladeira', pct: 12, hue: 42 },
        ],

        badges: [
            { icon: 'sunrise', name: 'Madrugador', desc: 'Ouviste antes das 7h, 10 dias', tier: 'gold',    got: true },
            { icon: 'fire',    name: 'Streak 12',  desc: '12 dias seguidos a ouvir',       tier: 'coral',   got: true },
            { icon: 'compass', name: 'Explorador', desc: 'Ouviste 50 artistas diferentes', tier: 'ocean',   got: true },
            { icon: 'heart',   name: 'Apoiante',   desc: 'Seguiste 20 artistas',           tier: 'pink',    got: true },
            { icon: 'star',    name: 'Curador',    desc: 'Playlist com 100+ likes',        tier: 'mustard', got: true },
            { icon: 'crown',   name: 'Top 100',    desc: 'Entraste no top 100 semanal',    tier: 'green',   got: true },
            { icon: 'ticket',  name: 'Concertos',  desc: 'Vai a 5 eventos',                tier: 'locked',  got: false },
            { icon: 'gem',     name: 'Lenda',      desc: 'Atinge o nível 10',              tier: 'locked',  got: false },
        ],

        playlists: [
            { name: 'CV Roots',         tracks: 42, hue: 14,  shape: 'circles', image: Playlist0 },
            { name: 'Morna pra Chorar', tracks: 28, hue: 220, shape: 'arch',    image: Playlist1 },
            { name: 'Funaná no Carro',  tracks: 35, hue: 42,  shape: 'sun',     image: Playlist2 },
            { name: 'Diáspora Vibes',   tracks: 51, hue: 145, shape: 'wave',    image: Playlist3 },
        ],

        recentlyPlayed: [
            { title: 'Mar Salgado',  artist: 'Djossa', hue: 14,  shape: 'circles', image: DjossaImg },
            { title: 'Noite di Lua', artist: 'Naia',   hue: 220, shape: 'arch', image: NaiaImg },
            { title: 'Tabanka 81',   artist: 'Madá',   hue: 8,   shape: 'sun', image: MadaImg },
        ],

        followingList: [
            { name: 'Djossa',          genre: 'Funaná',    city: 'Praia',      shape: 'circles',   hue: 14,  isLive: true },
            { name: 'Naia',            genre: 'Morna',     city: 'Mindelo',    shape: 'arch',      hue: 220, isLive: false },
            { name: 'Bento Lima',      genre: 'Coladeira', city: 'São Filipe', shape: 'stripes',   hue: 42,  isLive: false },
            { name: 'Yuri Brava',      genre: 'Cabo Love', city: 'Sal',        shape: 'orbit',     hue: 145, isLive: false },
            { name: 'Madá',            genre: 'Tabanka',   city: 'Tarrafal',   shape: 'sun',       hue: 8,   isLive: true },
            { name: 'Khris T.',        genre: 'Kizomba',   city: 'Mindelo',    shape: 'wave',      hue: 280, isLive: false },
            { name: 'Sosó Mendes',     genre: 'Kola',      city: 'Boa Vista',  shape: 'triangles', hue: 195, isLive: false },
            { name: 'Inês d\u2019Praia', genre: 'Batuque', city: 'Praia',      shape: 'split',     hue: 340, isLive: false },
        ],

        activity: [
            { type: 'badge',    text: 'Ganhaste o badge "Madrugador" 🌅',                          time: 'agora' },
            { type: 'follow',   text: 'Começaste a seguir Inês d\u2019Praia',                        time: 'há 1h' },
            { type: 'like',     text: 'Gostaste de "Mar Salgado" de Djossa',                        time: 'há 3h' },
            { type: 'playlist', text: 'Adicionaste 4 faixas à playlist "CV Roots"',                time: 'há 5h' },
            { type: 'comment',  text: 'Comentaste em "Noite di Lua" de Naia',                       time: 'ontem' },
            { type: 'level',    text: 'Subiste para o nível 7, destaque na homepage desbloqueado', time: 'há 2 dias' },
            { type: 'follow',   text: 'Yuri Brava começou a seguir-te',                             time: 'há 3 dias' },
            { type: 'badge',    text: 'Ganhaste o badge "Explorador" 🧭',                           time: 'há 4 dias' },
        ],
    },

    /* ═══ ARTISTA ══════════════════════════════════════════════════ */
    artist: {
        name: 'Djossa',
        handle: '@djossa',
        avatar: { shape: 'circles', hue: 14 },
        country: 'Cabo Verde',
        location: 'Praia',
        joined: 'janeiro 2024',
        isVerified: true,
        verifiedOn: 'spotify',
        bio: 'Funaná do coração da Praia. Misturo a gaita tradicional com produção moderna. Já toquei em Lisboa, Roterdão e Boston. Disponível para colaborações e beats por encomenda.',

        // stats
        points: 18420,
        rank: 1,
        followers: 4280,
        monthlyListeners: 12840,
        tracksPublished: 18,

        about: {
            location:  'Praia, Santiago · Cabo Verde',
            genre:     'Funaná · Coladeira',
            languages: 'Crioulo, Português',
            forHire:   true,
        },

        social: [
            { kind: 'spotify',   handle: 'Djossa' },
            { kind: 'instagram', handle: '@djossa.cv' },
            { kind: 'youtube',   handle: 'Djossa Oficial' },
        ],

        featuredTracks: [
            { title: 'Mar Salgado',   plays: 4820, duration: '3:42', hue: 14, image: DjossaImg, shape: 'circles' },
            { title: 'Sodade di Mar', plays: 3640, duration: '4:08', hue: 14, image: DjossaImg, shape: 'arch' },
            { title: 'Funaná Vivo',   plays: 3120, duration: '3:18', hue: 14, image: DjossaImg, shape: 'sun' },
            { title: 'Praia Quente',  plays: 2840, duration: '2:56', hue: 14, image: DjossaImg, shape: 'stripes' },
            { title: 'Coração di CV', plays: 2210, duration: '3:33', hue: 14, image: DjossaImg, shape: 'split' },
        ],

        badges: [
            { icon: 'crown',    name: '#1 Semanal', desc: 'Topo do ranking esta semana', tier: 'gold',    got: true },
            { icon: 'fire',     name: 'Em alta',    desc: '+20% reproduções num mês',     tier: 'coral',   got: true },
            { icon: 'verified', name: 'Verificado', desc: 'Conta ligada ao Spotify',      tier: 'green',   got: true },
            { icon: 'star',     name: 'Top Vendas', desc: 'Top 10 do marketplace',        tier: 'mustard', got: true },
            { icon: 'users',    name: '4k Fãs',     desc: 'Mais de 4000 seguidores',      tier: 'ocean',   got: true },
            { icon: 'gem',      name: '50k Plays',  desc: 'Atinge 50.000 reproduções',    tier: 'locked',  got: false },
        ],
    },
};

export default profileData;
