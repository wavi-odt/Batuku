/* ─────────────────────────────────────────────────────────────────
   useReveal, Adiciona class `in` quando o elemento entra no viewport.
   Combina com a class `reveal` em global.css.
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'

export default function useReveal(threshold = 0.12) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (el.classList.contains('reveal')) {
                        el.classList.add('in');
                    } else {
                        el.querySelectorAll('.reveal').forEach(r => r.classList.add('in'));
                    }
                    io.disconnect();
                }
            },
            { threshold }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);

    return ref;
}
