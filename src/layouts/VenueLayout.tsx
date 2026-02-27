import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './VenueLayout.css';

const VenueLayout: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isLoading) return <div className="page-loader">Đang tải...</div>;
    if (!user) return <Navigate to="/login" replace />;


    const navItems = [
        { to: '/venue', label: '📊 Dashboard', end: true },
        { to: '/venue/spaces', label: '🏠 Không gian', end: false },
        { to: '/venue/calendar', label: '📅 Lịch trống', end: false },
        { to: '/venue/bookings', label: '📋 Đơn thuê', end: false },
        { to: '/venue/finance', label: '💰 Doanh thu', end: false },
    ];

    return (
        <div className="venue-shell">
            <aside className={`venue-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="venue-sidebar-brand">
                    <Link to="/" className="brand-link">
                        <img src="/logo.png" alt="Heal Haven" className="sidebar-logo" />
                    </Link>
                    <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>

                <div className="venue-sidebar-user">
                    <div className="venue-avatar">{user.name?.charAt(0).toUpperCase() ?? 'V'}</div>
                    <div>
                        <div className="venue-user-name">{user.name ?? 'Venue'}</div>
                        <div className="venue-user-role">Venue Provider</div>
                    </div>
                </div>

                <nav className="venue-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `venue-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="venue-sidebar-footer">
                    <Link to="/" className="venue-nav-link back-link">← Về trang chủ</Link>
                </div>
            </aside>

            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <div className="venue-main">
                <div className="venue-topbar">
                    <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                    <span className="topbar-title">Venue Dashboard</span>
                </div>
                <div className="venue-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default VenueLayout;
