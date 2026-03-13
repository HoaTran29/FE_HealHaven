import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Bar, Legend
} from 'recharts';
import { TrendingUp, Users, Clock, MapPin, CreditCard, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi, type AdminStatsOverview, type AdminRevenueData } from '../../services/api';
import './AdminPage.css';

const workshopCatData = [
  { name: 'Thủ công', value: 38 },
  { name: 'Hội họa', value: 24 },
  { name: 'Ẩm thực', value: 18 },
  { name: 'Gốm sứ', value: 12 },
  { name: 'Khác', value: 8 },
];
const PIE_COLORS = ['#007BA2', '#2d9cdb', '#27ae60', '#f2994a', '#9b51e0'];

const recentActivities = [
  { msg: 'Workshop "Đan len" vừa được duyệt', time: '5p trước', type: 'approve' },
  { msg: 'Host "Lê Thị C" đăng ký mới', time: '12p trước', type: 'user' },
  { msg: 'Yêu cầu rút 8.000.000đ từ Trần A', time: '30p trước', type: 'finance' },
  { msg: 'Địa điểm "Studio Xanh" chờ duyệt', time: '1h trước', type: 'venue' },
  { msg: 'User "Nguyen F" bị báo cáo vi phạm', time: '2h trước', type: 'report' },
];

const fmtM = (v: number) => (v / 1000000).toFixed(1) + 'M';
const fmtVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsOverview | null>(null);
  const [chartData, setChartData] = useState<AdminRevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [overview, chart] = await Promise.all([
          adminApi.getStatsOverview(),
          adminApi.getRevenueChart('monthly', new Date().getFullYear())
        ]);
        setStats(overview);
        setChartData(chart);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Admin Dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const KPI_ITEMS = stats ? [
    { Icon: TrendingUp, label: 'Doanh thu ròng', value: fmtVND(stats.netRevenue), sub: 'Ví hệ thống', color: '#16a34a' },
    { Icon: Users, label: 'Tổng người dùng', value: stats.totalUsers.toString(), sub: 'Toàn hệ thống', color: '#007BA2' },
    { Icon: Clock, label: 'Tổng Workshop', value: stats.totalWorkshops.toString(), sub: 'Tất cả trạng thái', color: '#d97706' },
    { Icon: MapPin, label: 'Tổng địa điểm', value: stats.totalVenues.toString(), sub: 'Các không gian', color: '#7c3aed' },
  ] : [
    { Icon: TrendingUp, label: 'Doanh thu ròng', value: '...', sub: 'Đang tải', color: '#16a34a' },
    { Icon: Users, label: 'Tổng người dùng', value: '...', sub: 'Đang tải', color: '#007BA2' },
    { Icon: Clock, label: 'Tổng Workshop', value: '...', sub: 'Đang tải', color: '#d97706' },
    { Icon: MapPin, label: 'Tổng địa điểm', value: '...', sub: 'Đang tải', color: '#7c3aed' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Dashboard</h1>
          <p className="admin-page-subtitle">Tổng quan hệ thống Heal Haven.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        {KPI_ITEMS.map(({ Icon, label, value, sub, color }, i) => (
          <div className="admin-kpi-card" key={i} style={{ '--kc': color } as React.CSSProperties}>
            <div className="kpi-icon-wrap" style={{ color }}>
              <Icon size={22} strokeWidth={1.8} />
            </div>
            <div className="kpi-body">
              <div className="kpi-value">{value}</div>
              <div className="kpi-label">{label}</div>
              <div className="kpi-sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="admin-charts-grid">
        <div className="admin-card">
          <h3 className="admin-card-title">Doanh thu hệ thống {new Date().getFullYear()}</h3>
          <ResponsiveContainer width="100%" height={240}>
            {isLoading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Đang tải biểu đồ...</div> : (
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f5" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="rev" tickFormatter={fmtM} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number, name: string) => name === 'Doanh thu' ? fmtVND(v) : v} />
                <Legend />
                <Area yAxisId="rev" type="monotone" dataKey="value" name="Doanh thu" stroke="#007BA2" fill="#e8f4f8" strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title">Phân loại Workshop</h3>
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
        <div className="admin-card">
          <h3 className="admin-card-title">Cần xử lý ngay</h3>
          <div className="quick-actions">
            <Link to="/admin/workshops" className="quick-action-row workshops">
              <span className="qa-text">Workshop chờ phê duyệt</span>
              <span className="qa-count">7</span>
            </Link>
            <Link to="/admin/venues" className="quick-action-row venues">
              <span className="qa-text">Địa điểm chờ kiểm duyệt</span>
              <span className="qa-count">3</span>
            </Link>
            <Link to="/admin/finance" className="quick-action-row finance">
              <span className="qa-text">Lệnh rút tiền chờ xử lý</span>
              <span className="qa-count">5</span>
            </Link>
            <Link to="/admin/users" className="quick-action-row users">
              <span className="qa-text">Báo cáo người dùng vi phạm</span>
              <span className="qa-count">2</span>
            </Link>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title">Hoạt động gần đây</h3>
          <ul className="activity-list">
            {recentActivities.map((a, i) => (
              <li key={i} className={`activity-item activity-${a.type}`}>
                <div className="activity-dot" />
                <span className="activity-msg">{a.msg}</span>
                <span className="activity-time">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;