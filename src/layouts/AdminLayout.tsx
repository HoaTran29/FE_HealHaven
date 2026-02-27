import React, { useState } from 'react'
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './AdminLayout.css'

const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) return <div className="page-loader">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const navItems = [
    { to: '/admin', label: '📊 Dashboard', end: true },
    { to: '/admin/workshops', label: '🎨 Kiểm duyệt Workshop', end: false },
    { to: '/admin/venues', label: '🏠 Kiểm duyệt Địa điểm', end: false },
    { to: '/admin/users', label: '👥 Quản lý Người dùng', end: false },
    { to: '/admin/finance', label: '💰 Đối soát Tài chính', end: false },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="admin-brand-link">
            <img src="/logo.png" alt="Heal Haven" className="admin-sidebar-logo" />
          </Link>
          <div className="admin-panel-tag">Admin Panel</div>
          <button className="admin-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="admin-sidebar-user">
          <div className="admin-avatar">{user.name?.charAt(0).toUpperCase() ?? 'A'}</div>
          <div>
            <div className="admin-user-name">{user.name}</div>
            <div className="admin-user-role">Administrator</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link back-to-site">← Về trang chủ</Link>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="admin-main-content">
        <div className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="admin-topbar-title">Admin Dashboard</span>
        </div>
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout