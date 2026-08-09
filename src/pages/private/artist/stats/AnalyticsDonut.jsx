export default function AnalyticsDonut({ completionRate }) {
    const SIZE   = 156
    const STROKE = 18
    const r      = (SIZE - STROKE) / 2
    const cx     = SIZE / 2
    const cy     = SIZE / 2
    const circ   = 2 * Math.PI * r

    const pct   = Math.max(0, Math.min(100, completionRate ?? 0))
    const color = pct >= 70
        ? 'var(--color-green)'
        : pct >= 40
        ? 'var(--color-mustard)'
        : 'var(--color-coral)'

    const hint = pct >= 70
        ? 'Excelente retenção'
        : pct >= 40
        ? 'Retenção moderada'
        : 'Baixa retenção'

    return (
        <div className="anl__donut-card">
            <h3 className="anl__line-title">Taxa de conclusão</h3>
            <p className="anl__line-sub" style={{ marginBottom: 20 }}>
                Percentagem média de cada faixa ouvida
            </p>
            <div className="anl__donut-wrap">
                <svg width={SIZE} height={SIZE} className="anl__donut-svg">
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={STROKE}
                    />
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        style={{ transition: 'stroke-dasharray 0.7s ease, stroke 0.4s ease' }}
                    />
                    <text x={cx} y={cy - 7} textAnchor="middle"
                        fontSize="24" fontWeight="700" fill="var(--color-ink)"
                        fontFamily="inherit" dominantBaseline="auto">
                        {pct.toLocaleString('pt-PT', { maximumFractionDigits: 1 })}%
                    </text>
                    <text x={cx} y={cy + 13} textAnchor="middle"
                        fontSize="10" fill="var(--color-ink-mute)"
                        fontFamily="inherit">
                        conclusão média
                    </text>
                </svg>
                <p className="anl__donut-hint" style={{ color }}>{hint}</p>
            </div>
        </div>
    )
}
