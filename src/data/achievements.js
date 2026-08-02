/* ─────────────────────────────────────────────────────────────────
   data/achievements.js, Dados mock para a página Conquistas.
   Substituir por chamadas reais quando o backend estiver pronto.
   ───────────────────────────────────────────────────────────────── */

export const achievementsData = {

    /* ─── Stats do utilizador (shape igual ao LevelCard) ────────── */
    user: {
        name:        'Rafael Reis',
        level:       7,
        points:      4280,
        nextLevelAt: 5000,
        rank:        142,
        streak:      12,
        badges:      6,
        following:   24,
    },

    /* ─── Desafios ativos ────────────────────────────────────────── */
    challenges: [
        {
            id: 'c-1', icon: '🧭', title: 'Descobridor Semanal',
            desc:     'Ouve faixas de artistas que nunca ouviste',
            progress: 3, total: 5, xp: 150, expires: 'amanhã',
        },
        {
            id: 'c-2', icon: '💬', title: 'Comentador',
            desc:     'Deixa comentários em faixas',
            progress: 1, total: 3, xp: 100, expires: 'em 3 dias',
        },
        {
            id: 'c-3', icon: '🎧', title: 'Maratonista',
            desc:     'Ouve 60 minutos seguidos hoje',
            progress: 22, total: 60, xp: 200, expires: 'hoje',
        },
        {
            id: 'c-4', icon: '❤️', title: 'Seguidor Ativo',
            desc:     'Segue 2 novos artistas',
            progress: 2, total: 2, xp: 80, expires: null, completed: true,
        },
        {
            id: 'c-5', icon: '🔥', title: 'Streak 14',
            desc:     'Mantém o streak por 14 dias seguidos',
            progress: 12, total: 14, xp: 180, expires: 'em 2 dias',
        },
        {
            id: 'c-6', icon: '⭐', title: 'Curador',
            desc:     'Adiciona faixas à tua playlist esta semana',
            progress: 4, total: 10, xp: 120, expires: 'em 5 dias',
        },
    ],

    /* ─── Badges (conquistadas + bloqueadas) ─────────────────────── */
    badges: [
        /* ── Ganhas ── */
        { id: 'b-1',  icon: '🌅', name: 'Madrugador',    desc: 'Ouviste antes das 7h por 10 dias',        xp: 100, tier: 'gold',    got: true,  meta: 'Há 2 dias'    },
        { id: 'b-2',  icon: '🔥', name: 'Streak 12',     desc: '12 dias seguidos a ouvir',                xp: 80,  tier: 'coral',   got: true,  meta: 'Ontem'        },
        { id: 'b-3',  icon: '🧭', name: 'Explorador',    desc: 'Ouviste 50 artistas diferentes',          xp: 120, tier: 'ocean',   got: true,  meta: 'Há 1 semana'  },
        { id: 'b-4',  icon: '❤️', name: 'Apoiante',      desc: 'Seguiste 20 artistas',                    xp: 60,  tier: 'pink',    got: true,  meta: 'Há 2 semanas' },
        { id: 'b-5',  icon: '⭐', name: 'Curador',       desc: 'Playlist com 100+ likes',                 xp: 150, tier: 'mustard', got: true,  meta: 'Há 1 mês'     },
        { id: 'b-6',  icon: '👑', name: 'Top 100',       desc: 'Entraste no top 100 semanal',             xp: 200, tier: 'green',   got: true,  meta: 'Há 3 semanas' },
        /* ── Bloqueadas ── */
        { id: 'b-7',  icon: '🎟️', name: 'Concertos',     desc: 'Vai a 5 eventos Batuku',                  xp: 300, tier: 'locked',  got: false, meta: '0 / 5 eventos'    },
        { id: 'b-8',  icon: '💎', name: 'Lenda',         desc: 'Atinge o nível 10',                       xp: 500, tier: 'locked',  got: false, meta: 'Nível 7 / 10'     },
        { id: 'b-9',  icon: '🔥', name: 'Streak 30',     desc: '30 dias seguidos a ouvir',                xp: 250, tier: 'locked',  got: false, meta: '12 / 30 dias'     },
        { id: 'b-10', icon: '⭐', name: 'Influenciador', desc: 'Playlist com 1.000+ likes',               xp: 400, tier: 'locked',  got: false, meta: '142 / 1.000 likes' },
        { id: 'b-11', icon: '🧭', name: 'Embaixador',   desc: 'Convida 5 amigos para o Batuku',          xp: 350, tier: 'locked',  got: false, meta: '0 / 5 convites'   },
        { id: 'b-12', icon: '🎧', name: 'Fã Dedicado',  desc: 'Ouve 100 horas de música no Batuku',      xp: 180, tier: 'locked',  got: false, meta: '42 / 100 horas'   },
    ],

    /* ─── Ranking semanal ────────────────────────────────────────── */
    leaderboard: [
        { rank: 1,   name: 'Djossa',     points: 18420, isYou: false, shape: 'circles',   hue: 14  },
        { rank: 2,   name: 'Ana M.',     points: 12300, isYou: false, shape: 'orbit',     hue: 165 },
        { rank: 3,   name: 'Naia',       points:  9840, isYou: false, shape: 'arch',      hue: 220 },
        { rank: 4,   name: 'Madá',       points:  7650, isYou: false, shape: 'sun',       hue: 8   },
        { rank: 5,   name: 'João L.',    points:  5920, isYou: false, shape: 'triangles', hue: 105 },
        { rank: 6,   name: 'Sofia P.',   points:  5410, isYou: false, shape: 'wave',      hue: 45  },
        { rank: 7,   name: 'Carlos D.',  points:  4990, isYou: false, shape: 'stripes',   hue: 320 },
        { rank: 8,   name: 'Marta V.',   points:  4720, isYou: false, shape: 'split',     hue: 185 },
        { rank: 9,   name: 'Rui A.',     points:  4540, isYou: false, shape: 'circles',   hue: 60  },
        { rank: 10,  name: 'Lena K.',    points:  4380, isYou: false, shape: 'arch',      hue: 300 },
        { rank: 142, name: 'Rafael R.',  points:  4280, isYou: true,  shape: 'split',     hue: 285 },
    ],

    /* ─── Milestones de escuta ───────────────────────────────────── */
    milestones: [
        { label: 'Horas ouvidas',         value: 42,   unit: 'h'  },
        { label: 'Faixas únicas',         value: 840,  unit: ''   },
        { label: 'Artistas descobertos',  value: 67,   unit: ''   },
        { label: 'Playlists criadas',     value: 9,    unit: ''   },
        { label: 'Comentários dados',     value: 38,   unit: ''   },
        { label: 'Likes dados',           value: 214,  unit: ''   },
    ],
};
