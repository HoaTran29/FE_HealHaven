import React from "react";
import { Link } from "react-router-dom";
import { useChat } from "../contexts/ChatContext";
import "./HomePage.css"; // CSS riêng cho Trang chủ

const HomePage: React.FC = () => {
  const { openChat } = useChat();
  return (
    <>
      {/* === HERO BANNER === */}
      <header className="hero">
        <div className="hero-container">
          <h1>Healing through Handmade</h1>
          <p>
            Khám phá sự sáng tạo và tìm thấy bình yên trong từng sản phẩm thủ
            công.
          </p>
          <Link to="/workshops" className="btn btn-primary">
            Khám phá Workshop
          </Link>
        </div>
      </header>

      {/* === NỘI DUNG CHÍNH === */}
      <div className="container">
        {/* === Mục 1: AI Gợi ý cho bạn === */}
        <section className="ai-suggestion">
          <h2>Trợ lý Sáng tạo AI 🤖</h2>
          <p>
            Bạn đang cảm thấy thế nào? Hãy để AI gợi ý một dự án thủ công dành
            riêng cho bạn.
          </p>
          <button onClick={openChat} className="btn btn-primary">
            Hỏi AI ngay
          </button>
        </section>

        {/* === Mục 2: Các Workshop nổi bật === */}
        <section className="featured-workshops">
          <h2>Các Workshop nổi bật</h2>

          {/* Lưới chứa các thẻ khóa học */}
          <div className="grid">
            {/* Card 1 */}
            <Link to="/workshop/workshop-dan-len" className="card-link">
              <div className="card">
                <img
                  src="/images/dan-len.webp"
                  alt="Workshop đan len"
                  className="card-img-real"
                />
                <div className="card-content">
                  <h3>Workshop Đan len cơ bản</h3>
                  <p className="card-author">Nghệ nhân: Trần Văn A</p>
                  <p>Học cách đan mũ len và khăn choàng chỉ trong 2 giờ.</p>
                  <div className="card-price">399.000 VNĐ</div>
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/workshop/ve-mau-nuoc" className="card-link">
              <div className="card">
                <img
                  src="/images/mau-nuoc.webp"
                  alt="Workshop Vẽ màu nước"
                  className="card-img-real"
                />
                <div className="card-content">
                  <h3>Vẽ màu nước: Thiên nhiên</h3>
                  <p className="card-author">Nghệ nhân: Lê Thị B</p>
                  <p>Kỹ thuật vẽ lá, hoa và bầu trời bằng màu nước.</p>
                  <div className="card-price">599.000 VNĐ</div>
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/workshop/hoa-kem-nhung" className="card-link">
              <div className="card">
                <img
                  src="/images/kem-nhung.webp"
                  alt="Workshop Hoa kẽm nhung"
                  className="card-img-real"
                />
                <div className="card-content">
                  <h3>Hoa Kẽm nhung nghệ thuật</h3>
                  <p className="card-author">Nghệ nhân: Nguyễn Văn C</p>
                  <p>Tạo ra những bó hoa kẽm nhung sống động như thật.</p>
                  <div className="card-price">450.000 VNĐ</div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
