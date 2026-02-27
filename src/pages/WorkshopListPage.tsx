import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Workshop } from '../services/api';
import './WorkshopListPage.css';

// --- Danh mục và khu vực ---
const CATEGORIES = ['Đan len', 'Vẽ màu nước', 'Hoa nghệ thuật', 'Gốm sứ', 'Thêu tay', 'Origami', 'Macro lens'];
const AREAS = ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Thủ Đức'];
const PRICE_RANGES = [
  { label: 'Tất cả', min: 0, max: Infinity },
  { label: 'Dưới 300k', min: 0, max: 300000 },
  { label: '300k – 500k', min: 300000, max: 500000 },
  { label: '500k – 1 triệu', min: 500000, max: 1000000 },
  { label: 'Trên 1 triệu', min: 1000000, max: Infinity },
];

// --- Mock data (dùng cho đến khi BE sẵn sàng) ---
const MOCK_WORKSHOPS: Workshop[] = [
  {
    id: 'workshop-dan-len', title: 'Workshop Đan len cơ bản',
    subtitle: 'Học cách đan mũ len trong 2 giờ', host: 'Nghệ nhân Trần Văn A', hostId: 'host-1',
    category: 'Đan len', area: 'Quận 3', city: 'TP.HCM', address: '45 Nguyễn Đình Chiểu, Q3',
    price: 399000, originalPrice: 599000, rating: 4.8, reviewCount: 124,
    availableSeats: 5, maxSeats: 10, date: '2026-03-15', time: '09:00 – 11:00',
    image: '/images/dan-len.webp',
  },
  {
    id: 've-mau-nuoc', title: 'Vẽ màu nước: Thiên nhiên',
    subtitle: 'Kỹ thuật vẽ lá, hoa và bầu trời', host: 'Nghệ nhân Lê Thị B', hostId: 'host-2',
    category: 'Vẽ màu nước', area: 'Quận 1', city: 'TP.HCM', address: '10 Lê Lợi, Q1',
    price: 599000, originalPrice: 799000, rating: 4.9, reviewCount: 87,
    availableSeats: 3, maxSeats: 8, date: '2026-03-20', time: '14:00 – 16:30',
    image: '/images/mau-nuoc.webp',
  },
  {
    id: 'hoa-kem-nhung', title: 'Hoa Kẽm nhung nghệ thuật',
    subtitle: 'Tạo hoa kẽm nhung sống động như thật', host: 'Nghệ nhân Nguyễn Văn C', hostId: 'host-3',
    category: 'Hoa nghệ thuật', area: 'Bình Thạnh', city: 'TP.HCM', address: '22 Đinh Tiên Hoàng, BT',
    price: 450000, originalPrice: 600000, rating: 4.7, reviewCount: 56,
    availableSeats: 7, maxSeats: 12, date: '2026-03-22', time: '09:00 – 12:00',
    image: '/images/kem-nhung.webp',
  },
  {
    id: 'gom-su-co-ban', title: 'Gốm sứ thủ công cơ bản',
    subtitle: 'Tạo ra bình hoa đất nung đơn giản', host: 'Studio Gốm Hà', hostId: 'host-4',
    category: 'Gốm sứ', area: 'Quận 7', city: 'TP.HCM', address: '5 Nguyễn Thị Thập, Q7',
    price: 750000, originalPrice: 900000, rating: 4.6, reviewCount: 43,
    availableSeats: 0, maxSeats: 6, date: '2026-03-28', time: '10:00 – 13:00',
    image: '/images/dan-len.webp',
  },
  {
    id: 'origami-nang-cao', title: 'Origami nâng cao 🦢',
    subtitle: 'Khám phá nghệ thuật gấp giấy Nhật Bản', host: 'Nghệ nhân Yuki', hostId: 'host-5',
    category: 'Origami', area: 'Thủ Đức', city: 'TP.HCM', address: '88 Võ Văn Ngân, Thủ Đức',
    price: 250000, rating: 4.5, reviewCount: 38,
    availableSeats: 10, maxSeats: 15, date: '2026-04-05', time: '08:30 – 10:30',
    image: '/images/mau-nuoc.webp',
  },
  {
    id: 'theu-tay-co-truyen', title: 'Thêu tay cổ truyền 🌸',
    subtitle: 'Thêu hoa sen và các họa tiết Việt Nam', host: 'Bà Nguyệt Thêu', hostId: 'host-6',
    category: 'Thêu tay', area: 'Quận 1', city: 'TP.HCM', address: '33 Đồng Khởi, Q1',
    price: 480000, originalPrice: 580000, rating: 5.0, reviewCount: 201,
    availableSeats: 4, maxSeats: 8, date: '2026-04-10', time: '13:00 – 16:00',
    image: '/images/kem-nhung.webp',
  },
];

// --- Stars ---
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="stars" title={`${rating}/5`}>
    {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    <span className="rating-value"> {rating.toFixed(1)}</span>
  </span>
);

const WorkshopListPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [workshops, _setWorkshops] = useState<Workshop[]>(MOCK_WORKSHOPS);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, _setIsLoading] = useState(false);

  // Filter state
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [priceIdx, setPriceIdx] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'newest'>('rating');
  const [showFilter, setShowFilter] = useState(false); // mobile

  // --- Fetch từ API (bật khi BE sẵn sàng) ---
  useEffect(() => {
    // TODO: Bỏ comment khi BE sẵn sàng
    // _setIsLoading(true);
    // workshopApi.getList({ keyword, category, area }).then(res => {
    //   setWorkshops(res.data);
    //   _setIsLoading(false);
    // }).catch(() => _setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category, area]);

  // --- Filter + Sort phía FE (dùng mock data) ---
  const priceRange = PRICE_RANGES[priceIdx];

  const filtered = workshops
    .filter(ws => {
      if (keyword && !ws.title.toLowerCase().includes(keyword.toLowerCase()) &&
        !ws.host.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (category && ws.category !== category) return false;
      if (area && ws.area !== area) return false;
      if (ws.price < priceRange.min || ws.price > priceRange.max) return false;
      if (ws.rating < minRating) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  const resetFilters = () => {
    setKeyword(''); setCategory(''); setArea('');
    setPriceIdx(0); setMinRating(0);
  };

  const hasActiveFilters = keyword || category || area || priceIdx > 0 || minRating > 0;

  return (
    <div className="workshop-list-page">
      {/* Hero header */}
      <div className="wl-hero">
        <div className="container">
          <h1>🎨 Khám phá Workshop</h1>
          <p>Tìm không gian sáng tạo và chữa lành dành riêng cho bạn</p>

          {/* Search bar */}
          <div className="wl-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm workshop, nghệ nhân…"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            {keyword && (
              <button className="search-clear" onClick={() => setKeyword('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="wl-layout">
          {/* =================== FILTER SIDEBAR =================== */}
          <button className="filter-toggle-mobile" onClick={() => setShowFilter(!showFilter)}>
            🔧 Bộ lọc {hasActiveFilters && <span className="filter-badge">!</span>}
          </button>

          <aside className={`wl-filter-sidebar ${showFilter ? 'open' : ''}`}>
            <div className="filter-header">
              <h3>Bộ lọc</h3>
              {hasActiveFilters && (
                <button className="filter-reset-btn" onClick={resetFilters}>Xóa tất cả</button>
              )}
            </div>

            {/* Danh mục */}
            <div className="filter-group">
              <h4>Danh mục</h4>
              <div className="filter-chips">
                <button
                  className={`chip ${!category ? 'active' : ''}`}
                  onClick={() => setCategory('')}
                >Tất cả</button>
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    className={`chip ${category === c ? 'active' : ''}`}
                    onClick={() => setCategory(category === c ? '' : c)}
                  >{c}</button>
                ))}
              </div>
            </div>

            {/* Khu vực */}
            <div className="filter-group">
              <h4>Khu vực</h4>
              <select value={area} onChange={e => setArea(e.target.value)}>
                <option value="">Tất cả khu vực</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Giá */}
            <div className="filter-group">
              <h4>Mức giá</h4>
              {PRICE_RANGES.map((r, i) => (
                <label key={i} className="filter-radio">
                  <input
                    type="radio"
                    name="price"
                    checked={priceIdx === i}
                    onChange={() => setPriceIdx(i)}
                  />
                  {r.label}
                </label>
              ))}
            </div>

            {/* Đánh giá tối thiểu */}
            <div className="filter-group">
              <h4>Đánh giá tối thiểu</h4>
              {[0, 4, 4.5, 4.8].map(r => (
                <label key={r} className="filter-radio">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(r)}
                  />
                  {r === 0 ? 'Tất cả' : `≥ ${r}★`}
                </label>
              ))}
            </div>
          </aside>

          {/* =================== WORKSHOP GRID =================== */}
          <section className="wl-main">
            {/* Toolbar: count + sort */}
            <div className="wl-toolbar">
              <span className="wl-count">
                {isLoading ? 'Đang tải…' : `${filtered.length} workshop`}
                {hasActiveFilters && ' (đã lọc)'}
              </span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price_asc">Giá: Thấp → Cao</option>
                <option value="price_desc">Giá: Cao → Thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="wl-empty">
                <p>😕 Không tìm thấy workshop phù hợp.</p>
                <button className="btn btn-secondary" onClick={resetFilters}>Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="wl-grid">
                {filtered.map(ws => (
                  <Link to={`/workshop/${ws.id}`} key={ws.id} className="wl-card-link">
                    <div className="wl-card">
                      {/* Ảnh */}
                      <div className="wl-card-img-wrap">
                        <img src={ws.image} alt={ws.title} loading="lazy" />
                        {ws.availableSeats === 0 && (
                          <span className="badge-soldout">Hết chỗ</span>
                        )}
                        {ws.availableSeats > 0 && ws.availableSeats <= 3 && (
                          <span className="badge-few">Còn {ws.availableSeats} chỗ</span>
                        )}
                        {ws.originalPrice && (
                          <span className="badge-discount">
                            -{Math.round((1 - ws.price / ws.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>

                      {/* Nội dung */}
                      <div className="wl-card-body">
                        <div className="wl-card-category">{ws.category}</div>
                        <h3 className="wl-card-title">{ws.title}</h3>
                        <p className="wl-card-host">👤 {ws.host}</p>

                        <div className="wl-card-meta">
                          <span>📅 {new Date(ws.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
                          <span>📍 {ws.area}</span>
                        </div>

                        <StarRating rating={ws.rating} />
                        <span className="wl-card-reviews"> ({ws.reviewCount} đánh giá)</span>

                        <div className="wl-card-footer">
                          <div className="wl-card-price">
                            <strong>{new Intl.NumberFormat('vi-VN').format(ws.price)}đ</strong>
                            {ws.originalPrice && (
                              <s>{new Intl.NumberFormat('vi-VN').format(ws.originalPrice)}đ</s>
                            )}
                          </div>
                          <button
                            className={`btn ${ws.availableSeats === 0 ? 'btn-disabled' : 'btn-primary'} wl-card-btn`}
                            disabled={ws.availableSeats === 0}
                          >
                            {ws.availableSeats === 0 ? 'Hết chỗ' : 'Đăng ký'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default WorkshopListPage;