import React, { useState } from 'react';
import './HostPage.css';

// Mock data
const WORKSHOPS = [
    { id: 1, title: 'Workshop Đan len cơ bản' },
    { id: 2, title: 'Vẽ màu nước: Thiên nhiên' },
];

const ATTENDEES = [
    { id: 1, name: 'Khánh Hòa', email: 'khanh@gmail.com', ticketId: 'TK-001', checkedIn: false, seat: 1 },
    { id: 2, name: 'Minh Anh', email: 'minh@gmail.com', ticketId: 'TK-002', checkedIn: true, seat: 2 },
    { id: 3, name: 'Gia Bảo', email: 'bao@gmail.com', ticketId: 'TK-003', checkedIn: false, seat: 3 },
    { id: 4, name: 'An Nhiên', email: 'annhien@gmail.com', ticketId: 'TK-004', checkedIn: true, seat: 4 },
    { id: 5, name: 'Tuấn Kiệt', email: 'tuan@gmail.com', ticketId: 'TK-005', checkedIn: false, seat: 5 },
];

const HostAttendeePage: React.FC = () => {
    const [selectedWs, setSelectedWs] = useState<number>(1);
    const [attendees, setAttendees] = useState(ATTENDEES);
    const [scanMode, setScanMode] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [scanResult, setScanResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [search, setSearch] = useState('');

    const filtered = attendees.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.ticketId.toLowerCase().includes(search.toLowerCase())
    );

    const checkedCount = attendees.filter(a => a.checkedIn).length;

    const checkIn = (ticketId: string) => {
        const attendee = attendees.find(a => a.ticketId === ticketId.toUpperCase());
        if (!attendee) {
            setScanResult({ type: 'error', msg: `❌ Không tìm thấy vé "${ticketId}"` });
            return;
        }
        if (attendee.checkedIn) {
            setScanResult({ type: 'error', msg: `⚠️ Vé ${ticketId} đã được check-in rồi!` });
            return;
        }
        setAttendees(prev => prev.map(a => a.ticketId === attendee.ticketId ? { ...a, checkedIn: true } : a));
        setScanResult({ type: 'success', msg: `✅ Check-in thành công: ${attendee.name}` });
        setManualCode('');
        setTimeout(() => setScanResult(null), 3000);
    };

    const toggleCheckIn = (id: number) => {
        setAttendees(prev => prev.map(a => a.id === id ? { ...a, checkedIn: !a.checkedIn } : a));
    };

    return (
        <div className="host-page">
            <div className="host-page-header">
                <div>
                    <h1 className="host-page-title">Quản lý Attendee</h1>
                    <p className="host-page-subtitle">Xem danh sách và check-in người tham dự.</p>
                </div>
                <button className={`btn ${scanMode ? 'btn-ghost' : 'btn-primary'}`} onClick={() => { setScanMode(!scanMode); setScanResult(null); }}>
                    {scanMode ? '← Đóng Check-in' : '📷 Mở Check-in QR'}
                </button>
            </div>

            {/* Workshop selector */}
            <div className="host-card" style={{ marginBottom: '1.25rem' }}>
                <div className="form-row" style={{ alignItems: 'center', gap: '1rem', marginBottom: 0 }}>
                    <label style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Workshop:</label>
                    <select className="form-select" value={selectedWs} onChange={e => setSelectedWs(Number(e.target.value))}>
                        {WORKSHOPS.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
                    </select>
                    <div className="attendee-stat-mini">
                        <span className="check-count">{checkedCount}/{attendees.length}</span>
                        <span className="check-label">đã check-in</span>
                    </div>
                </div>
            </div>

            {/* QR check-in panel */}
            {scanMode && (
                <div className="host-card checkin-panel">
                    <h3>🎟️ Check-in QR</h3>
                    <div className="qr-camera-placeholder">
                        <div className="qr-box">
                            <div className="qr-corner tl" /><div className="qr-corner tr" />
                            <div className="qr-corner bl" /><div className="qr-corner br" />
                            <div className="qr-scan-line" />
                            <p>Camera QR đang phát triển</p>
                            <small>(dùng mã thủ công bên dưới)</small>
                        </div>
                    </div>

                    <div className="manual-checkin">
                        <p className="manual-label">Nhập mã vé thủ công:</p>
                        <div className="manual-input-row">
                            <input
                                className="manual-input"
                                value={manualCode}
                                onChange={e => setManualCode(e.target.value.toUpperCase())}
                                onKeyDown={e => { if (e.key === 'Enter') checkIn(manualCode); }}
                                placeholder="VD: TK-001"
                            />
                            <button className="btn btn-primary" onClick={() => checkIn(manualCode)}>Check-in</button>
                        </div>
                        {scanResult && (
                            <div className={`scan-result ${scanResult.type}`}>{scanResult.msg}</div>
                        )}
                    </div>
                </div>
            )}

            {/* Attendee list */}
            <div className="host-card">
                <div className="host-card-header">
                    <h3>Danh sách attendee</h3>
                    <input
                        className="search-mini"
                        placeholder="Tìm tên, email, mã vé…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="table-wrap">
                    <table className="host-table">
                        <thead>
                            <tr><th>#</th><th>Tên</th><th>Email</th><th>Mã vé</th><th>Check-in</th><th>Hành động</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a.id} className={a.checkedIn ? 'row-checked' : ''}>
                                    <td className="td-muted">{a.seat}</td>
                                    <td className="td-title">{a.name}</td>
                                    <td className="td-muted">{a.email}</td>
                                    <td><code className="ticket-code">{a.ticketId}</code></td>
                                    <td>
                                        <span className={`badge-status ${a.checkedIn ? 'confirmed' : 'draft'}`}>
                                            {a.checkedIn ? '✅ Đã check-in' : '⏳ Chưa'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={`btn-sm ${a.checkedIn ? 'btn-ghost' : 'btn-primary'}`}
                                            onClick={() => toggleCheckIn(a.id)}
                                            style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                        >
                                            {a.checkedIn ? 'Hủy check-in' : 'Check-in'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HostAttendeePage;
