import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ForgotPasswordPage.css' // Tái sử dụng CSS của trang trước

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  // Lấy "token" giả từ URL (ví dụ: "demo-token-12345")
  const { token } = useParams<{ token: string }>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    
    // --- Logic Backend (Khi code thật) ---
    // 1. Gọi API /api/auth/reset-password
    // 2. Gửi kèm { newPassword: password, token: token }
    
    // --- Logic Demo (Giả lập) ---
    console.log('Đặt lại mật khẩu với token:', token);
    console.log('Mật khẩu mới:', password);
    alert("Đã đặt lại mật khẩu thành công (giả lập)!");
    navigate('/login'); // Chuyển về trang đăng nhập
  };

  return (
    <div className="fp-container">
      <div className="fp-box">
        <h2>Tạo Mật khẩu mới</h2>
        <p>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
        
        <form onSubmit={handleSubmit}>
          
          {/* Trường Mật khẩu mới */}
          <div className="form-group">
            <label htmlFor="password">Mật khẩu mới</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {/* Trường Xác nhận Mật khẩu */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          
          {/* Nút Gửi */}
          <button type="submit" className="btn btn-primary fp-btn">
            Lưu Mật khẩu
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage