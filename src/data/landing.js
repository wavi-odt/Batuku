import BeatImg0 from '../assets/beats/img.png'
import BeatImg1 from '../assets/beats/img_1.png'
import BeatImg2 from '../assets/beats/img_2.png'
import BeatImg3 from '../assets/beats/img_3.png'
import BeatImg4 from '../assets/beats/img_4.png'

import Djossa from '../assets/artists/djossa.png'
import Naia   from '../assets/artists/naia.png'
import Bento  from '../assets/artists/Bento Lima.png'
import Ines   from '../assets/artists/Inês.png'
import Yuri   from '../assets/artists/Yuri Brava.png'
import Khris  from '../assets/artists/Khris T.png'
import Mada   from '../assets/artists/Madá.png'
import Soso   from '../assets/artists/Sosó Mendes.png'

// Proposta de valor em vez de números inflacionados
export const STATS = [
    { value: 'Grátis',         label: 'Para artistas e fãs, para sempre' },
    { value: '8%',             label: 'Única comissão no marketplace' },
    { value: 'CV + Diáspora',  label: 'Comunidade global cabo-verdiana' },
    { value: 'Tempo real',     label: 'Analytics ao vivo no dashboard' },
];

export const ARTISTS = [
    { name: 'Djossa',          city: 'Praia',      genre: 'Funaná',    hue: 14,  shape: 'circles',   image: Djossa },
    { name: 'Naia',            city: 'Mindelo',    genre: 'Morna',     hue: 220, shape: 'arch',       image: Naia   },
    { name: 'Bento Lima',      city: 'São Filipe', genre: 'Coladeira', hue: 42,  shape: 'stripes',    image: Bento  },
    { name: 'Inês d\'Praia',   city: 'Praia',      genre: 'Batuque',   hue: 340, shape: 'split',      image: Ines   },
    { name: 'Yuri Brava',      city: 'Sal',        genre: 'Cabo Love', hue: 145, shape: 'orbit',      image: Yuri   },
    { name: 'Khris T.',        city: 'Mindelo',    genre: 'Kizomba',   hue: 280, shape: 'wave',       image: Khris  },
    { name: 'Madá',            city: 'Tarrafal',   genre: 'Tabanka',   hue: 8,   shape: 'sun',        image: Mada   },
    { name: 'Sosó Mendes',     city: 'Boa Vista',  genre: 'Kola',      hue: 195, shape: 'triangles',  image: Soso   },
];

export const BEATS = [
    { title: 'Mar Salgado',  producer: 'Prod. Djo',   bpm: 92,  key: 'Am', price: 19.99, genre: 'Funaná',    hue: 14,  image: BeatImg0 },
    { title: 'Noite di Lua', producer: 'Prod. Naia',  bpm: 78,  key: 'Dm', price: 24.99, genre: 'Morna',     hue: 220, image: BeatImg1 },
    { title: 'Riba Mar',     producer: 'Prod. Yuri',  bpm: 102, key: 'G',  price: 14.99, genre: 'Cabo Love', hue: 145, image: BeatImg2 },
    { title: 'Tabanka 81',   producer: 'Prod. Madá',  bpm: 88,  key: 'F',  price: 29.99, genre: 'Tabanka',   hue: 8,   image: BeatImg3 },
    { title: 'Sodade Beat',  producer: 'Prod. Bento', bpm: 84,  key: 'Em', price: 17.50, genre: 'Coladeira', hue: 42,  image: BeatImg4 },
];

export const STEPS = [
    { n: '01', title: 'Cria o teu perfil',    body: 'Regista-te grátis, carrega faixas, fotos e a tua bio. Demora menos de 2 minutos.' },
    { n: '02', title: 'Partilha e cresce',     body: 'Os fãs descobrem-te, ouvem e seguem-te. Cada interação gera dados em tempo real.' },
    { n: '03', title: 'Ganha com a tua arte', body: 'Vende beats no marketplace, recebe gorjetas e acede a oportunidades curadas.' },
];

// Sem pontos fictícios — mostra só o conceito do ranking
export const LEADERBOARD = [
    { rank: 1, name: 'Djossa',     badge: 'Ouro'   },
    { rank: 2, name: 'Naia',       badge: 'Ouro'   },
    { rank: 3, name: 'Yuri Brava', badge: 'Prata'  },
    { rank: 4, name: 'Madá',       badge: 'Prata'  },
    { rank: 5, name: 'Khris T.',   badge: 'Bronze' },
];

// Artistas fundadores — sem citações fabricadas
export const FOUNDERS = [
    { name: 'Djossa',     role: 'Funaná · Praia',       hue: 14  },
    { name: 'Bento Lima', role: 'Produtor · São Filipe', hue: 42  },
    { name: 'Naia',       role: 'Morna · Mindelo',       hue: 220 },
];

export const FAQ = [
    { q: 'O Batuku é grátis?',                a: 'Sim. Criar conta, publicar faixas, seguir artistas e usar o Discord é grátis para sempre. Só pagas comissão (8%) quando vendes beats no marketplace.' },
    { q: 'Posso publicar música em crioulo?', a: 'Claro. Aceitamos todas as línguas e géneros — crioulo, português, inglês ou misturas. Os filtros de descoberta respeitam as variantes.' },
    { q: 'Como funciona a gamificação?',      a: 'Cada interação (ouvir, seguir, comentar, partilhar) gera pontos para o artista. Os pontos sobem no ranking semanal e desbloqueiam badges, destaques na homepage e oportunidades curadas.' },
    { q: 'Preciso de viver em Cabo Verde?',   a: 'Não. Se a tua música respira CV, onde quer que estejas no mundo, tens lugar aqui. A diáspora é parte da casa.' },
    { q: 'Quem está por trás do Batuku?',     a: 'Uma equipa pequena de cabo-verdianos a viver entre Praia, Lisboa e Boston. Independentes, sem grandes investidores, guiados pela comunidade.' },
];

export const FEATURES = [
    { icon: 'chart',      title: 'Análises em tempo real', body: 'Reproduções, seguidores e previsões de crescimento.' },
    { icon: 'storefront', title: 'Marketplace de beats',   body: 'Compra e vende instrumentais com pagamentos seguros. Comissão justa de 8%.' },
    { icon: 'trophy',     title: 'Gamificação',            body: 'Ganha pontos a cada interação, sobe no ranking semanal e desbloqueia destaques.' },
    { icon: 'discord',    title: 'Comunidade Discord',     body: 'Liga-te a outros artistas, produtores e fãs. Sessões ao vivo, feedback, colaborações.' },
];

export const GENRES = ['Funaná', 'Morna', 'Coladeira', 'Batuque', 'Cabo Love', 'Kizomba', 'Tabanka', 'Kola San Jon'];
