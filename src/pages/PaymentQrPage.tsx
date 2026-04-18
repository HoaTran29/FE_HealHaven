import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { bookingApi } from '../services/api';
import './PaymentQrPage.css';

const PaymentQrPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const bookingId = searchParams.get('bookingId') || '';

    const [amount, setAmount] = useState<number>(0);
    const [workshopTitle, setWorkshopTitle] = useState<string>('Workshop');
    const [status, setStatus] = useState<string>('PENDING'); // PENDING | PAID | CANCELLED
    const [loadingInfo, setLoadingInfo] = useState(true);
    
    // URL QR tự động từ API của VietQR cho MB Bank - 0765953577
    const BANK_ID = "MB";
    const ACCOUNT_NO = "0765953577";
    const content = `HH${bookingId}`;
    const qrUrl = amount > 0 ? `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(content)}` : '';

    const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

    // Fetch booking info
    const fetchBookingInfo = useCallback(async () => {
        if (!bookingId) {
            setLoadingInfo(false);
            return;
        }
        try {
            const data = await bookingApi.getById(bookingId);
            setAmount(data.totalPrice || 0);
            setWorkshopTitle(data.workshopTitle || 'Workshop');
            
            // Lấy paymentStatus từ BE, nếu không có tạm dùng status (cách BE trả về có thể gộp chung tuỳ spec)
            // Note: Hướng dẫn FE bảo fetch: GET /bookings/{bookingId} => .paymentStatus
            // API return type hiện tại là BookingStatus (PENDING | CONFIRMED | ATTENDED | CANCELLED)
            // Nhưng docs nói paymentStatus có: PENDING | PAID. 
            // Chúng ta casting kiểu generic:
            const bookingAny = data as any; 
            const paymentStatus = bookingAny.paymentStatus || data.status;
            
            setStatus(paymentStatus);
        } catch (error) {
            console.error('Không thể tải thông tin booking:', error);
        } finally {
            setLoadingInfo(false);
        }
    }, [bookingId]);

    useEffect(() => {
        fetchBookingInfo();
    }, [fetchBookingInfo]);

    // Polling kiểm tra trạng thái thanh toán mỗi 5 giây
    useEffect(() => {
        if (status === 'PAID' || status === 'REFUNDED') return;
        
        const interval = setInterval(fetchBookingInfo, 5000);
        
        // Tự động ngừng sau 10 phút (600,000ms) để không bị spam server
        const timeout = setTimeout(() => {
            clearInterval(interval);
        }, 600000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [fetchBookingInfo, status]);

    // Khi đã duyệt thành công → tự chuyển sang ds lịch trình
    useEffect(() => {
        if (status === 'PAID') {
            const timer = setTimeout(() => navigate('/my-schedule'), 2000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);


    if (loadingInfo) {
        return (
            <div className="pqr-container container">
                <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải thông tin...</div>
            </div>
        );
    }

    if (status === 'PAID') {
        return (
            <div className="pqr-container container">
                <div className="pqr-success-card">
                    <div className="pqr-success-icon">🎉</div>
                    <h2>Thanh toán thành công!</h2>
                    <p>Vé đã được xác nhận. Đang chuyển đến lịch trình của bạn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pqr-container container">
            <nav className="pqr-breadcrumb">
                <Link to="/workshops">← Về trang Workshop</Link>
            </nav>

            <div className="pqr-card">
                {/* Header */}
                <div className="pqr-header">
                    <div className="pqr-header-icon">🏦</div>
                    <div>
                        <h2 className="pqr-title">Thanh toán Chuyển khoản QR</h2>
                        <p className="pqr-subtitle">Quét mã QR bằng ứng dụng ngân hàng để thanh toán</p>
                    </div>
                </div>

                <div className="pqr-body">
                    {/* QR Code */}
                    <div className="pqr-qr-section">
                        <div className="pqr-qr-wrap">
                            {qrUrl && <img src={qrUrl} alt="Mã QR Thanh Toán" className="pqr-qr-img" />}
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="pqr-info-section">
                        <div className="pqr-info-card">
                            <h3>Chi tiết đơn hàng</h3>
                            <div className="pqr-info-rows">
                                <div className="pqr-info-row">
                                    <span>Workshop</span>
                                    <strong>{workshopTitle}</strong>
                                </div>
                                <div className="pqr-info-row">
                                    <span>Mã đặt chỗ</span>
                                    <code className="pqr-booking-id">{bookingId}</code>
                                </div>
                                <div className="pqr-info-row highlight">
                                    <span>Số tiền cần chuyển</span>
                                    <strong className="pqr-amount">{formattedAmount}</strong>
                                </div>
                                <div className="pqr-info-row highlight" style={{ borderTop: '1px dashed #e2e8f0', marginTop: '12px', paddingTop: '12px' }}>
                                    <span>Nội dung chuyển khoản (bắt buộc)</span>
                                    <strong className="pqr-amount" style={{ color: '#0f172a', letterSpacing: '1px' }}>HH{bookingId}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="pqr-steps">
                            <h4>Hoặc chuyển khoản thủ công:</h4>
                            <ul>
                                <li>Ngân hàng: <strong>MB Bank</strong></li>
                                <li>Số tài khoản: <strong>0765953577</strong></li>
                                <li>Số tiền: <strong>{formattedAmount}</strong></li>
                                <li>Nội dung CK: <strong style={{color: '#e53e3e'}}>HH{bookingId}</strong></li>
                            </ul>
                            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#64748b' }}>
                                ⚠️ Vui lòng nhập ĐÚNG nội dung chuyển khoản để hệ thống tự động xác nhận sau 1-2 phút.
                            </div>
                        </div>

                        <div className="pqr-actions">
                            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                🔄 Đang chờ thanh toán... 
                                (Hệ thống tự động xác nhận)
                            </div>
                            <Link to="/my-schedule" className="pqr-cancel-link" style={status !== 'PENDING' ? { marginTop: '16px' } : {}}>
                                Xem lịch trình của tôi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentQrPage;
