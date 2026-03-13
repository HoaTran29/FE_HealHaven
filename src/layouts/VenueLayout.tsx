import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Building2, Calendar, ClipboardList, DollarSign, ArrowLeft, Menu, X } from 'lucide-react';
import './VenueLayout.css';

const NAV_ITEMS = [
    { to: '/venue', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/venue/spaces', label: 'Không gian', Icon: Building2, end: false },
    { to: '/venue/calendar', label: 'Lịch trống', Icon: Calendar, end: false },
    { to: '/venue/bookings', label: 'Đơn thuê', Icon: ClipboardList, end: false },
    { to: '/venue/finance', label: 'Doanh thu', Icon: DollarSign, end: false },
];

const VenueLayout: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isLoading) return <div className="page-loader">Đang tải...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="venue-shell">
            <aside className={`venue-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="venue-sidebar-brand">
                    <Link to="/" className="brand-link">
                        <img src="/logo.png" alt="Heal Haven" className="sidebar-logo" />
                    </Link>
                    <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                <div className="venue-sidebar-user">
                    <div className="venue-avatar">{user.name?.charAt(0).toUpperCase() ?? 'V'}</div>
                    <div>
                        <div className="venue-user-name">{user.name ?? 'Venue'}</div>
                        <div className="venue-user-role">Venue Provider</div>
                    </div>
                </div>

                <nav className="venue-nav">
                    {NAV_ITEMS.map(({ to, label, Icon, end }) => (
                        <NavLink
                            key={to} to={to} end={end}
                            className={({ isActive }) => `venue-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icon size={17} strokeWidth={1.8} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="venue-sidebar-footer">
                    <Link to="/" className="venue-nav-link back-link">
                        <ArrowLeft size={15} /> Về trang chủ
                    </Link>
                </div>
            </aside>

            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <div className="venue-main">
                <div className="venue-topbar">
                    <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <span className="topbar-title">Venue</span>
                </div>
                <div className="venue-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default VenueLayout;
