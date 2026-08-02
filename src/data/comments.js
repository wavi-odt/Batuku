/* ─────────────────────────────────────────────────────────────────
   data/comments.js  ·  Dados mock para Comentários do artista.
   Substituir por chamadas reais quando o backend estiver pronto.
   ───────────────────────────────────────────────────────────────── */

export const commentsData = {

    summary: {
        total:   142,
        pending:   3,   /* aguardam resposta */
        today:     8,
        pinned:    2,
    },

    /* ─── Comentários ─────────────────────────────────────────── */
    comments: [
        {
            id: 'cm-01',
            user: 'Rafael Reis',   handle: '@rafareis',   hue: 285, shape: 'split',
            track: 'Mar Salgado',  trackHue: 14,
            text: 'Esta produção está top, qual o BPM? Quero samplar numa beat minha.',
            time: 'há 12 min', likes: 6, isLiked: false, isPinned: false,
            status: 'pending', reply: null,
        },
        {
            id: 'cm-02',
            user: 'Ana Monteiro',  handle: '@ana_m',      hue: 165, shape: 'arch',
            track: 'Sodade di Mar', trackHue: 14,
            text: 'Pode entrar na minha playlist de manhã? Que paz que esta música me dá 🌊',
            time: 'há 1h', likes: 12, isLiked: false, isPinned: true,
            status: 'replied',
            reply: { text: 'Claro que sim! Fico feliz que gostaste 🙏 A música foi feita mesmo para esses momentos de paz.', time: 'há 45 min' },
        },
        {
            id: 'cm-03',
            user: 'João Lopes',    handle: '@joaolopes',  hue: 105, shape: 'orbit',
            track: 'Funaná Vivo',  trackHue: 14,
            text: 'Vai haver concerto em Lisboa? Precisamos de te ver ao vivo, Djossa! 🔥',
            time: 'há 3h', likes: 28, isLiked: false, isPinned: true,
            status: 'replied',
            reply: { text: 'Sim! Lisboa está confirmada para Março. Fiquem atentos às redes 🎉', time: 'há 2h' },
        },
        {
            id: 'cm-04',
            user: 'Sofia Pereira', handle: '@sofia_p',    hue: 45,  shape: 'stripes',
            track: 'Coração di CV', trackHue: 14,
            text: 'Esta música faz-me lembrar a minha avó em Santiago. Obrigada por isto 💙',
            time: 'há 5h', likes: 41, isLiked: true, isPinned: false,
            status: 'replied',
            reply: { text: 'Isso é tudo o que um artista pode pedir. Abraço grande à tua avó ❤️', time: 'há 4h' },
        },
        {
            id: 'cm-05',
            user: 'Carlos Duarte', handle: '@carlos_d',   hue: 320, shape: 'circles',
            track: 'Praia Quente', trackHue: 14,
            text: 'Quem fez a mistura deste track? O baixo está incrível nos headphones.',
            time: 'há 8h', likes: 9, isLiked: false, isPinned: false,
            status: 'pending', reply: null,
        },
        {
            id: 'cm-06',
            user: 'Maria Évora',   handle: '@maria_cv',   hue: 340, shape: 'wave',
            track: 'Mar Salgado',  trackHue: 14,
            text: 'Já ouvi esta música mais de 50 vezes esta semana 😭 É viciante demais!',
            time: 'há 11h', likes: 33, isLiked: false, isPinned: false,
            status: 'replied',
            reply: { text: 'Haha obrigado Maria! Isso faz-me muito feliz 🙌 50 vezes é recorde!', time: 'há 10h' },
        },
        {
            id: 'cm-07',
            user: 'Nuno Tavares',  handle: '@nuno_lx',    hue: 180, shape: 'triangles',
            track: 'Funaná Vivo',  trackHue: 14,
            text: 'Quando é que lanças o álbum completo? Estou à espera há meses!',
            time: 'há 1 dia', likes: 54, isLiked: false, isPinned: false,
            status: 'replied',
            reply: { text: 'Em breve! Ainda não posso dizer a data mas já vem 👀', time: 'há 22h' },
        },
        {
            id: 'cm-08',
            user: 'Irina Costa',   handle: '@irina_cv',   hue:  80, shape: 'sun',
            track: 'Sodade di Mar', trackHue: 14,
            text: 'Podes fazer uma versão acústica? Com guitarra cabo-verdiana seria perfeito.',
            time: 'há 1 dia', likes: 18, isLiked: false, isPinned: false,
            status: 'replied',
            reply: { text: 'Boa ideia! Estou a pensar nisso mesmo. Quem sabe para o próximo EP 🎸', time: 'há 20h' },
        },
        {
            id: 'cm-09',
            user: 'Pedro Alves',   handle: '@pedro_a',    hue: 200, shape: 'split',
            track: 'Praia Quente', trackHue: 14,
            text: 'Esta beat foi feita para o verão. Não consigo ouvir sem dançar 😂',
            time: 'há 2 dias', likes: 22, isLiked: false, isPinned: false,
            status: 'replied',
            reply: { text: 'Essa é a missão! Obrigado Pedro 😄🎶', time: 'há 1 dia' },
        },
        {
            id: 'cm-10',
            user: 'Kris Barbosa',  handle: '@kris_bv',    hue: 220, shape: 'arch',
            track: 'Coração di CV', trackHue: 14,
            text: 'Partilhei com toda a minha família em Boston. Todos ficaram com lágrimas nos olhos.',
            time: 'há 2 dias', likes: 67, isLiked: true, isPinned: false,
            status: 'replied',
            reply: { text: 'Que história linda! A diáspora é o nosso maior público. Muito obrigado 🙏', time: 'há 2 dias' },
        },
        {
            id: 'cm-11',
            user: 'Lena Fonseca',  handle: '@lena_f',     hue:  60, shape: 'circles',
            track: 'Mar Salgado',  trackHue: 14,
            text: 'Fui ao concerto em Praia e chorei. Nunca me esqueço dessa noite. Volta depressa!',
            time: 'há 3 dias', likes: 89, isLiked: false, isPinned: false,
            status: 'replied',
            reply: { text: 'Esse concerto foi especial para mim também. Estarei de volta em breve! 🙌', time: 'há 3 dias' },
        },
        {
            id: 'cm-12',
            user: 'Tatiana Brito', handle: '@tati_b',     hue: 270, shape: 'stripes',
            track: 'Funaná Vivo',  trackHue: 14,
            text: 'Descobri-te há uma semana e já ouvi todo o catálogo. Onde estavas tu?! 😍',
            time: 'há 3 dias', likes: 15, isLiked: false, isPinned: false,
            status: 'pending', reply: null,
        },
    ],

    /* ─── Faixas para o filtro ───────────────────────────────── */
    trackFilter: [
        'Todas',
        'Mar Salgado',
        'Sodade di Mar',
        'Funaná Vivo',
        'Praia Quente',
        'Coração di CV',
    ],

    sortOptions: [
        { key: 'recent',  label: 'Mais recentes' },
        { key: 'popular', label: 'Mais populares' },
        { key: 'pending', label: 'Pendentes primeiro' },
    ],
};
