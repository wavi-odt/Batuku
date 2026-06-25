/* ─────────────────────────────────────────────────────────────────
   icons.js — Mapeamento de ícones partilhado pelo AppShell e secções.
   Usa react-icons que já está instalado no projeto.
   ───────────────────────────────────────────────────────────────── */

import {
    HiHome, HiSearch, HiBell, HiPlus,
    HiOutlineLibrary, HiUsers, HiUpload,
    HiSparkles, HiVolumeUp, HiArrowsExpand,
    HiBadgeCheck, HiHeart, HiTrendingUp,
    HiOutlineChatAlt2,
} from 'react-icons/hi'

import {
    FaCompass, FaTrophy, FaStore, FaDiscord,
    FaChartLine, FaMusic, FaPlay, FaPause,
    FaStepForward, FaStepBackward, FaRandom, FaSyncAlt,
    FaCog, FaAward,
} from 'react-icons/fa'

/* Ícones por nome lógico — usa este mapa em vez de imports espalhados. */
export const ICONS = {
    home:     HiHome,
    compass:  FaCompass,
    library:  HiOutlineLibrary,
    heart:    HiHeart,
    trophy:   FaTrophy,
    store:    FaStore,
    discord:  FaDiscord,
    chart:    FaChartLine,
    music:    FaMusic,
    users:    HiUsers,
    comment:  HiOutlineChatAlt2,
    search:   HiSearch,
    bell:     HiBell,
    plus:     HiPlus,
    play:     FaPlay,
    pause:    FaPause,
    skipN:    FaStepForward,
    skipP:    FaStepBackward,
    shuffle:  FaRandom,
    repeat:   FaSyncAlt,
    volume:   HiVolumeUp,
    expand:   HiArrowsExpand,
    award:    FaAward,
    upload:   HiUpload,
    verified: HiBadgeCheck,
    settings: FaCog,
    sparkles: HiSparkles,
    trendUp:  HiTrendingUp,
};

export default ICONS;
