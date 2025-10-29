import React from 'react'
// Import các component của Recharts
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import './AdminDashboardPage.css' // CSS riêng

// Dữ liệu giả cho biểu đồ doanh thu
const revenueData = [
  { name: 'Tháng 1', DoanhThu: 4000 },
  { name: 'Tháng 2', DoanhThu: 3000 },
  { name: 'Tháng 3', DoanhThu: 2000 },
  { name: 'Tháng 4', DoanhThu: 2780 },
  { name: 'Tháng 5', DoanhThu: 1890 },
  { name: 'Tháng 6', DoanhThu: 2390 },
  { name: 'Tháng 7', DoanhThu: 3490 },
];

// Dữ liệu giả cho biểu đồ tròn (Workshop)
const workshopData = [
  { name: 'Đan len', value: 400 },
  { name: 'Vẽ màu nước', value: 300 },
  { name: 'Kẽm nhung', value: 300 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28']; // Màu của Recharts

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="admin-dashboard-page">
      <h1>Admin Dashboard</h1>
      
      {/* === Lưới Thẻ KPI === */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Tổng Doanh thu</h4>
          <p>120.500.000 VNĐ</p>
        </div>
        <div className="kpi-card">
          <h4>Workshop Chờ duyệt</h4>
          <p>3</p>
        </div>
        <div className="kpi-card">
          <h4>Học viên mới (Tháng)</h4>
          <p>150</p>
        </div>
        <div className="kpi-card">
          <h4>Tổng Nghệ nhân</h4>
          <p>25</p>
        </div>
      </div>
      
      {/* === Lưới Biểu đồ === */}
      <div className="charts-grid">
        {/* Biểu đồ Doanh thu (Area Chart) */}
        <div className="chart-card">
          <h3>Thống kê Doanh thu (7 tháng)</h3>
          {/* ResponsiveContainer giúp biểu đồ co giãn */}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="DoanhThu" stroke="#007E9F" fill="#d8f6f6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Biểu đồ Tỷ lệ Workshop (Pie Chart) */}
        <div className="chart-card">
          <h3>Tỷ lệ Khóa học</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workshopData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
              >
                {workshopData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage