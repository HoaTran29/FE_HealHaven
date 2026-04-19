import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts';
import { TrendingUp, Users, Clock, MapPin } from 'lucide-react';

import { adminApi, type AdminStatsOverview, type AdminRevenueData } from '../../services/api';
import './AdminPage.css';



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
      <div className="admin-card">
        <h3 className="admin-card-title">Doanh thu hệ thống {new Date().getFullYear()}</h3>
        <ResponsiveContainer width="100%" height={240}>
          {isLoading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Đang tải biểu đồ...</div> : (
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f5" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="rev" tickFormatter={fmtM} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number, name: string) => name === 'Doanh thu' ? fmtVND(v) : v} />
              <Area yAxisId="rev" type="monotone" dataKey="value" name="Doanh thu" stroke="#007BA2" fill="#e8f4f8" strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardPage;