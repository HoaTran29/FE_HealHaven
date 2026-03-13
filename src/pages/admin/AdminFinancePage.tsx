import React, { useState, useEffect } from 'react';
import { adminApi, type AdminWithdrawal } from '../../services/api';
import './AdminPage.css';

const STATUS_LABEL: Record<string, string> = { PENDING: 'Chờ xử lý', COMPLETED: 'Đã chuyển', REJECTED: 'Từ chối' };
const fmtM = (v: number) => new Intl.NumberFormat('vi').format(v) + 'đ';

const FILTERS = [
    { key: 'PENDING', label: 'Chờ xử lý' },
    { key: 'COMPLETED', label: 'Đã hoàn thành' },
    { key: 'REJECTED', label: 'Từ chối' }
];

const AdminFinancePage: React.FC = () => {
    const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
    const [filter, setFilter] = useState<string>('PENDING');
    const [detailId, setDetailId] = useState<number | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [rejectId, setRejectId] = useState<number | null>(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchWithdrawals = async () => {
        try {
            setIsLoading(true);
            const res = await adminApi.getWithdrawals(filter, page, 10);
            setWithdrawals(res.content || []);
            setTotalPages(res.totalPages || 0);
        } catch (error) {
            console.error('Lỗi tải danh sách rút tiền:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [filter, page]);

    const approve = async (id: number) => {
        if (!window.confirm("Xác nhận đã chuyển tiền thành công cho yêu cầu này?")) return;
        try {
            await adminApi.completeWithdrawal(id);
            fetchWithdrawals();
            setDetailId(null);
        } catch (e) {
            alert("Lỗi khi hoàn tất lệnh rút.");
        }
    };

    const reject = async (id: number) => {
        try {
            await adminApi.rejectWithdrawal(id, rejectNote);
            fetchWithdrawals();
            setDetailId(null); setRejectId(null); setRejectNote('');
        } catch (e) {
            alert("Lỗi khi từ chối lệnh rút.");
        }
    };

    const detail = withdrawals.find(w => w.withdrawalId === detailId);
    // Tính tổng pending chỉ của trang hiện tại (tạm thời)
    const pendingTotal = withdrawals.filter(w => w.status === 'PENDING').reduce((s, w) => s + w.amount, 0);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Đối soát Tài chính</h1>
                    <p className="admin-page-subtitle">Quản lý doanh thu và xử lý lệnh rút tiền.</p>
                </div>
                <div className="admin-pending-badge">
                    {withdrawals.filter(w => w.status === 'PENDING').length} lệnh · {fmtM(pendingTotal)} (Trang hiện tại)
                </div>
            </div>

            {/* Withdrawal table */}
            <div className="admin-toolbar">
                <div className="admin-tabs">
                    {FILTERS.map(f => (
                        <button key={f.key} className={`admin-tab ${filter === f.key ? 'active' : ''}`} onClick={() => { setFilter(f.key); setPage(0); }}>
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-card">
                <div className="table-wrap">
                    <table className="admin-table2">
                        <thead>
                            <tr><th>Mã</th><th>Tên người dùng</th><th>Ngân hàng</th><th>Số tiền</th><th>Ngày yêu cầu</th><th>Trạng thái</th><th>Hành động</th></tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</td></tr>
                            ) : withdrawals.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Không có lệnh chuyển tiền nào.</td></tr>
                            ) : (
                                withdrawals.map(w => (
                                    <tr key={w.withdrawalId}>
                                        <td><code className="admin-code">WD-{w.withdrawalId.toString().padStart(4, '0')}</code></td>
                                        <td className="td-title">{w.fullName} (ID: {w.userId})</td>
                                        <td className="td-muted">{w.bankInfo}</td>
                                        <td className="td-amount">{fmtM(w.amount)}</td>
                                        <td className="td-muted">{new Date(w.requestedAt || Date.now()).toLocaleDateString('vi-VN')}</td>
                                        <td><span className={`admin-badge ${w.status.toLowerCase()}`}>{STATUS_LABEL[w.status]}</span></td>
                                        <td>
                                            <div className="action-row">
                                                <button className="adm-btn info" onClick={() => { setDetailId(w.withdrawalId); setRejectId(null); }}>Xem</button>
                                                {w.status === 'PENDING' && <>
                                                    <button className="adm-btn approve" onClick={() => approve(w.withdrawalId)} title="Xác nhận đã chuyển">Xong</button>
                                                    <button className="adm-btn reject" onClick={() => { setDetailId(w.withdrawalId); setRejectId(w.withdrawalId); }} title="Từ chối">Từ chối</button>
                                                </>}
                                            </div>
                                        </td>
                                    </tr>
                                ))
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

            {detail && (
                <div className="admin-modal-overlay" onClick={() => setDetailId(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Lệnh rút: #WD-{detail.withdrawalId.toString().padStart(4, '0')}</h3>
                            <button className="modal-close" onClick={() => { setDetailId(null); setRejectId(null); }}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="detail-grid2">
                                <div className="d-row"><span>Người yêu cầu:</span><strong>{detail.fullName} (User ID: {detail.userId})</strong></div>
                                <div className="d-row"><span>Thông tin NH:</span><strong>{detail.bankInfo}</strong></div>
                                <div className="d-row"><span>Số tiền:</span><strong className="td-amount">{fmtM(detail.amount)}</strong></div>
                                <div className="d-row"><span>Ngày yêu cầu:</span><strong>{new Date(detail.requestedAt || Date.now()).toLocaleString('vi-VN')}</strong></div>
                                <div className="d-row"><span>Trạng thái:</span><span className={`admin-badge ${detail.status.toLowerCase()}`}>{STATUS_LABEL[detail.status]}</span></div>
                                {detail.processedAt && (
                                    <div className="d-row"><span>Ngày xử lý:</span><strong>{new Date(detail.processedAt).toLocaleString('vi-VN')}</strong></div>
                                )}
                                {detail.note && (
                                    <div className="d-row"><span>Ghi chú:</span><strong>{detail.note}</strong></div>
                                )}
                            </div>
                            {rejectId === detail.withdrawalId && detail.status === 'PENDING' && (
                                <div className="reject-section">
                                    <label>Lý do từ chối *</label>
                                    <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Nhập lý do lỗi tài khoản..." />
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            {detail.status === 'PENDING' && rejectId !== detail.withdrawalId && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(detail.withdrawalId)}>Từ chối</button>
                                    <button className="btn btn-admin-primary" onClick={() => approve(detail.withdrawalId)}>Xác nhận đã chuyển</button>
                                </>
                            )}
                            {detail.status === 'PENDING' && rejectId === detail.withdrawalId && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(null)}>Quay lại</button>
                                    <button className="btn btn-danger" onClick={() => reject(detail.withdrawalId)} disabled={!rejectNote.trim()}>Xác nhận Từ chối</button>
                                </>
                            )}
                            {detail.status !== 'PENDING' && <button className="btn btn-ghost" onClick={() => setDetailId(null)}>Đóng</button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinancePage;
