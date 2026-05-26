/* ─────────────────────────────────────────────────────────────────
   data/batuku.js — Dados placeholder da landing.
   Substituir nomes / preços / textos por dados reais.
   ───────────────────────────────────────────────────────────────── */

export const STATS = [
    { value: '1.2k+', label: 'Artistas cabo-verdianos' },
    { value: '4.8k',  label: 'Faixas publicadas' },
    { value: '12k',   label: 'Fãs ativos por mês' },
    { value: '240k',  label: 'Reproduções este ano' },
];

export const ARTISTS = [
    { name: 'Djossa',         city: 'Praia',      genre: 'Funaná',    hue: 14,  shape: 'circles' },
    { name: 'Naia',           city: 'Mindelo',    genre: 'Morna',     hue: 220, shape: 'arch' },
    { name: 'Bento Lima',     city: 'São Filipe', genre: 'Coladeira', hue: 42,  shape: 'stripes' },
    { name: 'Inês d\u2019Praia', city: 'Praia',   genre: 'Batuque',   hue: 340, shape: 'split' },
    { name: 'Yuri Brava',     city: 'Sal',        genre: 'Cabo Love', hue: 145, shape: 'orbit' },
    { name: 'Khris T.',       city: 'Mindelo',    genre: 'Kizomba',   hue: 280, shape: 'wave' },
    { name: 'Madá',           city: 'Tarrafal',   genre: 'Tabanka',   hue: 8,   shape: 'sun' },
    { name: 'Sosó Mendes',    city: 'Boa Vista',  genre: 'Kola',      hue: 195, shape: 'triangles' },
];

export const BEATS = [
    { title: 'Mar Salgado',  producer: 'Prod. Djo',   bpm: 92,  key: 'Am', price: 19.99, genre: 'Funaná',    hue: 14 },
    { title: 'Noite di Lua', producer: 'Prod. Naia',  bpm: 78,  key: 'Dm', price: 24.99, genre: 'Morna',     hue: 220 },
    { title: 'Riba Mar',     producer: 'Prod. Yuri',  bpm: 102, key: 'G',  price: 14.99, genre: 'Cabo Love', hue: 145 },
    { title: 'Tabanka 81',   producer: 'Prod. Madá',  bpm: 88,  key: 'F',  price: 29.99, genre: 'Tabanka',   hue: 8 },
    { title: 'Sodade Beat',  producer: 'Prod. Bento', bpm: 84,  key: 'Em', price: 17.50, genre: 'Coladeira', hue: 42 },
];

export const STEPS = [
    { n: '01', title: 'Cria o teu perfil', body: 'Regista-te grátis, carrega faixas, fotos e a tua bio. Demora menos de 2 minutos.' },
    { n: '02', title: 'Partilha e cresce',  body: 'Os fãs descobrem-te, ouvem e seguem-te. Cada interação gera dados em tempo real.' },
    { n: '03', title: 'Ganha com a tua arte', body: 'Vende beats no marketplace, recebe gorjetas e acede a oportunidades curadas.' },
];

export const LEADERBOARD = [
    { rank: 1, name: 'Djossa',     pts: 18420, delta: '+340', badge: 'Ouro' },
    { rank: 2, name: 'Naia',       pts: 17180, delta: '+285', badge: 'Ouro' },
    { rank: 3, name: 'Yuri Brava', pts: 15940, delta: '+412', badge: 'Prata' },
    { rank: 4, name: 'Madá',       pts: 14210, delta: '+198', badge: 'Prata' },
    { rank: 5, name: 'Khris T.',   pts: 12880, delta: '+264', badge: 'Bronze' },
];

export const TESTIMONIALS = [
    {
        quote: 'Antes do Batuku, espalhava as minhas músicas por cinco apps diferentes. Agora a comunidade chega até mim — e os números são reais.',
        name: 'Djossa',
        role: 'Funaná · Praia',
        hue: 14,
    },
    {
        quote: 'O marketplace de beats mudou tudo. Vendi a primeira instrumental três dias depois de me registar. Coisa séria.',
        name: 'Bento Lima',
        role: 'Produtor · São Filipe',
        hue: 42,
    },
    {
        quote: 'Adoro a parte de ranking. Faz sentir que somos uma cena unida, não cada um na sua ilha.',
        name: 'Naia',
        role: 'Morna · Mindelo',
        hue: 220,
    },
];

export const FAQ = [
    { q: 'O Batuku é grátis?',                a: 'Sim. Criar conta, publicar faixas, seguir artistas e usar o Discord é grátis para sempre. Só pagas comissão (8%) quando vendes beats no marketplace.' },
    { q: 'Posso publicar música em crioulo?', a: 'Claro. Aceitamos todas as línguas e géneros — crioulo, português, inglês ou misturas. Os filtros de descoberta respeitam as variantes.' },
    { q: 'Como funciona a gamificação?',      a: 'Cada interação (ouvir, seguir, comentar, partilhar) gera pontos para o artista. Os pontos sobem no ranking semanal e desbloqueiam badges, destaques na homepage e oportunidades curadas.' },
    { q: 'Preciso de viver em Cabo Verde?',   a: 'Não. Se a tua música respira CV — onde quer que estejas no mundo — tens lugar aqui. A diáspora é parte da casa.' },
    { q: 'Quem está por trás do Batuku?',     a: 'Uma equipa pequena de cabo-verdianos a viver entre Praia, Lisboa e Boston. Independentes, sem grandes investidores — guiados pela comunidade.' },
];

export const FEATURES = [
    { icon: 'chart',      title: 'Análises em tempo real', body: 'Reproduções, seguidores, mapas de calor por ilha e previsões de crescimento — sem jargão.' },
    { icon: 'storefront', title: 'Marketplace de beats',   body: 'Compra e vende instrumentais com pagamentos seguros. Comissão justa de 8%.' },
    { icon: 'trophy',     title: 'Gamificação',            body: 'Ganha pontos a cada interação, sobe no ranking semanal e desbloqueia destaques.' },
    { icon: 'discord',    title: 'Comunidade Discord',     body: 'Liga-te a outros artistas, produtores e fãs. Sessões ao vivo, feedback, colaborações.' },
];

export const GENRES = ['Funaná', 'Morna', 'Coladeira', 'Batuque', 'Cabo Love', 'Kizomba', 'Tabanka', 'Kola San Jon'];
