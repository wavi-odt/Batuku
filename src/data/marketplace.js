/* ─────────────────────────────────────────────────────────────────
   data/marketplace.js, Dados mock para o Marketplace de Beats.
   Substituir por chamadas reais quando o backend estiver pronto.
   ───────────────────────────────────────────────────────────────── */

import BeatImg0 from '../assets/beats/img.png'
import BeatImg1 from '../assets/beats/img_1.png'
import BeatImg2 from '../assets/beats/img_2.png'
import BeatImg3 from '../assets/beats/img_3.png'
import BeatImg4 from '../assets/beats/img_4.png'

import DjossaImg from '../assets/artists/djossa.png'
import NaiaImg   from '../assets/artists/naia.png'
import BentoImg  from '../assets/artists/Bento Lima.png'
import YuriImg   from '../assets/artists/Yuri Brava.png'
import KhrisImg  from '../assets/artists/Khris T.png'
import MadaImg   from '../assets/artists/Madá.png'

export const marketplaceData = {

    /* ─── Métricas globais ───────────────────────────────────────── */
    stats: { beats: 284, producers: 47, sold: 1830 },

    /* ─── Filtros de género ──────────────────────────────────────── */
    genres: ['Todos', 'Funaná', 'Morna', 'Coladeira', 'Batuque', 'Cabo Love', 'Kizomba', 'Tabanka', 'Kola'],

    /* ─── Opções de ordenação ────────────────────────────────────── */
    sortOptions: [
        { key: 'newest',    label: 'Mais recentes' },
        { key: 'popular',   label: 'Mais vendidos'  },
        { key: 'price_asc', label: 'Preço ↑'        },
        { key: 'price_desc',label: 'Preço ↓'        },
        { key: 'bpm_asc',   label: 'BPM ↑'          },
    ],

    /* ─── Beat em destaque ───────────────────────────────────────── */
    featured: {
        id: 'b-1',
        title:      'Mar Salgado',
        producer:   'Prod. Djo',
        producerId: 'p-1',
        genre:      'Funaná',
        bpm: 92, key: 'Am',
        mood:  'Energético',
        desc:  'Beat de Funaná com influências modernas. Estrutura limpa, perfeita para letras em crioulo ou português.',
        hue:   14,
        image: BeatImg0,
        prices: { lease: 19.99, premium: 39.99, exclusive: 149.99 },
        plays: 2840, sales: 142,
        isNew: false,
    },

    /* ─── Catálogo de beats ──────────────────────────────────────── */
    beats: [
        {
            id: 'b-1',  title: 'Mar Salgado',    producer: 'Prod. Djo',   producerId: 'p-1',
            genre: 'Funaná',    bpm: 92,  key: 'Am', hue: 14,  image: BeatImg0,
            prices: { lease: 19.99, premium: 39.99, exclusive: 149.99 },
            plays: 2840, sales: 142, isNew: false,
        },
        {
            id: 'b-2',  title: 'Noite di Lua',   producer: 'Prod. Naia',  producerId: 'p-2',
            genre: 'Morna',     bpm: 78,  key: 'Dm', hue: 220, image: BeatImg1,
            prices: { lease: 24.99, premium: 49.99, exclusive: 179.99 },
            plays: 1920, sales: 98,  isNew: false,
        },
        {
            id: 'b-3',  title: 'Riba Mar',        producer: 'Prod. Yuri',  producerId: 'p-4',
            genre: 'Cabo Love', bpm: 102, key: 'G',  hue: 145, image: BeatImg2,
            prices: { lease: 14.99, premium: 29.99, exclusive: 109.99 },
            plays: 1540, sales: 76,  isNew: false,
        },
        {
            id: 'b-4',  title: 'Tabanka 81',      producer: 'Prod. Madá',  producerId: 'p-5',
            genre: 'Tabanka',   bpm: 88,  key: 'F',  hue: 8,   image: BeatImg3,
            prices: { lease: 29.99, premium: 59.99, exclusive: 219.99 },
            plays: 1280, sales: 54,  isNew: false,
        },
        {
            id: 'b-5',  title: 'Sodade Beat',     producer: 'Prod. Bento', producerId: 'p-3',
            genre: 'Coladeira', bpm: 84,  key: 'Em', hue: 42,  image: BeatImg4,
            prices: { lease: 17.50, premium: 34.99, exclusive: 129.99 },
            plays: 1105, sales: 48,  isNew: false,
        },
        {
            id: 'b-6',  title: 'Fogo Vivo',       producer: 'Prod. Djo',   producerId: 'p-1',
            genre: 'Funaná',    bpm: 96,  key: 'C',  hue: 18,  image: BeatImg0,
            prices: { lease: 21.99, premium: 44.99, exclusive: 159.99 },
            plays: 980,  sales: 40,  isNew: true,
        },
        {
            id: 'b-7',  title: 'Ilha d\'Boa',      producer: 'Prod. Khris', producerId: 'p-6',
            genre: 'Kizomba',   bpm: 72,  key: 'G',  hue: 280, image: BeatImg1,
            prices: { lease: 22.99, premium: 44.99, exclusive: 169.99 },
            plays: 870,  sales: 38,  isNew: false,
        },
        {
            id: 'b-8',  title: 'Batuque Flow',    producer: 'Prod. Naia',  producerId: 'p-2',
            genre: 'Batuque',   bpm: 90,  key: 'Bm', hue: 225, image: BeatImg2,
            prices: { lease: 18.99, premium: 37.99, exclusive: 139.99 },
            plays: 760,  sales: 32,  isNew: true,
        },
        {
            id: 'b-9',  title: 'Algravia',        producer: 'Prod. Bento', producerId: 'p-3',
            genre: 'Morna',     bpm: 75,  key: 'Am', hue: 48,  image: BeatImg3,
            prices: { lease: 26.99, premium: 54.99, exclusive: 199.99 },
            plays: 640,  sales: 27,  isNew: false,
        },
        {
            id: 'b-10', title: 'Kola di Praia',   producer: 'Prod. Madá',  producerId: 'p-5',
            genre: 'Kola',      bpm: 110, key: 'D',  hue: 10,  image: BeatImg4,
            prices: { lease: 15.99, premium: 31.99, exclusive: 119.99 },
            plays: 520,  sales: 21,  isNew: true,
        },
        {
            id: 'b-11', title: 'Kriol Trap',      producer: 'Prod. Yuri',  producerId: 'p-4',
            genre: 'Cabo Love', bpm: 140, key: 'F#', hue: 150, image: BeatImg0,
            prices: { lease: 12.99, premium: 25.99, exclusive:  99.99 },
            plays: 490,  sales: 18,  isNew: true,
        },
        {
            id: 'b-12', title: 'São Vicente Night',producer: 'Prod. Naia',  producerId: 'p-2',
            genre: 'Morna',     bpm: 76,  key: 'C',  hue: 215, image: BeatImg1,
            prices: { lease: 23.99, premium: 47.99, exclusive: 174.99 },
            plays: 410,  sales: 15,  isNew: false,
        },
    ],

    /* ─── Top produtores ─────────────────────────────────────────── */
    producers: [
        { id: 'p-1', name: 'Prod. Djo',   handle: '@djossa',    genre: 'Funaná',    beats: 48, sales: 420, rating: 4.9, hue: 14,  shape: 'circles',   image: DjossaImg,  isVerified: true  },
        { id: 'p-2', name: 'Prod. Naia',  handle: '@naia',      genre: 'Morna',     beats: 32, sales: 305, rating: 4.8, hue: 220, shape: 'arch',       image: NaiaImg,    isVerified: true  },
        { id: 'p-3', name: 'Prod. Bento', handle: '@bentolima', genre: 'Coladeira', beats: 27, sales: 218, rating: 4.8, hue: 42,  shape: 'stripes',    image: BentoImg,   isVerified: false },
        { id: 'p-4', name: 'Prod. Yuri',  handle: '@yuribrava', genre: 'Cabo Love', beats: 22, sales: 190, rating: 4.7, hue: 145, shape: 'orbit',      image: YuriImg,    isVerified: false },
        { id: 'p-5', name: 'Prod. Madá',  handle: '@mada',      genre: 'Tabanka',   beats: 19, sales: 142, rating: 4.6, hue: 8,   shape: 'sun',        image: MadaImg,    isVerified: false },
        { id: 'p-6', name: 'Prod. Khris', handle: '@khrist',    genre: 'Kizomba',   beats: 15, sales: 98,  rating: 4.5, hue: 280, shape: 'wave',       image: KhrisImg,   isVerified: false },
    ],

    /* ─── Definições de licença ──────────────────────────────────── */
    licenses: {
        lease:     { label: 'Lease',     desc: 'Não exclusiva · 10k streams · 2 anos' },
        premium:   { label: 'Premium',   desc: 'Não exclusiva · 100k streams · 5 anos' },
        exclusive: { label: 'Exclusiva', desc: 'Todos os direitos cedidos · sem limites' },
    },
};
