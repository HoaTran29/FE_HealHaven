import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import './Navbar.css'

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const { theme, toggleTheme } = useSettings()
  const navigate = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    closeMenu()
    navigate('/')
  }

  // Lấy chữ cái đầu để hiển thị avatar text
  const avatarText = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : '?'

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`nav-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <img src="/logo.png" alt="HealHaven Logo" className="logo-image" />
          </Link>

          {/* Hamburger (mobile) */}
          <button
            className={`nav-hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Mở menu"
          >
            <span /><span /><span />
          </button>

          {/* Nav links */}
          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <li><NavLink to="/" end onClick={closeMenu}>Trang chủ</NavLink></li>
            <li><NavLink to="/workshops" onClick={closeMenu}>Workshop</NavLink></li>
            <li><NavLink to="/gallery" onClick={closeMenu}>Triển lãm</NavLink></li>
            <li><NavLink to="/community" onClick={closeMenu}>Cộng đồng</NavLink></li>

            {/* Dark mode toggle */}
            <li>
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Đổi theme"
                title={theme === 'light' ? 'Bật Dark Mode' : 'Bật Light Mode'}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>

            {isLoggedIn && user ? (
              /* === ĐÃ ĐĂNG NHẬP === */
              <li className="nav-user-item" ref={dropdownRef}>
                <button
                  className="nav-avatar-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Menu tài khoản"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="nav-avatar-img" />
                  ) : (
                    <span className="nav-avatar-text">{avatarText}</span>
                  )}
                  <span className="nav-username">{user.name.split(' ').pop()}</span>
                  <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                </button>

                {isDropdownOpen && (
                  <div className="nav-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                      👤 Hồ sơ của tôi
                    </Link>
                    <Link to="/my-schedule" className="dropdown-item" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                      📅 Lịch trình của tôi
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                      ⚙️ Cài đặt
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item dropdown-item-admin" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                        🛡️ Trang Admin
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item dropdown-item-logout" onClick={handleLogout}>
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </li>
            ) : (
              /* === CHƯA ĐĂNG NHẬP === */
              <>
                <li><NavLink to="/login" onClick={closeMenu}>Đăng nhập</NavLink></li>
                <li><Link to="/signup" className="btn btn-primary" onClick={closeMenu}>Đăng ký</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar