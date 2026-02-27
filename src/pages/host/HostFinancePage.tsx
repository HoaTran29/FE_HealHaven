import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import './HostPage.css';

const monthlyData = [
    { month: 'T9/25', revenue: 3200000, orders: 8 },
    { month: 'T10/25', revenue: 5100000, orders: 13 },
    { month: 'T11/25', revenue: 4800000, orders: 12 },
    { month: 'T12/25', revenue: 7600000, orders: 19 },
    { month: 'T1/26', revenue: 6900000, orders: 17 },
    { month: 'T2/26', revenue: 12400000, orders: 31 },
];

const transactions = [
    { id: '#TXN-001', type: 'credit', desc: 'Đăng ký - Workshop Đan len cơ bản', amount: 399000, date: '26/02/2026' },
    { id: '#TXN-002', type: 'credit', desc: 'Đăng ký - Vẽ màu nước: Thiên nhiên', amount: 599000, date: '25/02/2026' },
    { id: '#TXN-003', type: 'debit', desc: 'Rút tiền về tài khoản ngân hàng', amount: -5000000, date: '20/02/2026' },
    { id: '#TXN-004', type: 'credit', desc: 'Đăng ký - Hoa Kẽm nhung nghệ thuật', amount: 450000, date: '19/02/2026' },
    { id: '#TXN-005', type: 'credit', desc: 'Đăng ký - Workshop Đan len cơ bản', amount: 399000, date: '18/02/2026' },
];

const fmtMoney = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.abs(n)) + 'đ';

const HostFinancePage: React.FC = () => {
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [withdrawForm, setWithdrawForm] = useState({ amount: '', bank: '', account: '', name: '' });
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);

    const handleWithdraw = () => {
        if (!withdrawForm.amount || !withdrawForm.bank || !withdrawForm.account) return;
        setWithdrawSuccess(true);
        setTimeout(() => { setWithdrawModal(false); setWithdrawSuccess(false); setWithdrawForm({ amount: '', bank: '', account: '', name: '' }); }, 2500);
    };

    return (
        <div className="host-page">
            <div className="host-page-header">
                <div>
                    <h1 className="host-page-title">Tài chính</h1>
                    <p className="host-page-subtitle">Doanh thu và quản lý thu chi của bạn.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setWithdrawModal(true)}>💳 Rút tiền</button>
            </div>

            {/* Balance cards */}
            <div className="stats-grid">
                <div className="stat-card" style={{ '--stat-color': '#16a34a' } as React.CSSProperties}>
                    <div className="stat-icon">💰</div>
                    <div>
                        <div className="stat-value">12.400.000đ</div>
                        <div className="stat-label">Doanh thu tháng này</div>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#007BA2' } as React.CSSProperties}>
                    <div className="stat-icon">💳</div>
                    <div>
                        <div className="stat-value">8.750.000đ</div>
                        <div className="stat-label">Khả dụng để rút</div>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#d97706' } as React.CSSProperties}>
                    <div className="stat-icon">⏳</div>
                    <div>
                        <div className="stat-value">3.650.000đ</div>
                        <div className="stat-label">Đang chờ thanh toán</div>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#7c3aed' } as React.CSSProperties}>
                    <div className="stat-icon">📊</div>
                    <div>
                        <div className="stat-value">40.000.000đ</div>
                        <div className="stat-label">Tổng doanh thu (6 tháng)</div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="dashboard-grid">
                <div className="host-card">
                    <h3 className="chart-title">📊 Doanh thu 6 tháng gần đây</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5f3f3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={v => (v / 1000000).toFixed(1) + 'M'} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v: number) => fmtMoney(v)} />
                            <Bar dataKey="revenue" name="Doanh thu" fill="#007BA2" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="host-card">
                    <h3 className="chart-title">📈 Số đơn hàng theo tháng</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5f3f3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="orders" name="Đơn hàng" stroke="#00c9a7" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transactions */}
            <div className="host-card">
                <div className="host-card-header">
                    <h3>Lịch sử giao dịch</h3>
                </div>
                <div className="table-wrap">
                    <table className="host-table">
                        <thead>
                            <tr><th>Mã GD</th><th>Mô tả</th><th>Số tiền</th><th>Ngày</th></tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td><code className="ticket-code">{t.id}</code></td>
                                    <td>{t.desc}</td>
                                    <td className={t.type === 'credit' ? 'td-amount' : 'td-debit'}>
                                        {t.type === 'credit' ? '+' : '-'}{fmtMoney(t.amount)}
                                    </td>
                                    <td className="td-muted">{t.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdraw modal */}
            {withdrawModal && (
                <div className="host-modal-overlay" onClick={() => setWithdrawModal(false)}>
                    <div className="host-modal" onClick={e => e.stopPropagation()}>
                        <div className="host-modal-header">
                            <h3>💳 Rút tiền</h3>
                            <button className="modal-close" onClick={() => setWithdrawModal(false)}>✕</button>
                        </div>
                        {!withdrawSuccess ? (
                            <>
                                <div className="host-modal-body">
                                    <div className="balance-info">
                                        <span>Số dư khả dụng:</span>
                                        <strong className="balance-available">8.750.000đ</strong>
                                    </div>
                                    <div className="form-group">
                                        <label>Số tiền rút (đ) *</label>
                                        <input type="number" value={withdrawForm.amount} onChange={e => setWithdrawForm(f => ({ ...f, amount: e.target.value }))} placeholder="VD: 5000000" />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngân hàng *</label>
                                        <select value={withdrawForm.bank} onChange={e => setWithdrawForm(f => ({ ...f, bank: e.target.value }))}>
                                            <option value="">-- Chọn ngân hàng --</option>
                                            {['Vietcombank', 'Techcombank', 'BIDV', 'Agribank', 'MBBank', 'TPBank', 'VPBank'].map(b => <option key={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Số tài khoản *</label>
                                            <input value={withdrawForm.account} onChange={e => setWithdrawForm(f => ({ ...f, account: e.target.value }))} placeholder="VD: 0123456789" />
                                        </div>
                                        <div className="form-group">
                                            <label>Tên chủ tài khoản</label>
                                            <input value={withdrawForm.name} onChange={e => setWithdrawForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: NGUYEN VAN A" />
                                        </div>
                                    </div>
                                    <p className="withdraw-note">⚠️ Thời gian xử lý: 1-3 ngày làm việc. Phí rút tiền: 0đ.</p>
                                </div>
                                <div className="host-modal-footer">
                                    <button className="btn btn-ghost" onClick={() => setWithdrawModal(false)}>Hủy</button>
                                    <button className="btn btn-primary" onClick={handleWithdraw}>💳 Gửi yêu cầu rút tiền</button>
                                </div>
                            </>
                        ) : (
                            <div className="host-modal-body success-msg">
                                <div style={{ fontSize: '3rem' }}>✅</div>
                                <h3>Yêu cầu đã gửi!</h3>
                                <p>Tiền sẽ được chuyển trong 1-3 ngày làm việc.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostFinancePage;
