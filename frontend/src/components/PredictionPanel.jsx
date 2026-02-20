import { useState } from 'react';
import { FiCpu, FiPlay, FiSettings, FiCheck } from 'react-icons/fi';

export default function PredictionPanel({ ticker, onPredict, loading }) {
    const [model, setModel] = useState('arima');
    const [forecastDays, setForecastDays] = useState(30);
    const [period, setPeriod] = useState('2y');

    const handlePredict = () => {
        if (!ticker) return;
        onPredict({
            model,
            ticker,
            period,
            forecast_days: forecastDays
        });
    };

    const models = [
        { id: 'arima', name: 'ARIMA', desc: 'Linear time series model' },
        { id: 'lstm', name: 'LSTM', desc: 'Deep learning (neural network)' },
        { id: 'regression', name: 'D&C Regression', desc: 'Divide-and-conquer piecewise' },
        { id: 'moving-avg', name: 'Moving Averages', desc: 'SMA/EMA sliding window' },
        { id: 'best-trade', name: 'Best Trade (DP)', desc: 'Optimal buy/sell intervals' },
        { id: 'evaluate', name: 'Compare All', desc: 'Benchmark all models' }
    ];

    return (
        <div className="glass-card fade-in" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                    width: 32, height: 32,
                    borderRadius: '8px',
                    background: 'rgba(0, 224, 255, 0.08)',
                    border: '1px solid rgba(0, 224, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <FiCpu size={16} color="var(--accent-cyan)" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Prediction Models</h3>
            </div>

            {/* Model Selection */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '20px'
            }}>
                {models.map(m => (
                    <button
                        key={m.id}
                        onClick={() => setModel(m.id)}
                        className={`model-card ${model === m.id ? 'active' : ''}`}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            {model === m.id && (
                                <FiCheck size={12} color="var(--accent-cyan)" style={{
                                    animation: 'fadeIn 0.2s ease-out'
                                }} />
                            )}
                            <p style={{
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                color: model === m.id ? 'var(--accent-cyan)' : 'var(--text-primary)'
                            }}>{m.name}</p>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.desc}</p>
                    </button>
                ))}
            </div>

            {/* Parameters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem' }}>
                        <FiSettings size={12} style={{ marginRight: 4 }} />
                        Forecast Days
                    </label>
                    <select
                        className="input-field"
                        value={forecastDays}
                        onChange={(e) => setForecastDays(Number(e.target.value))}
                    >
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                    </select>
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem' }}>Historical Period</label>
                    <select
                        className="input-field"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="6mo">6 months</option>
                        <option value="1y">1 year</option>
                        <option value="2y">2 years</option>
                        <option value="5y">5 years</option>
                    </select>
                </div>
            </div>

            {/* Run Button */}
            <button
                onClick={handlePredict}
                className="btn btn-primary"
                disabled={!ticker || loading}
                style={{ width: '100%', gap: '8px' }}
            >
                {loading ? (
                    <>
                        <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                        Running {model.toUpperCase()}...
                    </>
                ) : (
                    <>
                        <FiPlay size={16} />
                        Run Prediction
                    </>
                )}
            </button>

            {/* Loading progress bar */}
            {loading && (
                <div className="progress-bar" style={{ marginTop: '12px' }}>
                    <div className="progress-bar-fill" />
                </div>
            )}

            {!ticker && (
                <p style={{
                    textAlign: 'center',
                    marginTop: '12px',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                }}>
                    Search for a stock first to run predictions
                </p>
            )}
        </div>
    );
}
