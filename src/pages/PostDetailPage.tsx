import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import './PostDetailPage.css' // CSS riêng cho trang này

// === DỮ LIỆU GIẢ (Copy từ CommunityPage) ===
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
  // (Tôi sẽ chỉ lấy 2 cái đầu làm dữ liệu, bạn có thể copy toàn bộ)
  { id: 1, user: 'Khánh Hòa', userAvatar: 'KH', image: 'https://via.placeholder.com/600x450.png?text=Mu+Len+Cua+Toi', caption: 'Vừa học xong khóa Đan len, khoe thành quả đầu tay! 🧣', likes: 12, comments: 2 },
  { id: 2, user: 'Minh Anh', userAvatar: 'MA', image: 'https://via.placeholder.com/600x750.png?text=Tranh+Mau+Nuoc', caption: 'Bức tranh màu nước đầu tiên. 🎨', likes: 45, comments: 8 },
  { id: 3, user: 'Gia Bảo', userAvatar: 'GB', image: 'https://via.placeholder.com/600x600.png?text=Hoa+Kem+Nhung', caption: 'Một chút hoa kẽm nhung cho cuối tuần.', likes: 28, comments: 5 },
  { id: 4, user: 'An Nhiên', userAvatar: 'AN', image: 'https://via.placeholder.com/600x525.png?text=Khan+Choang', caption: 'Đang đan dở chiếc khăn...', likes: 19, comments: 3 },
  { id: 5, user: 'Khánh Hòa', userAvatar: 'KH', image: 'https://via.placeholder.com/600x900.png?text=San+pham+moi', caption: 'Thử nghiệm một kỹ thuật mới.', likes: 55, comments: 10 },
  { id: 6, user: 'Tuấn Kiệt', userAvatar: 'TK', image: 'https://via.placeholder.com/600x675.png?text=Gom+su', caption: 'Sản phẩm gốm đầu tay.', likes: 33, comments: 4 },
  { id: 7, user: 'Minh Anh', userAvatar: 'MA', image: 'https://via.placeholder.com/600x600.png?text=Tranh+phong+canh', caption: 'Bức tranh phong cảnh chiều hoàng hôn.', likes: 72, comments: 15 },
  { id: 8, user: 'Gia Bảo', userAvatar: 'GB', image: 'https://via.placeholder.com/600x825.png?text=Hoa+hong+kem', caption: 'Hoa hồng kẽm nhung tặng mẹ. ❤️', likes: 102, comments: 22 },
];
// === HẾT DỮ LIỆU GIẢ ===


const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate(); 

  // 1. Lấy bài đăng chính
  const mainPost = communityPosts.find(p => p.id === parseInt(postId || '0'));

  // 2. Lấy "các bài đăng còn lại" (lọc bài đăng chính ra)
  const otherPosts = communityPosts.filter(p => p.id !== parseInt(postId || '0'));

  if (!mainPost) {
    // Xử lý lỗi nếu không tìm thấy post
    return <div className="container"><p>Không tìm thấy bài đăng.</p></div>
  }

  return (
    <div className="post-detail-page">
      {/* Nút quay lại */}
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr;
      </button>

      {/* === PHẦN BÀI ĐĂNG CHÍNH === */}
      <div className="main-post-container">
        <div className="main-post-card">
          {/* Cột trái: Ảnh */}
          <div className="main-post-image">
            <img src={mainPost.image} alt={mainPost.caption} />
          </div>
          
          {/* Cột phải: Thông tin */}
          <div className="main-post-info">
            {/* Icon Like/Comment (Theo yêu cầu) */}
            <div className="main-post-interactions">
              <span className="interaction-item">❤️ {mainPost.likes}</span>
              <span className="interaction-item">💬 {mainPost.comments}</span>
            </div>

            {/* Thông tin */}
            <p className="main-post-caption">{mainPost.caption}</p>
            <div className="main-post-user">
              <div className="main-post-avatar">{mainPost.userAvatar}</div>
              <span className="main-post-username">{mainPost.user}</span>
            </div>
            
            {/* (Phần bình luận chi tiết có thể thêm ở đây) */}
          </div>
        </div>
      </div>

      {/* === PHẦN "CÁC BÀI ĐĂNG CÒN LẠI" (MỚI) === */}
      <div className="related-posts-container container">
        <h2>Các bài đăng khác</h2>
        
        {/* Tái sử dụng grid từ trang Cộng đồng */}
        <div className="post-grid">
          {otherPosts.map((post) => (
            <Link 
              to={`/post/${post.id}`} // Link đến bài đăng khác
              className="post-card-link" 
              key={post.id} 
            >
              <div className="post-card">
                <img src={post.image.replace('600x', '400x')} alt={post.caption} className="post-image" />
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

export default PostDetailPage