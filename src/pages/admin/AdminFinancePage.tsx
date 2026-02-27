import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminPage.css';

type WdStatus = 'pending' | 'approved' | 'rejected';

interface Withdrawal {
    id: string; user: string; role: string; bank: string;
    account: string; amount: number; requestDate: string; status: WdStatus;
}

const INIT_WD: Withdrawal[] = [
    { id: 'WD-001', user: 'Lê Thị Minh', role: 'Host', bank: 'Vietcombank', account: '012345678', amount: 8750000, requestDate: '27/02/2026', status: 'pending' },
    { id: 'WD-002', user: 'Nguyễn Văn Bảo', role: 'Host', bank: 'Techcombank', account: '987654321', amount: 5200000, requestDate: '26/02/2026', status: 'pending' },
    { id: 'WD-003', user: 'Phạm Thị Lan', role: 'Venue', bank: 'BIDV', account: '112233445', amount: 9840000, requestDate: '25/02/2026', status: 'pending' },
    { id: 'WD-004', user: 'Yuki Tanaka', role: 'Host', bank: 'MBBank', account: '554433221', amount: 4100000, requestDate: '24/02/2026', status: 'pending' },
    { id: 'WD-005', user: 'Trần Minh H', role: 'Venue', bank: 'TPBank', account: '667788990', amount: 3200000, requestDate: '20/02/2026', status: 'approved' },
    { id: 'WD-006', user: 'Hà Lan', role: 'Host', bank: 'Vietcombank', account: '223344556', amount: 6600000, requestDate: '15/02/2026', status: 'approved' },
];

const monthlyData = [
    { month: 'T9/25', host: 32000000, venue: 10000000 },
    { month: 'T10/25', host: 52000000, venue: 16000000 },
    { month: 'T11/25', host: 41000000, venue: 14000000 },
    { month: 'T12/25', host: 68000000, venue: 23000000 },
    { month: 'T1/26', host: 56000000, venue: 20000000 },
    { month: 'T2/26', host: 88000000, venue: 32500000 },
];

const STATUS_LABEL: Record<WdStatus, string> = { pending: '⏳ Chờ xử lý', approved: '✅ Đã chuyển', rejected: '🔴 Từ chối' };
const fmtM = (v: number) => new Intl.NumberFormat('vi').format(v) + 'đ';

const AdminFinancePage: React.FC = () => {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(INIT_WD);
    const [filter, setFilter] = useState<WdStatus | 'all'>('pending');
    const [detailId, setDetailId] = useState<string | null>(null);

    const filtered = filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter);
    const detail = withdrawals.find(w => w.id === detailId);
    const pendingTotal = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);

    const approve = (id: string) => { setWithdrawals(ws => ws.map(w => w.id === id ? { ...w, status: 'approved' } : w)); setDetailId(null); };
    const reject = (id: string) => { setWithdrawals(ws => ws.map(w => w.id === id ? { ...w, status: 'rejected' } : w)); setDetailId(null); };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Đối soát Tài chính</h1>
                    <p className="admin-page-subtitle">Quản lý doanh thu và xử lý lệnh rút tiền.</p>
                </div>
                <div className="admin-pending-badge">
                    {withdrawals.filter(w => w.status === 'pending').length} lệnh · {fmtM(pendingTotal)}
                </div>
            </div>

            {/* Summary stats */}
            <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {[
                    { icon: '💰', label: 'Tổng giao dịch T2', value: '120.500.000đ', color: '#16a34a' },
                    { icon: '🏪', label: 'Phí nền tảng (10%)', value: '12.050.000đ', color: '#007BA2' },
                    { icon: '⏳', label: 'Đang chờ rút', value: fmtM(pendingTotal), color: '#d97706' },
                    { icon: '✅', label: 'Đã xử lý tháng này', value: '15.800.000đ', color: '#7c3aed' },
                ].map((s, i) => (
                    <div className="admin-kpi-card" key={i} style={{ '--kc': s.color } as React.CSSProperties}>
                        <div className="kpi-icon">{s.icon}</div>
                        <div className="kpi-body">
                            <div className="kpi-value">{s.value}</div>
                            <div className="kpi-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="admin-card">
                <h3 className="admin-card-title">📊 Doanh thu Host & Venue 6 tháng</h3>
                <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef7f7" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={v => (v / 1000000).toFixed(0) + 'M'} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => fmtM(v)} />
                        <Bar dataKey="host" name="Host" fill="#007BA2" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="venue" name="Venue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Withdrawal table */}
            <div className="admin-toolbar">
                <div className="admin-tabs">
                    {(['pending', 'approved', 'all'] as const).map(f => (
                        <button key={f} className={`admin-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'Tất cả' : STATUS_LABEL[f as WdStatus]}
                            <span className="tab-cnt">{f === 'all' ? withdrawals.length : withdrawals.filter(w => w.status === f).length}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-card">
                <div className="table-wrap">
                    <table className="admin-table2">
                        <thead>
                            <tr><th>Mã</th><th>Người yêu cầu</th><th>Vai trò</th><th>Ngân hàng</th><th>Số tiền</th><th>Ngày yêu cầu</th><th>Trạng thái</th><th>Hành động</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(w => (
                                <tr key={w.id}>
                                    <td><code className="admin-code">{w.id}</code></td>
                                    <td className="td-title">{w.user}</td>
                                    <td><span className={`admin-badge ${w.role === 'Host' ? 'role-host' : 'role-venue'}`}>{w.role}</span></td>
                                    <td className="td-muted">{w.bank} · {w.account.slice(-4).padStart(w.account.length, '•')}</td>
                                    <td className="td-amount">{fmtM(w.amount)}</td>
                                    <td className="td-muted">{w.requestDate}</td>
                                    <td><span className={`admin-badge ${w.status}`}>{STATUS_LABEL[w.status]}</span></td>
                                    <td>
                                        <div className="action-row">
                                            <button className="adm-btn info" onClick={() => setDetailId(w.id)}>👁️</button>
                                            {w.status === 'pending' && <>
                                                <button className="adm-btn approve" onClick={() => approve(w.id)} title="Xác nhận đã chuyển">✅</button>
                                                <button className="adm-btn reject" onClick={() => reject(w.id)} title="Từ chối">🔴</button>
                                            </>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {detail && (
                <div className="admin-modal-overlay" onClick={() => setDetailId(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Lệnh rút: {detail.id}</h3>
                            <button className="modal-close" onClick={() => setDetailId(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="detail-grid2">
                                <div className="d-row"><span>Người yêu cầu:</span><strong>{detail.user}</strong></div>
                                <div className="d-row"><span>Vai trò:</span><span className={`admin-badge ${detail.role === 'Host' ? 'role-host' : 'role-venue'}`}>{detail.role}</span></div>
                                <div className="d-row"><span>Ngân hàng:</span><strong>{detail.bank}</strong></div>
                                <div className="d-row"><span>Số tài khoản:</span><strong>{detail.account}</strong></div>
                                <div className="d-row"><span>Số tiền:</span><strong className="td-amount">{fmtM(detail.amount)}</strong></div>
                                <div className="d-row"><span>Ngày yêu cầu:</span><strong>{detail.requestDate}</strong></div>
                                <div className="d-row"><span>Trạng thái:</span><span className={`admin-badge ${detail.status}`}>{STATUS_LABEL[detail.status]}</span></div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            {detail.status === 'pending' ? (
                                <>
                                    <button className="btn btn-danger" onClick={() => reject(detail.id)}>🔴 Từ chối</button>
                                    <button className="btn btn-admin-primary" onClick={() => approve(detail.id)}>✅ Xác nhận đã chuyển</button>
                                </>
                            ) : (
                                <button className="btn btn-ghost" onClick={() => setDetailId(null)}>Đóng</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinancePage;
