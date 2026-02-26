import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Cột 1: Thương hiệu */}
          <div className="footer-brand">
            <h3>Heal Haven</h3>
            <p className="footer-tagline">"Healing through Handmade"</p>
            <p className="footer-desc">
              Nền tảng kết nối workshop thủ công — nơi bạn tìm thấy sự chữa lành qua sáng tạo.
            </p>
            {/* Mạng xã hội */}
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.19 8.19 0 004.78 1.52V7.01a4.85 4.85 0 01-1.02-.32z" /></svg>
              </a>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h4>Khám phá</h4>
            <ul className="footer-links">
              <li><Link to="/workshops">Danh sách Workshop</Link></li>
              <li><Link to="/community">Cộng đồng</Link></li>
              <li><Link to="/">Về chúng tôi</Link></li>
              <li><Link to="/">Blog</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              <li><Link to="/">Câu hỏi thường gặp</Link></li>
              <li><Link to="/">Liên hệ</Link></li>
              <li><Link to="/">Chính sách hoàn tiền</Link></li>
              <li><Link to="/">Quy chế nền tảng</Link></li>
            </ul>
          </div>

          {/* Cột 4: Pháp lý */}
          <div>
            <h4>Pháp lý</h4>
            <ul className="footer-links">
              <li><Link to="/">Điều khoản sử dụng</Link></li>
              <li><Link to="/">Chính sách bảo mật</Link></li>
              <li><Link to="/">Cookie</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Heal Haven. Đã đăng ký bản quyền.</p>
          <p>Made with ❤️ in Vietnam</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer