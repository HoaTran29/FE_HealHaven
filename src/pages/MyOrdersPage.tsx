import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MyOrdersPage.css';

// --- KIỂU DỮ LIỆU ---
type OrderStatus = 'pending' | 'confirmed' | 'attended' | 'cancelled';

interface Order {
    id: string;
    workshopId: string;
    workshopTitle: string;
    workshopImage: string;
    host: string;
    date: string;
    time: string;
    location: string;
    seats: number;
    totalPrice: string;
    status: OrderStatus;
}

// --- DỮ LIỆU GIẢ (Sẽ thay bằng API call) ---
const mockOrders: Order[] = [
    {
        id: 'ORD-001',
        workshopId: 'workshop-dan-len',
        workshopTitle: 'Workshop Đan len cơ bản',
        workshopImage: '/images/dan-len.webp',
        host: 'Nghệ nhân Trần Văn A',
        date: '2026-03-15',
        time: '09:00 - 11:00',
        location: 'Quận 3, TP.HCM',
        seats: 2,
        totalPrice: '798.000đ',
        status: 'confirmed',
    },
    {
        id: 'ORD-002',
        workshopId: 've-mau-nuoc',
        workshopTitle: 'Vẽ màu nước: Thiên nhiên',
        workshopImage: '/images/mau-nuoc.webp',
        host: 'Nghệ nhân Lê Thị B',
        date: '2026-03-20',
        time: '14:00 - 16:30',
        location: 'Quận 1, TP.HCM',
        seats: 1,
        totalPrice: '599.000đ',
        status: 'pending',
    },
    {
        id: 'ORD-003',
        workshopId: 'hoa-kem-nhung',
        workshopTitle: 'Hoa Kẽm nhung nghệ thuật',
        workshopImage: '/images/kem-nhung.webp',
        host: 'Nghệ nhân Nguyễn Văn C',
        date: '2026-02-10',
        time: '10:00 - 12:00',
        location: 'Quận 7, TP.HCM',
        seats: 1,
        totalPrice: '450.000đ',
        status: 'attended',
    },
    {
        id: 'ORD-004',
        workshopId: 'workshop-dan-len',
        workshopTitle: 'Workshop Đan len cơ bản',
        workshopImage: '/images/dan-len.webp',
        host: 'Nghệ nhân Trần Văn A',
        date: '2026-01-20',
        time: '09:00 - 11:00',
        location: 'Quận 3, TP.HCM',
        seats: 1,
        totalPrice: '399.000đ',
        status: 'cancelled',
    },
];

// --- CẤU HÌNH TAB ---
const TABS: { key: OrderStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ thanh toán' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'attended', label: 'Đã tham gia' },
    { key: 'cancelled', label: 'Đã hủy' },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: 'Chờ thanh toán', className: 'status-pending' },
    confirmed: { label: 'Đã xác nhận', className: 'status-confirmed' },
    attended: { label: 'Đã tham gia', className: 'status-attended' },
    cancelled: { label: 'Đã hủy', className: 'status-cancelled' },
};

// --- MODAL HỦY ĐƠN ---
interface CancelModalProps {
    order: Order;
    onClose: () => void;
    onConfirm: (orderId: string, reason: string) => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ order, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const refundAmount = parseFloat(order.totalPrice.replace(/\./g, '').replace('đ', '')) * 0.8;

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
    order: Order;
    onCancelClick: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancelClick }) => {
    const status = STATUS_CONFIG[order.status];

    return (
        <div className={`order-card ${order.status}`}>
            <div className="order-card-image">
                <img src={order.workshopImage} alt={order.workshopTitle} />
            </div>

            <div className="order-card-body">
                <div className="order-card-header">
                    <Link to={`/workshop/${order.workshopId}`} className="order-title">
                        {order.workshopTitle}
                    </Link>
                    <span className={`order-status-badge ${status.className}`}>
                        {status.label}
                    </span>
                </div>

                <div className="order-meta">
                    <div className="order-meta-item">
                        <span className="meta-icon">👤</span>
                        <span>{order.host}</span>
                    </div>
                    <div className="order-meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{new Date(order.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="order-meta-item">
                        <span className="meta-icon">⏰</span>
                        <span>{order.time}</span>
                    </div>
                    <div className="order-meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{order.location}</span>
                    </div>
                    <div className="order-meta-item">
                        <span className="meta-icon">🎟️</span>
                        <span>{order.seats} chỗ &nbsp;•&nbsp; <strong>{order.totalPrice}</strong></span>
                    </div>
                </div>

                <div className="order-card-footer">
                    <span className="order-id">Mã đơn: #{order.id}</span>
                    <div className="order-actions">
                        {order.status === 'confirmed' && (
                            <button className="btn btn-secondary btn-sm">Xem E-Ticket</button>
                        )}
                        {order.status === 'attended' && (
                            <Link to={`/workshop/${order.workshopId}`} className="btn btn-accent btn-sm">
                                Đánh giá
                            </Link>
                        )}
                        {(order.status === 'pending' || order.status === 'confirmed') && (
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
    const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(o => o.status === activeTab);

    const handleCancelConfirm = (orderId: string, _reason: string) => {
        // TODO: Gọi API hủy đơn với { orderId, reason }
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o));
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
                        {tab.key !== 'all' && (
                            <span className="tab-count">
                                {orders.filter(o => o.status === tab.key).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* --- DANH SÁCH ĐƠN HÀNG --- */}
            <div className="orders-list">
                {filteredOrders.length === 0 ? (
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
