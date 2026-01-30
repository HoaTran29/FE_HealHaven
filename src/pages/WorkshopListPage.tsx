import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './WorkshopListPage.css';

const WorkshopListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ category: '', area: '', price: '' });

  // Dữ liệu mẫu hiển thị (F2.2)
  const workshops = [
    {
      id: 'workshop-dan-len',
      title: 'Đan len chữa lành',
      host: 'Tiệm Thủ Công',
      price: '350.000đ',
      image: '/images/dan-len.webp'
    }
    // Có thể thêm các workshop khác vào đây
  ];

  return (
    <div className="workshop-list-container container">
      <header className="list-page-header">
        <h1>Khám phá Workshop</h1>
        <p>Tìm kiếm không gian sáng tạo dành riêng cho bạn</p>
      </header>

      <div className="list-layout">
        {/* F2.2: Bộ lọc nâng cao */}
        <aside className="filter-sidebar">
          <h3>Bộ lọc tìm kiếm</h3>
          <div className="filter-group">
            <label>Khu vực</label>
            <select onChange={(e) => setFilter({...filter, area: e.target.value})}>
              <option value="">Tất cả khu vực</option>
              <option value="q1">Quận 1</option>
              <option value="q3">Quận 3</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Mức giá</label>
            <select onChange={(e) => setFilter({...filter, price: e.target.value})}>
              <option value="">Tất cả giá</option>
              <option value="low">Dưới 500k</option>
              <option value="high">Trên 500k</option>
            </select>
          </div>
        </aside>

        {/* Danh sách hiển thị */}
        <section className="workshop-grid">
          {workshops.map((ws) => (
            <div key={ws.id} className="workshop-card">
              <Link to={`/workshop/${ws.id}`} className="card-link">
                <div className="card-image">
                  <img src={ws.image} alt={ws.title} />
                </div>
                <div className="info">
                  <h4>{ws.title}</h4>
                  <p className="host-name">Host: {ws.host}</p>
                  <span className="price">{ws.price}</span>
                </div>
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default WorkshopListPage;