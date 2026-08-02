/* ─────────────────────────────────────────────────────────────────
   data/community.js, Dados mock para a página Comunidade.
   Substituir por chamadas reais quando o backend estiver pronto.
   ───────────────────────────────────────────────────────────────── */

import DjossaImg from '../assets/artists/djossa.png'
import NaiaImg   from '../assets/artists/naia.png'
import BentoImg  from '../assets/artists/Bento Lima.png'
import YuriImg   from '../assets/artists/Yuri Brava.png'
import KhrisImg  from '../assets/artists/Khris T.png'

export const communityData = {

    /* ─── Stats globais do Discord ───────────────────────────────── */
    discord: {
        members:        8542,
        online:         234,
        messagesPerDay: 1840,
        inviteUrl:      'https://discord.gg/',
    },

    /* ─── Canais activos ─────────────────────────────────────────── */
    channels: [
        { id: 'c1', name: 'geral',              emoji: '💬', unread: 12, lastUser: 'djossa',     lastMsg: 'Novo single esta semana! 🔥' },
        { id: 'c2', name: 'sessões-praia',       emoji: '🎵', unread: 5,  lastUser: 'naia',       lastMsg: 'Quinta às 21h, quem vem?' },
        { id: 'c3', name: 'beats-e-producao',    emoji: '🎛️', unread: 23, lastUser: 'bento_prod', lastMsg: 'Beat novo no marketplace — só €30 hoje' },
        { id: 'c4', name: 'morna-e-funaná',      emoji: '🎸', unread: 0,  lastUser: 'khris_t',   lastMsg: 'Alguém sabe a escala de Sodade?' },
        { id: 'c5', name: 'novidades',           emoji: '📢', unread: 3,  lastUser: 'batuku',     lastMsg: 'Novo artista verificado 🎉' },
        { id: 'c6', name: 'feedback',            emoji: '🔁', unread: 8,  lastUser: 'yuri_brava', lastMsg: 'Podes dar feedback nesta track?' },
    ],

    /* ─── Eventos futuros ────────────────────────────────────────── */
    events: [
        {
            id: 'e1', title: 'Listening Thursday',
            type: 'listening', date: '30 Jan', time: '21:00', platform: 'Discord Stage',
            confirmed: 142, isRecurring: true,
            desc: 'Sessão semanal onde partilhamos lançamentos recentes e damos feedback em tempo real.',
        },
        {
            id: 'e2', title: 'Beat Battle #12',
            type: 'battle', date: '1 Fev', time: '20:00', platform: 'Discord',
            confirmed: 38, isRecurring: false,
            desc: 'Competição de beats ao vivo. Submete o teu instrumental e vota nos melhores.',
        },
        {
            id: 'e3', title: 'Workshop: Produção de Funaná',
            type: 'workshop', date: '6 Fev', time: '18:30', platform: 'Zoom',
            confirmed: 24, isRecurring: false,
            desc: 'Bento Lima mostra a sua metodologia para produzir Funaná moderno.',
        },
        {
            id: 'e4', title: 'Q&A com Djossa',
            type: 'qa', date: '15 Fev', time: '20:00', platform: 'Discord Stage',
            confirmed: 220, isRecurring: false,
            desc: 'Perguntas ao vivo com o artista mais ouvido do Batuku em 2025.',
        },
        {
            id: 'e5', title: 'Open Mic Virtual',
            type: 'openmic', date: '28 Fev', time: '21:00', platform: 'Discord Stage',
            confirmed: 56, isRecurring: true,
            desc: 'Espaço aberto para artistas apresentarem novas letras e receberem feedback.',
        },
        {
            id: 'e6', title: 'Collab Session #5',
            type: 'collab', date: '8 Fev', time: '16:00', platform: 'Discord',
            confirmed: 18, isRecurring: false,
            desc: 'Produtores e MCs fazem match e criam juntos numa sessão de colaboração guiada.',
        },
    ],

    /* ─── Feed da comunidade (posts/threads) ─────────────────────── */
    feed: [
        {
            id: 'p1', user: 'naia', handle: '@naia', hue: 220, shape: 'arch', image: NaiaImg,
            time: 'há 12 min', channel: '#sessões-praia', type: 'collab',
            title: 'Alguém quer fazer collab numa track de Morna?',
            excerpt: 'Tenho um instrumental pronto, falta só a letra. Estou à procura de um MC ou cantor para gravar...',
            tags: ['#collab', '#morna'], replies: 7, reactions: 14,
        },
        {
            id: 'p2', user: 'rafareis', handle: '@rafareis', hue: 285, shape: 'split', image: null,
            time: 'há 34 min', channel: '#geral', type: 'playlist',
            title: 'Playlist colaborativa — os melhores beats de 2025 já tem 80 faixas!',
            excerpt: 'Começámos em janeiro e já somos 34 contribuidores. Adicionem as vossas recomendações...',
            tags: ['#playlist', '#beats'], replies: 12, reactions: 28,
        },
        {
            id: 'p3', user: 'bento_prod', handle: '@bentolima', hue: 42, shape: 'stripes', image: BentoImg,
            time: 'há 1h', channel: '#beats-e-producao', type: 'questao',
            title: 'Que ferramentas de produção usam para Funaná moderno?',
            excerpt: 'Tenho experimentado com FL Studio e samples de batuque. Quero ouvir o que a comunidade usa...',
            tags: ['#producao', '#funaná', '#daw'], replies: 23, reactions: 41,
        },
        {
            id: 'p4', user: 'djossa', handle: '@djossa', hue: 14, shape: 'circles', image: DjossaImg,
            time: 'há 3h', channel: '#sessões-praia', type: 'highlight',
            title: 'A listening party da quinta foi 🔥 — obrigado a todos!',
            excerpt: 'Foram quase 200 pessoas em direto. Próxima sessão já tem data: 30 de Janeiro às 21h...',
            tags: ['#listeningparty', '#comunidade'], replies: 34, reactions: 89,
        },
        {
            id: 'p5', user: 'batuku', handle: '@batuku_team', hue: 195, shape: 'orbit', image: null,
            time: 'há 6h', channel: '#novidades', type: 'novidade',
            title: '🎉 Novo artista verificado: Sosó Mendes já está no Batuku!',
            excerpt: 'Sosó Mendes, lendária da música cabo-verdiana, acaba de se juntar à plataforma. Segue já...',
            tags: ['#novidade', '#artistas'], replies: 45, reactions: 120,
        },
        {
            id: 'p6', user: 'yuri_brava', handle: '@yuribrava', hue: 145, shape: 'orbit', image: YuriImg,
            time: 'há 8h', channel: '#feedback', type: 'questao',
            title: 'Demo nova — precisava de feedback honesto antes de publicar',
            excerpt: 'É uma track de Cabo Love com influências de R&B. Deixa a tua opinião nos comentários...',
            tags: ['#feedback', '#cabolove'], replies: 18, reactions: 33,
        },
    ],

    /* ─── Online agora ───────────────────────────────────────────── */
    onlineNow: [
        { user: 'djossa',     handle: '@djossa',    hue: 14,  shape: 'circles',  image: DjossaImg, status: 'Em #sessões-praia'       },
        { user: 'naia',       handle: '@naia',      hue: 220, shape: 'arch',      image: NaiaImg,   status: 'A ouvir — Sodade (Naia)' },
        { user: 'yuri_brava', handle: '@yuribrava', hue: 145, shape: 'orbit',     image: YuriImg,   status: 'Em #beats-e-producao'    },
        { user: 'rafareis',   handle: '@rafareis',  hue: 285, shape: 'split',     image: null,      status: 'A ver o feed'            },
        { user: 'khris_t',    handle: '@khrist',    hue: 280, shape: 'wave',      image: KhrisImg,  status: 'Em #morna-e-funaná'      },
    ],

    /* ─── Tags em tendência ──────────────────────────────────────── */
    trendingTags: [
        { tag: '#funaná',         posts: 234 },
        { tag: '#producao',       posts: 187 },
        { tag: '#listeningparty', posts: 142 },
        { tag: '#collab',         posts: 118 },
        { tag: '#beats',          posts: 96  },
        { tag: '#morna',          posts: 84  },
        { tag: '#batuque',        posts: 71  },
        { tag: '#novidades',      posts: 58  },
    ],
};
