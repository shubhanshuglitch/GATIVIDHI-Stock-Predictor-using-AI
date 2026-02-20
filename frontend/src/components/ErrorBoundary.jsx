import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="slide-up" style={{
                    padding: '50px 40px',
                    textAlign: 'center',
                    background: 'rgba(255, 77, 106, 0.04)',
                    border: '1px solid rgba(255, 77, 106, 0.15)',
                    borderRadius: 'var(--radius-lg)',
                    margin: '40px 20px',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{
                        width: 64, height: 64,
                        borderRadius: '16px',
                        background: 'rgba(255, 77, 106, 0.08)',
                        border: '1px solid rgba(255, 77, 106, 0.15)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        animation: 'pulseScale 2s ease-in-out infinite'
                    }}>
                        <FiAlertTriangle size={28} color="var(--danger)" />
                    </div>
                    <h2 style={{
                        color: 'var(--danger)',
                        marginBottom: '8px',
                        fontSize: '1.4rem',
                        fontWeight: 700
                    }}>Something went wrong</h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '24px',
                        fontSize: '0.9rem',
                        maxWidth: '400px',
                        margin: '0 auto 24px'
                    }}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        className="btn btn-primary"
                        style={{ gap: '8px' }}
                    >
                        <FiRefreshCw size={16} />
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
