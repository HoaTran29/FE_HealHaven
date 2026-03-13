import React, { useState, useEffect } from 'react';
import { venueApi, venueBookingApi, type Venue } from '../../services/api';
import './HostPage.css';

const AREAS = ['Tất cả', 'Quận 1', 'Quận 3', 'Bình Thạnh', 'Thủ Đức'];

const HostVenuePage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [area, setArea] = useState('Tất cả');
    const [bookingVenue, setBookingVenue] = useState<Venue | null>(null);
    const [bookForm, setBookForm] = useState({ date: '', startTime: '', hours: '2', notes: '' });
    const [booked, setBooked] = useState(false);

    const filtered = area === 'Tất cả' ? venues : venues.filter(v => v.area === area);
    const totalCost = bookingVenue ? bookingVenue.pricePerHour * Number(bookForm.hours) : 0;

    useEffect(() => {
        setIsLoading(true);
        venueApi.getList()
            .then(res => setVenues(Array.isArray(res) ? res : (res.content || [])))
            .catch(err => console.error("Lỗi tải danh sách địa điểm:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleBook = async () => {
        if (!bookForm.date || !bookForm.startTime || !bookingVenue) return;

        try {
            const bookingDate = bookForm.date;
            const startTime = `${bookForm.startTime}:00`;

            // Tính endTime
            const [hh, mm] = bookForm.startTime.split(':');
            const endHour = Number(hh) + Number(bookForm.hours);
            const endTime = `${endHour.toString().padStart(2, '0')}:${mm}:00`;

            const vId = bookingVenue.venueId || bookingVenue.id || '';

            await venueBookingApi.create({
                venueId: vId,
                bookingDate: bookingDate,
                startTime: startTime,
                endTime: endTime,
                note: bookForm.notes
            });

            setBooked(true);
            setTimeout(() => { setBookingVenue(null); setBooked(false); }, 2000);
        } catch (error) {
            console.error("Lỗi đặt địa điểm:", error);
            alert("Đặt địa điểm thất bại, vui lòng kiểm tra lại!");
        }
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
            {isLoading ? <p>Đang tải địa điểm...</p> : (
                <div className="venue-grid">
                    {filtered.map(v => {
                        const displayArea = v.district || v.area || 'Chưa rõ';
                        const displayImages = v.imageUrls || v.images || [];
                        const vId = v.venueId || v.id || '';
                        let parsedAminities: string[] = [];
                        if (typeof v.amenities === 'string') parsedAminities = v.amenities.split(',').map(x => x.trim()).filter(Boolean);
                        else if (Array.isArray(v.amenities)) parsedAminities = v.amenities;

                        return (
                            <div className="venue-card host-card" key={vId}>
                                <div className="venue-img-wrap">
                                    <img src={displayImages.length > 0 ? displayImages[0] : '/images/mau-nuoc.webp'} alt={v.name} />
                                    <span className="venue-rating">⭐ {4.8}</span>
                                </div>
                                <div className="venue-body">
                                    <div className="venue-area-tag">{displayArea}</div>
                                    <h3 className="venue-name">{v.name}</h3>
                                    <p className="venue-capacity">👥 Sức chứa: tối đa {v.capacity} người</p>
                                    <div className="venue-amenities">
                                        {parsedAminities.map(a => <span key={a} className="amenity-chip">{a}</span>)}
                                    </div>
                                    <div className="venue-footer">
                                        <div className="venue-price">
                                            <strong>{new Intl.NumberFormat('vi-VN').format(v.pricePerHour)}đ</strong>
                                            <span>/giờ</span>
                                        </div>
                                        <button className="btn btn-primary" onClick={() => { setBookingVenue(v); setBooked(false); }}>
                                            Đặt ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
