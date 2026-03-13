import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { workshopApi, mediaApi, type Workshop } from '../../services/api';
import './HostPage.css';

const EMPTY_FORM = {
    title: '', category: '', date: '', time: '', price: '',
    seats: '', description: '', address: '', materials: '',
};

const STATUS_LABEL: Record<string, string> = {
    APPROVED: '🟢 Đã duyệt',
    PENDING_APPROVAL: '🟡 Chờ duyệt',
    DRAFT: '⚪ Nháp',
    REJECTED: '🔴 Từ chối',
};

const HostWorkshopPage: React.FC = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'APPROVED' | 'DRAFT'>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Workshop | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const hasAutoOpenedRef = useRef(false);

    const filtered = filter === 'all' ? workshops : workshops.filter(w => w.status === filter);

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = () => {
        setIsLoading(true);
        workshopApi.getMyWorkshops()
            .then(res => setWorkshops(res.content || []))
            .catch(err => console.error("Lỗi tải workshop:", err))
            .finally(() => setIsLoading(false));
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ ...EMPTY_FORM });
        setImageFile(null);
        setImagePreview('');
        setModalOpen(true);
    };

    // Tự động mở form tạo nếu URL có query ?create=true (chỉ chạy 1 lần)
    useEffect(() => {
        if (searchParams.get('create') === 'true' && !hasAutoOpenedRef.current) {
            hasAutoOpenedRef.current = true;
            openCreate();
            // Xóa query param để khi navigate lại hoặc F5 không bị dính
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    const openEdit = (w: Workshop) => {
        setEditing(w);
        setForm({
            title: w.title, category: w.category, date: w.date || '', time: w.time || '',
            price: String(w.price), seats: String(w.maxSeats),
            description: w.subtitle || '', address: w.address || '', materials: Array.isArray(w.materials) ? w.materials.join('\n') : (w.materials || ''),
        });
        setImageFile(null);

        let initialPreview = '';
        if (w.images && w.images.length > 0) {
            initialPreview = w.images[0];
        } else if (w.image) {
            initialPreview = w.image;
        }
        setImagePreview(initialPreview);

        setModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (submitAfterSave = false) => {
        if (!form.title || !form.date) return;
        setIsSaving(true);
        try {
            let uploadedImageUrl = editing?.image || (editing?.images && editing?.images[0]) || '';

            // Nếu user có chọn file ảnh mới -> upload
            if (imageFile) {
                const uploadRes = await mediaApi.upload(imageFile);
                uploadedImageUrl = uploadRes.url;
            }

            const payload: Partial<Workshop> = {
                title: form.title,
                category: form.category,
                date: form.date,
                time: form.time,
                price: Number(form.price),
                maxSeats: Number(form.seats),
                subtitle: form.description,
                address: form.address,
                materials: form.materials.split('\n').filter(Boolean),
                availableSeats: Number(form.seats),
                image: uploadedImageUrl,
                images: uploadedImageUrl ? [uploadedImageUrl] : []
            };

            let savedId = editing?.id;
            if (editing) {
                await workshopApi.update(String(editing.id), payload);
            } else {
                const res: any = await workshopApi.create(payload);
                savedId = String(res.id || res.workshopId);
            }

            if (submitAfterSave && savedId) {
                await workshopApi.submit(String(savedId));
            }

            fetchWorkshops();
            setModalOpen(false);
        } catch (error) {
            console.error("Lưu workshop thất bại:", error);
            alert("Lưu workshop hoặc tải ảnh thất bại, vui lòng thử lại!");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await workshopApi.delete(id);
            fetchWorkshops();
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Xóa workshop thất bại:", error);
        }
    };

    const togglePublish = async (id: string) => {
        try {
            await workshopApi.submit(id);
            fetchWorkshops();
        } catch (error) {
            console.error("Gửi duyệt thất bại:", error);
        }
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
                {(['all', 'APPROVED', 'DRAFT'] as const).map(f => (
                    <button key={f} className={`host-tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f === 'all' ? 'Tất cả' : f === 'APPROVED' ? '🟢 Đã duyệt' : '⚪ Nháp'}
                        <span className="host-tab-count">{f === 'all' ? workshops.length : workshops.filter(w => w.status === f).length}</span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="host-card">
                <div className="table-wrap">
                    {isLoading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải danh sách...</div>
                    ) : (
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
                                        <td className="td-muted">{new Date(w.date || Date.now()).toLocaleDateString('vi-VN')} {w.time || ''}</td>
                                        <td className="td-amount">{new Intl.NumberFormat('vi-VN').format(w.price)}đ</td>
                                        <td>{(w.maxSeats || 0) - (w.availableSeats || 0)}/{w.maxSeats || 0}</td>
                                        <td><span className={`badge-status ${(w.status || 'DRAFT').toLowerCase()}`}>{STATUS_LABEL[w.status || 'DRAFT'] || 'Không rõ'}</span></td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn-icon edit" onClick={() => openEdit(w)} title="Sửa">✏️</button>
                                                {(!w.status || w.status === 'DRAFT' || w.status === 'REJECTED') && (
                                                    <button className="btn-icon publish" onClick={() => togglePublish(String(w.id))} title="Gửi duyệt nhanh">🚀</button>
                                                )}
                                                <button className="btn-icon delete" onClick={() => setDeleteConfirm(String(w.id))} title="Xóa">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
                            {/* --- UPLOAD ẢNH --- */}
                            <div className="form-group">
                                <label>Ảnh bìa Workshop</label>
                                <div className="image-upload-wrap" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div
                                        className="image-preview-box"
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
                            {/* -------------------- */}

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
                            <button className="btn btn-ghost" onClick={() => setModalOpen(false)} disabled={isSaving}>Hủy</button>
                            <button className="btn" style={{ border: '1px solid #cbd5e1', backgroundColor: '#fff' }} onClick={() => handleSave(false)} disabled={isSaving}>
                                {isSaving ? '⏳...' : '💾 Lưu Nháp'}
                            </button>
                            <button className="btn btn-primary" onClick={() => handleSave(true)} disabled={isSaving}>
                                {isSaving ? '⏳ Đang xử lý...' : '🚀 Lưu & Gửi Duyệt'}
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
