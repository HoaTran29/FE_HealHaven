import React from 'react';
import { Link } from 'react-router-dom';
import './VenuePage.css';

const stats = [
    { icon: '🏠', label: 'Không gian đang cho thuê', value: '3', color: '#4f46e5' },
    { icon: '📋', label: 'Đơn chờ phê duyệt', value: '4', color: '#d97706' },
    { icon: '✅', label: 'Đơn đã xác nhận (tháng)', value: '18', color: '#16a34a' },
    { icon: '💰', label: 'Doanh thu tháng này', value: '14.200.000đ', color: '#7c3aed' },
];

const pendingBookings = [
    { id: 'BK-001', host: 'Trần Minh A', space: 'Studio A', date: '15/03/2026', hours: 3, total: '600.000đ', status: 'pending' },
    { id: 'BK-002', host: 'Lê Thu B', space: 'Studio B', date: '18/03/2026', hours: 2, total: '360.000đ', status: 'pending' },
    { id: 'BK-003', host: 'Nguyễn C', space: 'Sân vườn', date: '20/03/2026', hours: 4, total: '480.000đ', status: 'pending' },
];

const recentBookings = [
    { id: 'BK-004', host: 'Khánh D', space: 'Studio A', date: '10/03/2026', total: '400.000đ', status: 'confirmed' },
    { id: 'BK-005', host: 'Minh E', space: 'Studio B', date: '08/03/2026', total: '360.000đ', status: 'confirmed' },
    { id: 'BK-006', host: 'Hoa F', space: 'Studio A', date: '05/03/2026', total: '600.000đ', status: 'cancelled' },
];

const STATUS_LABEL: Record<string, string> = {
    pending: '⏳ Chờ duyệt', confirmed: '✅ Đã xác nhận', cancelled: '🔴 Đã từ chối',
};

const VenueDashboardPage: React.FC = () => (
    <div className="venue-page">
        <div className="venue-page-header">
            <div>
                <h1 className="venue-page-title">Dashboard</h1>
                <p className="venue-page-subtitle">Tổng quan hoạt động địa điểm của bạn.</p>
            </div>
            <Link to="/venue/spaces" className="btn btn-venue">+ Thêm không gian</Link>
        </div>

        <div className="venue-stats-grid">
            {stats.map((s, i) => (
                <div className="venue-stat-card" key={i} style={{ '--vc': s.color } as React.CSSProperties}>
                    <div className="venue-stat-icon">{s.icon}</div>
                    <div>
                        <div className="venue-stat-value">{s.value}</div>
                        <div className="venue-stat-label">{s.label}</div>
                    </div>
                </div>
            ))}
        </div>

        <div className="venue-dashboard-grid">
            {/* Pending */}
            <section className="venue-card">
                <div className="venue-card-header">
                    <h3>⏳ Đơn chờ phê duyệt ({pendingBookings.length})</h3>
                    <Link to="/venue/bookings" className="venue-card-link">Xem tất cả →</Link>
                </div>
                <div className="table-wrap">
                    <table className="venue-table">
                        <thead><tr><th>Mã</th><th>Host</th><th>Không gian</th><th>Ngày</th><th>Tổng</th></tr></thead>
                        <tbody>
                            {pendingBookings.map(b => (
                                <tr key={b.id}>
                                    <td><code className="venue-code">{b.id}</code></td>
                                    <td className="td-title">{b.host}</td>
                                    <td className="td-muted">{b.space}</td>
                                    <td className="td-muted">{b.date} · {b.hours}h</td>
                                    <td className="td-amount">{b.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Recent */}
            <section className="venue-card">
                <div className="venue-card-header">
                    <h3>📋 Đơn gần đây</h3>
                    <Link to="/venue/bookings" className="venue-card-link">Chi tiết →</Link>
                </div>
                <div className="table-wrap">
                    <table className="venue-table">
                        <thead><tr><th>Mã</th><th>Host</th><th>Ngày</th><th>Tổng</th><th>TT</th></tr></thead>
                        <tbody>
                            {recentBookings.map(b => (
                                <tr key={b.id}>
                                    <td><code className="venue-code">{b.id}</code></td>
                                    <td className="td-title">{b.host}</td>
                                    <td className="td-muted">{b.date}</td>
                                    <td className="td-amount">{b.total}</td>
                                    <td><span className={`venue-badge ${b.status}`}>{STATUS_LABEL[b.status]}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
);

export default VenueDashboardPage;
