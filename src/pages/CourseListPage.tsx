import React from 'react'
import { Link } from 'react-router-dom'
import './CourseListPage.css' // CSS riêng cho trang này

// Dữ liệu giả (Trong dự án thật, bạn sẽ gọi API /api/courses)
// Đây là dữ liệu tóm tắt, có thể lấy từ mockData của CourseDetailsPage
const allCourses = [
  {
    id: 'workshop-dan-len',
    title: 'Workshop Đan len cơ bản',
    author: 'Nghệ nhân: Trần Văn A',
    description: 'Học cách đan mũ len và khăn choàng chỉ trong 2 giờ.',
    price: '399.000 VNĐ',
    imgPlaceholder: '[Ảnh khóa học Đan len]'
  },
  {
    id: 've-mau-nuoc',
    title: 'Vẽ màu nước: Thiên nhiên',
    author: 'Nghệ nhân: Lê Thị B',
    description: 'Kỹ thuật vẽ lá, hoa và bầu trời bằng màu nước.',
    price: '599.000 VNĐ',
    imgPlaceholder: '[Ảnh khóa học Vẽ màu nước]'
  },
  {
    id: 'hoa-kem-nhung',
    title: 'Hoa Kẽm nhung nghệ thuật',
    author: 'Nghệ nhân: Nguyễn Văn C',
    description: 'Tạo ra những bó hoa kẽm nhung sống động như thật.',
    price: '450.000 VNĐ',
    imgPlaceholder: '[Ảnh khóa học Kẽm nhung]'
  }
];

const CourseListPage: React.FC = () => {
  return (
    <div className="course-list-page">
      <div className="container">
        
        {/* Header của trang */}
        <header className="list-page-header">
          <h1>Tất cả Workshop</h1>
          <p>Khám phá tất cả các hoạt động thủ công tại Heal Haven.</p>
        </header>

        {/* Lưới hiển thị các khóa học (tái sử dụng từ index.css) */}
        <div className="grid">
          
          {/* Dùng .map() để render danh sách khóa học */}
          {allCourses.map((course) => (
            <Link to={`/course/${course.id}`} className="card-link" key={course.id}>
              <div className="card">
                <div className="card-img">{course.imgPlaceholder}</div>
                <div className="card-content">
                  <h3>{course.title}</h3>
                  <p className="card-author">{course.author}</p>
                  <p>{course.description}</p>
                  <div className="card-price">{course.price}</div>
                </div>
              </div>
            </Link>
          ))}
          
        </div>

      </div>
    </div>
  )
}


export default CourseListPage