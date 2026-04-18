import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { workshopApi, financialApi, bookingApi, type Workshop, type FinancialStats } from '../../services/api';
import './HostPage.css';

const HostDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [finStats, setFinStats] = useState<FinancialStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [hostName, setHostName] = useState('');
    const [totalBookings, setTotalBookings] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [wsRes, statRes] = await Promise.all([
                    workshopApi.getMyWorkshops().catch(() => []),
                    financialApi.getStats().catch(() => null)
                ]);
                
                const wList = Array.isArray(wsRes) ? wsRes : (wsRes as any).content || [];
                setWorkshops(wList);
                if (statRes) setFinStats(statRes);

                // Rút trích tên chính xác của Host từ workshop (vì user.name đôi khi fallback về email)
                const exactName = wList.find((w: any) => w.host?.fullName)?.host?.fullName;
                setHostName(exactName || user?.name || 'nhà sáng tạo');

                // Lấy đơn hàng từ tất cả các workshop của host
                if (wList.length > 0) {
                    const bookingPromises = wList.map((w: any) => bookingApi.getByWorkshop(String(w.id || w.workshopId)).catch(() => []));
                    const bookingsArrays = await Promise.all(bookingPromises);
                    // Lọc mảng hợp lệ, gom lại
                    const allBookings = bookingsArrays
                        .filter(arr => Array.isArray(arr))
                        .flat();
                    
                    setTotalBookings(allBookings.length);
                    // Lấy 5 đơn mới nhất
                    setRecentOrders(allBookings
                        .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                        .slice(0, 5)
                    );
                }
            } catch (err) {
                console.error("Lỗi tải dashboard host:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const openingWorkshops = workshops.filter(w => w.status !== 'CANCELLED' && w.status !== 'COMPLETED');
    const upcomingWorkshops = [...openingWorkshops].sort((a, b) => {
        const dA = new Date(a.startTime || a.startDate || 0).getTime();
        const dB = new Date(b.startTime || b.startDate || 0).getTime();
        return dA - dB;
    }).slice(0, 5);

    const fmtVND = (val?: number) => {
        if (!val) return '0đ';
        return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
    };

    const stats = [
        { icon: '🎨', label: 'Workshop đang mở', value: openingWorkshops.length.toString(), color: '#007BA2' },
        { icon: '👥', label: 'Tổng đăng ký', value: totalBookings.toString(), color: '#16a34a' },
        { icon: '💰', label: 'Doanh thu', value: fmtVND(finStats?.totalRevenue), color: '#d97706' },
        { icon: '⭐', label: 'Đánh giá trung bình', value: '4.8', color: '#7c3aed' }, // Hardcode temporarily as review API is missing avg rating
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return { cls: 'confirmed', label: '🌟 Đang mở' };
            case 'HAPPENING': return { cls: 'confirmed', label: '🔥 Đang diễn ra' };
            case 'PENDING_APPROVAL': return { cls: 'pending', label: '⏳ Chờ duyệt' };
            case 'REJECTED': return { cls: 'cancelled', label: '❌ Bị từ chối' };
            case 'CLOSED': return { cls: 'cancelled', label: '🔒 Đã đóng' };
            default: return { cls: 'pending', label: '📋 Nháp' };
        }
    };

    return (
        <div className="host-page">
            {/* Header */}
            <div className="host-page-header">
                <div>
                    <h1 className="host-page-title">Dashboard</h1>
                    <p className="host-page-subtitle">Xin chào {hostName}! Đây là tổng quan hoạt động của bạn.</p>
                </div>
                <Link to="/host/workshops?create=true" className="btn btn-primary">+ Tạo Workshop mới</Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div className="stat-card" key={i} style={{ '--stat-color': s.color } as React.CSSProperties}>
                        <div className="stat-icon">{s.icon}</div>
                        <div>
                            <div className="stat-value">{isLoading ? '...' : s.value}</div>
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
                        <h3>Workshop của bạn</h3>
                        <Link to="/host/workshops" className="host-card-link">Xem tất cả →</Link>
                    </div>
                    <div className="table-wrap">
                        <table className="host-table">
                            <thead>
                                <tr>
                                    <th>Tên Workshop</th>
                                    <th>Trạng thái</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? <tr><td colSpan={3}>Đang tải...</td></tr> : 
                                upcomingWorkshops.length === 0 ? <tr><td colSpan={3}>Bạn chưa có workshop nào đang mở.</td></tr> :
                                upcomingWorkshops.map((w: any) => (
                                    <tr key={w.id || w.workshopId}>
                                        <td className="td-title">{w.title}</td>
                                        <td>
                                            <span className={`badge-status ${getStatusBadge(w.status).cls}`}>
                                                {getStatusBadge(w.status).label}
                                            </span>
                                        </td>
                                        <td className="td-amount">{fmtVND(w.price)}</td>
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
                        <Link to="/host/finance" className="host-card-link">Chi tiết tài chính →</Link>
                    </div>
                    <div className="table-wrap">
                        <table className="host-table">
                            <thead>
                                <tr><th>Mã đơn</th><th>Khách</th><th>Số tiền</th><th>Ngày</th></tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={4}>Đang tải đơn hàng...</td></tr>
                                ) : recentOrders.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b' }}>Chưa có đơn hàng mới nào gần đây.</td></tr>
                                ) : (
                                    recentOrders.map((o: any) => (
                                        <tr key={o.id || Math.random()}>
                                            <td className="td-code">#{o.id || o.bookingId || '...'}</td>
                                            <td>{o.fullName || o.userName || o.user?.fullName || 'Khách hàng'}</td>
                                            <td className="td-amount">{fmtVND(o.totalPrice || o.amount)}</td>
                                            <td className="td-muted">{o.date || o.createdAt?.slice(0, 10)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HostDashboardPage;
