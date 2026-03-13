import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingApi, workshopApi, type Workshop } from '../services/api';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const workshopId = searchParams.get('workshopId') || '';
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth(); // Auth context

  // Workshop data từ API
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loadingWorkshop, setLoadingWorkshop] = useState(true);
  const [workshopError, setWorkshopError] = useState('');

  // Checkout state
  const [seats, setSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch workshop thật từ BE
  useEffect(() => {
    // 1. Kiểm tra đăng nhập
    if (!authLoading && !user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    // 2. Tải dữ liệu workshop nếu đã đăng nhập
    if (!workshopId) {
      setWorkshopError('Không tìm thấy thông tin workshop. Vui lòng quay lại trang danh sách.');
      setLoadingWorkshop(false);
      return;
    }

    // Nếu đang chờ auth data thì khoan tải workshop
    if (authLoading) return;

    setLoadingWorkshop(true);
    setWorkshopError('');
    workshopApi.getById(workshopId)
      .then(data => setWorkshop(data))
      .catch(() => setWorkshopError('Không thể tải thông tin workshop. Vui lòng thử lại.'))
      .finally(() => setLoadingWorkshop(false));
  }, [workshopId, user, authLoading, navigate, location]);

  const totalPrice = (workshop?.price ?? 0) * seats;
  const formattedTotal = new Intl.NumberFormat('vi-VN').format(totalPrice) + 'đ';
  const formattedUnit = new Intl.NumberFormat('vi-VN').format(workshop?.price ?? 0) + 'đ';

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshop) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      // B1: Tạo booking → lấy bookingId thật từ BE
      const vId = String(workshop.workshopId || workshop.id);
      const booking = await bookingApi.create({
        workshopId: vId,
        quantity: seats
      });

      // B2: Redirect sang trang thanh toán QR thủ công
      const bId = booking.bookingId || booking.id;
      navigate(`/payment/qr?bookingId=${bId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo mã thanh toán.';
      setErrorMsg(message);
      setIsLoading(false);
    }
  };

  // ——— Loading workshop ———
  if (loadingWorkshop || authLoading) {
    return (
      <div className="checkout-container container">
        <div className="checkout-loading">
          <div className="checkout-loading-spinner">🔄</div>
          <p>Đang chuẩn bị phiên thanh toán...</p>
        </div>
      </div>
    );
  }

  // User not exists return blank (to wait for redirection)
  if (!user) return null;

  // ——— Lỗi tải workshop ———
  if (workshopError || !workshop) {
    return (
      <div className="checkout-container container">
        <div className="checkout-error-state">
          <p>❌ {workshopError || 'Không tìm thấy workshop.'}</p>
          <Link to="/workshops" className="btn btn-primary">Quay về danh sách Workshop</Link>
        </div>
      </div>
    );
  }

  // ——— Form Checkout ———
  const availableSeats = workshop.availableSeats ?? workshop.maxSeats ?? 10;
  const hostName = workshop.host?.fullName ?? 'Nghệ nhân HealHaven';
  const workshopDateStr = workshop.startDate || workshop.date || '';
  const parsedDate = new Date(workshopDateStr);
  const workshopDate = isNaN(parsedDate.getTime())
    ? workshopDateStr
    : parsedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="checkout-container container">
      {/* Breadcrumb */}
      <nav className="checkout-breadcrumb">
        <Link to={`/workshop/${workshop.workshopId || workshop.id || workshopId}`}>← Quay lại Workshop</Link>
      </nav>

      <h1 className="checkout-title">Xác nhận đặt chỗ</h1>

      {errorMsg && (
        <div className="checkout-error-banner">
          ❌ {errorMsg}
        </div>
      )}

      <form onSubmit={handlePayment} className="checkout-layout">
        {/* =================== CỘT TRÁI =================== */}
        <div className="checkout-form-col">

          {/* 1. Thông tin Workshop */}
          <section className="checkout-section">
            <h3>📋 Thông tin Workshop</h3>
            <div className="workshop-summary-mini">
              <div>
                <p className="wsm-title">{workshop.title}</p>
                <p className="wsm-meta">🧑‍🎨 {hostName}</p>
                <p className="wsm-meta">📅 {workshopDate} {workshop.time ? `| ⏰ ${workshop.time}` : ''}</p>
                {workshop.address && <p className="wsm-meta">📍 {workshop.address}</p>}
                <p className="wsm-available">
                  <span className={availableSeats <= 3 ? 'seats-low' : ''}>
                    Còn {availableSeats} chỗ trống
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Chọn số lượng chỗ */}
          <section className="checkout-section">
            <h3>🎟️ Số lượng chỗ</h3>
            <div className="seat-selector">
              <button
                type="button"
                className="seat-btn"
                onClick={() => setSeats(s => Math.max(1, s - 1))}
                disabled={seats <= 1}
              >−</button>
              <span className="seat-count">{seats}</span>
              <button
                type="button"
                className="seat-btn"
                onClick={() => setSeats(s => Math.min(availableSeats, s + 1))}
                disabled={seats >= availableSeats}
              >+</button>
              <span className="seat-unit">× {formattedUnit}/người</span>
            </div>
          </section>

          {/* 3. Phương thức thanh toán */}
          <section className="checkout-section">
            <h3>💳 Phương thức thanh toán</h3>
            <div className="vnpay-only-info">
              <div className="vnpay-badge">
                <span className="vnpay-logo">🏦</span>
                <div>
                  <p className="vnpay-name">Chuyển khoản QR</p>
                  <p className="vnpay-desc">Thanh toán an toàn qua hình thức chuyển khoản ngân hàng bằng mã QR.</p>
                </div>
                <span className="vnpay-check">✓</span>
              </div>
              <div className="vnpay-logos-row">
                <span>QR Code</span>
                <span>Chuyển khoản 24/7</span>
              </div>
            </div>
          </section>
        </div>

        {/* =================== CỘT PHẢI =================== */}
        <aside className="checkout-summary-col">
          <div className="order-summary-card">
            <h3>Tóm tắt đơn hàng</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>{formattedUnit} × {seats} chỗ</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="summary-row text-muted">
                <span>Phí nền tảng</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Tổng thanh toán</span>
                <strong>{formattedTotal}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary checkout-pay-btn"
              disabled={isLoading || availableSeats === 0}
            >
              {isLoading ? (
                <span className="loading-dots">Đang xử lý<span>...</span></span>
              ) : availableSeats === 0 ? (
                'Workshop đã hết chỗ'
              ) : (
                `Tiến hành thanh toán ${formattedTotal}`
              )}
            </button>

            <p className="checkout-disclaimer">
              🔒 Thông tin thanh toán được mã hóa an toàn. Bằng cách thanh toán, bạn đồng ý với
              {' '}<Link to="/policy">Điều khoản sử dụng</Link>.
            </p>
          </div>

          <div className="refund-policy-box">
            <h4>📌 Chính sách hoàn tiền</h4>
            <ul>
              <li>Hủy trước 48h: hoàn 100%</li>
              <li>Hủy trước 24h: hoàn 80%</li>
              <li>Hủy trong vòng 24h: hoàn 50%</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default CheckoutPage;