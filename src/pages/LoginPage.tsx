import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginPage.css' // CSS riêng cho Trang Đăng nhập

const LoginPage: React.FC = () => {
  // Sử dụng 'useState' để quản lý dữ liệu người dùng nhập
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hàm xử lý khi người dùng nhấn nút Đăng nhập
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Ngăn trình duyệt tải lại trang
    
    // Demo: In ra console, trong dự án thật bạn sẽ gọi API ở đây
    console.log('Đang đăng nhập với:', { email, password });
    
    // TODO: Thêm logic gọi API đăng nhập
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <p>Chào mừng bạn trở lại với Heal Haven!</p>
        
        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit}>
          
          {/* Trường Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          {/* Trường Mật khẩu */}
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {/* Nút Đăng nhập */}
          <button type="submit" className="btn btn-primary login-btn">
            Đăng nhập
          </button>
        </form>
        
        <div className="login-links">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <p>
            Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage