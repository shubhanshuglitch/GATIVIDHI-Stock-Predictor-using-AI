import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiTrendingUp, FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }}>
            {/* Animated bottom border gradient */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, var(--accent-cyan) 20%, var(--accent-violet) 50%, var(--accent-emerald) 80%, transparent 100%)',
                opacity: 0.4
            }} />

            <Link to="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1.25rem',
                fontWeight: 800,
                textDecoration: 'none'
            }}>
                <div className="logo-icon" style={{
                    width: 40, height: 40,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(0, 224, 255, 0.2)',
                    transition: 'var(--transition)'
                }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span className="neon-text" style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                    GATIVIDHI
                </span>
                <span className="pulse-dot" style={{ marginLeft: '-4px' }} />
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-outline btn-sm"
                    style={{
                        width: '36px',
                        height: '36px',
                        padding: 0,
                        borderRadius: '10px',
                        borderColor: 'var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    background: 'rgba(0, 224, 255, 0.06)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    transition: 'var(--transition)'
                }}>
                    <FiUser size={14} />
                    <span>{user?.name || 'User'}</span>
                </div>

                <button
                    onClick={logout}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '6px' }}
                >
                    <FiLogOut size={14} />
                    Logout
                </button>
            </div>
        </nav>
    );
}
