import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, type User } from '../contexts/AuthContext'
import { authApi } from '../services/api'
import { Eye, EyeOff } from 'lucide-react'
import './SignupPage.css'

const SignupPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<'attendee' | 'host'>('attendee')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có nhất 6 ký tự.')
      return
    }

    setIsLoading(true)
    try {
      const res = await authApi.signup({ fullName, email, password, phoneNumber, role })
      const beUser = res.user
      const roleRaw = beUser.role?.toLowerCase() ?? role
      const roleMapped = roleRaw === 'provider' ? 'venue' : roleRaw
      login(
        {
          id: String(beUser.userId),
          name: [beUser.firstName, beUser.lastName].filter(Boolean).join(' ') || fullName,
          email: beUser.email,
          role: roleMapped as User['role'],
          avatar: beUser.avatar,
        },
        res.accessToken
      )
      // Redirect theo role
      if (roleMapped === 'host') navigate('/host', { replace: true })
      else if (roleMapped === 'venue') navigate('/venue', { replace: true })
      else navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Tạo tài khoản</h2>
        <p className="auth-subtitle">Bắt đầu hành trình sáng tạo của bạn ngay hôm nay.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Tên */}
          <div className="form-group">
            <label htmlFor="fullName">Tên đầy đủ</label>
            <input
              type="text"
              id="fullName"
              placeholder="Ví dụ: Nguyễn Thị Hoa"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="09xx xxx xxx"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
              autoComplete="tel"
            />
          </div>

          {/* Mật khẩu */}
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-with-icon">
              <input
                type={showPass ? 'text' : 'password'}
                id="password"
                placeholder="Ít nhất 6 ký tự"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pass-btn"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
                aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="form-group">
            <label htmlFor="confirm">Xác nhận mật khẩu</label>
            <div className="input-with-icon">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirm"
                placeholder="Nhập lại mật khẩu"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pass-btn"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Vai trò */}
          <div className="form-group">
            <label>Bạn tham gia với tư cách:</label>
            <div className="role-selector">
              <label className={`role-option ${role === 'attendee' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="attendee"
                  checked={role === 'attendee'}
                  onChange={() => setRole('attendee')}
                />
                <span className="role-icon">🎒</span>
                <div>
                  <strong>Học viên</strong>
                  <small>Tham gia workshop, khám phá sáng tạo</small>
                </div>
              </label>
              <label className={`role-option ${role === 'host' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="host"
                  checked={role === 'host'}
                  onChange={() => setRole('host')}
                />
                <span className="role-icon">🎨</span>
                <div>
                  <strong>Nghệ nhân / Host</strong>
                  <small>Mở và dạy workshop của riêng bạn</small>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary signup-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider"><span>hoặc</span></div>

        <button className="btn-oauth btn-google" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          Tiếp tục với Google
        </button>

        <p className="auth-footer-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>

        <p className="auth-terms">
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <Link to="/policy">Điều khoản sử dụng</Link> của chúng tôi.
        </p>
      </div>
    </div>
  )
}

export default SignupPage