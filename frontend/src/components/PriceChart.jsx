import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function PriceChart({ data, predictions, movingAverages, title }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!data || data.length === 0) {
        return (
            <div className="glass-card" style={{
                padding: '60px 40px',
                textAlign: 'center',
                position: 'relative'
            }}>
                <div style={{
                    width: 60, height: 60,
                    borderRadius: '16px',
                    background: 'rgba(0, 224, 255, 0.06)',
                    border: '1px solid rgba(0, 224, 255, 0.1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>📈</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Select a stock to view the price chart
                </p>
            </div>
        );
    }

    const labels = data.map(d => d.Date || d.date);

    const datasets = [
        {
            label: 'Close Price',
            data: data.map(d => d.Close ?? d.close),
            borderColor: '#00e0ff',
            backgroundColor: 'rgba(0, 224, 255, 0.06)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#00e0ff',
            pointHoverBorderColor: '#fff',
            fill: true,
            tension: 0.3,
            order: 1
        }
    ];

    // Add predictions if available
    if (predictions && predictions.length > 0) {
        let predData;
        const predStart = data.length - predictions.length;

        if (predStart >= 0) {
            predData = new Array(predStart).fill(null).concat(predictions);
        } else {
            predData = predictions.slice(-data.length);
        }

        datasets.push({
            label: 'Predicted',
            data: predData,
            borderColor: '#ffb020',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            tension: 0.3,
            order: 0
        });
    }

    // Add moving averages if available
    if (movingAverages) {
        const maColors = {
            'SMA_10': '#00f0a0',
            'SMA_20': '#38bdf8',
            'SMA_50': '#f97316',
            'EMA_10': '#d946ef'
        };

        Object.entries(movingAverages).forEach(([key, values]) => {
            if (['SMA_10', 'SMA_20'].includes(key) && values) {
                datasets.push({
                    label: key.replace('_', ' '),
                    data: values,
                    borderColor: maColors[key] || '#8b99b0',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.3
                });
            }
        });
    }

    const chartData = { labels, datasets };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDark ? '#8b99b0' : '#4a5568',
                    font: { family: 'Outfit', size: 11 },
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(6, 10, 19, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                titleColor: isDark ? '#e8edf5' : '#0a0f1d',
                bodyColor: isDark ? '#8b99b0' : '#4a5568',
                borderColor: isDark ? 'rgba(0, 224, 255, 0.2)' : 'rgba(0, 224, 255, 0.3)',
                borderWidth: 1,
                padding: 14,
                titleFont: { family: 'Outfit', weight: '600' },
                bodyFont: { family: 'JetBrains Mono', size: 12 },
                cornerRadius: 10,
                displayColors: true,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y?.toFixed(2) || 'N/A'}`
                }
            }
        },
        scales: {
            x: {
                grid: { color: isDark ? 'rgba(0, 224, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)' },
                ticks: {
                    color: isDark ? '#536380' : '#718096',
                    font: { family: 'Outfit', size: 10 },
                    maxTicksLimit: 12,
                    maxRotation: 45
                }
            },
            y: {
                grid: { color: isDark ? 'rgba(0, 224, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)' },
                ticks: {
                    color: isDark ? '#536380' : '#718096',
                    font: { family: 'JetBrains Mono', size: 10 },
                    callback: (v) => `₹${v.toFixed(0)}`
                }
            }
        }
    };

    return (
        <div className="glass-card fade-in" style={{ padding: '24px' }}>
            {title && (
                <h3 className="neon-text" style={{
                    marginBottom: '16px',
                    fontWeight: 700,
                    fontSize: '1.1rem'
                }}>{title}</h3>
            )}
            <div style={{ height: '400px' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}
