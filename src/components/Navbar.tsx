import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { Sun, Moon, User, Calendar, Settings, ShieldCheck, LogOut, ChevronDown } from 'lucide-react'
import './Navbar.css'

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const { theme, toggleTheme } = useSettings()
  const navigate = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

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

  const avatarText = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : '?'

  return (
    <>
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
            <li><NavLink to="/venues" onClick={closeMenu}>Địa điểm</NavLink></li>
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
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </li>

            {isLoggedIn && user ? (
              <>
                {/* Notification Bell */}
                <li className="nav-notification-item" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginRight: '16px' }}>
                  <NotificationBell closeMenu={closeMenu} />
                </li>
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
                    <ChevronDown size={14} className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="nav-dropdown">
                      <div className="dropdown-header">
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                      <div className="dropdown-divider" />
                      <Link to="/profile" className="dropdown-item" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                        <User size={15} /> Hồ sơ của tôi
                      </Link>
                      <Link to="/my-schedule" className="dropdown-item" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                        <Calendar size={15} /> Lịch trình của tôi
                      </Link>
                      <Link to="/settings" className="dropdown-item" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                        <Settings size={15} /> Cài đặt
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="dropdown-item dropdown-item-admin" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                          <ShieldCheck size={15} /> Trang Admin
                        </Link>
                      )}
                      {user.role === 'host' && (
                        <Link to="/host" className="dropdown-item dropdown-item-admin" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                          <ShieldCheck size={15} /> Trang Host
                        </Link>
                      )}
                      {user.role === 'venue' && (
                        <Link to="/venue" className="dropdown-item dropdown-item-admin" onClick={() => { setIsDropdownOpen(false); closeMenu() }}>
                          <ShieldCheck size={15} /> Trang Provider
                        </Link>
                      )}
                      <div className="dropdown-divider" />
                      <button className="dropdown-item dropdown-item-logout" onClick={handleLogout}>
                        <LogOut size={15} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
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

// Notification Component Separation
import { Bell } from 'lucide-react';
import { notificationApi, type Notification } from '../services/api';

const NotificationBell: React.FC<{ closeMenu: () => void }> = ({ closeMenu }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { count } = await notificationApi.getUnreadCount();
        setUnreadCount(count);
      } catch (err) { /* ignore */ }
    };
    
    // Initial fetch
    fetchUnread();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenDropdown = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      try {
        const notifs = await notificationApi.getUnread();
        setNotifications(notifs.slice(0, 5)); // show top 5
      } catch (err) { /* ignore */ }
    }
  };

  const handleNotifClick = async (n: Notification) => {
    try {
      await notificationApi.markRead(n.id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setShowDropdown(false);
      closeMenu();

      if (n.type === 'PAYMENT_APPROVED' || n.type === 'PAYMENT_REJECTED') {
        navigate('/my-schedule');
      } else if (n.link) {
        navigate(n.link);
      }
    } catch (err) { /* ignore */ }
  };

  return (
    <div ref={notifRef}>
      <button 
        className="theme-toggle-btn" 
        onClick={handleOpenDropdown}
        style={{ position: 'relative' }}
        aria-label="Thông báo"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px', 
            background: '#ef4444', color: 'white', 
            fontSize: '10px', fontWeight: 'bold',
            borderRadius: '50%', width: '16px', height: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="nav-dropdown" style={{ width: '320px', left: 'auto', right: 0 }}>
          <div className="dropdown-header">
            <p className="dropdown-name" style={{ fontSize: '14px', marginBottom: 0 }}>Thông báo</p>
          </div>
          <div className="dropdown-divider" />
          {notifications.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              Không có thông báo mới
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                className="dropdown-item" 
                style={{ padding: '12px', display: 'block', borderBottom: '1px solid #f1f5f9', whiteSpace: 'normal', cursor: 'pointer' }}
                onClick={() => handleNotifClick(n)}
              >
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{n.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{n.message}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>{new Date(n.createdAt).toLocaleString('vi-VN')}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;