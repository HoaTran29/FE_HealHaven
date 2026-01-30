import React, { useState } from 'react';

const CheckoutPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('momo');

  return (
    <div className="checkout-container">
      <h2>Xác nhận đặt chỗ</h2>
      <div className="order-summary">
        <p>Workshop: Vẽ màu nước thư giãn</p>
        <p>Số lượng: 2 người</p>
        <p>Tổng tiền: 700.000đ</p>
      </div>

      <div className="payment-methods">
        <h4>Chọn phương thức thanh toán</h4>
        <label>
          <input type="radio" name="pay" value="vnpay" onChange={() => setPaymentMethod('vnpay')} />
          VNPay
        </label>
        <label>
          <input type="radio" name="pay" value="momo" checked onChange={() => setPaymentMethod('momo')} />
          Ví MoMo
        </label>
      </div>

      <button className="btn-confirm">Thanh toán ngay</button>
    </div>
  );
};

export default CheckoutPage;