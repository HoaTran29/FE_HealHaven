import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useChat } from "../contexts/ChatContext";
import { workshopApi, type Workshop } from "../services/api";
import "./HomePage.css"; // CSS riêng cho Trang chủ

const HomePage: React.FC = () => {
  const { openChat } = useChat();
  const [featuredWorkshops, setFeaturedWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        // Lấy 3 workshop mới nhất làm nổi bật
        const res = await workshopApi.getList({ size: 3 });
        setFeaturedWorkshops(res.content || []);
      } catch (error) {
        console.error("Lỗi khi tải workshop nổi bật:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const fmtVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + ' VNĐ';

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
          <h2>Trợ lý Sáng tạo AI</h2>
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
            {isLoading ? (
               <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>Đang tải workshop...</div>
            ) : featuredWorkshops.length === 0 ? (
               <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>Hiện chưa có workshop nào nổi bật.</div>
            ) : (
              featuredWorkshops.map((ws) => {
                const wId = ws.workshopId || (ws as any).id;
                return (
                  <Link to={`/workshop/${wId}`} key={wId} className="card-link">
                    <div className="card">
                      <img
                        src={ws.image || "/images/ws1303.png"}
                        alt={ws.title}
                        className="card-img-real"
                        onError={(e) => { e.currentTarget.src = "/images/ws1303.png"; }}
                      />
                      <div className="card-content">
                        <h3>{ws.title}</h3>
                        <p className="card-author">Nghệ nhân: {ws.host?.fullName || 'N/A'}</p>
                        <p className="line-clamp-2">{ws.subtitle || ws.title}</p>
                        <div className="card-price">{fmtVND(ws.price)}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/workshops" className="btn btn-ghost">Xem tất cả workshop →</Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
