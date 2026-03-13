import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArtisanProfilePage.css';

// --- Mock artisan data (replace with API call) ---
const ARTISANS: Record<string, {
    slug: string; name: string; title: string; location: string;
    bio: string; avatar: string; joinYear: number;
    totalStudents: number; totalWorkshops: number; rating: number; reviewCount: number;
    skills: string[];
    workshops: { id: string; title: string; category: string; price: number; date: string; seats: number; workshopId?: number }[];
    reviews: { name: string; rating: number; comment: string; date: string; initials: string }[];
}> = {
    'tran-van-a': {
        slug: 'tran-van-a', name: 'Trần Văn A', title: 'Nghệ nhân Đan len',
        location: 'Quận 3, TP.HCM', avatar: '',
        bio: 'Với hơn 10 năm kinh nghiệm trong nghề đan len thủ công, mình đã học hỏi từ các nghệ nhân truyền thống tại Hà Nội và phát triển phong cách riêng kết hợp giữa kỹ thuật cổ điển và thiết kế hiện đại. Mình tin rằng đan len không chỉ là một kỹ năng — đó là liệu pháp tinh thần, là cách để mình chậm lại và hiện diện hoàn toàn.',
        joinYear: 2023, totalStudents: 340, totalWorkshops: 12, rating: 4.9, reviewCount: 124,
        skills: ['Đan mũ len', 'Đan khăn', 'Đan túi', 'Móc len cơ bản', 'Đan giày len'],
        workshops: [
            { id: 'workshop-dan-len', title: 'Workshop Đan len cơ bản', category: 'Đan len', price: 399000, date: '2026-03-15', seats: 5 },
            { id: 'dan-khan-len', title: 'Đan khăn len Mùa đông', category: 'Đan len', price: 450000, date: '2026-03-22', seats: 3 },
            { id: 'dan-tui-len', title: 'Tạo túi len Mini', category: 'Đan len', price: 520000, date: '2026-04-05', seats: 8 },
        ],
        reviews: [
            { name: 'Nguyễn Lan Anh', initials: 'LA', rating: 5, comment: 'Anh dạy rất kiên nhẫn và chi tiết. Mình chưa biết gì về đan len nhưng sau buổi workshop đã tự làm được chiếc mũ đầu tiên!', date: '10/03/2026' },
            { name: 'Phạm Thu Hằng', initials: 'TH', rating: 5, comment: 'Không gian ấm cúng, nguyên liệu chất lượng, và cách giảng dạy rất dễ hiểu. Sẽ quay lại workshop tiếp theo.', date: '02/03/2026' },
            { name: 'Lê Minh Quân', initials: 'MQ', rating: 4, comment: 'Workshop tốt, học được nhiều kỹ thuật mới. Chỉ tiếc là thời gian hơi ngắn, muốn học thêm.', date: '22/02/2026' },
        ],
    },
    'le-thi-b': {
        slug: 'le-thi-b', name: 'Lê Thị B', title: 'Họa sĩ Màu nước',
        location: 'Quận 1, TP.HCM', avatar: '',
        bio: 'Mình là họa sĩ độc lập với niềm đam mê với kỹ thuật vẽ màu nước. Sau nhiều năm học tập tại Đại học Mỹ thuật, mình muốn chia sẻ tình yêu với hội họa đến mọi người — từ người hoàn toàn mới đến những ai muốn nâng cao kỹ năng.',
        joinYear: 2024, totalStudents: 210, totalWorkshops: 8, rating: 4.8, reviewCount: 86,
        skills: ['Màu nước cơ bản', 'Vẽ phong cảnh', 'Vẽ hoa', 'Vẽ chân dung', 'Kỹ thuật wet-on-wet'],
        workshops: [
            { id: 've-mau-nuoc', title: 'Vẽ màu nước: Thiên nhiên', category: 'Hội họa', price: 599000, date: '2026-03-20', seats: 6 },
        ],
        reviews: [
            { name: 'Trần Bích Ngọc', initials: 'BN', rating: 5, comment: 'Chị dạy rất tỉ mỉ và truyền cảm hứng. Mình không nghĩ mình có thể vẽ được nhưng kết quả thật tuyệt vời!', date: '05/03/2026' },
        ],
    },
};

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => (
    <div className="star-display" style={{ fontSize: size }}>
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#ddd' }}>★</span>
        ))}
    </div>
);

const fmtPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const ArtisanProfilePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [activeTab, setActiveTab] = useState<'workshops' | 'reviews'>('workshops');

    const artisan = slug ? ARTISANS[slug] : null;

    if (!artisan) {
        return (
            <div className="artisan-not-found">
                <div className="anf-icon">🔍</div>
                <h2>Không tìm thấy nghệ nhân</h2>
                <p>Nghệ nhân "<strong>{slug}</strong>" không tồn tại hoặc đã ngừng hoạt động.</p>
                <Link to="/workshops" className="btn-artisan-primary">Xem tất cả Workshop</Link>
            </div>
        );
    }

    const initials = artisan.name.split(' ').map(w => w[0]).slice(-2).join('');

    return (
        <div className="artisan-page">
            {/* === HERO SECTION === */}
            <div className="artisan-hero">
                <div className="artisan-hero-inner">
                    {/* Avatar */}
                    <div className="artisan-avatar-wrap">
                        {artisan.avatar
                            ? <img src={artisan.avatar} alt={artisan.name} className="artisan-avatar-img" />
                            : <div className="artisan-avatar-placeholder">{initials}</div>
                        }
                    </div>

                    {/* Info */}
                    <div className="artisan-hero-info">
                        <div className="artisan-badge-row">
                            <span className="artisan-verified-badge">Nghệ nhân xác thực</span>
                            <span className="artisan-since">Tham gia từ {artisan.joinYear}</span>
                        </div>
                        <h1 className="artisan-name">{artisan.name}</h1>
                        <p className="artisan-title">{artisan.title}</p>
                        <p className="artisan-location">
                            <span className="loc-dot" /> {artisan.location}
                        </p>

                        <div className="artisan-stats-row">
                            <div className="artisan-stat">
                                <span className="as-value">{artisan.rating}</span>
                                <StarRating rating={artisan.rating} size={14} />
                                <span className="as-label">({artisan.reviewCount} đánh giá)</span>
                            </div>
                            <div className="artisan-stat-divider" />
                            <div className="artisan-stat">
                                <span className="as-value">{artisan.totalStudents}</span>
                                <span className="as-label">học viên</span>
                            </div>
                            <div className="artisan-stat-divider" />
                            <div className="artisan-stat">
                                <span className="as-value">{artisan.totalWorkshops}</span>
                                <span className="as-label">workshop</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === MAIN CONTENT === */}
            <div className="artisan-content">
                <div className="artisan-left">

                    {/* Bio */}
                    <section className="artisan-section">
                        <h2 className="artisan-section-title">Về nghệ nhân</h2>
                        <p className="artisan-bio">{artisan.bio}</p>
                    </section>

                    {/* Skills */}
                    <section className="artisan-section">
                        <h2 className="artisan-section-title">Chuyên môn</h2>
                        <div className="artisan-skills">
                            {artisan.skills.map(s => (
                                <span key={s} className="artisan-skill-chip">{s}</span>
                            ))}
                        </div>
                    </section>

                    {/* Tabs */}
                    <section className="artisan-section">
                        <div className="artisan-tabs">
                            <button
                                className={`artisan-tab ${activeTab === 'workshops' ? 'active' : ''}`}
                                onClick={() => setActiveTab('workshops')}
                            >
                                Workshop ({artisan.workshops.length})
                            </button>
                            <button
                                className={`artisan-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Đánh giá ({artisan.reviewCount})
                            </button>
                        </div>

                        {/* Workshop list */}
                        {activeTab === 'workshops' && (
                            <div className="artisan-workshop-list">
                                {artisan.workshops.map(ws => (
                                    <Link key={ws.workshopId || ws.id} to={`/workshop/${ws.workshopId || ws.id}`} className="artisan-ws-card">
                                        <div className="awsc-category">{ws.category}</div>
                                        <div className="awsc-title">{ws.title}</div>
                                        <div className="awsc-meta-row">
                                            <span className="awsc-date">{fmtDate(ws.date)}</span>
                                            <span className="awsc-dot" />
                                            <span className="awsc-seats">{ws.seats} chỗ còn</span>
                                        </div>
                                        <div className="awsc-price">{fmtPrice(ws.price)}</div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Reviews */}
                        {activeTab === 'reviews' && (
                            <div className="artisan-reviews">
                                <div className="review-summary-bar">
                                    <div className="rsb-score">{artisan.rating}</div>
                                    <div>
                                        <StarRating rating={artisan.rating} size={20} />
                                        <p className="rsb-count">{artisan.reviewCount} đánh giá</p>
                                    </div>
                                </div>
                                {artisan.reviews.map((r, i) => (
                                    <div key={i} className="artisan-review-card">
                                        <div className="arc-header">
                                            <div className="arc-avatar">{r.initials}</div>
                                            <div>
                                                <div className="arc-name">{r.name}</div>
                                                <StarRating rating={r.rating} size={13} />
                                            </div>
                                            <span className="arc-date">{r.date}</span>
                                        </div>
                                        <p className="arc-comment">{r.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar CTA */}
                <aside className="artisan-sidebar">
                    <div className="artisan-cta-card">
                        <h3>Đặt Workshop</h3>
                        <p>Tham gia cùng <strong>{artisan.totalStudents}+</strong> học viên đã trải nghiệm workshop của {artisan.name.split(' ').pop()}.</p>
                        <Link to={`/workshops?host=${artisan.slug}`} className="btn-artisan-primary btn-block">
                            Xem tất cả Workshop
                        </Link>
                        <div className="cta-rating-row">
                            <StarRating rating={artisan.rating} size={15} />
                            <span>{artisan.rating} · {artisan.reviewCount} đánh giá</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ArtisanProfilePage;
