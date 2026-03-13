import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, BookOpen, Users, MapPin, DollarSign, ArrowLeft, Menu, X } from 'lucide-react';
import './HostLayout.css';

const NAV_ITEMS = [
    { to: '/host', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/host/workshops', label: 'Workshop', Icon: BookOpen, end: false },
    { to: '/host/attendees', label: 'Attendee', Icon: Users, end: false },
    { to: '/host/venues', label: 'Địa điểm', Icon: MapPin, end: false },
    { to: '/host/finance', label: 'Tài chính', Icon: DollarSign, end: false },
];

const HostLayout: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isLoading) return <div className="page-loader">Đang tải...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="host-shell">
            <aside className={`host-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="host-sidebar-brand">
                    <Link to="/" className="brand-link">
                        <img src="/logo.png" alt="Heal Haven" className="sidebar-logo" />
                    </Link>
                    <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                <div className="host-sidebar-user">
                    <div className="host-avatar">{user.name?.charAt(0).toUpperCase() ?? 'H'}</div>
                    <div>
                        <div className="host-user-name">{user.name ?? 'Host'}</div>
                        <div className="host-user-role">Host</div>
                    </div>
                </div>

                <nav className="host-nav">
                    {NAV_ITEMS.map(({ to, label, Icon, end }) => (
                        <NavLink
                            key={to} to={to} end={end}
                            className={({ isActive }) => `host-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icon size={17} strokeWidth={1.8} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="host-sidebar-footer">
                    <Link to="/" className="host-nav-link back-link">
                        <ArrowLeft size={15} /> Về trang chủ
                    </Link>
                </div>
            </aside>

            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <div className="host-main">
                <div className="host-topbar">
                    <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <span className="topbar-title">Host</span>
                </div>
                <div className="host-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default HostLayout;
