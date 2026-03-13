import React, { useState, useEffect } from 'react';
import { adminApi, type Workshop } from '../../services/api';
import './AdminPage.css';

const STATUS_LABEL: Record<string, string> = {
  PENDING_APPROVAL: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  DRAFT: 'Bản nháp' // Có thể có
};

const FILTERS: { key: string; label: string }[] = [
  { key: 'PENDING_APPROVAL', label: 'Chờ duyệt' },
  { key: 'APPROVED', label: 'Đã duyệt' },
  { key: 'REJECTED', label: 'Từ chối' },
];

const AdminWorkshopPage: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filter, setFilter] = useState<string>('PENDING_APPROVAL');
  const [detailId, setDetailId] = useState<string | number | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectId, setRejectId] = useState<string | number | null>(null);
  const [search, setSearch] = useState('');

  // Phân trang
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorkshops = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getWorkshops(filter, page, 10);
      setWorkshops(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (error) {
      console.error('Lỗi khi tải danh sách workshop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, [filter, page]);

  const filtered = workshops.filter(w => {
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) ||
      (w.host?.fullName || '').toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const detail = workshops.find(w => (w.workshopId || w.id) === detailId);

  const approve = async (id: string | number) => {
    try {
      await adminApi.approveWorkshop(id);
      fetchWorkshops(); // re-fetch
      setDetailId(null);
    } catch (e) {
      alert("Đã xảy ra lỗi khi phê duyệt.");
    }
  };

  const reject = async (id: string | number) => {
    try {
      await adminApi.rejectWorkshop(id, rejectNote);
      fetchWorkshops(); // re-fetch
      setRejectId(null); setDetailId(null); setRejectNote('');
    } catch (e) {
      alert("Đã xảy ra lỗi khi từ chối.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kiểm duyệt Workshop</h1>
          <p className="admin-page-subtitle">Xem xét và phê duyệt các workshop từ Host.</p>
        </div>
        <div className="admin-pending-badge">{workshops.filter(w => w.status === 'PENDING_APPROVAL').length} chờ duyệt</div>
      </div>

      {/* Tabs + Search */}
      <div className="admin-toolbar">
        <div className="admin-tabs">
          {FILTERS.map(f => (
            <button key={f.key} className={`admin-tab ${filter === f.key ? 'active' : ''}`} onClick={() => { setFilter(f.key); setPage(0); }}>
              {f.label}
            </button>
          ))}
        </div>
        <input className="admin-search" placeholder="Tìm workshop, host…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table2">
            <thead>
              <tr><th>Tên Workshop</th><th>Host</th><th>Danh mục</th><th>Giá</th><th>Ngày nộp</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Không có workshop nào trong danh sách.</td></tr>
              ) : (
                filtered.map(w => {
                  const viewId = w.workshopId || w.id;
                  const st = w.status || 'DRAFT';
                  return (
                    <tr key={viewId}>
                      <td className="td-title">{w.title}</td>
                      <td className="td-muted">{w.host?.fullName || 'N/A'}</td>
                      <td><span className="admin-chip">{w.category}</span></td>
                      <td className="td-amount">{new Intl.NumberFormat('vi').format(w.price || 0)}đ</td>
                      <td className="td-muted">{new Date(w.date || Date.now()).toLocaleDateString('vi-VN')}</td>
                      <td><span className={`admin-badge ${(st).toLowerCase()}`}>{STATUS_LABEL[st] || st}</span></td>
                      <td>
                        <div className="action-row">
                          <button className="adm-btn info" onClick={() => { setDetailId(viewId!); setRejectId(null); }}>Xem</button>
                          {w.status === 'PENDING_APPROVAL' && <>
                            <button className="adm-btn approve" onClick={() => approve(viewId!)}>Duyệt</button>
                            <button className="adm-btn reject" onClick={() => { setDetailId(viewId!); setRejectId(viewId!); }}>Từ chối</button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  )
                }
                ))}
            </tbody>
          </table>

          {/* Phân trang */}
          {!isLoading && totalPages > 1 && (
            <div className="admin-pagination">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>Trang trước</button>
              <span>{page + 1} / {totalPages}</span>
              <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>Trang sau</button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="admin-modal-overlay" onClick={() => { setDetailId(null); setRejectId(null); }}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Chi tiết Workshop</h3>
              <button className="modal-close" onClick={() => { setDetailId(null); setRejectId(null); }}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="detail-grid2">
                <div className="d-row"><span>Tên:</span><strong>{detail.title}</strong></div>
                <div className="d-row"><span>Host:</span><strong>{detail.host?.fullName}</strong></div>
                <div className="d-row"><span>Danh mục:</span><strong>{detail.category}</strong></div>
                <div className="d-row"><span>Giá:</span><strong>{new Intl.NumberFormat('vi').format(detail.price)}đ</strong></div>
                <div className="d-row"><span>Số chỗ:</span><strong>{detail.maxSeats} người</strong></div>
                <div className="d-row"><span>Ngày:</span><strong>{new Date(detail.date || Date.now()).toLocaleDateString()}</strong></div>
                <div className="d-row"><span>Giờ:</span><strong>{detail.time}</strong></div>
                <div className="d-row"><span>Khu vực:</span><strong>{detail.area || detail.city}</strong></div>
                <div className="d-row"><span>Trạng thái:</span><span className={`admin-badge ${(detail.status || 'DRAFT').toLowerCase()}`}>{STATUS_LABEL[detail.status || 'DRAFT'] || detail.status}</span></div>
              </div>

              {rejectId === (detail.workshopId || detail.id) && detail.status === 'PENDING_APPROVAL' && (
                <div className="reject-section">
                  <label>Lý do từ chối *</label>
                  <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Nêu rõ lý do để host chỉnh sửa lại..." />
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              {detail.status === 'PENDING_APPROVAL' && rejectId !== (detail.workshopId || detail.id) && (
                <>
                  <button className="btn btn-ghost" onClick={() => setRejectId(detail.workshopId || detail.id!)}>Từ chối</button>
                  <button className="btn btn-admin-primary" onClick={() => approve(detail.workshopId || detail.id!)}>Phê duyệt</button>
                </>
              )}
              {detail.status === 'PENDING_APPROVAL' && rejectId === (detail.workshopId || detail.id) && (
                <>
                  <button className="btn btn-ghost" onClick={() => setRejectId(null)}>Quay lại</button>
                  <button className="btn btn-danger" onClick={() => reject(detail.workshopId || detail.id!)} disabled={!rejectNote.trim()}>Gửi từ chối</button>
                </>
              )}
              {detail.status !== 'PENDING_APPROVAL' && <button className="btn btn-ghost" onClick={() => setDetailId(null)}>Đóng</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkshopPage;