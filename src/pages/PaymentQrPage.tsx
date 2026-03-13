import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { bookingApi, paymentApi } from '../services/api';
import './PaymentQrPage.css';

const PaymentQrPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const bookingId = searchParams.get('bookingId') || '';

    const [amount, setAmount] = useState<number>(0);
    const [workshopTitle, setWorkshopTitle] = useState<string>('Workshop');
    const [status, setStatus] = useState<string>('PENDING'); // PENDING | PENDING_CONFIRMATION | PAID | REFUNDED
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [confirming, setConfirming] = useState(false);
    
    // URL QR tĩnh từ thư mục public/images
    const qrUrl = '/images/QR.png';

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
            // nhưng docs nói paymentStatus có: PENDING | PENDING_CONFIRMATION | PAID | REFUNDED. 
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

    // Polling kiểm tra trạng thái thanh toán mỗi 5 giây nếu đang PENDING / PENDING_CONFIRMATION
    useEffect(() => {
        if (status === 'PAID' || status === 'REFUNDED') return;
        
        const interval = setInterval(fetchBookingInfo, 5000);
        return () => clearInterval(interval);
    }, [fetchBookingInfo, status]);

    // Khi đã duyệt thành công → tự chuyển sang ds lịch trình
    useEffect(() => {
        if (status === 'PAID') {
            const timer = setTimeout(() => navigate('/my-schedule'), 2000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    // User bấm "Tôi đã chuyển tiền"
    const handleConfirmPayment = async () => {
        setConfirming(true);
        try {
            const res = await paymentApi.confirmPayment(bookingId);
            // API sẽ trả về booking detail cập nhật. Check `message` và `status`
            if (res && res.paymentStatus) {
                setStatus(res.paymentStatus);
            } else {
                setStatus('PENDING_CONFIRMATION');
            }
        } catch (error: any) {
            alert(error.message || 'Có lỗi xảy ra khi xác nhận thanh toán.');
        } finally {
            setConfirming(false);
        }
    };

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
                            <img src={qrUrl} alt="Mã QR Thanh Toán" className="pqr-qr-img" />
                            {status === 'PENDING_CONFIRMATION' && (
                                <div className="pqr-countdown" style={{ color: '#f59e0b', backgroundColor: '#fef3c7' }}>
                                    ⏳ Đang chờ xác nhận từ Admin
                                </div>
                            )}
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
                                    <span>Nội dung chuyển khoản</span>
                                    <strong className="pqr-amount" style={{ color: '#0f172a', letterSpacing: '1px' }}>HEALHAVEN {bookingId}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="pqr-steps">
                            <h4>Hướng dẫn thanh toán:</h4>
                            <ol>
                                <li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                                <li>Chọn <strong>Quét QR</strong> và hướng camera vào mã QR.</li>
                                <li>Kiểm tra lại <strong>Số tiền</strong> và <strong>Nội dung: HEALHAVEN {bookingId}</strong></li>
                                <li>Thanh toán và bấm nút "Tôi đã chuyển tiền" bên dưới.</li>
                            </ol>
                        </div>

                        <div className="pqr-actions">
                            {status === 'PENDING' ? (
                                <button
                                    className="btn btn-primary pqr-check-btn"
                                    onClick={handleConfirmPayment}
                                    disabled={confirming}
                                >
                                    {confirming ? '🔄 Đang gửi...' : '✅ Tôi đã chuyển tiền'}
                                </button>
                            ) : (
                                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    Chúng tôi đang kiểm tra và sẽ xác nhận thanh toán của bạn sớm nhất có thể.
                                </div>
                            )}
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
