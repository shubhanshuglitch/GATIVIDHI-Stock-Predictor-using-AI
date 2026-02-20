import { useState, useRef, useEffect, useCallback } from 'react';
import { FiSearch, FiTrendingUp } from 'react-icons/fi';
import { stockAPI } from '../services/api';

const POPULAR_STOCKS = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
    { symbol: 'TCS.NS', name: 'TCS' },
    { symbol: 'INFY.NS', name: 'Infosys' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
    { symbol: 'ITC.NS', name: 'ITC' },
    { symbol: 'SBIN.NS', name: 'State Bank' },
    { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance' },
    { symbol: 'WIPRO.NS', name: 'Wipro' },
];

export default function StockSearch({ onSearch, loading }) {
    const [ticker, setTicker] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searching, setSearching] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    const fetchSuggestions = useCallback((query) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await stockAPI.search(query);
                const results = res.data.results || [];
                setSuggestions(results);
                setShowSuggestions(results.length > 0);
                setSelectedIndex(-1);
            } catch {
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setSearching(false);
            }
        }, 300);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value.toUpperCase();
        setTicker(val);
        fetchSuggestions(val);
    };

    const selectSuggestion = (symbol) => {
        setTicker(symbol);
        setShowSuggestions(false);
        setSuggestions([]);
        onSearch(symbol);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (ticker.trim()) {
            setShowSuggestions(false);
            onSearch(ticker.trim().toUpperCase());
        }
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[selectedIndex].symbol);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '24px', overflow: 'visible' }}>
            <h3 style={{
                marginBottom: '16px',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <FiSearch size={16} color="var(--accent-cyan)" />
                Search Stock
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div ref={wrapperRef} style={{ position: 'relative', flex: 1 }}>
                    <FiSearch style={{
                        position: 'absolute', left: '14px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 2
                    }} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ paddingLeft: '42px', width: '100%' }}
                        placeholder="Search stocks (e.g., Reliance, AAPL)..."
                        value={ticker}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                        autoComplete="off"
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '8px',
                            background: 'var(--bg-dropdown)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            maxHeight: '280px',
                            overflowY: 'auto',
                            zIndex: 1000, // Very high z-index
                            boxShadow: 'var(--shadow-lg)',
                            backdropFilter: 'blur(30px)'
                        }}>
                            {searching && (
                                <div style={{ padding: '12px 16px', textAlign: 'center' }}>
                                    <div className="progress-bar" style={{ height: '2px' }}>
                                        <div className="progress-bar-fill shim" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            )}
                            {suggestions.map((s, i) => (
                                <div
                                    key={s.symbol + i}
                                    onClick={() => selectSuggestion(s.symbol)}
                                    onMouseEnter={() => setSelectedIndex(i)}
                                    className="stagger-item"
                                    style={{
                                        padding: '10px 16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        background: selectedIndex === i
                                            ? 'var(--bg-item-hover)'
                                            : 'transparent',
                                        borderBottom: i < suggestions.length - 1
                                            ? '1px solid var(--border-color)'
                                            : 'none',
                                        transition: 'background 0.2s ease',
                                        '--animation-delay': `${i * 0.05}s` // Staggered delay
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FiTrendingUp size={14} color="var(--accent-cyan)" />
                                        <div>
                                            <div style={{
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                color: 'var(--text-primary)'
                                            }}>
                                                {s.symbol}
                                            </div>
                                            <div style={{
                                                fontSize: '0.72rem',
                                                color: 'var(--text-muted)',
                                                marginTop: '1px'
                                            }}>
                                                {s.name}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        color: 'var(--text-muted)',
                                        background: 'rgba(0, 224, 255, 0.06)',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(0, 224, 255, 0.08)'
                                    }}>
                                        {s.exchange || s.type || 'EQUITY'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading || !ticker.trim()}>
                    {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Analyze'}
                </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Popular:</span>
                {POPULAR_STOCKS.map(stock => (
                    <button
                        key={stock.symbol}
                        onClick={() => { setTicker(stock.symbol); onSearch(stock.symbol); }}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                        disabled={loading}
                        title={stock.name}
                    >
                        {stock.symbol}
                    </button>
                ))}
            </div>
        </div>
    );
}
