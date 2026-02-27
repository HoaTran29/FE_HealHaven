import React, { useState } from 'react';
import './AdminPage.css';

type WsStatus = 'pending' | 'approved' | 'rejected';

interface Workshop {
  id: string; title: string; host: string; category: string;
  submittedDate: string; price: number; seats: number; status: WsStatus;
}

const INIT: Workshop[] = [
  { id: 'ws101', title: 'Workshop Đan móc cho người mới', host: 'Lê Thị C', category: 'Thủ công', submittedDate: '28/02/2026', price: 350000, seats: 10, status: 'pending' },
  { id: 'ws102', title: 'Làm gốm căn bản tại nhà', host: 'Nguyễn Văn D', category: 'Gốm sứ', submittedDate: '27/02/2026', price: 500000, seats: 8, status: 'pending' },
  { id: 'ws103', title: 'Nghệ thuật thêu nổi', host: 'Trần Thị E', category: 'Thủ công', submittedDate: '26/02/2026', price: 420000, seats: 12, status: 'pending' },
  { id: 'ws104', title: 'Vẽ màu nước cho trẻ em', host: 'Phạm Minh G', category: 'Hội họa', submittedDate: '25/02/2026', price: 299000, seats: 15, status: 'pending' },
  { id: 'ws105', title: 'làm Hoa len macramé', host: 'Hà Lan', category: 'Thủ công', submittedDate: '27/02/2026', price: 380000, seats: 8, status: 'approved' },
  { id: 'ws106', title: 'Ẩm thực Nhật Bản cơ bản', host: 'Yuki Tanaka', category: 'Ẩm thực', submittedDate: '26/02/2026', price: 650000, seats: 6, status: 'rejected' },
];

const STATUS_LABEL: Record<WsStatus, string> = { pending: '⏳ Chờ duyệt', approved: '✅ Đã duyệt', rejected: '🔴 Từ chối' };
const FILTERS: { key: WsStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tất cả' }, { key: 'pending', label: '⏳ Chờ duyệt' },
  { key: 'approved', label: '✅ Đã duyệt' }, { key: 'rejected', label: '🔴 Từ chối' },
];

const AdminWorkshopPage: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>(INIT);
  const [filter, setFilter] = useState<WsStatus | 'all'>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = workshops.filter(w => {
    const matchFilter = filter === 'all' || w.status === filter;
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) || w.host.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const detail = workshops.find(w => w.id === detailId);
  const approve = (id: string) => { setWorkshops(ws => ws.map(w => w.id === id ? { ...w, status: 'approved' } : w)); setDetailId(null); };
  const reject = (id: string) => { setWorkshops(ws => ws.map(w => w.id === id ? { ...w, status: 'rejected' } : w)); setRejectId(null); setDetailId(null); setRejectNote(''); };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kiểm duyệt Workshop</h1>
          <p className="admin-page-subtitle">Xem xét và phê duyệt các workshop từ Host.</p>
        </div>
        <div className="admin-pending-badge">{workshops.filter(w => w.status === 'pending').length} chờ duyệt</div>
      </div>

      {/* Tabs + Search */}
      <div className="admin-toolbar">
        <div className="admin-tabs">
          {FILTERS.map(f => (
            <button key={f.key} className={`admin-tab ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label} <span className="tab-cnt">{f.key === 'all' ? workshops.length : workshops.filter(w => w.status === f.key).length}</span>
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
              {filtered.map(w => (
                <tr key={w.id}>
                  <td className="td-title">{w.title}</td>
                  <td className="td-muted">{w.host}</td>
                  <td><span className="admin-chip">{w.category}</span></td>
                  <td className="td-amount">{new Intl.NumberFormat('vi').format(w.price)}đ</td>
                  <td className="td-muted">{w.submittedDate}</td>
                  <td><span className={`admin-badge ${w.status}`}>{STATUS_LABEL[w.status]}</span></td>
                  <td>
                    <div className="action-row">
                      <button className="adm-btn info" onClick={() => { setDetailId(w.id); setRejectId(null); }}>👁️</button>
                      {w.status === 'pending' && <>
                        <button className="adm-btn approve" onClick={() => approve(w.id)}>✅</button>
                        <button className="adm-btn reject" onClick={() => { setDetailId(w.id); setRejectId(w.id); }}>🔴</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="admin-empty">Không có workshop nào.</div>}
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
                <div className="d-row"><span>Host:</span><strong>{detail.host}</strong></div>
                <div className="d-row"><span>Danh mục:</span><strong>{detail.category}</strong></div>
                <div className="d-row"><span>Giá:</span><strong>{new Intl.NumberFormat('vi').format(detail.price)}đ</strong></div>
                <div className="d-row"><span>Số chỗ:</span><strong>{detail.seats} người</strong></div>
                <div className="d-row"><span>Ngày nộp:</span><strong>{detail.submittedDate}</strong></div>
                <div className="d-row"><span>Trạng thái:</span><span className={`admin-badge ${detail.status}`}>{STATUS_LABEL[detail.status]}</span></div>
              </div>

              {rejectId === detail.id && detail.status === 'pending' && (
                <div className="reject-section">
                  <label>Lý do từ chối *</label>
                  <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Nêu rõ lý do để host chỉnh sửa lại..." />
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

export default AdminWorkshopPage;