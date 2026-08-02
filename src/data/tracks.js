/* ─────────────────────────────────────────────────────────────────
   data/tracks.js, Dados mock para "As minhas faixas" do artista.
   Substituir por chamadas reais quando o backend estiver pronto.
   ───────────────────────────────────────────────────────────────── */

import DjossaImg from '../assets/artists/djossa.png'

export const tracksData = {

    /* ─── Resumo do catálogo ─────────────────────────────────────── */
    summary: {
        total:      10,
        published:   7,
        drafts:      2,
        scheduled:   1,
        totalPlays:  24450,
        totalLikes:  1284,
    },

    /* ─── Catálogo completo ──────────────────────────────────────── */
    tracks: [
        {
            id: 't-1', title: 'Mar Salgado',   album: 'Funaná Vivo',    genre: 'Funaná',
            bpm: 92,  key: 'Am', duration: '3:42',
            status: 'published', publishedAt: '15 Jan 2025',
            hue: 14, image: DjossaImg,
            plays: { week: 820, total: 4820 }, likes: 318, comments: 42, saves: 124,
            trend: '+18%', isOnMarketplace: true,
        },
        {
            id: 't-2', title: 'Sodade di Mar', album: 'Funaná Vivo',    genre: 'Funaná',
            bpm: 86,  key: 'Dm', duration: '4:08',
            status: 'published', publishedAt: '15 Jan 2025',
            hue: 14, image: DjossaImg,
            plays: { week: 610, total: 3640 }, likes: 245, comments: 31, saves: 98,
            trend: '+12%', isOnMarketplace: false,
        },
        {
            id: 't-3', title: 'Funaná Vivo',   album: 'Funaná Vivo',    genre: 'Funaná',
            bpm: 102, key: 'G',  duration: '3:28',
            status: 'published', publishedAt: '15 Jan 2025',
            hue: 14, image: DjossaImg,
            plays: { week: 490, total: 3120 }, likes: 198, comments: 22, saves: 76,
            trend: '+8%', isOnMarketplace: false,
        },
        {
            id: 't-4', title: 'Praia Quente',  album: 'Funaná Vivo',    genre: 'Funaná',
            bpm: 96,  key: 'C',  duration: '3:15',
            status: 'published', publishedAt: '15 Jan 2025',
            hue: 14, image: DjossaImg,
            plays: { week: 320, total: 2840 }, likes: 156, comments: 18, saves: 62,
            trend: '-3%', isOnMarketplace: false,
        },
        {
            id: 't-5', title: 'Coração di CV', album: 'Funaná Vivo',    genre: 'Funaná',
            bpm: 88,  key: 'F',  duration: '4:22',
            status: 'published', publishedAt: '15 Jan 2025',
            hue: 14, image: DjossaImg,
            plays: { week: 540, total: 2210 }, likes: 124, comments: 14, saves: 48,
            trend: '+22%', isOnMarketplace: false,
        },
        {
            id: 't-6', title: 'Badiu di Nha Terra', album: 'Single',    genre: 'Funaná',
            bpm: 94,  key: 'Am', duration: '3:54',
            status: 'published', publishedAt: '3 Dez 2024',
            hue: 14, image: DjossaImg,
            plays: { week: 210, total: 1980 }, likes: 98,  comments: 11, saves: 34,
            trend: '-8%', isOnMarketplace: false,
        },
        {
            id: 't-7', title: 'Ilha Bonita',   album: 'Single',         genre: 'Coladeira',
            bpm: 112, key: 'E',  duration: '3:02',
            status: 'published', publishedAt: '18 Nov 2024',
            hue: 14, image: DjossaImg,
            plays: { week: 148, total: 1840 }, likes: 145, comments:  9, saves: 58,
            trend: '+5%', isOnMarketplace: false,
        },
        {
            id: 't-8', title: 'Sabura',         album: 'Álbum Novo (TBD)', genre: 'Funaná',
            bpm: 90,  key: 'Bm', duration: '3:38',
            status: 'scheduled', scheduledAt: '1 Fev 2025',
            hue: 18, image: DjossaImg,
            plays: { week: 0, total: 0 }, likes: 0, comments: 0, saves: 0,
            trend: null, isOnMarketplace: false,
        },
        {
            id: 't-9', title: 'Nha Bô',         album: null,             genre: 'Funaná',
            bpm: 84,  key: 'G',  duration: '2:58',
            status: 'draft', publishedAt: null,
            hue: 22, image: DjossaImg,
            plays: { week: 0, total: 0 }, likes: 0, comments: 0, saves: 0,
            trend: null, isOnMarketplace: false,
        },
        {
            id: 't-10', title: 'Terra Longe',   album: null,             genre: 'Morna',
            bpm: 72,  key: 'Cm', duration: '5:14',
            status: 'draft', publishedAt: null,
            hue: 220, image: null,
            plays: { week: 0, total: 0 }, likes: 0, comments: 0, saves: 0,
            trend: null, isOnMarketplace: false,
        },
    ],

    sortOptions: [
        { key: 'recent',  label: 'Mais recentes'  },
        { key: 'plays',   label: 'Mais reproduções' },
        { key: 'likes',   label: 'Mais likes'      },
        { key: 'trend',   label: 'Tendência'       },
        { key: 'oldest',  label: 'Mais antigas'    },
    ],
};
