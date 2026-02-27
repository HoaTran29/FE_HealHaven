import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './ReviewPage.css';

// --- Mock completed workshops waiting for review ---
const COMPLETED = [
    {
        id: 'ORD-001', workshopId: 'ws1',
        workshopTitle: 'Workshop Đan len cơ bản',
        host: 'Nghệ nhân Trần Văn A',
        date: '15/03/2026', emoji: '🧶',
        gradient: 'linear-gradient(135deg, #fde68a, #f59e0b)',
    },
    {
        id: 'ORD-002', workshopId: 'ws2',
        workshopTitle: 'Vẽ màu nước: Thiên nhiên',
        host: 'Họa sĩ Lê Thị B',
        date: '10/03/2026', emoji: '🎨',
        gradient: 'linear-gradient(135deg, #bfdbfe, #6366f1)',
    },
    {
        id: 'ORD-005', workshopId: 'ws5',
        workshopTitle: 'Làm gốm căn bản',
        host: 'Nghệ nhân Phạm Thị Hoa',
        date: '05/03/2026', emoji: '🏺',
        gradient: 'linear-gradient(135deg, #d1fae5, #10b981)',
    },
];

interface ReviewForm {
    rating: number;
    hoverRating: number;
    content: string;
    pros: string;
    cons: string;
    shareToGallery: boolean;
    images: string[];
}

const ASPECTS = ['Nội dung thú vị', 'Giảng viên tận tâm', 'Không gian thoải mái', 'Nguyên liệu đầy đủ', 'Giá trị xứng đáng'];

const ReviewPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const preSelectedId = searchParams.get('orderId');

    const [selectedOrder, setSelectedOrder] = useState<typeof COMPLETED[0] | null>(
        preSelectedId ? COMPLETED.find(o => o.id === preSelectedId) ?? null : null
    );
    const [submitted, setSubmitted] = useState<Set<string>>(new Set());

    const [form, setForm] = useState<ReviewForm>({
        rating: 0, hoverRating: 0,
        content: '', pros: '', cons: '',
        shareToGallery: true, images: [],
    });
    const [checkedAspects, setCheckedAspects] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const toggleAspect = (a: string) => setCheckedAspects(prev => {
        const n = new Set(prev);
        n.has(a) ? n.delete(a) : n.add(a);
        return n;
    });

    const submit = () => {
        if (!selectedOrder || form.rating === 0 || form.content.trim().length < 10) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setSubmitted(prev => new Set(prev).add(selectedOrder.id));
            setIsSubmitting(false);
            setDone(true);
        }, 1200);
    };

    const reset = () => {
        setSelectedOrder(null);
        setDone(false);
        setForm({ rating: 0, hoverRating: 0, content: '', pros: '', cons: '', shareToGallery: true, images: [] });
        setCheckedAspects(new Set());
    };

    const pending = COMPLETED.filter(o => !submitted.has(o.id));

    if (done && selectedOrder) {
        return (
            <div className="review-page">
                <div className="review-done-screen">
                    <div className="review-done-icon">🎉</div>
                    <h2>Cảm ơn bạn đã đánh giá!</h2>
                    <p>Đánh giá của bạn về <strong>{selectedOrder.workshopTitle}</strong> đã được gửi thành công.</p>
                    {form.shareToGallery && (
                        <div className="review-gallery-note">
                            <span>✨</span>
                            <span>Tác phẩm của bạn sẽ xuất hiện trong <Link to="/gallery">Triển lãm</Link>!</span>
                        </div>
                    )}
                    <div className="review-done-actions">
                        <button className="btn-review-secondary" onClick={reset}>Đánh giá workshop khác</button>
                        <Link to="/gallery" className="btn-review-primary">Xem Triển lãm →</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="review-page">
            <div className="review-hero">
                <h1>⭐ Đánh giá Workshop</h1>
                <p>Chia sẻ trải nghiệm của bạn để giúp cộng đồng Heal Haven phát triển.</p>
            </div>

            <div className="review-main">
                {/* Left: order picker */}
                <aside className="review-sidebar">
                    <h3>Chờ đánh giá ({pending.length})</h3>
                    {pending.length === 0 ? (
                        <div className="review-all-done">
                            <div>✅</div>
                            <p>Bạn đã đánh giá tất cả các workshop!</p>
                            <Link to="/workshops" className="btn-review-primary btn-sm">Khám phá thêm</Link>
                        </div>
                    ) : (
                        <ul className="review-order-list">
                            {pending.map(o => (
                                <li
                                    key={o.id}
                                    className={`review-order-item ${selectedOrder?.id === o.id ? 'active' : ''}`}
                                    onClick={() => { setSelectedOrder(o); setDone(false); }}
                                >
                                    <div className="roi-visual" style={{ background: o.gradient }}>{o.emoji}</div>
                                    <div className="roi-info">
                                        <div className="roi-title">{o.workshopTitle}</div>
                                        <div className="roi-meta">{o.host} · {o.date}</div>
                                    </div>
                                    <span className="roi-arrow">→</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>

                {/* Right: form */}
                <div className="review-form-area">
                    {!selectedOrder ? (
                        <div className="review-placeholder">
                            <div style={{ fontSize: '4rem' }}>👆</div>
                            <h3>Chọn workshop cần đánh giá</h3>
                            <p>Chọn workshop từ danh sách bên trái để bắt đầu viết đánh giá.</p>
                        </div>
                    ) : (
                        <div className="review-form-card">
                            {/* Workshop header */}
                            <div className="review-ws-header" style={{ background: selectedOrder.gradient }}>
                                <span className="rws-emoji">{selectedOrder.emoji}</span>
                                <div>
                                    <div className="rws-title">{selectedOrder.workshopTitle}</div>
                                    <div className="rws-host">{selectedOrder.host}</div>
                                </div>
                            </div>

                            {/* Star rating */}
                            <div className="review-section">
                                <label className="review-label">Đánh giá tổng thể <span className="req">*</span></label>
                                <div className="star-row">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button
                                            key={s}
                                            className={`star-btn ${s <= (form.hoverRating || form.rating) ? 'filled' : ''}`}
                                            onMouseEnter={() => setForm(f => ({ ...f, hoverRating: s }))}
                                            onMouseLeave={() => setForm(f => ({ ...f, hoverRating: 0 }))}
                                            onClick={() => setForm(f => ({ ...f, rating: s }))}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span className="star-label">{
                                        ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc!'][form.hoverRating || form.rating] || ''
                                    }</span>
                                </div>
                            </div>

                            {/* Aspect checkboxes */}
                            <div className="review-section">
                                <label className="review-label">Điểm nổi bật</label>
                                <div className="aspect-chips">
                                    {ASPECTS.map(a => (
                                        <button
                                            key={a}
                                            className={`aspect-chip ${checkedAspects.has(a) ? 'active' : ''}`}
                                            onClick={() => toggleAspect(a)}
                                        >
                                            {checkedAspects.has(a) ? '✅' : '○'} {a}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review content */}
                            <div className="review-section">
                                <label className="review-label">Cảm nhận của bạn <span className="req">*</span></label>
                                <textarea
                                    className="review-textarea"
                                    rows={5}
                                    placeholder="Chia sẻ trải nghiệm của bạn: điều bạn học được, không khí workshop, điều bạn thích nhất…"
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                />
                                <div className="char-count">{form.content.length}/500</div>
                            </div>

                            {/* Pros & Cons */}
                            <div className="review-row2">
                                <div className="review-section">
                                    <label className="review-label">👍 Điểm hay</label>
                                    <textarea
                                        className="review-textarea sm"
                                        rows={2}
                                        placeholder="Điều bạn thích nhất…"
                                        value={form.pros}
                                        onChange={e => setForm(f => ({ ...f, pros: e.target.value }))}
                                    />
                                </div>
                                <div className="review-section">
                                    <label className="review-label">👎 Cần cải thiện</label>
                                    <textarea
                                        className="review-textarea sm"
                                        rows={2}
                                        placeholder="Điều bạn muốn tốt hơn…"
                                        value={form.cons}
                                        onChange={e => setForm(f => ({ ...f, cons: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Gallery share toggle */}
                            <div className="review-section">
                                <div className="gallery-share-toggle" onClick={() => setForm(f => ({ ...f, shareToGallery: !f.shareToGallery }))}>
                                    <div className={`toggle-track ${form.shareToGallery ? 'on' : ''}`}>
                                        <div className="toggle-thumb" />
                                    </div>
                                    <div>
                                        <div className="toggle-label">📸 Chia sẻ tác phẩm lên Triển lãm</div>
                                        <div className="toggle-sub">Tác phẩm của bạn sẽ xuất hiện trong Gallery cộng đồng</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="review-actions">
                                <button className="btn-review-secondary" onClick={reset}>Hủy</button>
                                <button
                                    className="btn-review-primary"
                                    onClick={submit}
                                    disabled={form.rating === 0 || form.content.trim().length < 10 || isSubmitting}
                                >
                                    {isSubmitting ? '⏳ Đang gửi…' : '✅ Gửi đánh giá'}
                                </button>
                            </div>
                            {form.rating === 0 && <p className="review-hint">* Vui lòng chọn số sao.</p>}
                            {form.rating > 0 && form.content.trim().length < 10 && <p className="review-hint">* Cảm nhận cần ít nhất 10 ký tự.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
