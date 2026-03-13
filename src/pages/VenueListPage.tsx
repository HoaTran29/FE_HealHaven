import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { venueApi, type Venue } from '../services/api';
import './VenueListPage.css';

const AREAS = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận Phu Nhuan', 'Bình Thạnh', 'Tân Bình', 'Gò Vấp', 'Khác'];
const PRICE_RANGES = [
    { label: 'Tất cả mức giá', min: 0, max: 999999999 },
    { label: 'Dưới 200.000đ/giờ', min: 0, max: 200000 },
    { label: '200.000đ - 500.000đ/giờ', min: 200000, max: 500000 },
    { label: 'Trên 500.000đ/giờ', min: 500000, max: 999999999 }
];

const VenueListPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    // Filters
    const [area, setArea] = useState('');
    const [priceIdx, setPriceIdx] = useState(0);
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        setIsLoading(true);
        venueApi.getList()
            .then(res => {
                if (Array.isArray(res)) {
                    setVenues(res);
                } else if (res && res.content) {
                    setVenues(res.content);
                }
            })
            .catch(err => console.error("Lỗi lấy danh sách địa điểm:", err))
            .finally(() => setIsLoading(false));
    }, []);

    // Lọc
    const filtered = venues.filter(v => {
        const displayArea = v.district || v.area;
        const matchKeyword = v.name.toLowerCase().includes(keyword.toLowerCase()) || (v.address && v.address.toLowerCase().includes(keyword.toLowerCase()));
        const matchArea = area ? displayArea === area : true;
        const matchPrice = v.pricePerHour >= PRICE_RANGES[priceIdx].min && v.pricePerHour <= PRICE_RANGES[priceIdx].max;
        return matchKeyword && matchArea && matchPrice;
    });

    // Sort
    const sortedAndFiltered = [...filtered].sort((a, b) => {
        if (sortOrder === 'price_asc') return a.pricePerHour - b.pricePerHour;
        if (sortOrder === 'price_desc') return b.pricePerHour - a.pricePerHour;
        if (sortOrder === 'capacity') return b.capacity - a.capacity;
        return 0; // newest mặc định
    });

    const resetFilters = () => {
        setKeyword('');
        setArea('');
        setPriceIdx(0);
        setSortOrder('newest');
    };

    const hasActiveFilters = keyword || area || priceIdx > 0;

    return (
        <div className="venue-list-page workshop-list-page">
            {/* Hero header */}
            <div className="vl-hero wl-hero">
                <div className="container">
                    <h1>🏘️ Thuê Không Gian Sáng Tạo</h1>
                    <p>Khám phá các Studio, Phòng học, Sân vườn phù hợp cho Workshop của bạn</p>

                    <div className="vl-search-bar wl-search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm tên không gian, địa chỉ…"
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
                <div className="vl-layout">
                    {/* Sidebar */}
                    <aside className="vl-filter-sidebar">
                        <div className="filter-header">
                            <h3>Bộ lọc</h3>
                            {hasActiveFilters && (
                                <button className="filter-reset-btn" onClick={resetFilters}>Xóa tất cả</button>
                            )}
                        </div>

                        <div className="filter-group">
                            <h4>Khu vực</h4>
                            <select value={area} onChange={e => setArea(e.target.value)}>
                                <option value="">Tất cả khu vực</option>
                                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>

                        <div className="filter-group">
                            <h4>Mức giá / giờ</h4>
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
                    </aside>

                    {/* Main Content */}
                    <div className="vl-main">
                        <div className="vl-top-bar">
                            <span className="vl-result-count">Hiển thị {sortedAndFiltered.length} không gian</span>
                            <div className="vl-sort">
                                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                                    <option value="newest">Mới nhất</option>
                                    <option value="price_asc">Giá tăng dần</option>
                                    <option value="price_desc">Giá giảm dần</option>
                                    <option value="capacity">Sức chứa lớn nhất</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div style={{ padding: '3rem 0', textAlign: 'center', color: '#666' }}>Đang tải danh sách địa điểm...</div>
                        ) : (
                            <div className="vl-grid">
                                {sortedAndFiltered.length > 0 ? sortedAndFiltered.map(v => {
                                    const displayImages = v.imageUrls || v.images || [];
                                    const defaultImage = displayImages.length > 0 ? displayImages[0] : 'https://placehold.co/600x400/e2e8f0/64748b?text=HealHaven+Venue';
                                    const displayArea = v.district || v.area;
                                    const vId = v.venueId || v.id;

                                    return (
                                        <Link to={`/venue/${vId}`} key={vId} className="vl-card">
                                            <div className="vl-card-img-wrap">
                                                <img src={defaultImage} alt={v.name} className="vl-card-img" />
                                                {displayArea && <span className="vl-badge-area">{displayArea}</span>}
                                            </div>
                                            <div className="vl-card-body">
                                                <h3 className="vl-card-title">{v.name}</h3>
                                                <div className="vl-card-address">
                                                    📍 {v.address || 'Đang cập nhật địa chỉ'}
                                                </div>
                                                <div className="vl-meta">
                                                    <span>👥 Sức chứa: {v.capacity} pax</span>
                                                </div>
                                                <div className="vl-card-footer">
                                                    <div className="vl-price">
                                                        {new Intl.NumberFormat('vi').format(v.pricePerHour)}đ <span>/ giờ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                }) : (
                                    <div className="vl-empty">
                                        <h3>Không tìm thấy địa điểm nào</h3>
                                        <p>Thử xóa bộ lọc hoặc tìm với từ khóa khác.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueListPage;
