/**
 * ms → "m:ss"  (retorna '' para null/undefined/0)
 */
export function fmtMs(ms) {
    if (!ms) return ''
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * ms → "m:ss"  (retorna '0:00' para 0/null/undefined — uso em players)
 */
export function fmtTime(ms) {
    if (!ms && ms !== 0) return '0:00'
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * s (segundos) → "m:ss"  (retorna '' para null/undefined/0)
 */
export function fmtDuration(s) {
    if (!s && s !== 0) return ''
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

/**
 * ms → "X min" ou "X h Y min"
 */
export function fmtTotalMs(ms) {
    if (!ms) return null
    const min = Math.floor(ms / 60000)
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `${h} h ${m} min` : `${h} h`
}

/**
 * ISO → "1 jan"  (dia + mês curto, sem ano — para gráficos)
 */
export function fmtDateShort(iso) {
    if (!iso) return ''
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}

/**
 * ISO → "1 jan 2024"  (dia + mês curto + ano — para listas)
 */
export function fmtDateLong(iso) {
    if (!iso) return null
    return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * ISO → "1 de jan de 2024"  (formato longo pt-PT — para detalhes)
 */
export function fmtDateFull(iso) {
    if (!iso) return null
    const [y, m, d] = iso.split('-')
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    return d ? `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}` : y
}

/**
 * Número → "1.5k" ou "123"
 */
export function fmtNum(n) {
    if (n == null) return ''
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}
