import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './WorkshopListPage.css';

const WorkshopListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ category: '', area: '', price: '' });

  return (
    <div className="workshop-list-container">
      <section className="filter-sidebar">
        <h3>Bộ lọc tìm kiếm</h3>
        {/* F2.2: Lọc theo khu vực */}
        <select onChange={(e) => setFilter({...filter, area: e.target.value})}>
          <option value="">Tất cả khu vực (Quận/Huyện)</option>
          <option value="q1">Quận 1</option>
          <option value="q3">Quận 3</option>
        </select>

        {/* F2.2: Lọc theo giá */}
        <select onChange={(e) => setFilter({...filter, price: e.target.value})}>
          <option value="">Mức giá</option>
          <option value="low">Dưới 500k</option>
          <option value="high">Trên 500k</option>
        </select>
      </section>

      <section className="workshop-grid">
        {/* Danh sách workshop sẽ map qua API ở đây */}
        <div className="workshop-card">
          <img src="/images/dan-len.webp" alt="Workshop" />
          <div className="info">
            <h4>Đan len chữa lành</h4>
            <p>Host: Tiệm Thủ Công</p>
            <span className="price">350.000đ</span>
            <button onClick={() => navigate('/workshop/1')}>Xem chi tiết</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseListPage;