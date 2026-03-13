import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi, type Booking, type BookingStatus } from '../services/api';
import './MyOrdersPage.css';

// --- CẤU HÌNH TAB ---
const TABS: { key: BookingStatus | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING_CONFIRMATION', label: 'Chờ duyệt' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'ATTENDED', label: 'Đã tham gia' },
    { key: 'CANCELLED', label: 'Đã hủy' },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
    PENDING: { label: 'Chờ thanh toán', className: 'status-pending' },
    PENDING_CONFIRMATION: { label: '⏳ Đang chờ xác nhận', className: 'status-pending-confirm' },
    PAID: { label: 'Đã thanh toán', className: 'status-paid' },
    CONFIRMED: { label: 'Đã xác nhận', className: 'status-confirmed' },
    ATTENDED: { label: 'Đã tham gia', className: 'status-attended' },
    CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
    FAILED: { label: 'Thất bại', className: 'status-failed' },
};

// --- MODAL HỦY ĐƠN ---
interface CancelModalProps {
    order: Booking;
    onClose: () => void;
    onConfirm: (orderId: string, reason: string) => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ order, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const refundAmount = order.totalPrice * 0.8;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3>Xác nhận Hủy đặt chỗ</h3>
                <p className="modal-workshop-name">{order.workshopTitle}</p>

                <div className="refund-info">
                    <span>Hoàn tiền dự kiến (sau 20% phí vận hành):</span>
                    <strong className="refund-amount">
                        {new Intl.NumberFormat('vi-VN').format(refundAmount)}đ
                    </strong>
                </div>

