import React, { useState } from 'react';
import './AdminPage.css';

type UserRole = 'attendee' | 'host' | 'venue' | 'admin';
type UserStatus = 'active' | 'banned';

interface AdminUser {
  id: string; name: string; email: string; role: UserRole;
  status: UserStatus; joinDate: string; orders: number;
}

const INIT_USERS: AdminUser[] = [
  { id: 'u001', name: 'Trần Lê Khánh Hòa', email: 'hoatran@gmail.com', role: 'attendee', status: 'active', joinDate: '15/01/2026', orders: 5 },
  { id: 'u002', name: 'Lê Thị Minh', email: 'minh@gmail.com', role: 'host', status: 'active', joinDate: '10/12/2025', orders: 0 },
  { id: 'u003', name: 'Nguyễn Văn Bảo', email: 'bao@gmail.com', role: 'host', status: 'active', joinDate: '05/11/2025', orders: 0 },
  { id: 'u004', name: 'Phạm Thị Lan', email: 'lan@gmail.com', role: 'venue', status: 'active', joinDate: '20/10/2025', orders: 0 },
  { id: 'u005', name: 'Trần Văn Dũng', email: 'dung@gmail.com', role: 'attendee', status: 'banned', joinDate: '03/09/2025', orders: 2 },
  { id: 'u006', name: 'Hồ Ngọc Anh', email: 'ngocanh@gmail.com', role: 'attendee', status: 'active', joinDate: '28/01/2026', orders: 3 },
  { id: 'u007', name: 'Yuki Tanaka', email: 'yuki@gmail.com', role: 'host', status: 'active', joinDate: '22/01/2026', orders: 0 },
];

const ROLE_LABEL: Record<UserRole, string> = { attendee: 'Attendee', host: 'Host', venue: 'Venue', admin: 'Admin' };
const ROLE_COLOR: Record<UserRole, string> = { attendee: 'role-attendee', host: 'role-host', venue: 'role-venue', admin: 'role-admin' };

const AdminUserPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(INIT_USERS);
  const [filter, setFilter] = useState<UserRole | 'all'>('all');
  const [search, setSearch] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = users.filter(u => {
    const mf = filter === 'all' || u.role === filter;
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const toggleBan = (id: string) => setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
  const changeRole = (id: string, role: UserRole) => setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));

  const detail = users.find(u => u.id === detailId);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý Người dùng</h1>
          <p className="admin-page-subtitle">Xem, phân quyền và khóa tài khoản người dùng.</p>
        </div>
        <div className="admin-pending-badge">{users.filter(u => u.status === 'banned').length} bị khóa</div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-tabs">
          {(['all', 'attendee', 'host', 'venue', 'admin'] as const).map(f => (
            <button key={f} className={`admin-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tất cả' : ROLE_LABEL[f as UserRole]}
              <span className="tab-cnt">{f === 'all' ? users.length : users.filter(u => u.role === f).length}</span>
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
              {filtered.map(u => (
                <tr key={u.id} className={u.status === 'banned' ? 'row-banned' : ''}>
                  <td className="td-title">{u.name}</td>
                  <td className="td-muted">{u.email}</td>
                  <td><span className={`admin-badge ${ROLE_COLOR[u.role]}`}>{ROLE_LABEL[u.role]}</span></td>
                  <td className="td-muted">{u.joinDate}</td>
                  <td>{u.orders}</td>
                  <td><span className={`admin-badge ${u.status === 'active' ? 'approved' : 'rejected'}`}>{u.status === 'active' ? '✅ Active' : '🔴 Banned'}</span></td>
                  <td>
                    <div className="action-row">
                      <button className="adm-btn info" onClick={() => setDetailId(u.id)}>👁️</button>
                      <button className={`adm-btn ${u.status === 'active' ? 'reject' : 'approve'}`} onClick={() => toggleBan(u.id)}>
                        {u.status === 'active' ? '🔒' : '🔓'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="admin-empty">Không có người dùng nào.</div>}
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="admin-modal-overlay" onClick={() => setDetailId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Chi tiết: {detail.name}</h3>
              <button className="modal-close" onClick={() => setDetailId(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="detail-grid2">
                <div className="d-row"><span>Email:</span><strong>{detail.email}</strong></div>
                <div className="d-row"><span>Vai trò:</span><span className={`admin-badge ${ROLE_COLOR[detail.role]}`}>{ROLE_LABEL[detail.role]}</span></div>
                <div className="d-row"><span>Tham gia:</span><strong>{detail.joinDate}</strong></div>
                <div className="d-row"><span>Đơn hàng:</span><strong>{detail.orders}</strong></div>
                <div className="d-row"><span>Trạng thái:</span><span className={`admin-badge ${detail.status === 'active' ? 'approved' : 'rejected'}`}>{detail.status === 'active' ? '✅ Active' : '🔴 Banned'}</span></div>
              </div>
              <div className="form-group2" style={{ marginTop: '1rem' }}>
                <label>Thay đổi vai trò:</label>
                <select value={detail.role} onChange={e => changeRole(detail.id, e.target.value as UserRole)}>
                  <option value="attendee">Attendee</option>
                  <option value="host">Host</option>
                  <option value="venue">Venue</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className={`btn ${detail.status === 'active' ? 'btn-danger' : 'btn-admin-primary'}`} onClick={() => { toggleBan(detail.id); setDetailId(null); }}>
                {detail.status === 'active' ? '🔒 Khóa tài khoản' : '🔓 Mở khóa'}
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