import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { financialApi, type FinancialStats } from '../../services/api';
import './VenuePage.css';

const DEFAULT_MONTHLY_DATA = [
    { month: 'T9/25', revenue: 2800000 },
    { month: 'T10/25', revenue: 4200000 },
    { month: 'T11/25', revenue: 5100000 },
    { month: 'T12/25', revenue: 8600000 },
    { month: 'T1/26', revenue: 7200000 },
    { month: 'T2/26', revenue: 14200000 },
];

const spaceData = [
    { name: 'Studio A', revenue: 8400000, bookings: 21 },
    { name: 'Studio B', revenue: 3960000, bookings: 11 },
    { name: 'Sân vườn', revenue: 1840000, bookings: 5 },
];

const txns = [
    { id: '#V-001', desc: 'Thanh toán đặt Studio A - Trần Minh A', amount: 600000, date: '26/02/2026' },
    { id: '#V-002', desc: 'Thanh toán đặt Studio B - Lê Thu B', amount: 360000, date: '25/02/2026' },
    { id: '#V-003', desc: 'Rút tiền về tài khoản', amount: -8000000, date: '20/02/2026' },
    { id: '#V-004', desc: 'Thanh toán đặt Studio A - Khánh D', amount: 400000, date: '18/02/2026' },
];

const fmtMoney = (n: number) => new Intl.NumberFormat('vi').format(Math.abs(n)) + 'đ';

const VenueFinancePage: React.FC = () => {
    const [stats, setStats] = useState<FinancialStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [form, setForm] = useState({ amount: '', bank: '', account: '' });
    const [done, setDone] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        financialApi.getStats()
            .then(res => setStats(res))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const submit = () => {
        if (!form.amount || !form.bank || !form.account) return;
        setDone(true);
        setTimeout(() => {
            setWithdrawModal(false);
            setDone(false);
            setForm({ amount: '', bank: '', account: '' });
        }, 2500);
    };

    return (
        <div className="venue-page">
            <div className="venue-page-header">
                <div>
                    <h1 className="venue-page-title">Doanh thu</h1>
                    <p className="venue-page-subtitle">Thống kê thu nhập từ các không gian cho thuê.</p>
                </div>
                <button className="btn btn-venue" onClick={() => setWithdrawModal(true)}>💳 Rút tiền</button>
            </div>

            {/* Stats */}
            {isLoading ? <p>Đang tải dữ liệu tài chính...</p> : (
                <div className="venue-stats-grid">
                    {[
                        { icon: '💰', label: 'Doanh thu', value: fmtMoney(stats?.totalRevenue || 14200000), color: '#16a34a' },
                        { icon: '💳', label: 'Khả dụng để rút', value: fmtMoney(stats?.profit || 9840000), color: '#4f46e5' },
                        { icon: '⏳', label: 'Đang chờ xử lý', value: '4.360.000đ', color: '#d97706' },
                        { icon: '📊', label: 'Số dư ước tính', value: fmtMoney(stats?.totalRevenue || 42100000), color: '#7c3aed' },
                    ].map((s, i) => (
                        <div className="venue-stat-card" key={i} style={{ '--vc': s.color } as React.CSSProperties}>
                            <div className="venue-stat-icon">{s.icon}</div>
                            <div><div className="venue-stat-value">{s.value}</div><div className="venue-stat-label">{s.label}</div></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Charts */}
            <div className="venue-dashboard-grid">
                <div className="venue-card">
                    <h3 className="venue-chart-title">📊 Doanh thu 6 tháng</h3>
                    <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={stats?.monthlyData || DEFAULT_MONTHLY_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={v => (v / 1000000).toFixed(1) + 'M'} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v: number) => fmtMoney(v)} />
                            <Bar dataKey="revenue" name="Doanh thu" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="venue-card">
                    <h3 className="venue-chart-title">🏠 Phân bổ doanh thu</h3>
                    <div className="space-revenue-list">
                        {spaceData.map((s, i) => (
                            <div key={i} className="space-rev-row">
                                <div className="space-rev-name">{s.name}</div>
                                <div className="space-rev-bar-wrap">
                                    <div className="space-rev-bar" style={{ width: `${(s.revenue / 10000000) * 100}%` }} />
                                </div>
                                <div className="space-rev-amount">{fmtMoney(s.revenue)}</div>
                                <div className="space-rev-count">{s.bookings} booking</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="venue-card">
                <h3 className="venue-chart-title">Lịch sử thanh toán</h3>
                <div className="table-wrap">
                    <table className="venue-table">
                        <thead><tr><th>Lịch trình</th><th>Mô tả</th><th>Số tiền</th><th>Loại</th></tr></thead>
                        <tbody>
                            {txns.map((t, i) => (
                                <tr key={i}>
                                    <td className="td-muted">{t.date}</td>
                                    <td>{t.desc}</td>
                                    <td className={t.amount < 0 ? 'td-debit' : 'td-amount'}>
                                        {t.amount < 0 ? '-' : '+'}{fmtMoney(t.amount)}
                                    </td>
                                    <td>{t.amount > 0 ? 'Thanh toán' : 'Rút tiền'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdraw modal */}
            {withdrawModal && (
                <div className="venue-modal-overlay" onClick={() => setWithdrawModal(false)}>
                    <div className="venue-modal" onClick={e => e.stopPropagation()}>
                        <div className="venue-modal-header">
                            <h3>💳 Rút tiền</h3>
                            <button className="modal-close" onClick={() => setWithdrawModal(false)}>✕</button>
                        </div>
                        {!done ? (
                            <>
                                <div className="venue-modal-body">
                                    <div className="balance-info-v">
                                        <span>Số dư khả dụng:</span>
                                        <strong className="available-v">{fmtMoney(stats?.profit || 9840000)}</strong>
                                    </div>
                                    <div className="form-group2">
                                        <label>Số tiền rút (đ) *</label>
                                        <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="VD: 5000000" />
                                    </div>
                                    <div className="form-group2">
                                        <label>Ngân hàng *</label>
                                        <select value={form.bank} onChange={e => setForm(f => ({ ...f, bank: e.target.value }))}>
                                            <option value="">-- Chọn ngân hàng --</option>
                                            {['Vietcombank', 'Techcombank', 'BIDV', 'MBBank', 'TPBank'].map(b => <option key={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group2">
                                        <label>Số tài khoản *</label>
                                        <input value={form.account} onChange={e => setForm(f => ({ ...f, account: e.target.value }))} placeholder="VD: 0123456789" />
                                    </div>
                                </div>
                                <div className="venue-modal-footer">
                                    <button className="btn btn-ghost" onClick={() => setWithdrawModal(false)}>Hủy</button>
                                    <button className="btn btn-venue" onClick={submit}>Gửi yêu cầu</button>
                                </div>
                            </>
                        ) : (
                            <div className="venue-modal-body success-msg-v">
                                <div style={{ fontSize: '3rem' }}>✅</div>
                                <h3>Đã gửi yêu cầu!</h3>
                                <p>Tiền sẽ được chuyển trong 1-3 ngày làm việc.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenueFinancePage;
