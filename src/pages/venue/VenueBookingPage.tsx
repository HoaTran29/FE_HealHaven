import React, { useState } from 'react';
import './VenuePage.css';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

interface Booking {
    id: string; host: string; email: string; space: string;
    date: string; startTime: string; hours: number; total: number;
    status: BookingStatus; note: string; createdAt: string;
}

const INIT_BOOKINGS: Booking[] = [
    { id: 'BK-001', host: 'Trần Minh A', email: 'minha@gmail.com', space: 'Studio A', date: '2026-03-15', startTime: '09:00', hours: 3, total: 600000, status: 'pending', note: 'Workshop đan len, cần thêm bàn', createdAt: '26/02' },
    { id: 'BK-002', host: 'Lê Thu B', email: 'thub@gmail.com', space: 'Studio B', date: '2026-03-18', startTime: '14:00', hours: 2, total: 360000, status: 'pending', note: '', createdAt: '25/02' },
    { id: 'BK-003', host: 'Nguyễn C', email: 'nguyenc@gmail.com', space: 'Sân vườn', date: '2026-03-20', startTime: '08:00', hours: 4, total: 480000, status: 'pending', note: 'Workshop ngoài trời cần điện', createdAt: '25/02' },
    { id: 'BK-004', host: 'Khánh D', email: 'khanhd@gmail.com', space: 'Studio A', date: '2026-03-10', startTime: '10:00', hours: 2, total: 400000, status: 'confirmed', note: '', createdAt: '20/02' },
    { id: 'BK-005', host: 'Minh E', email: 'minhe@gmail.com', space: 'Studio B', date: '2026-03-08', startTime: '14:00', hours: 2, total: 360000, status: 'confirmed', note: '', createdAt: '18/02' },
    { id: 'BK-006', host: 'Hoa F', email: 'hoaf@gmail.com', space: 'Studio A', date: '2026-03-05', startTime: '09:00', hours: 3, total: 600000, status: 'cancelled', note: 'Hủy do xung đột lịch', createdAt: '15/02' },
];

const STATUS_LABEL: Record<string, string> = {
    pending: '⏳ Chờ duyệt', confirmed: '✅ Xác nhận', cancelled: '🔴 Từ chối',
};

const FILTERS: { key: BookingStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: '⏳ Chờ duyệt' },
    { key: 'confirmed', label: '✅ Xác nhận' },
    { key: 'cancelled', label: '🔴 Từ chối' },
];

const VenueBookingPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>(INIT_BOOKINGS);
    const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
    const [detailId, setDetailId] = useState<string | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [rejectId, setRejectId] = useState<string | null>(null);

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const detail = bookings.find(b => b.id === detailId);

    const approve = (id: string) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
    const reject = (id: string, note: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled', note } : b));
        setRejectId(null); setDetailId(null); setRejectNote('');
    };

    return (
        <div className="venue-page">
            <div className="venue-page-header">
                <div>
                    <h1 className="venue-page-title">Phê duyệt Đơn thuê</h1>
                    <p className="venue-page-subtitle">Xem xét và xác nhận các yêu cầu đặt không gian.</p>
                </div>
                <div className="pending-count-badge">
                    {bookings.filter(b => b.status === 'pending').length} đơn chờ
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
                            <tr><th>Mã</th><th>Host</th><th>Không gian</th><th>Ngày / Giờ</th><th>Tổng</th><th>Trạng thái</th><th>Hành động</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => (
                                <tr key={b.id}>
                                    <td><code className="venue-code">{b.id}</code></td>
                                    <td>
                                        <div className="td-title">{b.host}</div>
                                        <div className="td-muted" style={{ fontSize: '0.78rem' }}>{b.email}</div>
                                    </td>
                                    <td className="td-muted">{b.space}</td>
                                    <td className="td-muted">
                                        {new Date(b.date).toLocaleDateString('vi-VN')} · {b.startTime} · {b.hours}h
                                    </td>
                                    <td className="td-amount">{new Intl.NumberFormat('vi').format(b.total)}đ</td>
                                    <td><span className={`venue-badge ${b.status}`}>{STATUS_LABEL[b.status]}</span></td>
                                    <td>
                                        <div className="action-btns2">
                                            <button className="btn-venue-sm info" onClick={() => setDetailId(b.id)}>👁️ Chi tiết</button>
                                            {b.status === 'pending' && (
                                                <>
                                                    <button className="btn-venue-sm approve" onClick={() => approve(b.id)}>✅</button>
                                                    <button className="btn-venue-sm reject2" onClick={() => { setRejectId(b.id); setDetailId(b.id); }}>🔴</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="venue-empty">Không có đơn nào.</div>}
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
                                <div className="detail-row"><span>Host:</span><strong>{detail.host}</strong></div>
                                <div className="detail-row"><span>Email:</span><strong>{detail.email}</strong></div>
                                <div className="detail-row"><span>Không gian:</span><strong>{detail.space}</strong></div>
                                <div className="detail-row"><span>Ngày:</span><strong>{new Date(detail.date).toLocaleDateString('vi-VN')}</strong></div>
                                <div className="detail-row"><span>Giờ bắt đầu:</span><strong>{detail.startTime}</strong></div>
                                <div className="detail-row"><span>Số giờ:</span><strong>{detail.hours} giờ</strong></div>
                                <div className="detail-row"><span>Tổng tiền:</span><strong className="td-amount">{new Intl.NumberFormat('vi').format(detail.total)}đ</strong></div>
                                <div className="detail-row"><span>Trạng thái:</span><span className={`venue-badge ${detail.status}`}>{STATUS_LABEL[detail.status]}</span></div>
                                {detail.note && <div className="detail-row full"><span>Ghi chú:</span><span>{detail.note}</span></div>}
                            </div>

                            {/* Reject form */}
                            {rejectId === detail.id && detail.status === 'pending' && (
                                <div className="reject-form">
                                    <label>Lý do từ chối *</label>
                                    <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="VD: Ngày đó đã có đặt trước..." />
                                </div>
                            )}
                        </div>
                        <div className="venue-modal-footer">
                            {detail.status === 'pending' && rejectId !== detail.id && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(detail.id)}>🔴 Từ chối</button>
                                    <button className="btn btn-venue" onClick={() => { approve(detail.id); setDetailId(null); }}>✅ Xác nhận</button>
                                </>
                            )}
                            {detail.status === 'pending' && rejectId === detail.id && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(null)}>← Quay lại</button>
                                    <button className="btn btn-danger" onClick={() => reject(detail.id, rejectNote)} disabled={!rejectNote.trim()}>Gửi từ chối</button>
                                </>
                            )}
                            {detail.status !== 'pending' && (
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
