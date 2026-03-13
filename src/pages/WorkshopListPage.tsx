import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workshopApi, type Workshop } from '../services/api';
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

// --- Stars ---
const StarRating: React.FC<{ rating?: number }> = ({ rating = 0 }) => (
  <span className="stars" title={`${rating}/5`}>
    {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    <span className="rating-value"> {rating.toFixed(1)}</span>
  </span>
);

const WorkshopListPage: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Filter state
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [priceIdx, setPriceIdx] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'newest'>('rating');
  const [showFilter, setShowFilter] = useState(false);

  // Fetch từ API BE
  useEffect(() => {
    setIsLoading(true);
    setApiError('');
    workshopApi.getList({ keyword, category, area })
      .then(res => {
        // BE trả về PageResponse<Workshop>: { content, totalElements, ... }
        setWorkshops(res.content ?? []);
      })
      .catch(err => {
        console.error('Workshop API error:', err);
        setApiError('Không thể tải danh sách workshop. Kiểm tra kết nối BE.');
        setWorkshops([]);
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category, area]);

  // --- Filter + Sort phía FE ---
  const priceRange = PRICE_RANGES[priceIdx];

  const filtered = workshops
    .filter(ws => {
      if (keyword && !ws.title.toLowerCase().includes(keyword.toLowerCase()) &&
        !(ws.host?.fullName || '').toLowerCase().includes(keyword.toLowerCase())) return false;
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
        {apiError && workshops.length === 0 && <div className="api-error-banner" style={{ marginBottom: '1rem', padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '8px' }}>{apiError}</div>}
        <div className="wl-layout">
          {/* Mobile Filter Toggle */}
          <button className="filter-toggle-mobile" onClick={() => setShowFilter(!showFilter)}>
            Bộ lọc {hasActiveFilters && <span className="filter-badge">!</span>}
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
                {filtered.map(ws => {
                  const wId = ws.workshopId || ws.id;
                  if (!wId) return null; // Không có ID thì không hiển thị card lỗi
                  return (
                    <Link to={`/workshop/${wId}`} key={wId} className="wl-card-link">
                      <div className="wl-card">
                        {/* Ảnh */}
                        <div className="wl-card-img-wrap">
                          <img src={ws.image || '/images/ws1303.png'} alt={ws.title} loading="lazy" onError={(e) => { e.currentTarget.src = '/images/ws1303.png'; }} />
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
                          <p className="wl-card-host">{ws.host?.fullName || 'Nghệ nhân HealHaven'}</p>

                          <div className="wl-card-meta">
                            <span>{new Date(ws.startDate || ws.date || '').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
                            <span>•</span>
                            <span>{ws.address || ws.venue?.address || ws.area || ws.location || 'TP.HCM'}</span>
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
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default WorkshopListPage;