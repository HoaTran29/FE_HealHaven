import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css' // CSS riêng cho Footer

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Cột 1: Thông tin chung */}
          <div>
            <h3>Heal Haven</h3>
            <p>"Healing through Handmade"</p>
            <p>&copy; 2025. Đã đăng ký bản quyền.</p>
          </div>
          
          {/* Cột 2: Links Về chúng tôi */}
          <div>
            <h4>Về chúng tôi</h4>
            <ul className="footer-links">
              <li><Link to="/about">Câu chuyện</Link></li>
              <li><Link to="/mission">Sứ mệnh</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          
          {/* Cột 3: Links Hỗ trợ */}
          <div>
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
              <li><Link to="/policy">Chính sách</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer