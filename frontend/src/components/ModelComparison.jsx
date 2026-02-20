import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';
import { FiAward } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ModelComparison({ comparison }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!comparison || !comparison.models || comparison.models.length === 0) {
        return null;
    }

    const { models, recommendation } = comparison;

    // Metrics table
    const metricsTable = (
        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table className="data-table">
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left' }}>Model</th>
                        <th style={{ textAlign: 'right' }}>RMSE ↓</th>
                        <th style={{ textAlign: 'right' }}>MAE ↓</th>
                        <th style={{ textAlign: 'right' }}>R² ↑</th>
                        <th style={{ textAlign: 'right' }}>MAPE ↓</th>
                    </tr>
                </thead>
                <tbody>
                    {models.map((m, i) => (
                        <tr key={i} style={{
                            background: m.model === recommendation ? 'var(--bg-item-hover)' : 'transparent'
                        }}>
                            <td style={{ fontWeight: 600 }}>
                                {m.model}
                                {m.model === recommendation && (
                                    <span className="best-badge">
                                        <FiAward size={10} /> BEST
                                    </span>
                                )}
                            </td>
                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{m.rmse}</td>
                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{m.mae}</td>
                            <td style={{
                                textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                                color: m.r2 > 0.9 ? 'var(--success)' : m.r2 > 0.7 ? 'var(--warning)' : 'var(--danger)'
                            }}>{m.r2}</td>
                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{m.mape}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Bar chart with gradient fills
    const chartData = {
        labels: models.map(m => m.model),
        datasets: [
            {
                label: 'R² Score',
                data: models.map(m => m.r2),
                backgroundColor: models.map(m =>
                    m.model === recommendation ? 'rgba(0, 224, 255, 0.6)' : 'rgba(0, 224, 255, 0.2)'
                ),
                borderColor: models.map(m =>
                    m.model === recommendation ? 'rgba(0, 224, 255, 0.9)' : 'rgba(0, 224, 255, 0.4)'
                ),
                borderWidth: 1,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(0, 224, 255, 0.5)'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? 'rgba(6, 10, 19, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                titleColor: isDark ? '#e8edf5' : '#0a0f1d',
                bodyColor: isDark ? '#8b99b0' : '#4a5568',
                borderColor: isDark ? 'rgba(0, 224, 255, 0.2)' : 'rgba(0, 224, 255, 0.3)',
                borderWidth: 1,
                padding: 14,
                cornerRadius: 10,
                bodyFont: { family: 'JetBrains Mono', size: 12 }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: isDark ? '#536380' : '#718096', font: { family: 'Outfit', size: 11 } }
            },
            y: {
                grid: { color: isDark ? 'rgba(0, 224, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)' },
                ticks: { color: isDark ? '#536380' : '#718096', font: { family: 'JetBrains Mono', size: 10 } },
                min: 0,
                max: 1
            }
        }
    };

    return (
        <div className="glass-card fade-in" style={{ padding: '24px' }}>
            <div className="section-header">
                <h3 className="section-title">Model Comparison</h3>
                {recommendation && (
                    <span className="tag tag-info">
                        Recommended: {recommendation}
                    </span>
                )}
            </div>

            {metricsTable}

            <div style={{ height: '250px' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}
