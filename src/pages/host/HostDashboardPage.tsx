import React from 'react';
import { Link } from 'react-router-dom';
import './HostPage.css';

// --- Mock data ---
const stats = [
    { icon: '🎨', label: 'Workshop đang mở', value: '5', color: '#007BA2' },
    { icon: '👥', label: 'Tổng đăng ký', value: '127', color: '#16a34a' },
    { icon: '💰', label: 'Doanh thu tháng', value: '12.400.000đ', color: '#d97706' },
    { icon: '⭐', label: 'Đánh giá trung bình', value: '4.8', color: '#7c3aed' },
];

const upcomingWorkshops = [
    { id: 1, title: 'Workshop Đan len cơ bản', date: '15/03/2026', time: '09:00', seats: '5/10', status: 'confirmed' },
    { id: 2, title: 'Vẽ màu nước: Thiên nhiên', date: '20/03/2026', time: '14:00', seats: '3/8', status: 'pending' },
    { id: 3, title: 'Hoa Kẽm nhung nghệ thuật', date: '25/03/2026', time: '10:00', seats: '8/12', status: 'confirmed' },
];

const recentOrders = [
    { id: '#ORD-001', buyer: 'Khánh Hòa', workshop: 'Workshop Đan len cơ bản', amount: '399.000đ', date: '26/02' },
    { id: '#ORD-002', buyer: 'Minh Anh', workshop: 'Vẽ màu nước: Thiên nhiên', amount: '599.000đ', date: '25/02' },
    { id: '#ORD-003', buyer: 'Gia Bảo', workshop: 'Hoa Kẽm nhung nghệ thuật', amount: '450.000đ', date: '24/02' },
    { id: '#ORD-004', buyer: 'An Nhiên', workshop: 'Workshop Đan len cơ bản', amount: '399.000đ', date: '23/02' },
];

const HostDashboardPage: React.FC = () => {
    return (
        <div className="host-page">
            {/* Header */}
            <div className="host-page-header">
                <div>
                    <h1 className="host-page-title">Dashboard</h1>
                    <p className="host-page-subtitle">Xin chào! Đây là tổng quan hoạt động của bạn.</p>
                </div>
                <Link to="/host/workshops" className="btn btn-primary">+ Tạo Workshop mới</Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div className="stat-card" key={i} style={{ '--stat-color': s.color } as React.CSSProperties}>
                        <div className="stat-icon">{s.icon}</div>
                        <div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two columns */}
            <div className="dashboard-grid">
                {/* Upcoming workshops */}
                <section className="host-card">
                    <div className="host-card-header">
                        <h3>Workshop sắp diễn ra</h3>
                        <Link to="/host/workshops" className="host-card-link">Xem tất cả →</Link>
                    </div>
                    <div className="table-wrap">
                        <table className="host-table">
                            <thead>
                                <tr>
                                    <th>Tên Workshop</th>
                                    <th>Ngày</th>
                                    <th>Chỗ</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingWorkshops.map(w => (
                                    <tr key={w.id}>
                                        <td className="td-title">{w.title}</td>
                                        <td className="td-muted">{w.date} {w.time}</td>
                                        <td>{w.seats}</td>
                                        <td>
                                            <span className={`badge-status ${w.status}`}>
                                                {w.status === 'confirmed' ? '✅ Xác nhận' : '⏳ Chờ'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Recent orders */}
                <section className="host-card">
                    <div className="host-card-header">
                        <h3>Đơn hàng gần đây</h3>
                        <Link to="/host/finance" className="host-card-link">Chi tiết →</Link>
                    </div>
                    <div className="table-wrap">
                        <table className="host-table">
                            <thead>
                                <tr><th>Mã đơn</th><th>Khách</th><th>Số tiền</th><th>Ngày</th></tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(o => (
                                    <tr key={o.id}>
                                        <td className="td-code">{o.id}</td>
                                        <td>{o.buyer}</td>
                                        <td className="td-amount">{o.amount}</td>
                                        <td className="td-muted">{o.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HostDashboardPage;
