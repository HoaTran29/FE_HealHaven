import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './UserProfilePage.css' // CSS riêng cho trang này

// Dữ liệu giả cho "Workshop của tôi"
const myWorkshops = [
  {
    id: 'workshop-dan-len',
    title: 'Workshop Đan len cơ bản',
    author: 'Nghệ nhân: Trần Văn A',
    img: '/images/dan-len.webp',
    progress: 80,
  },
  {
    id: 've-mau-nuoc',
    title: 'Vẽ màu nước: Thiên nhiên',
    author: 'Nghệ nhân: Lê Thị B',
    img: '/images/mau-nuoc.webp',
    progress: 30,
  }
];

const UserProfilePage: React.FC = () => {
  // State quản lý tab nào đang được chọn
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="user-profile-page">
      {/* === Header của Trang === */}
      <header className="profile-header">
        <div className="container">
          <div className="profile-info">
            <div className="profile-avatar">KH</div>
            <div className="profile-name">
              <h2>Trần Lê Khánh Hòa</h2>
              <p>hoatran@email.com</p>
              <button className="btn btn-secondary btn-edit-profile">
                Chỉnh sửa Hồ sơ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* === Nội dung chính (Tab) === */}
      <div className="container">
        <div className="profile-content-layout">

          {/* Cột Trái: Thanh điều hướng Tab */}
          <aside className="profile-sidebar">
            <nav className="profile-nav">
              <button
                className={`profile-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Hồ sơ công khai
              </button>
              <button
                className={`profile-nav-link ${activeTab === 'my-workshops' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-workshops')}
              >
                Workshop của tôi
              </button>
              <button
                className={`profile-nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Cài đặt
              </button>
              <Link to="/logout" className="profile-nav-link logout-link">
                Đăng xuất
              </Link>
            </nav>
          </aside>

          {/* Cột Phải: Nội dung Tab */}
          <main className="profile-tab-content">

            {/* --- Tab 1: Hồ sơ --- */}
            {activeTab === 'profile' && (
              <div className="tab-pane">
                <h3>Hồ sơ công khai</h3>
                <p>Đây là trang mà các thành viên khác trong cộng đồng sẽ thấy.</p>
                {/* (Bạn có thể thêm form chỉnh sửa ở đây) */}
                <div className="form-group">
                  <label htmlFor="bio">Tiểu sử ngắn</label>
                  <textarea
                    id="bio"
                    rows={4}
                    placeholder="Viết gì đó về bạn..."
                    defaultValue="Yêu thích làm đồ thủ công và chia sẻ đam mê."
                  ></textarea>
                </div>
                <button className="btn btn-primary">Lưu thay đổi</button>
              </div>
            )}

            {/* --- Tab 2: Khóa học của tôi --- */}
            {activeTab === 'my-workshops' && (
              <div className="tab-pane">
                <h3>Workshop của tôi</h3>
                <div className="my-workshops-grid">
                  {myWorkshops.map(ws => (
                    <Link to={`/workshop/${ws.id}`} className="workshop-card-link" key={ws.id}>
                      <div className="card my-workshop-card">
                        <img src={ws.img} alt={ws.title} className="card-img-real" />
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${ws.progress}%` }}></div>
                        </div>
                        <div className="card-content">
                          <h3>{ws.title}</h3>
                          <p className="card-author">{ws.author}</p>
                          <span>{ws.progress}% hoàn thành</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* --- Tab 3: Cài đặt --- */}
            {activeTab === 'settings' && (
              <div className="tab-pane">
                <h3>Cài đặt tài khoản</h3>
                <p>Quản lý thông tin đăng nhập và bảo mật.</p>

                <h4>Đổi mật khẩu</h4>
                <form>
                  <div className="form-group">
                    <label htmlFor="old-pass">Mật khẩu cũ</label>
                    <input type="password" id="old-pass" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-pass">Mật khẩu mới</label>
                    <input type="password" id="new-pass" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-pass">Xác nhận mật khẩu mới</label>
                    <input type="password" id="confirm-pass" />
                  </div>
                  <button className="btn btn-primary">Đổi mật khẩu</button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage