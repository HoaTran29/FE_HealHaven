import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { workshopApi, reviewApi, type Workshop, type Review } from '../services/api';
import './WorkshopDetailsPage.css';

// ------------------------------------------------------------------

const StarRating: React.FC<{ rating?: number; count?: number }> = ({ rating = 0, count = 0 }) => (
  <div className="wd-rating">
    <span className="wd-stars">{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</span>
    <strong>{rating.toFixed(1)}</strong>
    <span className="wd-reviews">({count} đánh giá)</span>
  </div>
);

const SeatBar: React.FC<{ avail: number; total: number }> = ({ avail, total }) => {
  const pct = Math.round((avail / total) * 100);
  return (
    <div className="seat-bar-wrap">
      <div className="seat-bar-track">
        <div
          className={`seat-bar-fill ${avail === 0 ? 'full' : avail <= 3 ? 'low' : ''}`}
          style={{ width: `${100 - pct}%` }}
        />
      </div>
      <span className={`seat-label ${avail === 0 ? 'text-red' : avail <= 3 ? 'text-orange' : ''}`}>
        {avail === 0 ? '🔴 Hết chỗ' : avail <= 3 ? `🟠 Chỉ còn ${avail} chỗ!` : `🟢 Còn ${avail}/${total} chỗ`}
      </span>
    </div>
  );
};

const WorkshopDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    // Nếu hết trạng thái loading Auth mà vẫn không có user => đẩy ra login
    if (!authLoading && !user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    if (id && user) {
      setIsLoading(true);
      workshopApi.getById(id)
        .then(data => {
          console.log("DEBUG: Workshop Data:", data); // Audit data source
          setWorkshop(data);
        })
        .catch(err => console.error("Không tải được chi tiết:", err))
        .finally(() => setIsLoading(false));

      // Fetch reviews
      setLoadingReviews(true);
      reviewApi.getByWorkshop(id)
        .then(res => setReviews(res.content))
        .catch(err => console.error("Không tải được đánh giá:", err))
        .finally(() => setLoadingReviews(false));
    }
  }, [id, user, authLoading, navigate, location]);

  if (isLoading || authLoading) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (!user) return null; // Wait for redirect
  if (!workshop) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Không tìm thấy Workshop! Đoán xem link có nhầm không?</div>;

  const formatted = new Intl.NumberFormat('vi-VN').format(workshop.price) + 'đ';
  const formattedOg = workshop.originalPrice
    ? new Intl.NumberFormat('vi-VN').format(workshop.originalPrice) + 'đ'
    : null;

  // Robust parsing for Date/Time/Location/Seats
  // Official flow uses startDate: "dd/MM/yyyy HH:mm"
  const workshopDateStr = workshop.startDate || workshop.date || '';
  const workshopTimeStr = workshop.time || workshop.startTime || '';

  let displayDate = 'Chưa cập nhật';
  let displayTime = 'Chưa cập nhật';

  if (workshopDateStr.includes(' ')) {
    const parts = workshopDateStr.split(' ');
    displayDate = parts[0];
    displayTime = parts[1];
  } else {
    // Fallback logic for legacy or ISO formats
    const parsedDate = new Date(workshopDateStr);
    const isValidDate = !isNaN(parsedDate.getTime());
    displayDate = isValidDate
      ? parsedDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : workshopDateStr.split('T')[0].split(' ')[0] || 'Chưa cập nhật';

    displayTime = workshopTimeStr;
    if (displayTime.includes('T')) {
      displayTime = displayTime.split('T')[1].substring(0, 5);
    } else if (displayTime.includes(' ') && displayTime.length > 10) {
      displayTime = displayTime.split(' ')[1].substring(0, 5);
    } else if (!displayTime && isValidDate) {
      displayTime = parsedDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
  }

  const displayLocation = workshop.address || workshop.venue?.address || workshop.location || workshop.area || 'Chưa cập nhật';
  const displayShortLocation = displayLocation.includes(',')
    ? displayLocation.split(',').slice(1).join(',').trim()
    : displayLocation;

  const totalSeats = workshop.capacity || workshop.maxSeats || workshop.totalSeats || workshop.seats || 20;
  const availableSeats = workshop.availableSeats ?? totalSeats;

  return (
    <div className="workshop-details-page">
      {/* === HEADER === */}
      <header className="workshop-header">
        <div className="container">
          <p className="workshop-breadcrumb">
            <Link to="/workshops">Workshop</Link> &gt; <span>{workshop.title}</span>
          </p>
          <h1>{workshop.title}</h1>
          <p className="workshop-subtitle">{workshop.subtitle}</p>
          <StarRating rating={workshop.rating} count={workshop.reviewCount} />
          <p className="workshop-author-header">
            Tổ chức bởi <Link to={`/artisan/${workshop.host?.userId || '1'}`}>{workshop.host?.fullName || 'Nghệ nhân HealHaven'}</Link>
          </p>
        </div>
      </header>

      <div className="container">
        <div className="workshop-layout">

          {/* === CỘT TRÁI === */}
          <div className="workshop-main-content">

            {/* --- Image Gallery --- */}
            <div className="wd-gallery">
              <div className="wd-gallery-main">
                <img src={(workshop.images && workshop.images[activeImg]) || workshop.image || '/images/ws1303.png'} alt={workshop.title} />
              </div>
              {workshop.images && workshop.images.length > 1 && (
                <div className="wd-gallery-thumbs">
                  {workshop.images.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Ảnh ${i + 1}`}
                      className={i === activeImg ? 'active' : ''}
                      onClick={() => setActiveImg(i)}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* --- Tabs --- */}
            <div className="workshop-tabs">
              {[
                { key: 'curriculum', label: 'Chương trình' },
                { key: 'materials', label: 'Nguyên liệu' },
                { key: 'location', label: '📍 Địa điểm' },
                { key: 'reviews', label: '⭐ Đánh giá' },
              ].map(t => (
                <button
                  key={t.key}
                  className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {/* Tab: Chương trình */}
              {activeTab === 'curriculum' && (
                <div className="curriculum-list">
                  {workshop.itinerary ? (
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                      {workshop.itinerary}
                    </div>
                  ) : workshop.curriculum && workshop.curriculum.length > 0 ? (
                    workshop.curriculum.map((item: any, i: number) => (
                      <div key={i} className={`lecture-item ${item.active ? 'active' : ''}`}>
                        <span>{item.name}</span>
                        <span className="lecture-time">🕐 {item.time}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Chưa cập nhật chương trình học cụ thể.</p>
                  )}
                </div>
              )}

              {/* Tab: Nguyên liệu */}
              {activeTab === 'materials' && (
                <div className="materials-list">
                  <div style={{ whiteSpace: 'pre-wrap', paddingLeft: '1rem' }}>
                    {typeof workshop.materials === 'string' ? (
                      workshop.materials
                    ) : Array.isArray(workshop.materials) && workshop.materials.length > 0 ? (
                      <ul>
                        {workshop.materials.map((m: string, i: number) => <li key={i}>{m}</li>)}
                      </ul>
                    ) : (
                      <p>Mọi thứ đã được chuẩn bị sẵn hoặc host chưa cập nhật nguyên liệu tự mang.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Địa điểm + Google Maps */}
              {activeTab === 'location' && (
                <div className="wd-location-tab">
                  <p className="wd-address">📍 <strong>{displayLocation}</strong></p>
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(displayLocation)}&output=embed`}
                    title="Bản đồ địa điểm"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}

              {/* Tab: Đánh giá */}
              {activeTab === 'reviews' && (
                <div className="wd-reviews-tab">
                  {loadingReviews ? (
                    <p>Đang tải đánh giá...</p>
                  ) : (reviews as Review[]).length > 0 ? (
                    <div className="reviews-list">
                      {(reviews as Review[]).map((r, i) => (
                        <div key={i} className="review-item">
                          <div className="review-header">
                            <strong>{r.authorName || 'Người dùng'}</strong>
                            <span className="review-stars">{'★'.repeat(r.rating)}</span>
                          </div>
                          <p>{r.comment}</p>
                          {r.createdAt && <small className="text-muted">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</small>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="review-summary">
                      <div className="review-score">{workshop.rating.toFixed(1)}</div>
                      <div>
                        <div className="review-stars">{'★'.repeat(Math.round(workshop.rating))}</div>
                        <div className="review-count">Dựa trên {workshop.reviewCount} đánh giá</div>
                      </div>
                    </div>
                  )}
                  {reviews.length === 0 && (
                    <p className="text-muted" style={{ marginTop: '1rem' }}>Chưa có đánh giá chi tiết cho workshop này.</p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* === CỘT PHẢI: SIDEBAR === */}
          <aside className="workshop-sidebar">
            <div className="purchase-card">
              {/* Giá */}
              <div className="wd-price-row">
                <h3 className="purchase-price">{formatted}</h3>
                {formattedOg && <s className="wd-original-price">{formattedOg}</s>}
              </div>

              {/* Thông tin nhanh */}
              <ul className="wd-quick-info">
                <li>📅 {displayDate}</li>
                <li>⏰ {displayTime}</li>
                <li>📍 {displayShortLocation}</li>
              </ul>

              {/* Progress chỗ còn */}
              <SeatBar avail={availableSeats} total={totalSeats} />

              {/* Nút đăng ký */}
              {availableSeats > 0 ? (
                <Link
                  to={`/checkout?workshopId=${workshop.workshopId || workshop.id}`}
                  className="btn btn-primary purchase-btn"
                >
                  🎟️ Đăng ký ngay
                </Link>
              ) : (
                <button className="btn btn-disabled purchase-btn" disabled>
                  Hết chỗ
                </button>
              )}

              {/* Bao gồm */}
              <h4 style={{ marginTop: '1.25rem' }}>Workshop này bao gồm:</h4>
              <ul className="wd-included">
                {['Hướng dẫn trực tiếp từ nghệ nhân', 'Không gian sáng tạo thoải mái'].map((item: string, i: number) => (
                  <li key={i}>✅ {item}</li>
                ))}
              </ul>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailsPage;