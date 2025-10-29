import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css' // CSS riêng cho Navbar

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo trỏ về trang chủ */}
        <Link to="/" className="nav-logo">
          <img src="/logo.png" alt="HealHaven Logo" className="logo-image"/>
        </Link>
        
        {/* Các link điều hướng */}
        <ul className="nav-links">
          <li>
            {/* NavLink tự động thêm class 'active' khi link được chọn */}
            <NavLink to="/">Trang chủ</NavLink>
          </li>
          <li>
            <NavLink to="/courses">Khóa học</NavLink>
          </li>
          <li>
            <NavLink to="/community">Cộng đồng</NavLink>
          </li>
          <li>
            <NavLink to="/login">Đăng nhập</NavLink>
          </li>
          <li>
            {/* Đây là nút, dùng Link bình thường */}
            <Link to="/signup" className="btn btn-primary">
              Đăng ký
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar