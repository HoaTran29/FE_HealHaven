import React from 'react'
import { Link, useParams } from 'react-router-dom'
import './WorkshopDetailsPage.css'

// --- DỮ LIỆU GIẢ ---
const mockWorkshopData: any = {
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
  const { id } = useParams<{ id: string }>();

  // Lấy dữ liệu workshop dựa trên id từ URL
  const workshop = mockWorkshopData[id || 'workshop-dan-len'] || mockWorkshopData['workshop-dan-len'];

  const [activeTab, setActiveTab] = React.useState('curriculum');

  return (
    <div className="workshop-details-page">
      {/* === HEADER === */}
      <header className="workshop-header">
        <div className="container">
          <p className="workshop-breadcrumb">
            <Link to="/workshops">Workshop</Link> &gt;
            <span>{workshop.title}</span>
          </p>
          <h1>{workshop.title}</h1>
          <p className="workshop-subtitle">{workshop.subtitle}</p>
          <p className="workshop-author-header">
            Tổ chức bởi <Link to={workshop.authorLink}>{workshop.author}</Link>
          </p>
        </div>
      </header>

      {/* === BỐ CỤC 2 CỘT === */}
      <div className="container">
        <div className="workshop-layout">

          {/* CỘT TRÁI */}
          <div className="workshop-main-content">
            <div className="workshop-video-player">
              <div className="video-placeholder">
                [Video Giới thiệu: {workshop.title}]
              </div>
            </div>

            {/* Tabs */}
            <div className="workshop-tabs">
              <button
                className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                onClick={() => setActiveTab('curriculum')}
              >
                Chương trình
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

            <div className="tab-content">
              {activeTab === 'curriculum' && (
                <div className="curriculum-list">
                  {workshop.curriculum.map((item: any, index: number) => (
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

              {activeTab === 'materials' && (
                <div className="materials-list">
                  <p>Để hoàn thành workshop, bạn cần chuẩn bị:</p>
                  <ul>
                    {workshop.materials.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <a href="#" className="btn btn-accent" style={{ marginTop: '1rem' }}>
                    Tìm cửa hàng nguyên liệu
                  </a>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-list">
                  <p>Tính năng đang được phát triển...</p>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI - THẺ MUA HÀNG */}
          <aside className="workshop-sidebar">
            <div className="purchase-card">
              <h3 className="purchase-price">{workshop.price}</h3>
              <p>Giá gốc: <span style={{ textDecoration: 'line-through' }}>{workshop.originalPrice}</span></p>

              <Link to={`/checkout?workshopId=${workshop.id}`} className="btn btn-primary purchase-btn">
                Đăng ký ngay
              </Link>

              <h4>Workshop này bao gồm:</h4>
              <ul>
                <li>✅ Hướng dẫn trực tiếp từ nghệ nhân</li>
                <li>✅ Nguyên liệu được chuẩn bị sẵn</li>
                <li>✅ Không gian sáng tạo thoải mái</li>
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