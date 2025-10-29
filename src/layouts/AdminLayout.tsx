import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import './AdminLayout.css' // CSS riêng cho Admin

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      {/* === THANH MENU DỌC (SIDEBAR) === */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-logo">Heal Haven</Link>
          <span>Admin Panel</span>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end> {/* 'end' để trang chủ không bị active khi ở /admin/users */}
            Dashboard (Bảng điều khiển)
          </NavLink>
          <NavLink to="/admin/workshops">
            Duyệt Workshop
          </NavLink>
          <NavLink to="/admin/users">
            Quản lý Người dùng
          </NavLink>
          <NavLink to="/admin/settings">
            Cài đặt
          </NavLink>
          <NavLink to="/" className="back-to-site"> {/* Quay về trang chủ */}
            &larr; Về trang chủ
          </NavLink>
        </nav>
      </aside>
      
      {/* === VÙNG NỘI DUNG CHÍNH === */}
      <main className="admin-main-content">
        <Outlet /> {/* Các trang admin sẽ render ở đây */}
      </main>
    </div>
  )
}

export default AdminLayout