import React, { useState } from 'react'
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, BookOpen, MapPin, Users, DollarSign, CreditCard, ArrowLeft, Menu, X } from 'lucide-react'
import './AdminLayout.css'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/workshops', label: 'Kiểm duyệt Workshop', Icon: BookOpen, end: false },
  { to: '/admin/venues', label: 'Kiểm duyệt Địa điểm', Icon: MapPin, end: false },
  { to: '/admin/users', label: 'Quản lý Người dùng', Icon: Users, end: false },
  { to: '/admin/payments', label: 'Duyệt thanh toán', Icon: CreditCard, end: false },
  { to: '/admin/finance', label: 'Đối soát Tài chính', Icon: DollarSign, end: false },
];

const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) return <div className="page-loader">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="admin-brand-link">
            <img src="/logo.png" alt="Heal Haven" className="admin-sidebar-logo" />
          </Link>
          <div className="admin-panel-tag">Admin</div>
          <button className="admin-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="admin-sidebar-user">
          <div className="admin-avatar">{user.name?.charAt(0).toUpperCase() ?? 'A'}</div>
          <div>
            <div className="admin-user-name">{user.name}</div>
            <div className="admin-user-role">Administrator</div>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link back-to-site">
            <ArrowLeft size={15} /> Về trang chủ
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="admin-main-content">
        <div className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <span className="admin-topbar-title">Admin</span>
        </div>
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout