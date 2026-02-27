import React, { useState } from 'react';
import './VenuePage.css';

interface Space {
    id: number; name: string; area: string; capacity: number;
    pricePerHour: number; amenities: string[]; status: 'active' | 'inactive';
    bookings: number;
}

const INIT_SPACES: Space[] = [
    { id: 1, name: 'Studio A', area: 'Quận 1', capacity: 15, pricePerHour: 200000, amenities: ['WiFi', 'Máy lạnh', 'Máy chiếu'], status: 'active', bookings: 12 },
    { id: 2, name: 'Studio B', area: 'Quận 1', capacity: 10, pricePerHour: 180000, amenities: ['WiFi', 'Máy lạnh'], status: 'active', bookings: 8 },
    { id: 3, name: 'Sân vườn', area: 'Quận 1', capacity: 30, pricePerHour: 120000, amenities: ['WiFi', 'Điện ngoài trời'], status: 'inactive', bookings: 3 },
];

const AMENITY_OPTIONS = ['WiFi', 'Máy lạnh', 'Máy chiếu', 'Bếp', 'Lò nướng', 'Điện ngoài trời', 'Bãi đỗ xe', 'Nhà vệ sinh'];

const EMPTY_FORM = { name: '', area: '', capacity: '', pricePerHour: '', amenities: [] as string[], description: '' };

const VenueSpacePage: React.FC = () => {
    const [spaces, setSpaces] = useState<Space[]>(INIT_SPACES);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Space | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const openCreate = () => { setEditing(null); setForm({ ...EMPTY_FORM }); setModalOpen(true); };
    const openEdit = (s: Space) => {
        setEditing(s);
        setForm({ name: s.name, area: s.area, capacity: String(s.capacity), pricePerHour: String(s.pricePerHour), amenities: [...s.amenities], description: '' });
        setModalOpen(true);
    };

    const toggleAmenity = (a: string) => {
        setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));
    };

    const handleSave = () => {
        if (!form.name) return;
        if (editing) {
            setSpaces(ss => ss.map(s => s.id === editing.id ? { ...s, ...form, capacity: Number(form.capacity), pricePerHour: Number(form.pricePerHour) } : s));
        } else {
            setSpaces(ss => [...ss, { id: Date.now(), name: form.name, area: form.area, capacity: Number(form.capacity), pricePerHour: Number(form.pricePerHour), amenities: form.amenities, status: 'inactive', bookings: 0 }]);
        }
        setModalOpen(false);
    };

    const toggleStatus = (id: number) => setSpaces(ss => ss.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
    const handleDelete = (id: number) => { setSpaces(ss => ss.filter(s => s.id !== id)); setDeleteConfirm(null); };

    return (
        <div className="venue-page">
            <div className="venue-page-header">
                <div>
                    <h1 className="venue-page-title">Quản lý Không gian</h1>
                    <p className="venue-page-subtitle">Tạo và quản lý các không gian cho thuê của bạn.</p>
                </div>
                <button className="btn btn-venue" onClick={openCreate}>+ Thêm không gian</button>
            </div>

            <div className="venue-spaces-grid">
                {spaces.map(s => (
                    <div className="venue-space-card venue-card" key={s.id}>
                        <div className="space-card-header">
                            <div>
                                <h3 className="space-name">{s.name}</h3>
                                <p className="space-area">📍 {s.area}</p>
                            </div>
                            <span className={`venue-badge ${s.status}`}>{s.status === 'active' ? '🟢 Đang cho thuê' : '⚫ Tắt'}</span>
                        </div>

                        <div className="space-stats">
                            <div className="space-stat"><span className="ss-icon">👥</span><span>Tối đa {s.capacity} người</span></div>
                            <div className="space-stat"><span className="ss-icon">💰</span><span>{new Intl.NumberFormat('vi').format(s.pricePerHour)}đ/giờ</span></div>
                            <div className="space-stat"><span className="ss-icon">📋</span><span>{s.bookings} lượt đặt</span></div>
                        </div>

                        <div className="space-amenities">
                            {s.amenities.map(a => <span key={a} className="venue-chip">{a}</span>)}
                        </div>

                        <div className="space-actions">
                            <button className="btn-venue-sm edit" onClick={() => openEdit(s)}>✏️ Sửa</button>
                            <button className="btn-venue-sm toggle" onClick={() => toggleStatus(s.id)}>
                                {s.status === 'active' ? '👁️ Ẩn' : '🚀 Bật'}
                            </button>
                            <button className="btn-venue-sm delete" onClick={() => setDeleteConfirm(s.id)}>🗑️ Xóa</button>
                        </div>
                    </div>
                ))}

                {/* Add card */}
                <div className="venue-add-card" onClick={openCreate}>
                    <div className="add-icon">+</div>
                    <p>Thêm không gian mới</p>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="venue-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="venue-modal" onClick={e => e.stopPropagation()}>
                        <div className="venue-modal-header">
                            <h3>{editing ? 'Chỉnh sửa không gian' : 'Thêm không gian mới'}</h3>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className="venue-modal-body">
                            <div className="form-row2">
                                <div className="form-group2">
                                    <label>Tên không gian *</label>
                                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Studio A" />
                                </div>
                                <div className="form-group2">
                                    <label>Khu vực</label>
                                    <select value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}>
                                        <option value="">-- Chọn --</option>
                                        {['Quận 1', 'Quận 3', 'Bình Thạnh', 'Thủ Đức', 'Gò Vấp'].map(a => <option key={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row2">
                                <div className="form-group2">
                                    <label>Sức chứa (người)</label>
                                    <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="VD: 15" />
                                </div>
                                <div className="form-group2">
                                    <label>Giá/giờ (đ)</label>
                                    <input type="number" value={form.pricePerHour} onChange={e => setForm(f => ({ ...f, pricePerHour: e.target.value }))} placeholder="VD: 200000" />
                                </div>
                            </div>
                            <div className="form-group2">
                                <label>Tiện nghi</label>
                                <div className="amenity-selector">
                                    {AMENITY_OPTIONS.map(a => (
                                        <button key={a} type="button" className={`amenity-btn ${form.amenities.includes(a) ? 'selected' : ''}`} onClick={() => toggleAmenity(a)}>
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group2">
                                <label>Mô tả thêm</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả không gian, vị trí đặc biệt..." />
                            </div>
                        </div>
                        <div className="venue-modal-footer">
                            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Hủy</button>
                            <button className="btn btn-venue" onClick={handleSave}>{editing ? '💾 Lưu' : '+ Thêm'}</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm !== null && (
                <div className="venue-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="venue-modal small" onClick={e => e.stopPropagation()}>
                        <div className="venue-modal-header"><h3>Xác nhận xóa</h3><button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button></div>
                        <div className="venue-modal-body"><p>Bạn có chắc muốn xóa không gian này?</p></div>
                        <div className="venue-modal-footer">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Hủy</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>🗑️ Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenueSpacePage;
