import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { paymentApi } from '../services/api';
import './PaymentResultPage.css';

/**
 * Trang kết quả thanh toán VNPay.
 * VNPay redirect về: /payment/result?vnp_ResponseCode=00&vnp_Amount=...
 * FE gọi BE verify: GET /payments/vnpay-return?<toàn bộ query string>
 */

const VNPAY_CODES: Record<string, string> = {
    '00': 'Thanh toán thành công',
    '24': 'Giao dịch bị hủy bởi người dùng',
    '51': 'Tài khoản không đủ số dư',
    '65': 'Vượt hạn mức giao dịch trong ngày',
    '07': 'Trừ tiền thành công nhưng bị nghi ngờ gian lận',
};

type VerifyStatus = 'loading' | 'success' | 'failed' | 'error';

const PaymentResultPage: React.FC = () => {
    const location = useLocation();
    const queryString = location.search; // "?vnp_Amount=...&vnp_ResponseCode=00&..."

    const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('loading');
    const [message, setMessage] = useState('');
    const [responseCode, setResponseCode] = useState('');
    const [booking, setBooking] = useState<{ id?: string; workshopTitle?: string; totalPrice?: number } | null>(null);

    useEffect(() => {
        if (!queryString) {
            setVerifyStatus('error');
            setMessage('Không tìm thấy thông tin thanh toán. Vui lòng liên hệ hỗ trợ.');
            return;
        }

        // Lấy mã kết quả từ URL để hiển thị ngay (không cần đợi BE)
        const params = new URLSearchParams(queryString);
        setResponseCode(params.get('vnp_ResponseCode') || '');

        // Gọi BE để xác thực chữ ký VNPay
        paymentApi.verifyVnpayReturn(queryString)
            .then(result => {
                if (result.success) {
                    setVerifyStatus('success');
                    setMessage(result.message || 'Thanh toán thành công!');
                    if (result.data) {
                        setBooking({
                            id: result.data.id,
                            workshopTitle: result.data.workshopTitle,
                            totalPrice: result.data.totalPrice,
                        });
                    }
                } else {
                    setVerifyStatus('failed');
                    setMessage(result.message || 'Thanh toán thất bại.');
                }
            })
            .catch(() => {
                setVerifyStatus('error');
                setMessage('Không thể kết nối đến máy chủ để xác thực thanh toán.');
            });
    }, [queryString]);

    // —— Loading ——
    if (verifyStatus === 'loading') {
        return (
            <div className="pres-container container">
                <div className="pres-card">
                    <div className="pres-spinner">🔄</div>
                    <h2>Đang xác thực thanh toán...</h2>
                    <p>Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        );
    }

    // —— Success ——
    if (verifyStatus === 'success') {
        return (
            <div className="pres-container container">
                <div className="pres-card pres-success">
                    <div className="pres-icon">🎉</div>
                    <h2>Thanh toán thành công!</h2>
                    <p className="pres-message">{message}</p>

                    {booking && (
                        <div className="pres-booking-info">
                            {booking.workshopTitle && (
                                <div className="pres-info-row">
                                    <span>Workshop</span>
                                    <strong>{booking.workshopTitle}</strong>
                                </div>
                            )}
                            {booking.id && (
                                <div className="pres-info-row">
                                    <span>Mã đặt chỗ</span>
                                    <code className="pres-booking-id">#{booking.id}</code>
                                </div>
                            )}
                            {booking.totalPrice && (
                                <div className="pres-info-row highlight">
                                    <span>Tổng thanh toán</span>
                                    <strong className="pres-amount">
                                        {new Intl.NumberFormat('vi-VN').format(booking.totalPrice)}đ
                                    </strong>
                                </div>
                            )}
                        </div>
                    )}

                    <p className="pres-note">
                        🎫 Vé điện tử và mã QR check-in đã được gửi vào lịch trình của bạn.
                    </p>

                    <div className="pres-actions">
                        <Link to="/my-schedule" className="btn btn-primary">Xem vé của tôi</Link>
                        <Link to="/workshops" className="btn btn-secondary">Khám phá Workshop khác</Link>
                    </div>
                </div>
            </div>
        );
    }

    // —— Failed / Error ——
    const isCancelled = responseCode === '24';
    return (
        <div className="pres-container container">
            <div className="pres-card pres-failed">
                <div className="pres-icon">{isCancelled ? '↩️' : '❌'}</div>
                <h2>{isCancelled ? 'Giao dịch đã bị hủy' : 'Thanh toán thất bại'}</h2>
                <p className="pres-message">{message}</p>

                {responseCode && VNPAY_CODES[responseCode] && (
                    <div className="pres-error-code">
                        <span>Lý do:</span>
                        <strong>{VNPAY_CODES[responseCode]}</strong>
                    </div>
                )}

                <div className="pres-actions">
                    <Link to="/checkout" className="btn btn-primary">Thử lại thanh toán</Link>
                    <Link to="/workshops" className="btn btn-secondary">Quay về Workshop</Link>
                </div>

                <p className="pres-support">
                    Nếu bạn đã bị trừ tiền nhưng đặt chỗ thất bại, vui lòng liên hệ{' '}
                    <a href="mailto:support@healhaven.vn">support@healhaven.vn</a>
                </p>
            </div>
        </div>
    );
};

export default PaymentResultPage;
