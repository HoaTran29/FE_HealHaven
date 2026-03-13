import React, { useState, useEffect } from 'react';
import { venueBookingApi, type VenueBooking } from '../../services/api';
import './VenuePage.css';

const STATUS_LABEL: Record<string, string> = {
    REQUESTING: '⏳ Chờ duyệt', CONFIRMED: '✅ Xác nhận', REJECTED: '🔴 Từ chối', CANCELLED: '❌ Đã huỷ'
};

const FILTERS: { key: string | 'all'; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'REQUESTING', label: '⏳ Chờ duyệt' },
    { key: 'CONFIRMED', label: '✅ Xác nhận' },
    { key: 'REJECTED', label: '🔴 Từ chối' },
];

const VenueBookingPage: React.FC = () => {
    const [bookings, setBookings] = useState<VenueBooking[]>([]);
    const [filter, setFilter] = useState<string | 'all'>('all');
    const [detailId, setDetailId] = useState<string | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [rejectId, setRejectId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBookings = () => {
        setIsLoading(true);
        venueBookingApi.getAllForProvider()
            .then(res => setBookings(res || []))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const detail = bookings.find(b => String(b.bookingId || b.id) === detailId);

    const approve = async (id: string | number) => {
        try {
            await venueBookingApi.approve(id);
            alert("Đã phê duyệt yêu cầu đặt phòng!");
            fetchBookings();
        } catch (error) {
            console.error(error);
            alert("Phê duyệt thất bại!");
        }
    };

    const reject = async (id: string | number, note: string) => {
        try {
            await venueBookingApi.reject(id, note);
            // Cập nhật lại list sau khi huỷ
            fetchBookings();
            setRejectId(null); setDetailId(null); setRejectNote('');
        } catch (error) {
            console.error(error);
            alert("Từ chối thất bại!");
        }
    };

    return (
        <div className="venue-page">
            <div className="venue-page-header">
                <div>
                    <h1 className="venue-page-title">Phê duyệt Đơn thuê</h1>
                    <p className="venue-page-subtitle">Xem xét và xác nhận các yêu cầu đặt không gian.</p>
                </div>
                <div className="pending-count-badge">
                    {bookings.filter(b => b.status === 'REQUESTING').length} đơn chờ
                </div>
            </div>

            {/* Tabs */}
            <div className="venue-filter-tabs">
                {FILTERS.map(f => (
                    <button key={f.key} className={`venue-tab-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                        {f.label}
                        <span className="venue-tab-count">
                            {f.key === 'all' ? bookings.length : bookings.filter(b => b.status === f.key).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="venue-card">
                <div className="table-wrap">
                    <table className="venue-table">
                        <thead>
                            <tr><th>Mã</th><th>Tên địa điểm</th><th>Ngày / Giờ</th><th>Tổng</th><th>Trạng thái</th><th>Hành động</th></tr>
                        </thead>
                        <tbody>
                            {isLoading ? <tr><td colSpan={6}>Đang tải...</td></tr> : filtered.map(b => {
                                const start = new Date(b.startTime);

                                return (
                                    <tr key={String(b.bookingId || b.id || Math.random())}>
                                        <td><code className="venue-code">{String(b.bookingId || b.id).substring(0, 8)}</code></td>
                                        <td className="td-muted">{b.venueName || b.venueId}</td>
                                        <td className="td-muted">
                                            {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('vi-VN') : start.toLocaleDateString('vi-VN')} · {typeof b.startTime === 'string' && !b.startTime.includes('T') ? b.startTime : start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="td-amount">{new Intl.NumberFormat('vi').format(b.totalPrice || 0)}đ</td>
                                        <td><span className={`venue-badge ${b.status.toLowerCase()}`}>{STATUS_LABEL[b.status] || b.status}</span></td>
                                        <td>
                                            <div className="action-btns2">
                                                <button className="btn-venue-sm info" onClick={() => setDetailId(String(b.bookingId || b.id))}>👁️ Chi tiết</button>
                                                {b.status === 'REQUESTING' && (
                                                    <>
                                                        <button className="btn-venue-sm approve" onClick={() => approve(String(b.bookingId || b.id))}>✅</button>
                                                        <button className="btn-venue-sm reject2" onClick={() => { setRejectId(String(b.bookingId || b.id)); setDetailId(String(b.bookingId || b.id)); }}>🔴</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {!isLoading && filtered.length === 0 && <div className="venue-empty">Không có đơn nào.</div>}
                </div>
            </div>

            {/* Detail Modal */}
            {detail && (
                <div className="venue-modal-overlay" onClick={() => { setDetailId(null); setRejectId(null); }}>
                    <div className="venue-modal" onClick={e => e.stopPropagation()}>
                        <div className="venue-modal-header">
                            <h3>Chi tiết đơn {detail.id}</h3>
                            <button className="modal-close" onClick={() => { setDetailId(null); setRejectId(null); }}>✕</button>
                        </div>
                        <div className="venue-modal-body">
                            <div className="detail-grid">
                                <div className="detail-row"><span>Không gian:</span><strong>{detail.venueName || detail.venueId}</strong></div>
                                {detail.bookingDate && <div className="detail-row"><span>Ngày thuê:</span><strong>{new Date(detail.bookingDate).toLocaleDateString('vi-VN')}</strong></div>}
                                <div className="detail-row"><span>Bắt đầu lúc:</span><strong>{detail.startTime}</strong></div>
                                <div className="detail-row"><span>Kết thúc lúc:</span><strong>{detail.endTime}</strong></div>
                                <div className="detail-row"><span>Tổng tiền:</span><strong className="td-amount">{new Intl.NumberFormat('vi').format(detail.totalPrice || 0)}đ</strong></div>
                                <div className="detail-row"><span>Trạng thái:</span><span className={`venue-badge ${detail.status.toLowerCase()}`}>{STATUS_LABEL[detail.status] || detail.status}</span></div>
                                {detail.note && <div className="detail-row full"><span>Ghi chú:</span><span>{detail.note}</span></div>}
                            </div>

                            {/* Reject form */}
                            {rejectId === String(detail.bookingId || detail.id) && detail.status === 'REQUESTING' && (
                                <div className="reject-form">
                                    <label>Lý do từ chối *</label>
                                    <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="VD: Ngày đó đã có đặt trước..." />
                                </div>
                            )}
                        </div>
                        <div className="venue-modal-footer">
                            {detail.status === 'REQUESTING' && rejectId !== String(detail.bookingId || detail.id) && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(String(detail.bookingId || detail.id))}>🔴 Từ chối</button>
                                    <button className="btn btn-venue" onClick={() => { approve(String(detail.bookingId || detail.id)); setDetailId(null); }}>✅ Xác nhận</button>
                                </>
                            )}
                            {detail.status === 'REQUESTING' && rejectId === String(detail.bookingId || detail.id) && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(null)}>← Quay lại</button>
                                    <button className="btn btn-danger" onClick={() => reject(String(detail.bookingId || detail.id), rejectNote)} disabled={!rejectNote.trim()}>Gửi từ chối</button>
                                </>
                            )}
                            {detail.status !== 'REQUESTING' && (
                                <button className="btn btn-ghost" onClick={() => setDetailId(null)}>Đóng</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenueBookingPage;