                <div className="form-group">
                    <label htmlFor="cancel-reason">Lý do hủy <span>(bắt buộc)</span></label>
                    <textarea
                        id="cancel-reason"
                        rows={3}
                        placeholder="Vui lòng cho chúng tôi biết lý do bạn muốn hủy..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Giữ lại đơn</button>
                    <button
                        className="btn btn-danger"
                        onClick={() => reason.trim() && onConfirm(order.id, reason)}
                        disabled={!reason.trim()}
                    >
                        Xác nhận hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- CARD ĐƠN HÀNG ---
interface OrderCardProps {
    order: Booking;
    onCancelClick: (order: Booking) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancelClick }) => {
    // Ưu tiên hiển thị "Chờ duyệt" nếu bất kỳ trường nào báo hiệu trạng thái này
    const isPendingConfirm = 
        order.paymentStatus === 'PENDING_CONFIRMATION' || 
        order.status === 'PENDING_CONFIRMATION' || 
        order.bookingStatus === 'PENDING_CONFIRMATION';

    const displayStatusKey = isPendingConfirm ? 'PENDING_CONFIRMATION' : (order.status || order.bookingStatus || 'PENDING');
    const status = STATUS_CONFIG[displayStatusKey as BookingStatus] || STATUS_CONFIG['PENDING'];

    return (
        <div className={`order-card ${(order.status || 'PENDING').toLowerCase()}`}>
            <div className="order-card-image">
                <img src={order.workshopImage || '/images/ws1303.png'} alt={order.workshopTitle || 'Workshop'} />
            </div>

            <div className="order-card-body">
                <div className="order-card-header">
                    <Link to={`/workshop/${order.workshopId || ''}`} className="order-title">
                        {order.workshopTitle || 'Tên Workshop Chưa Rõ'}
                    </Link>
                    <span className={`order-status-badge ${status.className}`}>
                        {status.label}
                    </span>
                </div>

                <div className="order-meta">
                    <div className="order-meta-item">
                        <span className="meta-icon">👤</span>
                        <span>{order.host || 'Ẩn danh'}</span>
                    </div>
                    <div className="order-meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{new Date(order.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="order-meta-item">
                        <span className="meta-icon">⏰</span>
                        <span>{order.time || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="order-meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{order.location || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="order-meta-item">
                        <span className="meta-icon">🎟️</span>
                        <span>{order.quantity || order.seats} chỗ &nbsp;•&nbsp; <strong>{new Intl.NumberFormat('vi-VN').format(order.totalPrice)}đ</strong></span>
                    </div>
                </div>

                <div className="order-card-footer">
                    <span className="order-id">Mã đơn: #{order.id}</span>
                    <div className="order-actions">
                        {order.status === 'CONFIRMED' && (
                            <button className="btn btn-secondary btn-sm">Xem E-Ticket</button>
                        )}
                        {order.status === 'ATTENDED' && (
                            <Link to={`/workshop/${order.workshopId}`} className="btn btn-accent btn-sm">
                                Đánh giá
                            </Link>
                        )}
                        {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onCancelClick(order)}
                            >
                                Hủy đặt chỗ
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- TRANG CHÍNH ---
const MyOrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL');
    const [orders, setOrders] = useState<Booking[]>([]);
    const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        bookingApi.getMyList()
            .then(async data => {
                console.log("DEBUG: MyOrdersPage data received:", data);
                // Handle both direct array and paginated response { content: [] }
                let parsedOrders: Booking[] = [];
                if (Array.isArray(data)) {
                    parsedOrders = data;
                } else if (data && Array.isArray(data.content)) {
                    parsedOrders = data.content;
                }

                if (parsedOrders.length > 0) {
                    const enrichedOrders = parsedOrders.map(order => {
                        const ws = order.workshop || {};
                        return {
                            ...order,
                            workshopId: order.workshopId || ws.workshopId,
                            workshopTitle: order.workshopTitle || ws.title,
                            workshopImage: order.workshopImage || ws.primaryImage,
                            host: order.host || ws.hostName,
                            location: order.location || ws.venueAddress,
                            date: order.date || ws.startTime,
                            time: order.time || (ws.startTime ? new Date(ws.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : undefined)
                        };
                    });
                    setOrders(enrichedOrders);
                } else {
                    setOrders([]);
                }
            })
            .catch(error => {
                console.error("Lỗi tải đơn booking:", error);
                setOrders([]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const filteredOrders = Array.isArray(orders) 
        ? (activeTab === 'ALL' 
            ? orders 
            : orders.filter(o => {
                const isPendingConfirm = 
                    o.paymentStatus === 'PENDING_CONFIRMATION' || 
                    o.status === 'PENDING_CONFIRMATION' || 
                    o.bookingStatus === 'PENDING_CONFIRMATION';

                if (activeTab === 'PENDING_CONFIRMATION') {
                    return isPendingConfirm;
                }
                
                if (activeTab === 'CONFIRMED') {
                    return o.status === 'CONFIRMED' || o.bookingStatus === 'CONFIRMED' || 
                           o.status === 'PAID' || o.bookingStatus === 'PAID' || o.paymentStatus === 'PAID';
                }

                return o.status === activeTab || o.bookingStatus === activeTab;
            }))
        : [];

    const handleCancelConfirm = (orderId: string, _reason: string) => {
        // TODO: Gọi API hủy đơn và cập nhật status
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
        setCancelTarget(null);
    };

    return (
        <div className="my-orders-page container">
            <header className="orders-header">
                <h1>Lịch trình của tôi</h1>
                <p>Theo dõi toàn bộ lịch sử và trạng thái đặt chỗ workshop của bạn.</p>
            </header>

            {/* --- TABS TRẠNG THÁI --- */}
            <div className="orders-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`orders-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                        {tab.key !== 'ALL' && Array.isArray(orders) && (
                            <span className="tab-count">
                                {orders.filter(o => {
                                    const isPendingConfirm = 
                                        o.paymentStatus === 'PENDING_CONFIRMATION' || 
                                        o.status === 'PENDING_CONFIRMATION' || 
                                        o.bookingStatus === 'PENDING_CONFIRMATION';

                                    if (tab.key === 'PENDING_CONFIRMATION') {
                                        return isPendingConfirm;
                                    }
                                    
                                    if (tab.key === 'CONFIRMED') {
                                        return o.status === 'CONFIRMED' || o.bookingStatus === 'CONFIRMED' || 
                                               o.status === 'PAID' || o.bookingStatus === 'PAID' || o.paymentStatus === 'PAID';
                                    }

                                    return o.status === tab.key || o.bookingStatus === tab.key;
                                }).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* --- DANH SÁCH ĐƠN HÀNG --- */}
            <div className="orders-list">
                {isLoading ? (
                    <div className="orders-empty">Đang tải lịch trình...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="orders-empty">
                        <p className="empty-icon">📭</p>
                        <p>Chưa có đơn đặt chỗ nào</p>
                        <Link to="/workshops" className="btn btn-primary">Khám phá Workshop</Link>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onCancelClick={setCancelTarget}
                        />
                    ))
                )}
            </div>

            {/* --- MODAL HỦY ĐƠN --- */}
            {cancelTarget && (
                <CancelModal
                    order={cancelTarget}
                    onClose={() => setCancelTarget(null)}
                    onConfirm={handleCancelConfirm}
                />
            )}
        </div>
    );
};

export default MyOrdersPage;
