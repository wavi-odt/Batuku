export const homeData = {
    fanNav: [
        { icon: 'home',    label: 'Início',      to: '/home' },
        { icon: 'compass', label: 'Descobrir',   to: '/discover' },
        { icon: 'library', label: 'Biblioteca',  to: '/library' },
        { icon: 'heart',   label: 'A seguir',    to: '/following' },
        { icon: 'trophy',  label: 'Conquistas',  to: '/achievements' },
        { icon: 'store',   label: 'Marketplace', to: '/marketplace', end: false },
       /* { icon: 'discord', label: 'Comunidade',  to: '/community' },*/
    ],

    adminNav: [
        { icon: 'home',    label: 'Dashboard',  to: '/admin',               end: true  },
        { icon: 'spotify', label: 'Importar',   to: '/admin/artist-import', end: false },
        { icon: 'flag',    label: 'Reclamações', to: '/admin/claims',       end: false },
    ],

    artistNav: [
        { icon: 'chart',   label: 'Dashboard',         to: '/dashboard' },
        { icon: 'music',   label: 'As minhas faixas',  to: '/tracks' },
        { icon: 'compass', label: 'Analytics',         to: '/analytics' },
        { icon: 'store',   label: 'Marketplace',       to: '/marketplace', end: false },
        { icon: 'users',   label: 'Os meus fãs',       to: '/fans' },
        { icon: 'comment', label: 'Comentários',       to: '/comments' },
       /* { icon: 'discord', label: 'Comunidade',        to: '/community' },*/
    ],
};
