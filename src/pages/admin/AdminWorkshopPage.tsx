import React from 'react'
import './AdminTables.css' // Import CSS chung

// Dữ liệu giả
const pendingWorkshops = [
  { id: 'ws101', title: 'Workshop Đan móc cho người mới', artisan: 'Lê Thị C', submittedDate: '2025-10-30', status: 'Pending' },
  { id: 'ws102', title: 'Làm gốm căn bản tại nhà', artisan: 'Nguyễn Văn D', submittedDate: '2025-10-29', status: 'Pending' },
  { id: 'ws103', title: 'Nghệ thuật thêu nổi', artisan: 'Trần Thị E', submittedDate: '2025-10-28', status: 'Pending' },
];

const AdminWorkshopPage: React.FC = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Duyệt Workshop</h1>
        {/* (Có thể thêm nút lọc ở đây) */}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Workshop</th>
            <th>Nghệ nhân</th>
            <th>Ngày nộp</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pendingWorkshops.map((ws) => (
            <tr key={ws.id}>
              <td>{ws.id}</td>
              <td>{ws.title}</td>
              <td>{ws.artisan}</td>
              <td>{ws.submittedDate}</td>
              <td>
                <span className="status-badge status-pending">{ws.status}</span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-action btn-approve">Duyệt</button>
                  <button className="btn-action btn-reject">Từ chối</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminWorkshopPage