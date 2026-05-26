/* ─────────────────────────────────────────────────────────────────
   ArtistArtwork — Gera "capas de álbum" em SVG por artista.
   Usa `shape` + `hue` para uma composição única reproduzível.
   ───────────────────────────────────────────────────────────────── */

import './ArtistArtwork.css'

const SHAPES = {
    circles: (fg, fg2, ink) => (
        <>
            <circle cx="50" cy="65" r="34" fill={fg} />
            <circle cx="68" cy="38" r="18" fill={fg2} />
        </>
    ),
    arch: (fg, fg2, ink) => (
        <>
            <path d="M10 90 L10 50 a40 40 0 0 1 80 0 L90 90 Z" fill={fg} />
            <rect x="42" y="62" width="16" height="28" fill={ink} />
        </>
    ),
    stripes: (fg, fg2, ink) => (
        <>
            <rect x="0"  y="0" width="20" height="100" fill={fg} />
            <rect x="30" y="0" width="20" height="100" fill={fg2} />
            <rect x="60" y="0" width="20" height="100" fill={fg} />
            <circle cx="50" cy="50" r="22" fill={ink} />
        </>
    ),
    split: (fg, fg2, ink) => (
        <>
            <rect x="0" y="0" width="50" height="100" fill={fg} />
            <rect x="50" y="0" width="50" height="100" fill={fg2} />
            <circle cx="50" cy="50" r="28" fill={ink} />
        </>
    ),
    orbit: (fg, fg2, ink) => (
        <>
            <circle cx="50" cy="50" r="38" fill="none" stroke={fg} strokeWidth="6" />
            <circle cx="50" cy="50" r="24" fill="none" stroke={fg2} strokeWidth="4" />
            <circle cx="50" cy="12" r="6" fill={fg2} />
            <circle cx="50" cy="50" r="10" fill={ink} />
        </>
    ),
    wave: (fg, fg2, ink) => (
        <>
            <path d="M0 60 Q 25 30 50 60 T 100 60 L 100 100 L 0 100 Z" fill={fg} />
            <path d="M0 75 Q 25 50 50 75 T 100 75 L 100 100 L 0 100 Z" fill={fg2} />
        </>
    ),
    sun: (fg, fg2, ink) => (
        <>
            <circle cx="50" cy="100" r="40" fill={fg} />
            {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x="48" y="14" width="4" height="22"
                      fill={fg2} transform={`rotate(${i * 22.5 - 90} 50 60)`} />
            ))}
        </>
    ),
    triangles: (fg, fg2, ink) => (
        <>
            <polygon points="0,100 50,20 100,100" fill={fg} />
            <polygon points="30,100 50,60 70,100" fill={ink} />
            <circle cx="50" cy="30" r="8" fill={fg2} />
        </>
    ),
};

export default function ArtistArtwork({
    shape = 'circles',
    hue = 14,
    name,
    rounded = 14,
    showGloss = true,
}) {
    const bg  = `oklch(0.52 0.18 ${hue})`;
    const fg  = `oklch(0.86 0.14 ${hue})`;
    const fg2 = `oklch(0.94 0.08 ${(hue + 30) % 360})`;
    const ink = '#1A1715';

    const Composition = SHAPES[shape] || SHAPES.circles;

    return (
        <div className="artwork" style={{ borderRadius: rounded }}>
            <svg className="artwork__svg" viewBox="0 0 100 100" preserveAspectRatio="none"
                 style={{ background: bg }} aria-hidden="true">
                {Composition(fg, fg2, ink)}
            </svg>
            {showGloss && <div className="artwork__gloss" aria-hidden="true" />}
            {name && <div className="artwork__name">{name}</div>}
        </div>
    );
}
