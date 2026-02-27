import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Bar, Legend
} from 'recharts';

import { Link } from 'react-router-dom';
import './AdminPage.css';

const revenueData = [
  { month: 'T9/25', revenue: 42000000, users: 38 },
  { month: 'T10/25', revenue: 68000000, users: 55 },
  { month: 'T11/25', revenue: 55000000, users: 47 },
  { month: 'T12/25', revenue: 91000000, users: 82 },
  { month: 'T1/26', revenue: 76000000, users: 63 },
  { month: 'T2/26', revenue: 120500000, users: 104 },
];

const workshopCatData = [
  { name: 'Thủ công', value: 38 },
  { name: 'Hội họa', value: 24 },
  { name: 'Ẩm thực', value: 18 },
  { name: 'Gốm sứ', value: 12 },
  { name: 'Khác', value: 8 },
];
const PIE_COLORS = ['#007BA2', '#00b4d8', '#00c9a7', '#fbbf24', '#a78bfa'];

const recentActivities = [
  { icon: '📋', msg: 'Workshop "Đan len" vừa được duyệt', time: '5p trước' },
  { icon: '👤', msg: 'Host "Lê Thị C" đăng ký mới', time: '12p trước' },
  { icon: '💰', msg: 'Yêu cầu rút 8.000.000đ từ Trần A', time: '30p trước' },
  { icon: '📍', msg: 'Địa điểm "Studio Xanh" chờ duyệt', time: '1h trước' },
  { icon: '🔴', msg: 'User "Nguyen F" bị báo cáo vi phạm', time: '2h trước' },
];

const fmtM = (v: number) => (v / 1000000).toFixed(1) + 'M';

const AdminDashboardPage: React.FC = () => (
  <div className="admin-page">
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">Admin Dashboard</h1>
        <p className="admin-page-subtitle">Tổng quan hệ thống Heal Haven.</p>
      </div>
    </div>

    {/* KPI Cards */}
    <div className="admin-kpi-grid">
      {[
        { icon: '💰', label: 'Doanh thu tháng', value: '120.500.000đ', sub: '+58% so với T1', color: '#16a34a' },
        { icon: '👥', label: 'Tổng người dùng', value: '1.284', sub: '+104 tháng này', color: '#007BA2' },
        { icon: '🎨', label: 'Workshop đang chờ', value: '7', sub: 'Cần phê duyệt', color: '#d97706' },
        { icon: '🏠', label: 'Địa điểm đăng ký', value: '23', sub: '3 chờ kiểm duyệt', color: '#7c3aed' },
        { icon: '💳', label: 'Lệnh rút chờ xử lý', value: '5', sub: '28.400.000đ', color: '#dc3545' },
        { icon: '⭐', label: 'Đánh giá trung bình', value: '4.7', sub: 'Trên toàn nền tảng', color: '#f59e0b' },
      ].map((k, i) => (
        <div className="admin-kpi-card" key={i} style={{ '--kc': k.color } as React.CSSProperties}>
          <div className="kpi-icon">{k.icon}</div>
          <div className="kpi-body">
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Charts row */}
    <div className="admin-charts-grid">
      <div className="admin-card">
        <h3 className="admin-card-title">📊 Doanh thu & Người dùng 6 tháng</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BA2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#007BA2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5f3f3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="rev" tickFormatter={fmtM} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="usr" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number, name: string) => name === 'Doanh thu' ? fmtM(v) + 'đ' : v} />
            <Legend />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#007BA2" fill="url(#revGrad)" strokeWidth={2} />
            <Bar yAxisId="usr" dataKey="users" name="Người dùng mới" fill="#00c9a7" radius={[4, 4, 0, 0]} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">🥧 Phân loại Workshop</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={workshopCatData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
              label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {workshopCatData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Bottom row */}
    <div className="admin-bottom-grid">
      {/* Pending items quick links */}
      <div className="admin-card">
        <h3 className="admin-card-title">⚡ Cần xử lý ngay</h3>
        <div className="quick-actions">
          <Link to="/admin/workshops" className="quick-action-row workshops">
            <span className="qa-icon">🎨</span>
            <span className="qa-text">7 Workshop chờ phê duyệt</span>
            <span className="qa-arrow">→</span>
          </Link>
          <Link to="/admin/venues" className="quick-action-row venues">
            <span className="qa-icon">🏠</span>
            <span className="qa-text">3 Địa điểm chờ kiểm duyệt</span>
            <span className="qa-arrow">→</span>
          </Link>
          <Link to="/admin/finance" className="quick-action-row finance">
            <span className="qa-icon">💳</span>
            <span className="qa-text">5 Lệnh rút tiền chờ xử lý</span>
            <span className="qa-arrow">→</span>
          </Link>
          <Link to="/admin/users" className="quick-action-row users">
            <span className="qa-icon">🔴</span>
            <span className="qa-text">2 Báo cáo người dùng vi phạm</span>
            <span className="qa-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* Activity feed */}
      <div className="admin-card">
        <h3 className="admin-card-title">🕐 Hoạt động gần đây</h3>
        <ul className="activity-list">
          {recentActivities.map((a, i) => (
            <li key={i} className="activity-item">
              <span className="activity-icon">{a.icon}</span>
              <span className="activity-msg">{a.msg}</span>
              <span className="activity-time">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default AdminDashboardPage;