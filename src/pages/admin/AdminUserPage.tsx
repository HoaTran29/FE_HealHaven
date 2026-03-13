import React, { useState, useEffect } from 'react';
import { adminApi, type AdminUser } from '../../services/api';
import './AdminPage.css';

const ROLE_LABEL: Record<string, string> = { ATTENDEE: 'Attendee', HOST: 'Host', PROVIDER: 'Venue', ADMIN: 'Admin' };
const ROLE_COLOR: Record<string, string> = { ATTENDEE: 'role-attendee', HOST: 'role-host', PROVIDER: 'role-venue', ADMIN: 'role-admin' };

const FILTERS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'ATTENDEE', label: 'Attendee' },
  { key: 'HOST', label: 'Host' },
  { key: 'PROVIDER', label: 'Venue' },
  { key: 'ADMIN', label: 'Admin' },
];

const AdminUserPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [detailId, setDetailId] = useState<number | null>(null);

  // Phân trang
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const roleParam = filter === 'ALL' ? undefined : filter;
      const res = await adminApi.getUsers(roleParam, page, 10);
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (error) {
      console.error('Lỗi khi tải người dùng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, page]);

  const filtered = users.filter(u => {
    const ms = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return ms;
  });

  const toggleBan = async (id: number, currentBannedState: boolean) => {
    if (!window.confirm(`Bạn có chắc muốn ${currentBannedState ? 'mở khóa' : 'khóa'} người dùng này không?`)) return;
    try {
      await adminApi.updateUserStatus(id, currentBannedState ? 'ACTIVE' : 'INACTIVE');
      fetchUsers();
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật trạng thái người dùng.");
    }
  };

  const changeRole = async (id: number, newRole: 'ATTENDEE' | 'HOST' | 'PROVIDER' | 'ADMIN') => {
    if (!window.confirm(`Xác nhận đổi quyền thành ${newRole}?`)) return;
    try {
      await adminApi.updateUserRole(id, newRole);
      fetchUsers();
      setDetailId(null);
    } catch (error) {
      alert("Có lỗi xảy ra khi phân quyền.");
    }
  };

  const detail = users.find(u => u.userId === detailId);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý Người dùng</h1>
          <p className="admin-page-subtitle">Xem, phân quyền và khóa tài khoản người dùng.</p>
        </div>
        <div className="admin-pending-badge">{users.filter(u => u.isBanned).length} bị khóa</div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-tabs">
          {FILTERS.map(f => (
            <button key={f.key} className={`admin-tab ${filter === f.key ? 'active' : ''}`} onClick={() => { setFilter(f.key); setPage(0); }}>
              {f.label}
            </button>
          ))}
        </div>
        <input className="admin-search" placeholder="Tìm tên, email…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table2">
            <thead>
              <tr><th>Tên</th><th>Email</th><th>Vai trò</th><th>Tham gia</th><th>Đơn hàng</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Không tìm thấy người dùng.</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.userId} className={u.isBanned ? 'row-banned' : ''}>
                    <td className="td-title">{u.fullName}</td>
                    <td className="td-muted">{u.email}</td>
                    <td><span className={`admin-badge ${ROLE_COLOR[u.role] || 'role-attendee'}`}>{ROLE_LABEL[u.role] || u.role}</span></td>
                    <td className="td-muted">{new Date(u.createdAt || Date.now()).toLocaleDateString('vi-VN')}</td>
                    <td>-</td>
                    <td><span className={`admin-badge ${!u.isBanned ? 'approved' : 'rejected'}`}>{!u.isBanned ? 'Active' : 'Banned'}</span></td>
                    <td>
                      <div className="action-row">
                        <button className="adm-btn info" onClick={() => setDetailId(u.userId)}>Xem</button>
                        <button className={`adm-btn ${!u.isBanned ? 'reject' : 'approve'}`} onClick={() => toggleBan(u.userId, u.isBanned)}>
                          {!u.isBanned ? 'Khóa' : 'Mở'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="admin-pagination">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>Trang trước</button>
              <span>{page + 1} / {totalPages}</span>
              <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>Trang sau</button>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="admin-modal-overlay" onClick={() => setDetailId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Chi tiết: {detail.fullName}</h3>
              <button className="modal-close" onClick={() => setDetailId(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="detail-grid2">
                <div className="d-row"><span>Email:</span><strong>{detail.email}</strong></div>
                <div className="d-row"><span>Vai trò:</span><span className={`admin-badge ${ROLE_COLOR[detail.role] || 'role-attendee'}`}>{ROLE_LABEL[detail.role] || detail.role}</span></div>
                <div className="d-row"><span>Ngày tham gia:</span><strong>{new Date(detail.createdAt || Date.now()).toLocaleDateString('vi-VN')}</strong></div>
                <div className="d-row"><span>Số ĐT:</span><strong>{detail.phoneNumber || 'Chưa cập nhật'}</strong></div>
                <div className="d-row"><span>Trạng thái:</span><span className={`admin-badge ${!detail.isBanned ? 'approved' : 'rejected'}`}>{!detail.isBanned ? 'Active' : 'Banned'}</span></div>
              </div>
              <div className="form-group2" style={{ marginTop: '1rem' }}>
                <label>Thay đổi vai trò:</label>
                <select value={detail.role} onChange={e => changeRole(detail.userId, e.target.value as any)}>
                  <option value="ATTENDEE">Attendee</option>
                  <option value="HOST">Host</option>
                  <option value="PROVIDER">Venue</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className={`btn ${!detail.isBanned ? 'btn-danger' : 'btn-admin-primary'}`} onClick={() => { toggleBan(detail.userId, detail.isBanned); setDetailId(null); }}>
                {!detail.isBanned ? 'Khóa tài khoản' : 'Mở khóa'}
              </button>
              <button className="btn btn-ghost" onClick={() => setDetailId(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserPage;