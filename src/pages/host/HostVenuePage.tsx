import React, { useState } from 'react';
import './HostPage.css';

const VENUES = [
    { id: 1, name: 'Studio Sáng tạo Quận 1', area: 'Quận 1', price: 200000, capacity: 15, amenities: ['WiFi', 'Máy lạnh', 'Máy chiếu', 'Bếp'], image: '/images/dan-len.webp', rating: 4.9 },
    { id: 2, name: 'Không gian Xanh Thủ Đức', area: 'Thủ Đức', price: 150000, capacity: 20, amenities: ['WiFi', 'Máy lạnh', 'Bãi đỗ xe'], image: '/images/mau-nuoc.webp', rating: 4.7 },
    { id: 3, name: 'Workshop Hub Bình Thạnh', area: 'Bình Thạnh', price: 180000, capacity: 12, amenities: ['WiFi', 'Máy lạnh', 'Bếp', 'Lò nướng'], image: '/images/kem-nhung.webp', rating: 4.8 },
    { id: 4, name: 'Art Space Quận 3', area: 'Quận 3', price: 250000, capacity: 10, amenities: ['WiFi', 'Máy lạnh', 'Máy chiếu'], image: '/images/dan-len.webp', rating: 5.0 },
];

const AREAS = ['Tất cả', 'Quận 1', 'Quận 3', 'Bình Thạnh', 'Thủ Đức'];

const HostVenuePage: React.FC = () => {
    const [area, setArea] = useState('Tất cả');
    const [bookingVenue, setBookingVenue] = useState<typeof VENUES[0] | null>(null);
    const [bookForm, setBookForm] = useState({ date: '', startTime: '', hours: '2', notes: '' });
    const [booked, setBooked] = useState(false);

    const filtered = area === 'Tất cả' ? VENUES : VENUES.filter(v => v.area === area);
    const totalCost = bookingVenue ? bookingVenue.price * Number(bookForm.hours) : 0;

    const handleBook = () => {
        if (!bookForm.date || !bookForm.startTime) return;
        setBooked(true);
        setTimeout(() => { setBookingVenue(null); setBooked(false); }, 2000);
    };

    return (
        <div className="host-page">
            <div className="host-page-header">
                <div>
                    <h1 className="host-page-title">Đặt Địa điểm</h1>
                    <p className="host-page-subtitle">Tìm không gian phù hợp cho workshop của bạn.</p>
                </div>
            </div>

            {/* Area filter */}
            <div className="area-chips">
                {AREAS.map(a => (
                    <button key={a} className={`chip ${area === a ? 'active' : ''}`} onClick={() => setArea(a)}>{a}</button>
                ))}
            </div>

            {/* Venue grid */}
            <div className="venue-grid">
                {filtered.map(v => (
                    <div className="venue-card host-card" key={v.id}>
                        <div className="venue-img-wrap">
                            <img src={v.image} alt={v.name} />
                            <span className="venue-rating">⭐ {v.rating}</span>
                        </div>
                        <div className="venue-body">
                            <div className="venue-area-tag">{v.area}</div>
                            <h3 className="venue-name">{v.name}</h3>
                            <p className="venue-capacity">👥 Sức chứa: tối đa {v.capacity} người</p>
                            <div className="venue-amenities">
                                {v.amenities.map(a => <span key={a} className="amenity-chip">{a}</span>)}
                            </div>
                            <div className="venue-footer">
                                <div className="venue-price">
                                    <strong>{new Intl.NumberFormat('vi-VN').format(v.price)}đ</strong>
                                    <span>/giờ</span>
                                </div>
                                <button className="btn btn-primary" onClick={() => { setBookingVenue(v); setBooked(false); }}>
                                    Đặt ngay
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking modal */}
            {bookingVenue && (
                <div className="host-modal-overlay" onClick={() => setBookingVenue(null)}>
                    <div className="host-modal" onClick={e => e.stopPropagation()}>
                        <div className="host-modal-header">
                            <h3>Đặt: {bookingVenue.name}</h3>
                            <button className="modal-close" onClick={() => setBookingVenue(null)}>✕</button>
                        </div>
                        {!booked ? (
                            <>
                                <div className="host-modal-body">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Ngày sử dụng *</label>
                                            <input type="date" value={bookForm.date} onChange={e => setBookForm(f => ({ ...f, date: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label>Giờ bắt đầu *</label>
                                            <input type="time" value={bookForm.startTime} onChange={e => setBookForm(f => ({ ...f, startTime: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Số giờ thuê</label>
                                        <select value={bookForm.hours} onChange={e => setBookForm(f => ({ ...f, hours: e.target.value }))}>
                                            {[1, 2, 3, 4, 5, 6].map(h => <option key={h} value={h}>{h} giờ</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Ghi chú thêm</label>
                                        <textarea rows={2} value={bookForm.notes} onChange={e => setBookForm(f => ({ ...f, notes: e.target.value }))} placeholder="Yêu cầu đặc biệt, thiết bị cần thêm..." />
                                    </div>
                                    <div className="booking-total">
                                        <span>Tổng chi phí:</span>
                                        <strong>{new Intl.NumberFormat('vi-VN').format(totalCost)}đ</strong>
                                    </div>
                                </div>
                                <div className="host-modal-footer">
                                    <button className="btn btn-ghost" onClick={() => setBookingVenue(null)}>Hủy</button>
                                    <button className="btn btn-primary" onClick={handleBook}>📍 Gửi yêu cầu đặt</button>
                                </div>
                            </>
                        ) : (
                            <div className="host-modal-body success-msg">
                                <div style={{ fontSize: '3rem' }}>🎉</div>
                                <h3>Yêu cầu đã gửi!</h3>
                                <p>Địa điểm sẽ liên hệ xác nhận trong vòng 24 giờ.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostVenuePage;
