import React, { useState, useEffect } from 'react';
import { workshopApi, bookingApi, type Workshop, type Booking } from '../../services/api';
import './HostPage.css';

const HostAttendeePage: React.FC = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [selectedWs, setSelectedWs] = useState<string>('');
    const [attendees, setAttendees] = useState<Booking[]>([]);

    const [scanMode, setScanMode] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [scanResult, setScanResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        workshopApi.getMyWorkshops().then(res => {
            if (res.content && res.content.length > 0) {
                setWorkshops(res.content);
                setSelectedWs(String(res.content[0].id));
            }
        });
    }, []);

    useEffect(() => {
        if (selectedWs) {
            bookingApi.getByWorkshop(selectedWs)
                .then(res => setAttendees(res))
                .catch(err => console.error(err));
        }
    }, [selectedWs]);

    const filtered = attendees.filter(a =>
        (a.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.ticketCode || '').toLowerCase().includes(search.toLowerCase())
    );

    const checkedCount = attendees.filter(a => a.status === 'ATTENDED').length;

    const exportCsv = () => {
        const headers = ['Mã Hệ Thống', 'Mã Vé', 'Số Lượng Ghế', 'Trạng Thái', 'Ngày Check-in'];
        const rows = attendees.map(a => [
            a.id, a.ticketCode || 'N/A', String(a.seats),
            a.status === 'ATTENDED' ? 'Đã check-in' : 'Chưa đến',
            a.date || ''
        ]);

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Attendees_${selectedWs}_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const checkIn = async (code: string) => {
        if (!code) return;
        try {
            const result = await bookingApi.checkIn(code.toUpperCase());
            // Update UI list
            setAttendees(prev => prev.map(a => a.id === result.id ? result : a));
            setScanResult({ type: 'success', msg: `✅ Check-in thành công mã vé: ${code}` });
            setManualCode('');
        } catch (err: any) {
            setScanResult({ type: 'error', msg: `❌ Lỗi: ${err.message || 'Mã vé không hợp lệ hoặc đã dùng'}` });
        }
        setTimeout(() => setScanResult(null), 3000);
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
                    <select className="form-select" value={selectedWs} onChange={e => setSelectedWs(e.target.value)}>
                        {workshops.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
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
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            className="search-mini"
                            placeholder="Tìm mã vé…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={exportCsv}>
                            📥 Xuất Excel
                        </button>
                    </div>
                </div>
                <div className="table-wrap">
                    <table className="host-table">
                        <thead>
                            <tr><th>Mã GD</th><th>Số Ghế</th><th>Tổng Tiền</th><th>Mã vé</th><th>Check-in</th><th>Hành động</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => {
                                const isChecked = a.status === 'ATTENDED';
                                return (
                                    <tr key={a.id} className={isChecked ? 'row-checked' : ''}>
                                        <td className="td-muted" title={a.id}>{a.id.substring(0, 8)}...</td>
                                        <td className="td-title">{a.seats}</td>
                                        <td className="td-muted">{new Intl.NumberFormat('vi-VN').format(a.totalPrice)}đ</td>
                                        <td><code className="ticket-code">{a.ticketCode || 'N/A'}</code></td>
                                        <td>
                                            <span className={`badge-status ${isChecked ? 'confirmed' : 'draft'}`}>
                                                {isChecked ? '✅ Đã check-in' : '⏳ Chưa'}
                                            </span>
                                        </td>
                                        <td>
                                            {!isChecked ? (
                                                <button
                                                    className="btn-sm btn-primary"
                                                    onClick={() => checkIn(a.ticketCode || '')}
                                                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                                    disabled={!a.ticketCode}
                                                >
                                                    Check-in
                                                </button>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Hoàn tất</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HostAttendeePage;
