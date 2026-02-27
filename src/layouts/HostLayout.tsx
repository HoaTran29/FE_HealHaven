import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HostLayout.css';

const HostLayout: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isLoading) return <div className="page-loader">Đang tải...</div>;
    if (!user) return <Navigate to="/login" replace />;
    // Bỏ comment dòng dưới khi BE phân quyền role sẵn sàng
    // if (user.role !== 'HOST') return <Navigate to="/" replace />;


    const navItems = [
        { to: '/host', label: '📊 Dashboard', end: true },
        { to: '/host/workshops', label: '🎨 Workshop', end: false },
        { to: '/host/attendees', label: '👥 Attendee', end: false },
        { to: '/host/venues', label: '📍 Địa điểm', end: false },
        { to: '/host/finance', label: '💰 Tài chính', end: false },
    ];

    return (
        <div className="host-shell">
            {/* === Sidebar === */}
            <aside className={`host-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="host-sidebar-brand">
                    <Link to="/" className="brand-link">
                        <img src="/logo.png" alt="Heal Haven" className="sidebar-logo" />
                    </Link>
                    <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>

                <div className="host-sidebar-user">
                    <div className="host-avatar">{user.name?.charAt(0).toUpperCase() ?? 'H'}</div>
                    <div>
                        <div className="host-user-name">{user.name ?? 'Host'}</div>
                        <div className="host-user-role">Host</div>
                    </div>
                </div>

                <nav className="host-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `host-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="host-sidebar-footer">
                    <Link to="/" className="host-nav-link back-link">← Về trang chủ</Link>
                </div>
            </aside>

            {/* Overlay mobile */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* === Main === */}
            <div className="host-main">
                {/* Mobile topbar */}
                <div className="host-topbar">
                    <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                    <span className="topbar-title">Host Dashboard</span>
                </div>

                <div className="host-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default HostLayout;
