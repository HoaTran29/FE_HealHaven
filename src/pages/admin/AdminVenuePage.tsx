import React, { useState, useEffect } from 'react';
import { adminApi, type Venue } from '../../services/api';
import './AdminPage.css';

const STATUS_LABEL: Record<string, string> = {
    PENDING: 'Chờ duyệt',
    AVAILABLE: 'Đã duyệt',
    REJECTED: 'Từ chối'
};

const FILTERS: { key: string; label: string }[] = [
    { key: 'PENDING', label: 'Chờ duyệt' },
    { key: 'AVAILABLE', label: 'Đã duyệt' },
    { key: 'REJECTED', label: 'Từ chối' }
];

const AdminVenuePage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [filter, setFilter] = useState<string>('PENDING');
    const [detailId, setDetailId] = useState<string | number | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [rejectId, setRejectId] = useState<string | number | null>(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchVenues = async () => {
        try {
            setIsLoading(true);
            const res = await adminApi.getVenues(filter, page, 10);
            setVenues(res.content || []);
            setTotalPages(res.totalPages || 0);
        } catch (error) {
            console.error('Lỗi tải danh sách địa điểm:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVenues();
    }, [filter, page]);

    const detail = venues.find(v => (v.venueId || v.id) === detailId);

    const approve = async (id: string | number) => {
        try {
            await adminApi.approveVenue(id);
            fetchVenues();
            setDetailId(null);
        } catch (error) {
            alert('Lỗi phê duyệt địa điểm.');
        }
    };

    const reject = async (id: string | number) => {
        try {
            await adminApi.rejectVenue(id, rejectNote);
            fetchVenues();
            setRejectId(null); setDetailId(null); setRejectNote('');
        } catch (error) {
            alert('Lỗi từ chối địa điểm.');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Kiểm duyệt Địa điểm</h1>
                    <p className="admin-page-subtitle">Xét duyệt các địa điểm đăng ký trở thành Venue Provider.</p>
                </div>
                <div className="admin-pending-badge">{filter === 'PENDING' ? venues.length : ''} chờ duyệt</div>
            </div>

            {/* Tabs */}
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
                            <tr><th>Tên Địa điểm</th><th>Chủ sở hữu</th><th>Khu vực</th><th>Sức chứa</th><th>Giá/giờ</th><th>Ngày đăng ký</th><th>Trạng thái</th><th>Hành động</th></tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</td></tr>
                            ) : venues.length === 0 ? (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Không có địa điểm nào trong danh sách.</td></tr>
                            ) : (
                                venues.map(v => {
                                    const vId = v.venueId || v.id;
                                    const st = v.status || 'PENDING';
                                    return (
                                        <tr key={vId}>
                                            <td className="td-title">{v.name}</td>
                                            <td className="td-muted">{v.ownerName || v.providerName || 'N/A'}</td>
                                            <td><span className="admin-chip">{v.area || v.district || 'N/A'}</span></td>
                                            <td>{v.capacity} người</td>
                                            <td className="td-amount">{new Intl.NumberFormat('vi').format(v.pricePerHour)}đ</td>
                                            <td className="td-muted">N/A</td>
                                            <td><span className={`admin-badge ${st.toLowerCase()}`}>{STATUS_LABEL[st] || st}</span></td>
                                            <td>
                                                <div className="action-row">
                                                    <button className="adm-btn info" onClick={() => { setDetailId(vId!); setRejectId(null); }}>Xem</button>
                                                    {st === 'PENDING' && <>
                                                        <button className="adm-btn approve" onClick={() => approve(vId!)}>Duyệt</button>
                                                        <button className="adm-btn reject" onClick={() => { setDetailId(vId!); setRejectId(vId!); }}>Từ chối</button>
                                                    </>}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                                ))}
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
                <div className="admin-modal-overlay" onClick={() => { setDetailId(null); setRejectId(null); }}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Chi tiết: {detail.name}</h3>
                            <button className="modal-close" onClick={() => { setDetailId(null); setRejectId(null); }}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="detail-grid2">
                                <div className="d-row"><span>Chủ sở hữu:</span><strong>{detail.ownerName || detail.providerName || 'N/A'}</strong></div>
                                <div className="d-row"><span>Khu vực:</span><strong>{detail.area || detail.district}</strong></div>
                                <div className="d-row"><span>Sức chứa:</span><strong>{detail.capacity} người</strong></div>
                                <div className="d-row"><span>Giá/giờ:</span><strong className="td-amount">{new Intl.NumberFormat('vi').format(detail.pricePerHour)}đ</strong></div>
                                <div className="d-row"><span>Trạng thái:</span><span className={`admin-badge ${(detail.status || 'PENDING').toLowerCase()}`}>{STATUS_LABEL[detail.status || 'PENDING'] || detail.status}</span></div>
                            </div>
                            {rejectId === (detail.venueId || detail.id) && detail.status === 'PENDING' && (
                                <div className="reject-section">
                                    <label>Lý do từ chối *</label>
                                    <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="VD: Ảnh địa điểm chưa đủ tiêu chuẩn..." />
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            {detail.status === 'PENDING' && rejectId !== (detail.venueId || detail.id) && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(detail.venueId || detail.id!)}>Từ chối</button>
                                    <button className="btn btn-admin-primary" onClick={() => approve(detail.venueId || detail.id!)}>Phê duyệt</button>
                                </>
                            )}
                            {detail.status === 'PENDING' && rejectId === (detail.venueId || detail.id) && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(null)}>Quay lại</button>
                                    <button className="btn btn-danger" onClick={() => reject(detail.venueId || detail.id!)} disabled={!rejectNote.trim()}>Gửi từ chối</button>
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

export default AdminVenuePage;
