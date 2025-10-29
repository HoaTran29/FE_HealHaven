import React from 'react'
import './AdminTables.css' // Tái sử dụng CSS

// Dữ liệu giả
const allUsers = [
  { id: 'u1', name: 'Trần Lê Khánh Hòa', email: 'hoatran@email.com', role: 'Học viên', status: 'Active' },
  { id: 'u2', name: 'Trần Văn A', email: 'vana@email.com', role: 'Nghệ nhân', status: 'Active' },
  { id: 'u3', name: 'Lê Thị B', email: 'thib@email.com', role: 'Nghệ nhân', status: 'Active' },
  { id: 'u4', name: 'Nguyễn Văn F', email: 'vanf@email.com', role: 'Học viên', status: 'Banned' },
];

// Hàm helper để lấy class cho vai trò
const getRoleClass = (role: string) => {
  if (role === 'Học viên') return 'status-student';
  if (role === 'Nghệ nhân') return 'status-artisan';
  return '';
}

const AdminUserPage: React.FC = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Quản lý Người dùng</h1>
        <button className="btn btn-primary">Thêm Admin mới</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`status-badge ${getRoleClass(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-banned'}`}>
                  {user.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-action btn-edit">Sửa</button>
                  {user.status === 'Active' ? (
                    <button className="btn-action btn-ban">Khóa</button>
                  ) : (
                    <button className="btn-action btn-approve">Mở</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUserPage