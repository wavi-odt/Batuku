/* ─────────────────────────────────────────────────────────────────
   data/analytics.js, Dados mock para a página de Analytics.
   Substituir por chamadas reais quando o backend estiver pronto.
   ───────────────────────────────────────────────────────────────── */

import DjossaImg from '../assets/artists/djossa.png'

/* Gera 90 dias de reproduções com curva realista */
function genDaily(n) {
    return Array.from({ length: n }, (_, i) => {
        const base  = 580 + i * 5;
        const noise = Math.round(Math.sin(i * 0.65) * 130 + Math.cos(i * 0.28) * 65);
        return { day: i + 1, plays: Math.max(180, base + noise) };
    });
}

export const analyticsData = {

    /* ─── KPIs por período ───────────────────────────────────────── */
    kpis: {
        '7d': {
            plays:     { value: 6840,  delta: +18.4, label: 'Reproduções'      },
            listeners: { value: 2140,  delta: +12.1, label: 'Ouvintes únicos'  },
            followers: { value: 84,    delta:  +6.8, label: 'Novos seguidores' },
            saves:     { value: 312,   delta: +22.3, label: 'Saves'            },
        },
        '30d': {
            plays:     { value: 24450, delta: +12.4, label: 'Reproduções'      },
            listeners: { value: 7820,  delta:  +8.2, label: 'Ouvintes únicos'  },
            followers: { value: 284,   delta:  +6.8, label: 'Novos seguidores' },
            saves:     { value: 1284,  delta: +15.6, label: 'Saves'            },
        },
        '90d': {
            plays:     { value: 62100, delta: +31.2, label: 'Reproduções'      },
            listeners: { value: 18400, delta: +24.5, label: 'Ouvintes únicos'  },
            followers: { value: 820,   delta: +19.8, label: 'Novos seguidores' },
            saves:     { value: 3840,  delta: +28.4, label: 'Saves'            },
        },
    },

    /* ─── Série temporal (90 dias) ───────────────────────────────── */
    dailyPlays: genDaily(90),

    /* ─── Fontes de descoberta (%) ───────────────────────────────── */
    sources: [
        { label: 'Playlists', value: 38, color: 'coral'   },
        { label: 'Descobrir', value: 26, color: 'ocean'   },
        { label: 'Pesquisa',  value: 18, color: 'mustard' },
        { label: 'Partilha',  value: 11, color: 'green'   },
        { label: 'Direto',    value: 7,  color: 'mute'    },
    ],

    /* ─── Top localizações (reproduções) ─────────────────────────── */
    locations: [
        { label: 'Praia',    value: 6840 },
        { label: 'Lisboa',   value: 5210 },
        { label: 'Mindelo',  value: 3980 },
        { label: 'Boston',   value: 2840 },
        { label: 'Paris',    value: 2120 },
        { label: 'Sal',      value: 1640 },
    ],

    /* ─── Top faixas ─────────────────────────────────────────────── */
    topTracks: [
        { title: 'Mar Salgado',   hue: 14, image: DjossaImg, plays: 4820, listeners: 1840, saves: 312, likes: 318, completion: 78 },
        { title: 'Sodade di Mar', hue: 14, image: DjossaImg, plays: 3640, listeners: 1420, saves: 245, likes: 245, completion: 82 },
        { title: 'Funaná Vivo',   hue: 14, image: DjossaImg, plays: 3120, listeners: 1180, saves: 198, likes: 198, completion: 71 },
        { title: 'Coração di CV', hue: 14, image: DjossaImg, plays: 2840, listeners: 1040, saves: 156, likes: 156, completion: 68 },
        { title: 'Praia Quente',  hue: 14, image: DjossaImg, plays: 2210, listeners:  890, saves: 124, likes: 124, completion: 85 },
    ],

    /* ─── Taxas de engagement ────────────────────────────────────── */
    engagement: [
        { key: 'like',       value: 6.8, unit: '%', label: 'Taxa de likes',      sub: 'por reprodução'       },
        { key: 'save',       value: 5.2, unit: '%', label: 'Taxa de saves',      sub: 'por ouvinte único'    },
        { key: 'comment',    value: 1.4, unit: '%', label: 'Taxa de comentários', sub: 'por reprodução'      },
        { key: 'completion', value: 76,  unit: '%', label: 'Taxa de conclusão',  sub: 'ouvem a faixa inteira' },
    ],
};
