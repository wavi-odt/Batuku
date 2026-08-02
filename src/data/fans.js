/* ─────────────────────────────────────────────────────────────────
   data/fans.js, Dados mock para "Os meus fãs" do artista.
   Substituir por chamadas reais quando o backend estiver pronto.
   ───────────────────────────────────────────────────────────────── */

export const fansData = {

    /* ─── Resumo ─────────────────────────────────────────────────── */
    summary: {
        total:      4280,
        newThisWeek: 84,
        retention:  72,   /* % que voltou a ouvir no último mês */
        active:     1840, /* ouviram algo nos últimos 30 dias */
    },

    /* ─── Distribuição por tier ──────────────────────────────────── */
    tiers: [
        { key: 'superfan', label: 'Superfãs',  desc: '100+ reproduções', count: 312,  color: 'coral'   },
        { key: 'regular',  label: 'Regulares', desc: '30–99 reproduções', count: 1240, color: 'ocean'   },
        { key: 'casual',   label: 'Ocasionais',desc: '1–29 reproduções',  count: 2728, color: 'mute'    },
    ],

    /* ─── Top localizações ───────────────────────────────────────── */
    locations: [
        { label: 'Praia',    value: 1240 },
        { label: 'Lisboa',   value: 980  },
        { label: 'Mindelo',  value: 720  },
        { label: 'Boston',   value: 480  },
        { label: 'Paris',    value: 380  },
        { label: 'Sal',      value: 290  },
        { label: 'Outros',   value: 190  },
    ],

    /* ─── Actividade recente ─────────────────────────────────────── */
    recentActivity: [
        { type: 'follow',  user: 'maria_cv',   hue: 340, time: 'há 4 min',  text: 'começou a seguir-te' },
        { type: 'comment', user: 'joao_praia', hue: 105, time: 'há 12 min', text: 'comentou em "Mar Salgado"' },
        { type: 'like',    user: 'ana_m',      hue: 165, time: 'há 28 min', text: 'gostou de "Funaná Vivo"' },
        { type: 'save',    user: 'rafa_r',     hue: 285, time: 'há 1h',     text: 'guardou "Sodade di Mar"' },
        { type: 'follow',  user: 'kris_bv',    hue: 220, time: 'há 2h',     text: 'começou a seguir-te' },
        { type: 'comment', user: 'sofia_p',    hue:  45, time: 'há 3h',     text: 'comentou em "Coração di CV"' },
        { type: 'like',    user: 'nuno_lx',    hue: 180, time: 'há 4h',     text: 'gostou de "Praia Quente"' },
        { type: 'save',    user: 'irina_cv',   hue:  80, time: 'há 5h',     text: 'guardou "Mar Salgado"' },
    ],

    /* ─── Lista de fãs ───────────────────────────────────────────── */
    fans: [
        { id: 'f-01', name: 'Rafael Reis',    handle: '@rafareis',   hue: 285, shape: 'split',     location: 'Praia',   tier: 'superfan', plays: 142, likes: 28, comments: 8,  saves: 12, followedAt: '15 Jan 2025', lastActive: 'há 2h',   topTrack: 'Mar Salgado',   isNew: false },
        { id: 'f-02', name: 'Ana Monteiro',   handle: '@ana_m',      hue: 165, shape: 'arch',      location: 'Lisboa',  tier: 'superfan', plays: 118, likes: 22, comments: 5,  saves:  9, followedAt: '3 Dez 2024',  lastActive: 'há 28 min', topTrack: 'Sodade di Mar', isNew: false },
        { id: 'f-03', name: 'João Lopes',     handle: '@joaolopes',  hue: 105, shape: 'orbit',     location: 'Mindelo', tier: 'superfan', plays:  92, likes: 14, comments: 12, saves:  7, followedAt: '8 Jan 2025',  lastActive: 'há 12 min', topTrack: 'Funaná Vivo',  isNew: false },
        { id: 'f-04', name: 'Sofia Pereira',  handle: '@sofia_p',    hue:  45, shape: 'stripes',   location: 'Paris',   tier: 'superfan', plays:  87, likes: 18, comments:  3, saves: 11, followedAt: '20 Jan 2025', lastActive: 'há 3h',   topTrack: 'Coração di CV', isNew: false },
        { id: 'f-05', name: 'Carlos Duarte',  handle: '@carlos_d',   hue: 320, shape: 'circles',   location: 'Boston',  tier: 'superfan', plays:  74, likes: 11, comments:  2, saves:  6, followedAt: '11 Nov 2024', lastActive: 'ontem',   topTrack: 'Mar Salgado',   isNew: false },
        { id: 'f-06', name: 'Maria Évora',    handle: '@maria_cv',   hue: 340, shape: 'wave',      location: 'Praia',   tier: 'superfan', plays:  68, likes: 16, comments:  6, saves:  8, followedAt: '28 Jan 2025', lastActive: 'há 4 min', topTrack: 'Mar Salgado',   isNew: true  },
        { id: 'f-07', name: 'Nuno Tavares',   handle: '@nuno_lx',    hue: 180, shape: 'triangles', location: 'Lisboa',  tier: 'regular',  plays:  62, likes:  9, comments:  1, saves:  5, followedAt: '22 Jan 2025', lastActive: 'há 4h',   topTrack: 'Praia Quente',  isNew: false },
        { id: 'f-08', name: 'Irina Costa',    handle: '@irina_cv',   hue:  80, shape: 'sun',       location: 'Sal',     tier: 'regular',  plays:  58, likes: 12, comments:  4, saves:  3, followedAt: '17 Jan 2025', lastActive: 'há 5h',   topTrack: 'Mar Salgado',   isNew: false },
        { id: 'f-09', name: 'Pedro Alves',    handle: '@pedro_a',    hue: 200, shape: 'split',     location: 'Boston',  tier: 'regular',  plays:  51, likes:  7, comments:  0, saves:  4, followedAt: '5 Dez 2024',  lastActive: 'há 1 dia', topTrack: 'Funaná Vivo',  isNew: false },
        { id: 'f-10', name: 'Kris Barbosa',   handle: '@kris_bv',    hue: 220, shape: 'arch',      location: 'Mindelo', tier: 'regular',  plays:  47, likes:  8, comments:  2, saves:  6, followedAt: '26 Jan 2025', lastActive: 'há 2h',   topTrack: 'Sodade di Mar', isNew: true  },
        { id: 'f-11', name: 'Lena Fonseca',   handle: '@lena_f',     hue:  60, shape: 'circles',   location: 'Paris',   tier: 'regular',  plays:  43, likes:  6, comments:  1, saves:  2, followedAt: '14 Jan 2025', lastActive: 'há 2 dias', topTrack: 'Coração di CV', isNew: false },
        { id: 'f-12', name: 'Rui Andrade',    handle: '@rui_a',      hue: 140, shape: 'orbit',     location: 'Praia',   tier: 'regular',  plays:  38, likes:  5, comments:  0, saves:  1, followedAt: '9 Jan 2025',  lastActive: 'há 3 dias', topTrack: 'Funaná Vivo',  isNew: false },
        { id: 'f-13', name: 'Tatiana Brito',  handle: '@tati_b',     hue: 270, shape: 'stripes',   location: 'Lisboa',  tier: 'casual',   plays:  24, likes:  3, comments:  0, saves:  0, followedAt: '25 Jan 2025', lastActive: 'há 6h',   topTrack: 'Mar Salgado',   isNew: true  },
        { id: 'f-14', name: 'Marco Silva',    handle: '@marco_s',    hue:  30, shape: 'sun',       location: 'Sal',     tier: 'casual',   plays:  19, likes:  2, comments:  1, saves:  1, followedAt: '18 Jan 2025', lastActive: 'há 1 dia', topTrack: 'Praia Quente',  isNew: false },
        { id: 'f-15', name: 'Vera Mendes',    handle: '@vera_m',     hue: 100, shape: 'wave',      location: 'Praia',   tier: 'casual',   plays:  14, likes:  1, comments:  0, saves:  0, followedAt: '27 Jan 2025', lastActive: 'há 8h',   topTrack: 'Sodade di Mar', isNew: true  },
    ],

    sortOptions: [
        { key: 'plays',      label: 'Mais reproduções' },
        { key: 'likes',      label: 'Mais likes'       },
        { key: 'comments',   label: 'Mais comentários' },
        { key: 'recent',     label: 'Mais recentes'    },
        { key: 'lastActive', label: 'Mais ativos'      },
    ],
};
