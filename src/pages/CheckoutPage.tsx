import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './CheckoutPage.css';

// --- DỮ LIỆU GIẢ WORKSHOP (sẽ fetch từ API dựa trên workshopId) ---
const mockWorkshopInfo = {
  id: 'workshop-dan-len',
  title: 'Workshop Đan len cơ bản',
  host: 'Nghệ nhân Trần Văn A',
  date: '2026-03-15',
  time: '09:00 - 11:00',
  location: 'Quận 3, TP.HCM',
  image: '/images/dan-len.webp',
  pricePerSeat: 399000,
  maxSeats: 10,
  availableSeats: 7,
};

type PaymentMethod = 'vnpay' | 'momo' | 'transfer';
type CheckoutStep = 'form' | 'ticket';

// --- MÃ QR PLACEHOLDER ---
const QRCodePlaceholder: React.FC<{ ticketId: string }> = ({ ticketId }) => (
  <div className="qr-placeholder">
    <div className="qr-grid">
      {Array.from({ length: 81 }).map((_, i) => (
        <div key={i} className={`qr-cell ${Math.random() > 0.45 ? 'filled' : ''}`} />
      ))}
    </div>
    <p className="qr-ticket-id">{ticketId}</p>
  </div>
);

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const workshopId = searchParams.get('workshopId') || mockWorkshopInfo.id;
  const workshop = mockWorkshopInfo; // TODO: fetch theo workshopId

  const [step, setStep] = useState<CheckoutStep>('form');
  const [seats, setSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vnpay');
  const [transferFile, setTransferFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId] = useState(`HH-${Date.now().toString(36).toUpperCase()}`);

  const totalPrice = workshop.pricePerSeat * seats;
  const formattedTotal = new Intl.NumberFormat('vi-VN').format(totalPrice) + 'đ';
  const formattedUnit = new Intl.NumberFormat('vi-VN').format(workshop.pricePerSeat) + 'đ';

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Gọi API tạo đơn hàng, xử lý thanh toán
    await new Promise(res => setTimeout(res, 1800)); // giả lập delay
    setIsLoading(false);
    setStep('ticket');
  };

  if (step === 'ticket') {
    return (
      <div className="checkout-container container">
        <div className="ticket-card">
          <div className="ticket-header">
            <div className="ticket-success-icon">✅</div>
            <h2>Đặt chỗ thành công!</h2>
            <p>Vé điện tử của bạn đã được tạo. Vui lòng xuất trình mã QR khi check-in.</p>
          </div>

          <div className="ticket-body">
            <div className="ticket-info">
              <h3>{workshop.title}</h3>
              <table className="ticket-details-table">
                <tbody>
                  <tr>
                    <td>Nghệ nhân</td>
                    <td>{workshop.host}</td>
                  </tr>
                  <tr>
                    <td>Ngày</td>
                    <td>{new Date(workshop.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td>Thời gian</td>
                    <td>{workshop.time}</td>
                  </tr>
                  <tr>
                    <td>Địa điểm</td>
                    <td>{workshop.location}</td>
                  </tr>
                  <tr>
                    <td>Số chỗ</td>
                    <td>{seats} người</td>
                  </tr>
                  <tr>
                    <td>Tổng tiền</td>
                    <td><strong className="ticket-price">{formattedTotal}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ticket-divider">
              <span className="ticket-hole left" />
              <div className="ticket-line" />
              <span className="ticket-hole right" />
            </div>

            <div className="ticket-qr">
              <QRCodePlaceholder ticketId={ticketId} />
              <p className="qr-instruction">Quét mã tại cổng check-in</p>
            </div>
          </div>

          <div className="ticket-footer">
            <Link to="/my-schedule" className="btn btn-primary">Xem lịch trình của tôi</Link>
            <Link to="/workshops" className="btn btn-secondary">Khám phá Workshop khác</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container container">
      {/* Breadcrumb */}
      <nav className="checkout-breadcrumb">
        <Link to={`/workshop/${workshopId}`}>← Quay lại Workshop</Link>
      </nav>

      <h1 className="checkout-title">Xác nhận đặt chỗ</h1>

      <form onSubmit={handlePayment} className="checkout-layout">
        {/* =================== CỘT TRÁI: FORM =================== */}
        <div className="checkout-form-col">

          {/* 1. Thông tin Workshop */}
          <section className="checkout-section">
            <h3>📋 Thông tin Workshop</h3>
            <div className="workshop-summary-mini">
              <img src={workshop.image} alt={workshop.title} />
              <div>
                <p className="wsm-title">{workshop.title}</p>
                <p className="wsm-meta">👤 {workshop.host}</p>
                <p className="wsm-meta">📅 {workshop.date} &nbsp;|&nbsp; ⏰ {workshop.time}</p>
                <p className="wsm-meta">📍 {workshop.location}</p>
                <p className="wsm-available">
                  <span className={workshop.availableSeats <= 3 ? 'seats-low' : ''}>
                    Còn {workshop.availableSeats} chỗ trống
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
                onClick={() => setSeats(s => Math.min(workshop.availableSeats, s + 1))}
                disabled={seats >= workshop.availableSeats}
              >+</button>
              <span className="seat-unit">× {formattedUnit}/người</span>
            </div>
          </section>

          {/* 3. Phương thức thanh toán */}
          <section className="checkout-section">
            <h3>💳 Phương thức thanh toán</h3>
            <div className="payment-methods">
              {([
                { id: 'vnpay', label: 'VNPay', icon: '🏦' },
                { id: 'momo', label: 'Ví MoMo', icon: '💜' },
                { id: 'transfer', label: 'Chuyển khoản ngân hàng', icon: '📱' },
              ] as { id: PaymentMethod; label: string; icon: string }[]).map(m => (
                <label
                  key={m.id}
                  className={`payment-option ${paymentMethod === m.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                  />
                  <span className="payment-icon">{m.icon}</span>
                  <span>{m.label}</span>
                </label>
              ))}
            </div>

            {paymentMethod === 'transfer' && (
              <div className="transfer-info">
                <div className="bank-info-box">
                  <p><strong>Ngân hàng:</strong> Vietcombank</p>
                  <p><strong>Số TK:</strong> 1234567890</p>
                  <p><strong>Tên TK:</strong> CONG TY HEAL HAVEN</p>
                  <p><strong>Nội dung CK:</strong> HH {ticketId}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="transfer-proof">
                    Upload minh chứng chuyển khoản
                    <span className="required"> *</span>
                  </label>
                  <div className="file-upload-area" onClick={() => document.getElementById('transfer-proof')?.click()}>
                    {transferFile ? (
                      <span>✅ {transferFile.name}</span>
                    ) : (
                      <span>📎 Nhấn để chọn ảnh / PDF</span>
                    )}
                  </div>
                  <input
                    id="transfer-proof"
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setTransferFile(e.target.files?.[0] || null)}
                    required={paymentMethod === 'transfer'}
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* =================== CỘT PHẢI: ORDER SUMMARY =================== */}
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
              disabled={isLoading || (paymentMethod === 'transfer' && !transferFile)}
            >
              {isLoading ? (
                <span className="loading-dots">Đang xử lý<span>...</span></span>
              ) : (
                `Thanh toán ${formattedTotal}`
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