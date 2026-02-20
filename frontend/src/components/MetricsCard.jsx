import { FiTrendingUp, FiTrendingDown, FiActivity, FiDollarSign } from 'react-icons/fi';

export default function MetricsCard({ title, value, subtitle, icon, trend, color }) {
    const icons = {
        trending: FiTrendingUp,
        down: FiTrendingDown,
        activity: FiActivity,
        dollar: FiDollarSign
    };

    const Icon = icons[icon] || FiActivity;
    const trendColor = trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--text-secondary)';
    const accentBarColor = trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--accent-cyan)';

    return (
        <div className="glass-card stagger-item" style={{
            padding: '20px',
            position: 'relative',
            cursor: 'default',
            overflow: 'hidden'
        }}>
            {/* Color-coded left accent bar */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: '20%',
                bottom: '20%',
                width: '3px',
                borderRadius: '0 3px 3px 0',
                background: accentBarColor,
                boxShadow: `0 0 8px ${accentBarColor}`
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p className="metric-label">{title}</p>
                    <p className="metric-value" style={{ color: color || 'var(--text-primary)' }}>
                        {value}
                    </p>
                    {subtitle && (
                        <p style={{
                            fontSize: '0.8rem',
                            color: trendColor,
                            marginTop: '4px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div style={{
                    width: 44, height: 44,
                    background: `${color || 'var(--accent-cyan)'}10`,
                    border: `1px solid ${color || 'var(--accent-cyan)'}20`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulseScale 3s ease-in-out infinite'
                }}>
                    <Icon size={20} color={color || 'var(--accent-cyan)'} />
                </div>
            </div>
        </div>
    );
}
