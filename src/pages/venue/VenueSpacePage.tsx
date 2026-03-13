import React, { useState, useEffect } from 'react';
import { venueApi, mediaApi, type Venue } from '../../services/api';
import './VenuePage.css';

const AMENITY_OPTIONS = ['WiFi', 'Máy lạnh', 'Máy chiếu', 'Bếp', 'Lò nướng', 'Điện ngoài trời', 'Bãi đỗ xe', 'Nhà vệ sinh'];

const EMPTY_FORM = { name: '', address: '', area: '', capacity: '', pricePerHour: '', amenities: [] as string[], description: '' };

const VenueSpacePage: React.FC = () => {
    const [spaces, setSpaces] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Venue | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });

    // Upload Ảnh
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchSpaces = () => {
        setIsLoading(true);
        venueApi.getMyVenues()
            .then(res => setSpaces(res || []))
            .catch(err => console.error("Lỗi lấy danh sách space:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchSpaces();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...EMPTY_FORM });
        setImageFile(null);
        setImagePreview('');
        setModalOpen(true);
    };

    const openEdit = (s: Venue) => {
        setEditing(s);
        let parsedAmenities: string[] = [];
        if (typeof s.amenities === 'string') {
            parsedAmenities = s.amenities.split(',').map(x => x.trim()).filter(Boolean);
        } else if (Array.isArray(s.amenities)) {
            parsedAmenities = s.amenities;
        }

        setForm({
            name: s.name,
            address: s.address || '',
            area: s.district || s.area || '',
            capacity: String(s.capacity),
            pricePerHour: String(s.pricePerHour),
            amenities: parsedAmenities,
            description: s.description || ''
        });

        setImageFile(null);
        setImagePreview(s.imageUrls?.[0] || s.images?.[0] || '');
        setModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleAmenity = (a: string) => {
        setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));
    };

    const handleSave = async () => {
        if (!form.name || !form.pricePerHour) return;
        setIsSaving(true);

        try {
            let uploadedImageUrl = (editing?.imageUrls?.[0] || editing?.images?.[0] || '');
            if (imageFile) {
                const uploadRes = await mediaApi.upload(imageFile);
                uploadedImageUrl = uploadRes.url;
            }

            const payload: Partial<Venue> = {
                name: form.name,
                address: form.address || form.area || 'Chưa có địa chỉ cụ thể',
                district: form.area,
                capacity: Number(form.capacity),
                pricePerHour: Number(form.pricePerHour),
                amenities: form.amenities.join(', '),
                description: form.description,
                imageUrls: uploadedImageUrl ? [uploadedImageUrl] : []
            };

            const vId = editing ? (editing.venueId || editing.id) : null;
            if (editing && vId) {
                await venueApi.update(String(vId), payload);
            } else {
                await venueApi.create(payload);
            }

            fetchSpaces();
            setModalOpen(false);
        } catch (error) {
            console.error("Lỗi lưu không gian:", error);
            alert("Đã xảy ra lỗi khi tạo/sửa không gian!");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        try {
            const payload: Partial<Venue> = {
                status: currentStatus === 'active' ? 'inactive' : 'active'
            };
            await venueApi.update(id, payload);
            fetchSpaces();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await venueApi.delete(id);
            fetchSpaces();
            setDeleteConfirm(null);
        } catch (error) {
            console.error(error);
        }
    };

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
                {isLoading ? <p>Đang tải danh sách địa điểm...</p> : spaces.map(s => {
                    const displayImages = s.imageUrls || s.images || [];
                    const displayArea = s.district || s.area || 'Khác';
                    const vId = s.venueId || s.id || '';
                    let parsedAminities: string[] = [];
                    if (typeof s.amenities === 'string') parsedAminities = s.amenities.split(',').map(x => x.trim()).filter(Boolean);
                    else if (Array.isArray(s.amenities)) parsedAminities = s.amenities;

                    return (
                        <div className="venue-space-card venue-card" key={vId}>
                            {displayImages.length > 0 && (
                                <div style={{ height: '140px', overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', margin: '-20px -20px 15px -20px' }}>
                                    <img src={displayImages[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={s.name} />
                                </div>
                            )}
                            <div className="space-card-header">
                                <div>
                                    <h3 className="space-name">{s.name}</h3>
                                    <p className="space-area">📍 {displayArea}</p>
                                </div>
                                <span className={`venue-badge ${s.status === 'active' ? 'active' : 'inactive'}`}>
                                    {s.status === 'active' ? '🟢 Đang cho thuê' : '⚫ Tắt'}
                                </span>
                            </div>

                            <div className="space-stats">
                                <div className="space-stat"><span className="ss-icon">👥</span><span>Tối đa {s.capacity} người</span></div>
                                <div className="space-stat"><span className="ss-icon">💰</span><span>{new Intl.NumberFormat('vi').format(s.pricePerHour)}đ/giờ</span></div>
                                <div className="space-stat"><span className="ss-icon">📋</span><span>Hoạt động</span></div>
                            </div>

                            <div className="space-amenities">
                                {parsedAminities.map(a => <span key={a} className="venue-chip">{a}</span>)}
                            </div>

                            <div className="space-actions">
                                <button className="btn-venue-sm edit" onClick={() => openEdit(s)}>✏️ Sửa</button>
                                <button className="btn-venue-sm toggle" onClick={() => toggleStatus(String(vId), s.status || '')}>
                                    {s.status === 'active' ? '👁️ Ẩn' : '🚀 Bật'}
                                </button>
                                <button className="btn-venue-sm delete" onClick={() => setDeleteConfirm(String(vId))}>🗑️ Xóa</button>
                            </div>
                        </div>
                    );
                })}

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
                            {/* --- UPLOAD ẢNH --- */}
                            <div className="form-group2">
                                <label>Ảnh Không gian</label>
                                <div className="image-upload-wrap" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div
                                        style={{
                                            width: '120px', height: '80px',
                                            backgroundColor: '#f1f5f9', borderRadius: '8px',
                                            backgroundSize: 'cover', backgroundPosition: 'center',
                                            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1'
                                        }}
                                    >
                                        {!imagePreview && <span style={{ color: '#94a3b8', fontSize: '12px' }}>Chưa có ảnh</span>}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                </div>
                            </div>
                            <div className="form-group2">
                                <label>Địa chỉ chi tiết *</label>
                                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="VD: 123 Đường Sứ" />
                            </div>
                            <div className="form-row2">
                                <div className="form-group2">
                                    <label>Tên không gian *</label>
                                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Studio A" />
                                </div>
                                <div className="form-group2">
                                    <label>Khu vực Quận/Huyện</label>
                                    <select value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}>
                                        <option value="">-- Chọn Quận --</option>
                                        {['Quận 1', 'Quận 2', 'Quận 3', 'Bình Thạnh', 'Thủ Đức', 'Gò Vấp', 'Khác'].map(a => <option key={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row2">
                                <div className="form-group2">
                                    <label>Sức chứa (người)</label>
                                    <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="VD: 15" />
                                </div>
                                <div className="form-group2">
                                    <label>Giá/giờ (đ) *</label>
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
                            <button className="btn btn-ghost" onClick={() => setModalOpen(false)} disabled={isSaving}>Hủy</button>
                            <button className="btn btn-venue" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? '⏳ Đang lưu...' : (editing ? '💾 Lưu' : '+ Thêm')}
                            </button>
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
