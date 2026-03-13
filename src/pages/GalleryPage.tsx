import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GalleryPage.css';

type Category = 'all' | 'handcraft' | 'painting' | 'pottery' | 'embroidery' | 'food';

interface GalleryItem {
    id: string;
    title: string;
    author: string;
    authorAvatar: string;
    category: Category;
    gradient: string;
    emoji: string;
    likes: number;
    comments: number;
    workshopId: string;
    workshopName: string;
    tags: string[];
    description: string;
}

const ITEMS: GalleryItem[] = [
    {
        id: 'g1', title: 'Túi đan móc hoa cúc', author: 'Nguyễn Thị Lan', authorAvatar: 'L',
        category: 'handcraft', gradient: 'linear-gradient(135deg, #fde68a, #f59e0b)',
        emoji: '🧶', likes: 128, comments: 24, workshopId: '1',
        workshopName: 'Workshop Đan móc cơ bản', tags: ['Đan móc', 'Thủ công', 'Túi'],
        description: 'Hoàn thành sau 3 buổi học. Rất hài lòng với kết quả!'
    },
    {
        id: 'g2', title: 'Tranh màu nước bình minh', author: 'Trần Văn Minh', authorAvatar: 'M',
        category: 'painting', gradient: 'linear-gradient(135deg, #bfdbfe, #6366f1)',
        emoji: '🎨', likes: 96, comments: 18, workshopId: '2',
        workshopName: 'Vẽ màu nước cho người mới', tags: ['Hội họa', 'Màu nước', 'Phong cảnh'],
        description: 'Bức đầu tiên trong đời. Thầy dạy rất tận tâm!'
    },
    {
        id: 'g3', title: 'Bình gốm dáng oval', author: 'Lê Thu Hà', authorAvatar: 'H',
        category: 'pottery', gradient: 'linear-gradient(135deg, #d1fae5, #10b981)',
        emoji: '🏺', likes: 214, comments: 41, workshopId: '3',
        workshopName: 'Làm gốm căn bản', tags: ['Gốm sứ', 'Craftwork', 'Bình'],
        description: 'Cảm giác nặn đất sét rất thú vị. Muốn học thêm!'
    },
    {
        id: 'g4', title: 'Tranh thêu hoa sen', author: 'Phạm Bích Ngọc', authorAvatar: 'N',
        category: 'embroidery', gradient: 'linear-gradient(135deg, #fecdd3, #fb7185)',
        emoji: '🌸', likes: 187, comments: 33, workshopId: '4',
        workshopName: 'Nghệ thuật thêu nổi', tags: ['Thêu', 'Hoa', 'Truyền thống'],
        description: 'Tác phẩm đầu tay về chủ đề hoa lotus Việt Nam.'
    },
    {
        id: 'g5', title: 'Macramé treo tường', author: 'Hồ Ngọc Anh', authorAvatar: 'A',
        category: 'handcraft', gradient: 'linear-gradient(135deg, #e9d5ff, #8b5cf6)',
        emoji: '🪢', likes: 156, comments: 28, workshopId: '5',
        workshopName: 'Workshop Macramé & Trang trí', tags: ['Macramé', 'Decor', 'Handmade'],
        description: 'Dùng dây cotton thuần thiên nhiên, rất thích màu sắc tự nhiên!'
    },
    {
        id: 'g6', title: 'Bánh mochi matcha nhân đậu đỏ', author: 'Yuki Tanaka', authorAvatar: 'Y',
        category: 'food', gradient: 'linear-gradient(135deg, #bbf7d0, #16a34a)',
        emoji: '🍡', likes: 302, comments: 57, workshopId: '6',
        workshopName: 'Ẩm thực Nhật Bản cơ bản', tags: ['Bánh', 'Nhật Bản', 'Matcha'],
        description: 'Mochi xịn mịn, nhân đậu đỏ tự làm. Siêu ngon!'
    },
    {
        id: 'g7', title: 'Giỏ đan tre mỹ nghệ', author: 'Nguyễn Văn Bảo', authorAvatar: 'B',
        category: 'handcraft', gradient: 'linear-gradient(135deg, #fef9c3, #ca8a04)',
        emoji: '🧺', likes: 89, comments: 15, workshopId: '7',
        workshopName: 'Đan tre thủ công mỹ nghệ', tags: ['Tre', 'Mỹ nghệ', 'Truyền thống'],
        description: 'Kỹ thuật đan đơn giản nhưng cần kiên nhẫn. Rất đáng học!'
    },
    {
        id: 'g8', title: 'Lọ hoa sơn dầu pop art', author: 'Trần Lê Khánh', authorAvatar: 'K',
        category: 'painting', gradient: 'linear-gradient(135deg, #fef3c7, #ef4444)',
        emoji: '🖼️', likes: 143, comments: 22, workshopId: '8',
        workshopName: 'Vẽ sơn dầu phong cách hiện đại', tags: ['Sơn dầu', 'Pop Art', 'Hiện đại'],
        description: 'Lần đầu vẽ sơn dầu, màu sắc pop art rất vui mắt!'
    },
    {
        id: 'g9', title: 'Bộ chén gốm sứ xanh celadon', author: 'Phạm Thị Lan', authorAvatar: 'L',
        category: 'pottery', gradient: 'linear-gradient(135deg, #cffafe, #0ea5e9)',
        emoji: '🍵', likes: 271, comments: 46, workshopId: '3',
        workshopName: 'Gốm nâng cao', tags: ['Gốm sứ', 'Celadon', 'Tea set'],
        description: 'Bộ trà Nhật Bản phong cách. Mất 2 tuần hoàn thiện!'
    },
];

const CATEGORIES = [
    { key: 'all', label: 'Tất cả', emoji: '✨' },
    { key: 'handcraft', label: 'Thủ công', emoji: '🧶' },
    { key: 'painting', label: 'Hội họa', emoji: '🎨' },
    { key: 'pottery', label: 'Gốm sứ', emoji: '🏺' },
    { key: 'embroidery', label: 'Thêu', emoji: '🌸' },
    { key: 'food', label: 'Ẩm thực', emoji: '🍡' },
];

const GalleryPage: React.FC = () => {
    const [category, setCategory] = useState<Category | 'all'>('all');
    const [search, setSearch] = useState('');
    const [liked, setLiked] = useState<Set<string>>(new Set());
    const [selected, setSelected] = useState<GalleryItem | null>(null);
    const [sort, setSort] = useState<'likes' | 'new'>('likes');

    const filtered = ITEMS
        .filter(i => (category === 'all' || i.category === category))
        .filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.author.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sort === 'likes' ? b.likes - a.likes : 0);

    const toggleLike = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="gallery-page">
            {/* Hero Banner */}
            <section className="gallery-hero">
                <div className="gallery-hero-content">
                    <h1 className="gallery-hero-title">🖼️ Triển lãm Tác phẩm</h1>
                    <p className="gallery-hero-sub">Khám phá những sản phẩm thủ công tuyệt đẹp từ cộng đồng Heal Haven.</p>
                    <div className="gallery-hero-search">
                        <span className="hero-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm tác phẩm, tác giả…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="hero-search-input"
                        />
                    </div>
                </div>
            </section>

            {/* Main */}
            <div className="gallery-main">
                {/* Category filter */}
                <div className="gallery-filters">
                    <div className="category-chips">
                        {CATEGORIES.map(c => (
                            <button
                                key={c.key}
                                className={`cat-chip ${category === c.key ? 'active' : ''}`}
                                onClick={() => setCategory(c.key as typeof category)}
                            >
                                {c.emoji} {c.label}
                            </button>
                        ))}
                    </div>
                    <div className="gallery-sort">
                        <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
                            <option value="likes">Phổ biến nhất</option>
                            <option value="new">Mới nhất</option>
                        </select>
                        <span className="gallery-count">{filtered.length} tác phẩm</span>
                    </div>
                </div>

                {/* Masonry grid */}
                <div className="gallery-grid">
                    {filtered.map(item => (
                        <div key={item.id} className="gallery-card" onClick={() => setSelected(item)}>
                            {/* Visual */}
                            <div className="gallery-card-visual" style={{ background: item.gradient }}>
                                <span className="gallery-card-emoji">{item.emoji}</span>
                            </div>
                            {/* Info */}
                            <div className="gallery-card-body">
                                <div className="gallery-card-author">
                                    <div className="gallery-author-av">{item.authorAvatar}</div>
                                    <div>
                                        <div className="gallery-author-name">{item.author}</div>
                                        <Link to={`/workshop/${item.workshopId}`} className="gallery-workshop-link" onClick={e => e.stopPropagation()}>
                                            {item.workshopName}
                                        </Link>
                                    </div>
                                </div>
                                <h3 className="gallery-card-title">{item.title}</h3>
                                <div className="gallery-card-tags">
                                    {item.tags.map(t => <span key={t} className="gallery-tag">{t}</span>)}
                                </div>
                                <div className="gallery-card-actions">
                                    <button
                                        className={`gallery-like-btn ${liked.has(item.id) ? 'liked' : ''}`}
                                        onClick={e => toggleLike(item.id, e)}
                                    >
                                        {liked.has(item.id) ? '❤️' : '🤍'} {item.likes + (liked.has(item.id) ? 1 : 0)}
                                    </button>
                                    <span className="gallery-comments">💬 {item.comments}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="gallery-empty">
                        <div style={{ fontSize: '3rem' }}>🔍</div>
                        <p>Không tìm thấy tác phẩm nào.</p>
                    </div>
                )}

                {/* Submit CTA */}
                <div className="gallery-cta">
                    <div className="gallery-cta-inner">
                        <h2>✨ Chia sẻ tác phẩm của bạn!</h2>
                        <p>Hoàn thành workshop và chia sẻ thành quả với cộng đồng.</p>
                        <Link to="/workshops" className="btn-gallery-cta">Tham gia Workshop ngay →</Link>
                    </div>
                </div>
            </div>

            {/* Detail Modal / Lightbox */}
            {selected && (
                <div className="gallery-lightbox" onClick={() => setSelected(null)}>
                    <div className="gallery-lightbox-inner" onClick={e => e.stopPropagation()}>
                        <button className="lb-close" onClick={() => setSelected(null)}>✕</button>
                        <div className="lb-visual" style={{ background: selected.gradient }}>
                            <span className="lb-emoji">{selected.emoji}</span>
                        </div>
                        <div className="lb-info">
                            <div className="lb-author-row">
                                <div className="lb-avatar">{selected.authorAvatar}</div>
                                <div>
                                    <div className="lb-author">{selected.author}</div>
                                    <Link to={`/workshop/${selected.workshopId}`} className="lb-workshop" onClick={() => setSelected(null)}>
                                        📚 {selected.workshopName}
                                    </Link>
                                </div>
                            </div>
                            <h2 className="lb-title">{selected.title}</h2>
                            <p className="lb-desc">{selected.description}</p>
                            <div className="lb-tags">
                                {selected.tags.map(t => <span key={t} className="gallery-tag">{t}</span>)}
                            </div>
                            <div className="lb-stats">
                                <button className={`gallery-like-btn ${liked.has(selected.id) ? 'liked' : ''}`} onClick={e => toggleLike(selected.id, e)}>
                                    {liked.has(selected.id) ? '❤️' : '🤍'} {selected.likes + (liked.has(selected.id) ? 1 : 0)} thích
                                </button>
                                <span className="gallery-comments">💬 {selected.comments} bình luận</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
