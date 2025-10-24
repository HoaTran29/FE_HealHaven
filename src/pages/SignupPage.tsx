import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SignupPage.css' // CSS riêng cho Trang Đăng ký

const SignupPage: React.FC = () => {
  // Quản lý nhiều state cho form đăng ký
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hoc-vien'); // Giá trị mặc định

  // Hàm xử lý khi submit form
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Ngăn tải lại trang
    
    // Demo: In ra console
    console.log('Đăng ký tài khoản mới:', { fullName, email, password, role });
    
    // TODO: Thêm logic gọi API đăng ký
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Tạo tài khoản</h2>
        <p>Bắt đầu hành trình sáng tạo của bạn ngay hôm nay.</p>
        
        <form onSubmit={handleSubmit}>
          
          {/* Trường Tên đầy đủ */}
          <div className="form-group">
            <label htmlFor="fullName">Tên đầy đủ</label>
            <input 
              type="text" 
              id="fullName" 
              placeholder="Ví dụ: Trần Lê Khánh Hòa"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          </div>
          
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
              placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {/* Chọn Vai trò */}
          <div className="form-group">
            <label>Bạn là:</label>
            <div className="role-selector">
              <label className={`role-option ${role === 'hoc-vien' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="hoc-vien"
                  checked={role === 'hoc-vien'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Học viên
              </label>
              <label className={`role-option ${role === 'nghe-nhan' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="nghe-nhan"
                  checked={role === 'nghe-nhan'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Nghệ nhân
              </label>
            </div>
          </div>
          
          {/* Nút Đăng ký */}
          <button type="submit" className="btn btn-primary signup-btn">
            Tạo tài khoản
          </button>
        </form>
        
        <div className="signup-links">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage