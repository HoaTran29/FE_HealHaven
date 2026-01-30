import React from 'react' // Bỏ useState vì chúng ta sẽ dùng tab mặc định
import { Link, useParams } from 'react-router-dom' // <-- 1. Import useParams
import './WorkshopDetailsPage.css'

// --- 2. TẠO DỮ LIỆU GIẢ (MOCK DATA) ---
// Khi có BE, bạn sẽ call API bằng courseId và lấy về data này
const mockCourseData: any = {
  'workshop-dan-len': {
    id: 'workshop-dan-len',
    title: 'Workshop Đan len cơ bản',
    subtitle: 'Học cách đan mũ len và khăn choàng chỉ trong 2 giờ.',
    author: 'Nghệ nhân: Trần Văn A',
    authorLink: '/artisan/tran-van-a',
    price: '399.000 VNĐ',
    originalPrice: '599.000 VNĐ',
    curriculum: [
      { name: 'Chương 1: Giới thiệu Dụng cụ', time: '10:00', active: false },
      { name: 'Chương 2: Cách bắt mũi len đầu tiên', time: '15:30', active: true },
      { name: 'Chương 3: Kỹ thuật đan trơn (Knit)', time: '25:00', active: false },
      { name: 'Chương 4: Hoàn thành sản phẩm', time: '30:00', active: false },
    ],
    materials: [
      '2 cuộn len 5mm (màu tùy chọn)',
      '1 cặp kim đan size 10',
      '1 cây kéo cắt len',
    ]
  },
  've-mau-nuoc': {
    id: 've-mau-nuoc',
    title: 'Vẽ màu nước: Thiên nhiên',
    subtitle: 'Kỹ thuật vẽ lá, hoa và bầu trời bằng màu nước.',
    author: 'Nghệ nhân: Lê Thị B',
    authorLink: '/artisan/le-thi-b',
    price: '599.000 VNĐ',
    originalPrice: '799.000 VNĐ',
    curriculum: [
      { name: 'Chương 1: Giới thiệu về màu nước và cọ', time: '12:00', active: false },
      { name: 'Chương 2: Kỹ thuật loang màu (Wet-on-Wet)', time: '20:00', active: true },
      { name: 'Chương 3: Vẽ lá cây và hoa đơn giản', time: '30:00', active: false },
    ],
    materials: [
      '1 bộ màu nước (ít nhất 12 màu)',
      'Giấy vẽ màu nước (300gsm)',
      'Cọ vẽ (size 4, 8, 12)',
    ]
  },
  'hoa-kem-nhung': {
    id: 'hoa-kem-nhung',
    title: 'Hoa Kẽm nhung nghệ thuật',
    subtitle: 'Tạo ra những bó hoa kẽm nhung sống động như thật.',
    author: 'Nghệ nhân: Nguyễn Văn C',
    authorLink: '/artisan/nguyen-van-c',
    price: '450.000 VNĐ',
    originalPrice: '600.000 VNĐ',
    curriculum: [
      { name: 'Chương 1: Chuẩn bị kẽm và dụng cụ', time: '05:00', active: false },
      { name: 'Chương 2: Cách tạo cánh hoa Tulip', time: '20:00', active: true },
      { name: 'Chương 3: Ghép cành và lá', time: '15:00', active: false },
      { name: 'Chương 4: Kỹ thuật bó hoa nghệ thuật', time: '20:00', active: false },
    ],
    materials: [
      'Kẽm nhung (nhiều màu)',
      'Kẽm cành, sáp xanh',
      'Kéo, kìm',
    ]
  }
};
// --- HẾT DỮ LIỆU GIẢ ---


const WorkshopDetailsPage: React.FC = () => {
  // --- 3. LẤY courseId TỪ URL ---
  const { courseId } = useParams<{ courseId: string }>();
  
  // Lấy dữ liệu của khóa học dựa trên courseId
  // Nếu không tìm thấy, dùng 'workshop-dan-len' làm mặc định (hoặc hiển thị trang 404)
  const course = mockCourseData[courseId || 'workshop-dan-len'] || mockCourseData['workshop-dan-len'];

  // Tab mặc định là 'curriculum'
  const [activeTab, setActiveTab] = React.useState('curriculum');

  return (
    <div className="course-details-page">
      {/* === PHẦN HEADER (ĐÃ DÙNG DỮ LIỆU ĐỘNG) === */}
      <header className="course-header">
        <div className="container">
          <p className="course-breadcrumb">
            <Link to="/courses">Khóa học</Link> &gt; 
            <span>{course.title}</span> {/* <-- Động */}
          </p>
          <h1>{course.title}</h1> {/* <-- Động */}
          <p className="course-subtitle">
            {course.subtitle} {/* <-- Động */}
          </p>
          <p className="course-author-header">
            Tạo bởi <Link to={course.authorLink}>{course.author}</Link> {/* <-- Động */}
          </p>
        </div>
      </header>
      
      {/* === BỐ CỤC 2 CỘT === */}
      <div className="container">
        <div className="course-layout">
          
          {/* CỘT TRÁI (NỘI DUNG CHÍNH) */}
          <div className="course-main-content">
            
            <div className="course-video-player">
              <div className="video-placeholder">
                [Video Giới thiệu: {course.title}] {/* <-- Động */}
              </div>
            </div>
            
            {/* Các Tab Nội dung */}
            <div className="course-tabs">
              <button 
                className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                onClick={() => setActiveTab('curriculum')}
              >
                Chương trình học
              </button>
              <button 
                className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
                onClick={() => setActiveTab('materials')}
              >
                Nguyên liệu cần thiết
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá (120)
              </button>
            </div>
            
            {/* Nội dung của Tab */}
            <div className="tab-content">
              {/* Nội dung Tab 1: Chương trình học (Động) */}
              {activeTab === 'curriculum' && (
                <div className="curriculum-list">
                  {course.curriculum.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className={`lecture-item ${item.active ? 'active' : ''}`}
                    >
                      <span>{item.name}</span>
                      <span>{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Nội dung Tab 2: Nguyên liệu (Động) */}
              {activeTab === 'materials' && (
                <div className="materials-list">
                  <p>Để hoàn thành khóa học, bạn cần chuẩn bị:</p>
                  <ul>
                    {course.materials.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <a href="#" className="btn btn-accent" style={{marginTop: '1rem'}}>
                    Tìm cửa hàng nguyên liệu
                  </a>
                </div>
              )}
              
              {/* Nội dung Tab 3: Đánh giá */}
              {activeTab === 'reviews' && (
                <div className="reviews-list">
                  <p>Tính năng đang được phát triển...</p>
                </div>
              )}
            </div>

          </div>
          
          {/* CỘT PHẢI (THẺ MUA HÀNG - ĐỘNG) */}
          <aside className="course-sidebar">
            <div className="purchase-card">
              <h3 className="purchase-price">{course.price}</h3> {/* <-- Động */}
              <p>Giá gốc: <span style={{textDecoration: 'line-through'}}>{course.originalPrice}</span></p> {/* <-- Động */}
              
              <button className="btn btn-primary purchase-btn">
                Đăng ký học ngay
              </button>
              
              <h4>Khóa học này bao gồm:</h4>
              <ul>
                <li>✅ 4 giờ video theo yêu cầu</li>
                <li>✅ Truy cập trọn đời</li>
                <li>✅ Hỗ trợ từ nghệ nhân</li>
                <li>✅ Chứng nhận hoàn thành</li>
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}

export default WorkshopDetailsPage