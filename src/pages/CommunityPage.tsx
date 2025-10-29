import React from 'react'
import { Link } from 'react-router-dom' // Dùng Link để chuyển trang
import './CommunityPage.css' 

// --- DỮ LIỆU GIẢ (Cần khớp với PostDetailPage) ---
interface CommunityPost {
  id: number;
  user: string;
  userAvatar: string; 
  image: string; 
  caption: string;
  likes: number;
  comments: number; 
}

const communityPosts: CommunityPost[] = [
  { id: 1, user: 'Khánh Hòa', userAvatar: 'KH', image: '/images/danlenpost.webp', caption: 'Vừa học xong khóa Đan len, khoe thành quả đầu tay! 🧣', likes: 12, comments: 2 },
  { id: 2, user: 'Minh Anh', userAvatar: 'MA', image: '/images/maunuocpost.webp', caption: 'Bức tranh màu nước đầu tiên. 🎨', likes: 45, comments: 8 },
  { id: 3, user: 'Gia Bảo', userAvatar: 'GB', image: '/images/kemnhungpost.webp', caption: 'Một chút hoa kẽm nhung cho cuối tuần.', likes: 28, comments: 5 },
  { id: 4, user: 'An Nhiên', userAvatar: 'AN', image: '/images/danlenpost.webp', caption: 'Đang đan dở chiếc khăn...', likes: 19, comments: 3 },
  { id: 5, user: 'Khánh Hòa', userAvatar: 'KH', image: '/images/maunuocpost.webp', caption: 'Thử nghiệm một kỹ thuật mới.', likes: 55, comments: 10 },
  { id: 6, user: 'Tuấn Kiệt', userAvatar: 'TK', image: '/images/maunuocpost.webp', caption: 'Sản phẩm đầu tay.', likes: 33, comments: 4 },
  { id: 7, user: 'Minh Anh', userAvatar: 'MA', image: '/images/maunuocpost.webp', caption: 'Bức tranh phong cảnh chiều hoàng hôn.', likes: 72, comments: 15 },
  { id: 8, user: 'Gia Bảo', userAvatar: 'GB', image: '/images/kemnhungpost.webp', caption: 'Hoa kẽm nhung tặng mẹ. ❤️', likes: 102, comments: 22 },
];


const CommunityPage: React.FC = () => {
  // Không cần State modal nữa
  
  return (
    <div className="community-page">
      <div className="container">
        {/* Header của trang */}
        <header className="community-header">
          <h1>Cộng đồng Sáng tạo</h1>
          <p>Nơi chia sẻ, kết nối và truyền cảm hứng thủ công.</p>
          <button className="btn btn-primary">
            Đăng dự án của bạn
          </button>
        </header>

        {/* --- Lưới bài đăng (Dùng <Link>) --- */}
        <div className="post-grid">
          {communityPosts.map((post) => (
            <Link 
              to={`/post/${post.id}`} // <-- Link đến trang chi tiết
              className="post-card-link" 
              key={post.id} 
            >
              <div className="post-card">
                <img src={post.image} alt={post.caption} className="post-image" />
                <div className="post-overlay">
                  <div className="post-meta">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
                <div className="post-user">
                  <div className="post-avatar">{post.userAvatar}</div>
                  <span className="post-username">{post.user}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommunityPage