import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingApi, workshopApi, type Booking, type Workshop } from '../services/api';
import './UserProfilePage.css';

const UserProfilePage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  // Dữ liệu tải từ BE
  const [attendeeBookings, setAttendeeBookings] = useState<Booking[]>([]);
  const [hostWorkshops, setHostWorkshops] = useState<Workshop[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Nếu chưa đăng nhập, chuyển ra login (Bảo vệ phía FE - dự phòng)
  useEffect(() => {
    if (!isLoggedIn && user === null) {
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  // Tải dữ liệu tùy theo Role
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoadingList(true);
      try {
        if (user.role === 'attendee') {
          // Lấy vé đặt
          const res = await bookingApi.getMyList();
          let parsedOrders: Booking[] = [];
          if (Array.isArray(res)) {
            parsedOrders = res;
          } else if (res && Array.isArray(res.content)) {
            parsedOrders = res.content;
          }

          if (parsedOrders.length > 0) {
            const enrichedOrders = parsedOrders.map(order => {
              const ws = order.workshop || {};
              return {
                ...order,
                workshopId: order.workshopId || ws.workshopId,
                workshopTitle: order.workshopTitle || ws.title,
                workshopImage: order.workshopImage || ws.primaryImage,
                host: order.host || ws.hostName,
                location: order.location || ws.venueAddress,
                date: order.date || ws.startTime,
                time: order.time || (ws.startTime ? new Date(ws.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : undefined)
              };
            });
            setAttendeeBookings(enrichedOrders);
          } else {
            setAttendeeBookings([]);
          }
        } else if (user.role === 'host') {
          // Lấy khoá học đã tạo
          const res = await workshopApi.getMyWorkshops();
          // Response của getMyWorkshops là kiểu PageResponse<Workshop>
          setHostWorkshops(res.content || []);
        }
        // role venue hoặc admin thì có dashboard riêng, có thể không cần fetch list ở đây
      } catch (err) {
        console.error('Lỗi khi tải danh sách:', err);
      } finally {
        setLoadingList(false);
      }
    };

    if (activeTab === 'my-workshops') {
      fetchData();
    }
  }, [user, activeTab]);

  if (!user) return null; // Tránh render khi đang redirect

  const initName = user.name ? user.name.charAt(0).toUpperCase() : '👤';

  return (
    <div className="user-profile-page">
      {/* === Header của Trang === */}
      <header className="profile-header">
        <div className="container">
          <div className="profile-info">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar">{initName}</div>
            )}

            <div className="profile-name">
              <h2>{user.name}</h2>
              <p>{user.email} <span className="profile-role-badge">{user.role.toUpperCase()}</span></p>
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
                {user.role === 'host' ? 'Workshop tôi tạo' : 'Vé & Tham gia'}
              </button>

              <button
                className={`profile-nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Cài đặt
              </button>

              {user.role === 'admin' && (
                <Link to="/admin" className="profile-nav-link text-primary" style={{ fontWeight: 600 }}>
                  ➡ Tới Admin Dashboard
                </Link>
              )}
              {user.role === 'host' && (
                <Link to="/host" className="profile-nav-link text-primary" style={{ fontWeight: 600 }}>
                  ➡ Tới Host Dashboard
                </Link>
              )}
              {user.role === 'venue' && (
                <Link to="/venue" className="profile-nav-link text-primary" style={{ fontWeight: 600 }}>
                  ➡ Tới Venue Dashboard
                </Link>
              )}

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

            {/* --- Tab 2: Khóa học của tôi (Role tuỳ biến) --- */}
            {activeTab === 'my-workshops' && (
              <div className="tab-pane">
                <h3>{user.role === 'host' ? 'Workshop tôi tổ chức' : 'Vé Workshop của tôi'}</h3>

                {loadingList && <p>Đang tải danh sách...</p>}

                {!loadingList && user.role === 'attendee' && (
                  <div className="my-workshops-grid">
                      {attendeeBookings.length === 0 ? (
                        <p>Bạn chưa đặt vé nào cả. <Link to="/workshops">Khám phá ngay!</Link></p>
                      ) : (
                        attendeeBookings.map(b => {
                          const isPendingConfirm = 
                            b.paymentStatus === 'PENDING_CONFIRMATION' || 
                            b.status === 'PENDING_CONFIRMATION' || 
                            b.bookingStatus === 'PENDING_CONFIRMATION';
                          const isPaid = b.status === 'PAID' || b.bookingStatus === 'PAID' || b.paymentStatus === 'PAID';
                          const isConfirmed = b.status === 'CONFIRMED' || b.bookingStatus === 'CONFIRMED';
                          
                          return (
                            <div className="card my-workshop-card" key={b.bookingId || b.id}>
                              {b.workshopImage && <img src={b.workshopImage} alt={b.workshopTitle} className="card-img-real" />}
                              <div className="card-content">
                                <Link to={`/workshop/${b.workshopId}`}>
                                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{b.workshopTitle}</h3>
                                </Link>
                                <p className="card-author">Ngày: {b.date} {b.time && `- ${b.time}`}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                  <span>Số vé: {b.quantity || b.seats}</span>
                                  <span style={{
                                    fontWeight: 'bold',
                                    color: (isConfirmed || isPaid) ? 'green' : isPendingConfirm ? '#0d47a1' : (b.status === 'PENDING' || b.bookingStatus === 'PENDING') ? 'orange' : 'gray'
                                  }}>
                                    {isPendingConfirm ? '⏳ Đang chờ xác nhận' : (b.status || b.bookingStatus || 'PENDING')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                  </div>
                )}

                {!loadingList && user.role === 'host' && (
                  <div className="my-workshops-grid">
                    {hostWorkshops.length === 0 ? (
                      <p>Bạn chưa tạo workshop nào. <Link to="/host">Tới trung tâm Host</Link></p>
                    ) : (
                      hostWorkshops.map(ws => (
                        <Link to={`/workshop/${ws.workshopId || ws.id}`} className="workshop-card-link" key={ws.workshopId || ws.id}>
                          <div className="card my-workshop-card">
                            <img src={ws.image} alt={ws.title} className="card-img-real" />
                            <div className="card-content">
                              <h3>{ws.title}</h3>
                              <p className="card-author">Ngày: {new Date(ws.date || ws.startDate || '').toLocaleDateString('vi-VN')}</p>
                              <p className="card-author">Vé đã bán: {(ws.capacity || ws.maxSeats || 0) - (ws.availableSeats || 0)} / {(ws.capacity || ws.maxSeats || 0)}</p>
                              <span style={{ color: ws.status === 'APPROVED' ? 'green' : 'orange' }}>{ws.status || 'DRAFT'}</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}

                {!loadingList && (user.role === 'admin' || user.role === 'venue') && (
                  <p>Tài khoản của bạn ({user.role}) nên thao tác tại Dashboard chuyên dụng.</p>
                )}
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
  );
};

export default UserProfilePage;
