import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ForgotPasswordPage.css' // CSS riêng (gần giống Login)

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Dùng để chuyển trang

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // --- Logic Backend (Khi code thật) ---
    // 1. Gọi API /api/auth/forgot-password với { email }
    // 2. Backend sẽ gửi email chứa 1 link (ví dụ: /reset-password/TOKEN123)
    
    // --- Logic Demo (Giả lập) ---
    console.log('Đã gửi yêu cầu reset cho email:', email);
    // Giả lập gửi email thành công, chuyển người dùng đến trang nhập mật khẩu mới
    // Chúng ta dùng "demo-token" để giả lập
    alert("Đã gửi email (giả lập)! Giờ bạn sẽ được chuyển đến trang Đặt lại mật khẩu.");
    navigate('/reset-password/demo-token-12345');
  };

  return (
    <div className="fp-container"> {/* Forgot Password Container */}
      <div className="fp-box">
        <h2>Quên Mật khẩu</h2>
        <p>Đừng lo lắng. Vui lòng nhập email của bạn, chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.</p>
        
        <form onSubmit={handleSubmit}>
          
          {/* Trường Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          {/* Nút Gửi */}
          <button type="submit" className="btn btn-primary fp-btn">
            Gửi liên kết
          </button>
        </form>
        
        <div className="fp-links">
          <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage