import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Floating Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <div className="glass-card slide-up" style={{
                width: '100%',
                maxWidth: '440px',
                padding: '40px',
                position: 'relative',
                zIndex: 2,
                border: '1px solid rgba(0, 224, 255, 0.1)'
            }}>
                {/* Animated border gradient line at top */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: '10%', right: '10%',
                    height: '2px',
                    background: 'var(--accent-gradient)',
                    borderRadius: '0 0 2px 2px',
                    opacity: 0.6
                }} />

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: 56, height: 56,
                        background: 'var(--accent-gradient)',
                        borderRadius: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        boxShadow: '0 8px 30px rgba(0, 224, 255, 0.2), 0 0 40px rgba(0, 224, 255, 0.06)',
                        animation: 'fadeIn 0.8s ease-out'
                    }}>
                        <FiTrendingUp size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Start predicting the market with AI
                    </p>
                </div>

                {error && (
                    <div className="error-card" style={{ marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)'
                            }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '42px', width: '100%' }}
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)'
                            }} />
                            <input
                                type="email"
                                className="input-field"
                                style={{ paddingLeft: '42px', width: '100%' }}
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)'
                            }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '42px', width: '100%' }}
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ marginTop: '8px', width: '100%' }}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
                        ) : (
                            <>Create Account <FiArrowRight /></>
                        )}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
