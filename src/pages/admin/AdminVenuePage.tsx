import React, { useState } from 'react';
import './AdminPage.css';

type VenueStatus = 'pending' | 'approved' | 'rejected';

interface Venue {
    id: string; name: string; owner: string; area: string;
    capacity: number; pricePerHour: number; submittedDate: string; status: VenueStatus;
}

const INIT_VENUES: Venue[] = [
    { id: 'v001', name: 'Studio Sáng tạo Q1', owner: 'Phạm Thị Lan', area: 'Quận 1', capacity: 15, pricePerHour: 200000, submittedDate: '28/02/2026', status: 'pending' },
    { id: 'v002', name: 'Không gian Xanh Thủ Đức', owner: 'Trần Minh H', area: 'Thủ Đức', capacity: 20, pricePerHour: 150000, submittedDate: '27/02/2026', status: 'pending' },
    { id: 'v003', name: 'Workshop Hub Bình Thạnh', owner: 'Lê Văn K', area: 'Bình Thạnh', capacity: 12, pricePerHour: 180000, submittedDate: '25/02/2026', status: 'pending' },
    { id: 'v004', name: 'Art Space Q3', owner: 'Hà Thu N', area: 'Quận 3', capacity: 10, pricePerHour: 250000, submittedDate: '20/02/2026', status: 'approved' },
    { id: 'v005', name: 'Rooftop Event Space', owner: 'Hoàng P', area: 'Quận 7', capacity: 50, pricePerHour: 500000, submittedDate: '15/02/2026', status: 'rejected' },
];

const STATUS_LABEL: Record<VenueStatus, string> = { pending: '⏳ Chờ duyệt', approved: '✅ Đã duyệt', rejected: '🔴 Từ chối' };

const AdminVenuePage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>(INIT_VENUES);
    const [filter, setFilter] = useState<VenueStatus | 'all'>('all');
    const [detailId, setDetailId] = useState<string | null>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [rejectId, setRejectId] = useState<string | null>(null);

    const filtered = filter === 'all' ? venues : venues.filter(v => v.status === filter);
    const detail = venues.find(v => v.id === detailId);

    const approve = (id: string) => { setVenues(vs => vs.map(v => v.id === id ? { ...v, status: 'approved' } : v)); setDetailId(null); };
    const reject = (id: string) => { setVenues(vs => vs.map(v => v.id === id ? { ...v, status: 'rejected' } : v)); setRejectId(null); setDetailId(null); setRejectNote(''); };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Kiểm duyệt Địa điểm</h1>
                    <p className="admin-page-subtitle">Xét duyệt các địa điểm đăng ký trở thành Venue Provider.</p>
                </div>
                <div className="admin-pending-badge">{venues.filter(v => v.status === 'pending').length} chờ duyệt</div>
            </div>

            {/* Tabs */}
            <div className="admin-toolbar">
                <div className="admin-tabs">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                        <button key={f} className={`admin-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'Tất cả' : STATUS_LABEL[f as VenueStatus]}
                            <span className="tab-cnt">{f === 'all' ? venues.length : venues.filter(v => v.status === f).length}</span>
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
                            {filtered.map(v => (
                                <tr key={v.id}>
                                    <td className="td-title">{v.name}</td>
                                    <td className="td-muted">{v.owner}</td>
                                    <td><span className="admin-chip">{v.area}</span></td>
                                    <td>{v.capacity} người</td>
                                    <td className="td-amount">{new Intl.NumberFormat('vi').format(v.pricePerHour)}đ</td>
                                    <td className="td-muted">{v.submittedDate}</td>
                                    <td><span className={`admin-badge ${v.status}`}>{STATUS_LABEL[v.status]}</span></td>
                                    <td>
                                        <div className="action-row">
                                            <button className="adm-btn info" onClick={() => { setDetailId(v.id); setRejectId(null); }}>👁️</button>
                                            {v.status === 'pending' && <>
                                                <button className="adm-btn approve" onClick={() => approve(v.id)}>✅</button>
                                                <button className="adm-btn reject" onClick={() => { setDetailId(v.id); setRejectId(v.id); }}>🔴</button>
                                            </>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                <div className="d-row"><span>Chủ sở hữu:</span><strong>{detail.owner}</strong></div>
                                <div className="d-row"><span>Khu vực:</span><strong>{detail.area}</strong></div>
                                <div className="d-row"><span>Sức chứa:</span><strong>{detail.capacity} người</strong></div>
                                <div className="d-row"><span>Giá/giờ:</span><strong className="td-amount">{new Intl.NumberFormat('vi').format(detail.pricePerHour)}đ</strong></div>
                                <div className="d-row"><span>Ngày đăng ký:</span><strong>{detail.submittedDate}</strong></div>
                                <div className="d-row"><span>Trạng thái:</span><span className={`admin-badge ${detail.status}`}>{STATUS_LABEL[detail.status]}</span></div>
                            </div>
                            {rejectId === detail.id && detail.status === 'pending' && (
                                <div className="reject-section">
                                    <label>Lý do từ chối *</label>
                                    <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="VD: Ảnh địa điểm chưa đủ tiêu chuẩn..." />
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            {detail.status === 'pending' && rejectId !== detail.id && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(detail.id)}>🔴 Từ chối</button>
                                    <button className="btn btn-admin-primary" onClick={() => approve(detail.id)}>✅ Phê duyệt</button>
                                </>
                            )}
                            {detail.status === 'pending' && rejectId === detail.id && (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setRejectId(null)}>← Quay lại</button>
                                    <button className="btn btn-danger" onClick={() => reject(detail.id)} disabled={!rejectNote.trim()}>Gửi từ chối</button>
                                </>
                            )}
                            {detail.status !== 'pending' && <button className="btn btn-ghost" onClick={() => setDetailId(null)}>Đóng</button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVenuePage;
