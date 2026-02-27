import React, { useState } from 'react';
import './HostPage.css';

interface Workshop {
    id: number; title: string; category: string; date: string;
    time: string; price: number; seats: number; registered: number;
    status: 'draft' | 'published' | 'cancelled';
}

const INITIAL_WORKSHOPS: Workshop[] = [
    { id: 1, title: 'Workshop Đan len cơ bản', category: 'Thủ công', date: '2026-03-15', time: '09:00', price: 399000, seats: 10, registered: 5, status: 'published' },
    { id: 2, title: 'Vẽ màu nước: Thiên nhiên', category: 'Hội họa', date: '2026-03-20', time: '14:00', price: 599000, seats: 8, registered: 3, status: 'published' },
    { id: 3, title: 'Hoa Kẽm nhung nghệ thuật', category: 'Thủ công', date: '2026-03-25', time: '10:00', price: 450000, seats: 12, registered: 8, status: 'draft' },
];

const EMPTY_FORM = {
    title: '', category: '', date: '', time: '', price: '',
    seats: '', description: '', address: '', materials: '',
};

const STATUS_LABEL: Record<string, string> = {
    published: '🟢 Đã đăng', draft: '⚪ Nháp', cancelled: '🔴 Hủy',
};

const HostWorkshopPage: React.FC = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>(INITIAL_WORKSHOPS);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Workshop | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const filtered = filter === 'all' ? workshops : workshops.filter(w => w.status === filter);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...EMPTY_FORM });
        setModalOpen(true);
    };

    const openEdit = (w: Workshop) => {
        setEditing(w);
        setForm({
            title: w.title, category: w.category, date: w.date, time: w.time,
            price: String(w.price), seats: String(w.seats),
            description: '', address: '', materials: '',
        });
        setModalOpen(true);
    };

    const handleSave = () => {
        if (!form.title || !form.date) return;
        if (editing) {
            setWorkshops(ws => ws.map(w => w.id === editing.id
                ? { ...w, ...form, price: Number(form.price), seats: Number(form.seats) }
                : w));
        } else {
            const newW: Workshop = {
                id: Date.now(), title: form.title, category: form.category,
                date: form.date, time: form.time, price: Number(form.price),
                seats: Number(form.seats), registered: 0, status: 'draft',
            };
            setWorkshops(ws => [newW, ...ws]);
        }
        setModalOpen(false);
    };

    const handleDelete = (id: number) => {
        setWorkshops(ws => ws.filter(w => w.id !== id));
        setDeleteConfirm(null);
    };

    const togglePublish = (id: number) => {
        setWorkshops(ws => ws.map(w => w.id === id
            ? { ...w, status: w.status === 'published' ? 'draft' : 'published' }
            : w));
    };

    return (
        <div className="host-page">
            {/* Header */}
            <div className="host-page-header">
                <div>
                    <h1 className="host-page-title">Quản lý Workshop</h1>
                    <p className="host-page-subtitle">Tạo và quản lý các workshop của bạn.</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ Tạo Workshop mới</button>
            </div>

            {/* Filter tabs */}
            <div className="host-filter-tabs">
                {(['all', 'published', 'draft'] as const).map(f => (
                    <button key={f} className={`host-tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f === 'all' ? 'Tất cả' : f === 'published' ? '🟢 Đã đăng' : '⚪ Nháp'}
                        <span className="host-tab-count">{f === 'all' ? workshops.length : workshops.filter(w => w.status === f).length}</span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="host-card">
                <div className="table-wrap">
                    <table className="host-table">
                        <thead>
                            <tr>
                                <th>Tên Workshop</th>
                                <th>Danh mục</th>
                                <th>Ngày / Giờ</th>
                                <th>Giá</th>
                                <th>Đăng ký</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(w => (
                                <tr key={w.id}>
                                    <td className="td-title">{w.title}</td>
                                    <td className="td-tag">{w.category}</td>
                                    <td className="td-muted">{new Date(w.date).toLocaleDateString('vi-VN')} {w.time}</td>
                                    <td className="td-amount">{new Intl.NumberFormat('vi-VN').format(w.price)}đ</td>
                                    <td>{w.registered}/{w.seats}</td>
                                    <td><span className={`badge-status ${w.status}`}>{STATUS_LABEL[w.status]}</span></td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="btn-icon edit" onClick={() => openEdit(w)} title="Sửa">✏️</button>
                                            <button className="btn-icon publish" onClick={() => togglePublish(w.id)} title={w.status === 'published' ? 'Ẩn' : 'Đăng'}>
                                                {w.status === 'published' ? '👁️' : '🚀'}
                                            </button>
                                            <button className="btn-icon delete" onClick={() => setDeleteConfirm(w.id)} title="Xóa">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="host-empty">Chưa có workshop nào. <button className="link-btn" onClick={openCreate}>Tạo ngay →</button></div>
                    )}
                </div>
            </div>

            {/* === CREATE/EDIT MODAL === */}
            {modalOpen && (
                <div className="host-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="host-modal" onClick={e => e.stopPropagation()}>
                        <div className="host-modal-header">
                            <h3>{editing ? 'Chỉnh sửa Workshop' : 'Tạo Workshop mới'}</h3>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className="host-modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên workshop *</label>
                                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: Workshop Đan len cơ bản" />
                                </div>
                                <div className="form-group">
                                    <label>Danh mục</label>
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {['Thủ công', 'Hội họa', 'Ẩm thực', 'Gốm sứ', 'Origami', 'Macramé'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ngày *</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Giờ bắt đầu</label>
                                    <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Giá (VNĐ)</label>
                                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="VD: 399000" />
                                </div>
                                <div className="form-group">
                                    <label>Số chỗ tối đa</label>
                                    <input type="number" value={form.seats} onChange={e => setForm(f => ({ ...f, seats: e.target.value }))} placeholder="VD: 10" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="VD: 45 Nguyễn Đình Chiểu, Q3, TP.HCM" />
                            </div>

                            <div className="form-group">
                                <label>Mô tả ngắn</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả workshop của bạn..." />
                            </div>

                            <div className="form-group">
                                <label>Nguyên liệu cần chuẩn bị</label>
                                <textarea rows={2} value={form.materials} onChange={e => setForm(f => ({ ...f, materials: e.target.value }))} placeholder="VD: Len 5mm, kim đan size 10..." />
                            </div>
                        </div>
                        <div className="host-modal-footer">
                            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                {editing ? '💾 Lưu thay đổi' : '🚀 Tạo Workshop'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === DELETE CONFIRM === */}
            {deleteConfirm !== null && (
                <div className="host-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="host-modal small" onClick={e => e.stopPropagation()}>
                        <div className="host-modal-header">
                            <h3>Xác nhận xóa</h3>
                            <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
                        </div>
                        <div className="host-modal-body">
                            <p>Bạn có chắc muốn xóa workshop này? Hành động không thể hoàn tác.</p>
                        </div>
                        <div className="host-modal-footer">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Hủy</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>🗑️ Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostWorkshopPage;
