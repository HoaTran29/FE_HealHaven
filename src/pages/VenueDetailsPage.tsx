import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { venueApi, type Venue } from '../services/api';
import './VenueDetailsPage.css';

const VenueDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        venueApi.getById(id)
            .then(res => setVenue(res))
            .catch(err => console.error("Không tìm thấy không gian:", err))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Đang tải thông tin không gian...</div>;
    }

    if (!venue) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2 style={{ color: '#ef4444' }}>Không tìm thấy không gian.</h2>
                <button onClick={() => navigate('/venues')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Quay lại danh sách</button>
            </div>
        );
    }

    const displayImages = venue.imageUrls || venue.images || [];
    const defaultCover = displayImages.length > 0
        ? displayImages[activeImg]
        : 'https://placehold.co/1200x600/1e293b/cbd5e1?text=HealHaven+Venue';

    let parsedAmenities: string[] = [];
    if (typeof venue.amenities === 'string') {
        parsedAmenities = venue.amenities.split(',').map(a => a.trim()).filter(Boolean);
    } else if (Array.isArray(venue.amenities)) {
        parsedAmenities = venue.amenities;
    }

    const amenitiesList = parsedAmenities.length > 0
        ? parsedAmenities
        : ['Wifi tốc độ cao', 'Điều hòa không khí', 'Bảng trắng & Bút lông', 'Máy chiếu'];

    const displayArea = venue.district || venue.area;

    return (
        <div className="venue-details-page">
            {/* === HEADER TƯƠNG TỰ WORKSHOP === */}
            <header className="vd-header">
                <div className="container">
                    <p className="vd-breadcrumb">
                        <Link to="/venues">Địa điểm</Link> &gt; <span>{venue.name}</span>
                    </p>
                    {displayArea && <span className="vd-badge-area">{displayArea}</span>}
                    <h1>{venue.name}</h1>
                    <p className="vd-subtitle">Không gian khơi nguồn cảm hứng và cung cấp tiện ích chuyên nghiệp.</p>
                </div>
            </header>

            <div className="container">
                <div className="vd-layout">
                    {/* === CỘT TRÁI === */}
                    <div className="vd-main-content">
                        {/* Image Gallery */}
                        <div className="vd-gallery">
                            <div className="vd-gallery-main">
                                <img src={defaultCover} alt={venue.name} />
                            </div>
                            {venue.images && venue.images.length > 1 && (
                                <div className="vd-gallery-thumbs">
                                    {venue.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`Gallery ${i}`}
                                            className={i === activeImg ? 'active' : ''}
                                            onClick={() => setActiveImg(i)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="vd-tabs">
                            {[
                                { key: 'info', label: '📖 Giới thiệu' },
                                { key: 'amenity', label: '✨ Tiện ích' },
                                { key: 'location', label: '📍 Vị trí bản đồ' },
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
                            {/* Tab Giới thiệu */}
                            {activeTab === 'info' && (
                                <div>
                                    <p className="vd-desc">
                                        Đây là thông tin mô tả chi tiết không gian "{venue.name}". Được vận hành bởi {venue.ownerName || 'đối tác'}, không gian này mang không khí ấm cúng, thư giãn, rất phù hợp cho những buổi workshop nghệ thuật và chữa lành.
                                        <br /><br />
                                        Hãy đặt trước để đảm bảo bạn có đủ thời gian chuẩn bị hậu cần cho học viên.
                                    </p>
                                </div>
                            )}

                            {/* Tab Tiện ích */}
                            {activeTab === 'amenity' && (
                                <div>
                                    <p>Khi thuê không gian, bạn sẽ được cung cấp miễn phí các tiện nghi sau đây:</p>
                                    <div className="vd-amenities-grid">
                                        {amenitiesList.map((am: string, i: number) => (
                                            <div key={i} className="vd-amenity-item">
                                                <span>✅</span> {am}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab Bản đồ */}
                            {activeTab === 'location' && (
                                <div>
                                    <p className="vd-address-text">📍 <strong>{venue.address || displayArea || 'Đang cập nhật địa chỉ'}</strong></p>
                                    {(venue.address || displayArea) && (
                                        <div className="vd-map-wrap">
                                            <iframe
                                                src={`https://www.google.com/maps?q=${encodeURIComponent(venue.address || displayArea || '')}&output=embed`}
                                                title="Bản đồ địa điểm"
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === CỘT PHẢI (SIDEBAR) === */}
                    <aside className="vd-sidebar">
                        <div className="vd-purchase-card">
                            <div className="vd-price-row">
                                <h3 className="vd-price">{new Intl.NumberFormat('vi').format(venue.pricePerHour)}đ<span>/giờ</span></h3>
                            </div>

                            <ul className="vd-quick-info">
                                <li>👥 <strong>Sức chứa:</strong> {venue.capacity} người</li>
                                <li>🏢 <strong>Khu vực:</strong> {displayArea || 'Khác'}</li>
                                <li>🟢 <strong>Trạng thái:</strong> Sẵn sàng cho thuê</li>
                            </ul>

                            <button
                                className="btn btn-primary vd-book-btn"
                                onClick={() => navigate('/host')}
                                title="Host dashboard cho phép Book Venue"
                            >
                                Đăng ký Thuê ngay
                            </button>

                            <div className="vd-host-box">
                                <p>Cung cấp bởi đối tác</p>
                                <strong>{venue.ownerName || 'HealHaven Partner'}</strong>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default VenueDetailsPage;
