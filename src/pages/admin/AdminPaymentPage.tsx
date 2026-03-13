import React, { useState, useEffect } from 'react';
import { adminApi, type Booking } from '../../services/api';
import './AdminPage.css';

const STATUS_LABEL: Record<string, string> = { 
    PENDING_CONFIRMATION: 'Chờ duyệt', 
    PAID: 'Đã thanh toán', 
    PENDING: 'Chờ thanh toán',
    CANCELLED: 'Đã hủy',
    FAILED: 'Thất bại'
};
const fmtM = (v: number) => new Intl.NumberFormat('vi').format(v) + 'đ';

const AdminPaymentPage: React.FC = () => {
    const [payments, setPayments] = useState<Booking[]>([]);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [rejectId, setRejectId] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPayments = async () => {
        try {
            setIsLoading(true);
            const res = await adminApi.getPendingPayments(page, 10);
            setPayments(res.content || []);
            setTotalPages(res.totalPages || 0);
        } catch (error) {
            console.error('Lỗi tải danh sách thanh toán:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [page]);

    const approve = async (id: string | number) => {
        try {
            await adminApi.approvePayment(id);
            fetchPayments();
            setDetailId(null);
        } catch (e) {
            alert("Lỗi khi duyệt thanh toán.");
        }
    };

    const reject = async (id: string | number) => {
        if (!rejectNote.trim()) return;
        try {
            await adminApi.rejectPayment(id, rejectNote);
            fetchPayments();
            setDetailId(null);
            setRejectId(null);
            setRejectNote('');
        } catch (e) {
            alert("Lỗi khi từ chối thanh toán.");
        }
    };

    const detail = payments.find(p => p.bookingId?.toString() === detailId?.toString() || p.id === detailId);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Duyệt thanh toán</h1>
                    <p className="admin-page-subtitle">Kiểm tra và xác nhận các giao dịch chuyển khoản thủ công.</p>
                </div>
                <div className="admin-pending-badge">
                    {payments.length} đơn cần duyệt (Trang {page + 1})
                </div>
            </div>

            <div className="admin-card">
                <div className="table-wrap">
                    <table className="admin-table2">
                        <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Workshop</th>
                                <th>Người đặt vé</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Không có đơn thanh toán nào đang chờ duyệt.</td></tr>
                            ) : (
                                payments.map(p => {
                                    const bId = p.bookingId || p.id;
                                    const ws = p.workshop || {};
                                    // Backend might return userName, fullName, or nested user object for admin endpoints
                                    const attendeeName = p.userName || p.fullName || p.user?.fullName || p.user?.userName || 'Người dùng ẩn danh';
                                    
                                    return (
                                        <tr key={bId}>
                                            <td><code className="admin-code">HEALHAVEN {bId}</code></td>
                                            <td className="td-title">{p.workshopTitle || ws.title}</td>
                                            <td className="td-muted">{attendeeName}</td>
                                            <td className="td-amount">{fmtM(p.amount || p.totalPrice || 0)}</td>
                                            <td>
                                                <span className={`admin-badge pending`}>
                                                    {STATUS_LABEL[p.paymentStatus || p.status] || 'Chờ duyệt'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-row">
                                                    <button className="adm-btn info" onClick={() => { setDetailId(bId.toString()); setRejectId(null); }}>Xem chi tiết</button>
                                                    <button className="adm-btn approve" onClick={() => approve(bId)} title="Duyệt đơn này">Duyệt</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="admin-pagination">
                        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Trang trước</button>
                        <span>{page + 1} / {totalPages}</span>
                        <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>Trang sau</button>
                    </div>
                )}
            </div>

            {/* Modal Chi Tiết */}
            {detail && (
                <div className="admin-modal-overlay" onClick={() => setDetailId(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Đơn xác nhận: #HEALHAVEN {detail.bookingId || detail.id}</h3>
                            <button className="modal-close" onClick={() => { setDetailId(null); setRejectId(null); }}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="detail-grid2">
                                <div className="d-row"><span>Workshop:</span><strong>{detail.workshopTitle || detail.workshop?.title}</strong></div>
                                <div className="d-row"><span>Người đặt vé:</span><strong>{detail.userName || detail.fullName || detail.user?.fullName || detail.user?.userName || 'Người dùng ẩn danh'}</strong></div>
                                <div className="d-row"><span>Tổng tiền:</span><strong className="td-amount">{fmtM(detail.amount || detail.totalPrice || 0)}</strong></div>
                                <div className="d-row"><span>Số lượng vé:</span><strong>{detail.quantity || detail.seats || 1}</strong></div>
                                <div className="d-row"><span>Trạng thái thanh toán:</span><span className={`admin-badge pending`}>{STATUS_LABEL[detail.paymentStatus || detail.status] || 'Chờ duyệt'}</span></div>
                            </div>
                            
                            {rejectId === (detail.bookingId?.toString() || detail.id) && (
                                <div className="reject-section" style={{ marginTop: '20px' }}>
                                    <label>Lý do từ chối phiếu chuyển tiền này *</label>
                                    <textarea 
                                        rows={3} 
                                        value={rejectNote} 
                                        onChange={e => setRejectNote(e.target.value)} 
                                        placeholder="Ví dụ: Không tìm thấy giao dịch, sai số tiền..." 
                                    />
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            {rejectId !== (detail.bookingId?.toString() || detail.id) ? (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(detail.bookingId?.toString() || detail.id)}>Từ chối thanh toán</button>
                                    <button className="btn btn-admin-primary" onClick={() => approve(detail.bookingId || detail.id)}>Duyệt (Đã nhận tiền)</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(null)}>Quay lại</button>
                                    <button className="btn btn-danger" onClick={() => reject(detail.bookingId || detail.id)} disabled={!rejectNote.trim()}>Xác nhận Từ chối</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentPage;
