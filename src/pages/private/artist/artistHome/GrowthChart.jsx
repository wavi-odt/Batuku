import AnalyticsLineChart from '../stats/AnalyticsLineChart.jsx'

export default function GrowthChart({ data, period, onPeriodChange }) {
    return (
        <AnalyticsLineChart
            dailyPlays={data}
            period={period}
            onPeriodChange={onPeriodChange}
        />
    )
}
