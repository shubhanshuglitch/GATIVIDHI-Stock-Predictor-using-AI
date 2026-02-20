import { useState } from 'react';
import { stockAPI, predictionAPI } from '../services/api';
import StockSearch from '../components/StockSearch';
import PriceChart from '../components/PriceChart';
import PredictionPanel from '../components/PredictionPanel';
import ModelComparison from '../components/ModelComparison';
import MetricsCard from '../components/MetricsCard';
import { FiCalendar, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
    const [ticker, setTicker] = useState('');
    const [stockData, setStockData] = useState(null);
    const [stockInfo, setStockInfo] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [movingAverages, setMovingAverages] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [tradeResult, setTradeResult] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predLoading, setPredLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch stock data
    const handleSearch = async (searchTicker) => {
        setLoading(true);
        setError('');
        setPredictions(null);
        setMovingAverages(null);
        setComparison(null);
        setTradeResult(null);
        setForecast(null);
        setMetrics(null);

        try {
            const response = await stockAPI.getData(searchTicker, '1y');
            setStockData(response.data.data);
            setStockInfo(response.data.info);
            setTicker(searchTicker);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch stock data');
            setStockData(null);
        } finally {
            setLoading(false);
        }
    };

    // Run prediction model
    const handlePredict = async ({ model, ticker: t, period, forecast_days }) => {
        setPredLoading(true);
        setError('');
        setPredictions(null);
        setMovingAverages(null);
        setComparison(null);
        setTradeResult(null);
        setForecast(null);
        setMetrics(null);

        try {
            let response;
            const payload = { ticker: t, period, forecast_days };

            switch (model) {
                case 'arima':
                    response = await predictionAPI.arima(payload);
                    setPredictions(response.data.test_predictions || null);
                    setForecast(response.data.future_forecast || null);
                    setMetrics(response.data.metrics || null);
                    break;

                case 'lstm':
                    response = await predictionAPI.lstm(payload);
                    setPredictions(response.data.test_predictions || null);
                    setForecast(response.data.future_forecast || null);
                    setMetrics(response.data.metrics || null);
                    break;

                case 'regression':
                    response = await predictionAPI.regression(payload);
                    setPredictions(response.data.predictions || null);
                    setForecast(response.data.future_forecast || null);
                    setMetrics(response.data.metrics || null);
                    break;

                case 'moving-avg':
                    response = await predictionAPI.movingAvg(payload);
                    setMovingAverages(response.data.moving_averages || null);
                    break;

                case 'best-trade':
                    response = await predictionAPI.bestTrade(payload);
                    setTradeResult(response.data || null);
                    break;

                case 'evaluate':
                    response = await predictionAPI.evaluate(payload);
                    setComparison(response.data.comparison || null);
                    break;

                default:
                    break;
            }
        } catch (err) {
            console.error('Prediction error:', err);
            setError(err.response?.data?.message || `Failed to run ${model} prediction`);
        } finally {
            setPredLoading(false);
        }
    };

    // Compute display values from stock data
    const latestPrice = stockData?.length > 0 ? (stockData[stockData.length - 1].Close ?? stockData[stockData.length - 1].close) : null;
    const prevPrice = stockData?.length > 1 ? (stockData[stockData.length - 2].Close ?? stockData[stockData.length - 2].close) : null;
    const priceChange = latestPrice && prevPrice ? latestPrice - prevPrice : 0;
    const pctChange = prevPrice ? ((priceChange / prevPrice) * 100).toFixed(2) : '0.00';
    const highPrice = stockData ? Math.max(...stockData.map(d => d.High ?? d.high)) : 0;
    const lowPrice = stockData ? Math.min(...stockData.map(d => d.Low ?? d.low)) : 0;
    const avgVolume = stockData
        ? Math.round(stockData.reduce((sum, d) => sum + (d.Volume ?? d.volume), 0) / stockData.length)
        : 0;

    return (
        <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div className="stagger-item" style={{ marginBottom: '24px' }}>
                <h1 className="neon-text" style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    marginBottom: '4px'
                }}>
                    Market Dashboard
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    AI-powered stock analysis and prediction
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-card" style={{ marginBottom: '20px' }}>
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{
                        background: 'none', border: 'none', color: 'var(--danger)',
                        cursor: 'pointer', fontSize: '1.1rem'
                    }}>×</button>
                </div>
            )}

            {/* Search + Prediction Panel Row */}
            <div className="stagger-item" style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 380px)',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <StockSearch onSearch={handleSearch} loading={loading} />
                    </div>

                    {/* Metrics Cards */}
                    {stockData && (
                        <div className="grid-4" style={{ position: 'relative', zIndex: 1 }}>
                            <MetricsCard
                                title="Current Price"
                                value={`₹${latestPrice?.toFixed(2) || '—'}`}
                                subtitle={`${priceChange >= 0 ? '+' : ''}${pctChange}%`}
                                icon={priceChange >= 0 ? 'trending' : 'down'}
                                trend={priceChange >= 0 ? 'up' : 'down'}
                                color={priceChange >= 0 ? 'var(--success)' : 'var(--danger)'}
                            />
                            <MetricsCard
                                title="52W High"
                                value={`₹${highPrice.toFixed(2)}`}
                                icon="trending"
                                color="var(--success)"
                            />
                            <MetricsCard
                                title="52W Low"
                                value={`₹${lowPrice.toFixed(2)}`}
                                icon="down"
                                color="var(--danger)"
                            />
                            <MetricsCard
                                title="Avg Volume"
                                value={avgVolume > 1000000
                                    ? `${(avgVolume / 1000000).toFixed(1)}M`
                                    : avgVolume > 1000
                                        ? `${(avgVolume / 1000).toFixed(0)}K`
                                        : avgVolume.toString()
                                }
                                icon="activity"
                                color="var(--info)"
                            />
                        </div>
                    )}
                </div>

                <PredictionPanel
                    ticker={ticker}
                    onPredict={handlePredict}
                    loading={predLoading}
                />
            </div>

            {/* Price Chart */}
            <div className="stagger-item" style={{ marginBottom: '20px' }}>
                <PriceChart
                    data={stockData}
                    predictions={predictions}
                    movingAverages={movingAverages}
                    title={ticker ? `${stockInfo?.name || ticker} — Price Chart` : 'Stock Price Chart'}
                />
            </div>

            {/* Prediction Metrics */}
            {metrics && (
                <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '20px' }}>
                    <h3 className="section-title" style={{ marginBottom: '16px' }}>Prediction Metrics</h3>
                    <div className="grid-4">
                        <div className="stagger-item" style={{ textAlign: 'center' }}>
                            <p className="metric-value" style={{ color: 'var(--accent-cyan)' }}>{metrics.rmse}</p>
                            <p className="metric-label">RMSE</p>
                        </div>
                        <div className="stagger-item" style={{ textAlign: 'center' }}>
                            <p className="metric-value" style={{ color: 'var(--info)' }}>{metrics.mae}</p>
                            <p className="metric-label">MAE</p>
                        </div>
                        <div className="stagger-item" style={{ textAlign: 'center' }}>
                            <p className="metric-value" style={{
                                color: metrics.r2 > 0.9 ? 'var(--success)' : metrics.r2 > 0.7 ? 'var(--warning)' : 'var(--danger)'
                            }}>{metrics.r2}</p>
                            <p className="metric-label">R² Score</p>
                        </div>
                        <div className="stagger-item" style={{ textAlign: 'center' }}>
                            <p className="metric-value" style={{ color: 'var(--warning)' }}>{metrics.mape}%</p>
                            <p className="metric-label">MAPE</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Best Trade Results */}
            {tradeResult && (
                <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '20px' }}>
                    <h3 className="section-title" style={{ marginBottom: '16px' }}>
                        Optimal Trading Strategy (DP Analysis)
                    </h3>

                    <div className="grid-3" style={{ marginBottom: '20px' }}>
                        <div className="glass-card stagger-item" style={{ padding: '16px', textAlign: 'center' }}>
                            <p className="metric-label">Single Trade</p>
                            <p className="metric-value" style={{ color: 'var(--success)' }}>
                                ₹{tradeResult.single_transaction?.max_profit?.toFixed(2)}
                            </p>
                        </div>
                        <div className="glass-card stagger-item" style={{ padding: '16px', textAlign: 'center' }}>
                            <p className="metric-label">K Transactions</p>
                            <p className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
                                ₹{tradeResult.k_transactions?.max_profit?.toFixed(2)}
                            </p>
                        </div>
                        <div className="glass-card stagger-item" style={{ padding: '16px', textAlign: 'center' }}>
                            <p className="metric-label">Unlimited</p>
                            <p className="metric-value" style={{ color: 'var(--warning)' }}>
                                ₹{tradeResult.unlimited_transactions?.max_profit?.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {tradeResult.k_transactions?.transactions?.length > 0 && (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Buy Date</th>
                                        <th style={{ textAlign: 'right' }}>Buy Price</th>
                                        <th>Sell Date</th>
                                        <th style={{ textAlign: 'right' }}>Sell Price</th>
                                        <th style={{ textAlign: 'right' }}>Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tradeResult.k_transactions.transactions.map((t, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td style={{ color: 'var(--success)' }}>{t.buy_date}</td>
                                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{t.buy_price}</td>
                                            <td style={{ color: 'var(--danger)' }}>{t.sell_date}</td>
                                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{t.sell_price}</td>
                                            <td style={{
                                                textAlign: 'right', fontWeight: 600,
                                                fontFamily: 'var(--font-mono)',
                                                color: t.profit >= 0 ? 'var(--success)' : 'var(--danger)'
                                            }}>₹{t.profit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Future Forecast */}
            {forecast && forecast.length > 0 && (
                <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '20px' }}>
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
                            <FiCalendar size={16} color="var(--accent-cyan)" />
                        </div>
                        <h3 className="section-title" style={{ margin: 0 }}>
                            Predicted Prices — Next {forecast.length} Days
                        </h3>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '10px',
                        marginBottom: '20px'
                    }}>
                        {forecast.map((price, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i + 1);
                            const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                            const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
                            const prevForecast = i > 0 ? forecast[i - 1] : (stockData?.[stockData.length - 1]?.close || price);
                            const change = price - prevForecast;
                            const isUp = change >= 0;

                            return (
                                <div key={i} className="forecast-card stagger-item">
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                        {dayName}, {dateStr}
                                    </p>
                                    <p style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        marginBottom: '2px',
                                        fontFamily: 'var(--font-mono)'
                                    }}>
                                        ₹{typeof price === 'number' ? price.toFixed(2) : price}
                                    </p>
                                    <p style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 500,
                                        color: isUp ? 'var(--success)' : 'var(--danger)',
                                        fontFamily: 'var(--font-mono)'
                                    }}>
                                        {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div style={{
                        display: 'flex', gap: '20px', padding: '16px',
                        background: 'rgba(0, 224, 255, 0.03)',
                        border: '1px solid rgba(0, 224, 255, 0.06)',
                        borderRadius: 'var(--radius-sm)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Today</p>
                            <p style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                ₹{stockData?.[stockData.length - 1]?.close?.toFixed(2)}
                            </p>
                        </div>
                        <div style={{
                            color: 'var(--text-muted)',
                            fontSize: '1.2rem'
                        }}>→</div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Day {forecast.length}</p>
                            <p style={{
                                fontWeight: 700,
                                fontFamily: 'var(--font-mono)',
                                color: forecast[forecast.length - 1] >= (stockData?.[stockData.length - 1]?.close || 0)
                                    ? 'var(--success)' : 'var(--danger)'
                            }}>
                                ₹{typeof forecast[forecast.length - 1] === 'number'
                                    ? forecast[forecast.length - 1].toFixed(2)
                                    : forecast[forecast.length - 1]}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FiTrendingUp size={16} color={
                                forecast[forecast.length - 1] >= (stockData?.[stockData.length - 1]?.close || 0)
                                    ? 'var(--success)' : 'var(--danger)'
                            } />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Change</p>
                            {(() => {
                                const totalChange = forecast[forecast.length - 1] - (stockData?.[stockData.length - 1]?.close || 0);
                                const pct = ((totalChange / (stockData?.[stockData.length - 1]?.close || 1)) * 100).toFixed(2);
                                return (
                                    <p style={{
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-mono)',
                                        color: totalChange >= 0 ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        {totalChange >= 0 ? '+' : ''}{pct}%
                                    </p>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Model Comparison */}
            {comparison && <ModelComparison comparison={comparison} />}
        </div>
    );
}
