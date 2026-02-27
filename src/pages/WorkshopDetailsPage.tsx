import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './WorkshopDetailsPage.css'

// --- DỮ LIỆU GIẢ (sẽ thay bằng workshopApi.getById(id)) ---
const mockData: Record<string, any> = {
  'workshop-dan-len': {
    id: 'workshop-dan-len',
    title: 'Workshop Đan len cơ bản',
    subtitle: 'Học cách đan mũ len và khăn choàng chỉ trong 2 giờ.',
    author: 'Nghệ nhân: Trần Văn A',
    authorLink: '/artisan/tran-van-a',
    price: 399000,
    originalPrice: 599000,
    rating: 4.8,
    reviewCount: 124,
    availableSeats: 5,
    maxSeats: 10,
    date: '2026-03-15',
    time: '09:00 – 11:00',
    address: '45 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580672296!2d106.68264!3d10.774553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM0LjQiTiAxMDbCsDQwJzU3LjUiRQ!5e0!3m2!1svi!2svn!4v1620000000000',
    images: ['/images/dan-len.webp', '/images/mau-nuoc.webp', '/images/kem-nhung.webp'],
    curriculum: [
      { name: 'Chương 1: Giới thiệu Dụng cụ', time: '10 phút', active: false },
      { name: 'Chương 2: Cách bắt mũi len đầu tiên', time: '15 phút', active: true },
      { name: 'Chương 3: Kỹ thuật đan trơn (Knit)', time: '25 phút', active: false },
      { name: 'Chương 4: Hoàn thành sản phẩm', time: '30 phút', active: false },
    ],
    materials: ['2 cuộn len 5mm (màu tùy chọn)', '1 cặp kim đan size 10', '1 cây kéo cắt len'],
    included: ['Hướng dẫn trực tiếp từ nghệ nhân', 'Nguyên liệu được chuẩn bị sẵn', 'Không gian sáng tạo thoải mái', 'Chứng nhận hoàn thành'],
  },
  've-mau-nuoc': {
    id: 've-mau-nuoc',
    title: 'Vẽ màu nước: Thiên nhiên',
    subtitle: 'Kỹ thuật vẽ lá, hoa và bầu trời bằng màu nước.',
    author: 'Nghệ nhân: Lê Thị B',
    authorLink: '/artisan/le-thi-b',
    price: 599000, originalPrice: 799000,
    rating: 4.9, reviewCount: 87,
    availableSeats: 3, maxSeats: 8,
    date: '2026-03-20', time: '14:00 – 16:30',
    address: '10 Lê Lợi, Quận 1, TP.HCM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d106.700!3d10.775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMQ!5e0!3m2!1svi!2svn!4v1',
    images: ['/images/mau-nuoc.webp', '/images/dan-len.webp'],
    curriculum: [
      { name: 'Chương 1: Giới thiệu về màu nước và cọ', time: '12 phút', active: false },
      { name: 'Chương 2: Kỹ thuật loang màu (Wet-on-Wet)', time: '20 phút', active: true },
      { name: 'Chương 3: Vẽ lá cây và hoa đơn giản', time: '30 phút', active: false },
    ],
    materials: ['1 bộ màu nước (ít nhất 12 màu)', 'Giấy vẽ màu nước (300gsm)', 'Cọ vẽ (size 4, 8, 12)'],
    included: ['Hướng dẫn từ nghệ nhân', 'Giấy vẽ và cọ cơ bản', 'Bộ màu nước nhỏ để mang về'],
  },
};

// ------------------------------------------------------------------

const StarRating: React.FC<{ rating: number; count: number }> = ({ rating, count }) => (
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
  const workshop = mockData[id || 'workshop-dan-len'] || mockData['workshop-dan-len'];

  const [activeTab, setActiveTab] = useState('curriculum');
  const [activeImg, setActiveImg] = useState(0);

  const formatted = new Intl.NumberFormat('vi-VN').format(workshop.price) + 'đ';
  const formattedOg = workshop.originalPrice
    ? new Intl.NumberFormat('vi-VN').format(workshop.originalPrice) + 'đ'
    : null;

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
            Tổ chức bởi <Link to={workshop.authorLink}>{workshop.author}</Link>
          </p>
        </div>
      </header>

      <div className="container">
        <div className="workshop-layout">

          {/* === CỘT TRÁI === */}
          <div className="workshop-main-content">

            {/* --- Image Gallery --- */}
            {workshop.images?.length > 0 && (
              <div className="wd-gallery">
                <div className="wd-gallery-main">
                  <img src={workshop.images[activeImg]} alt={workshop.title} />
                </div>
                {workshop.images.length > 1 && (
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
            )}

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
                  {workshop.curriculum.map((item: any, i: number) => (
                    <div key={i} className={`lecture-item ${item.active ? 'active' : ''}`}>
                      <span>{item.name}</span>
                      <span className="lecture-time">🕐 {item.time}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Nguyên liệu */}
              {activeTab === 'materials' && (
                <div className="materials-list">
                  <p>Để tham gia workshop, bạn cần chuẩn bị:</p>
                  <ul>
                    {workshop.materials.map((m: string, i: number) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              )}

              {/* Tab: Địa điểm + Google Maps */}
              {activeTab === 'location' && (
                <div className="wd-location-tab">
                  <p className="wd-address">📍 <strong>{workshop.address}</strong></p>
                  <div className="wd-map-wrap">
                    <iframe
                      src={workshop.mapEmbedUrl}
                      title="Bản đồ địa điểm"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Đánh giá */}
              {activeTab === 'reviews' && (
                <div className="wd-reviews-tab">
                  <div className="review-summary">
                    <div className="review-score">{workshop.rating.toFixed(1)}</div>
                    <div>
                      <div className="review-stars">{'★'.repeat(Math.round(workshop.rating))}</div>
                      <div className="review-count">Dựa trên {workshop.reviewCount} đánh giá</div>
                    </div>
                  </div>
                  <p className="text-muted" style={{ marginTop: '1rem' }}>Tính năng hiển thị đánh giá đang được phát triển.</p>
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
                <li>📅 {new Date(workshop.date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</li>
                <li>⏰ {workshop.time}</li>
                <li>📍 {workshop.address.split(',').slice(1).join(',').trim()}</li>
              </ul>

              {/* Progress chỗ còn */}
              <SeatBar avail={workshop.availableSeats} total={workshop.maxSeats} />

              {/* Nút đăng ký */}
              {workshop.availableSeats > 0 ? (
                <Link
                  to={`/checkout?workshopId=${workshop.id}`}
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
                {workshop.included.map((item: string, i: number) => (
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