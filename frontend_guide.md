# 📋 Hướng Dẫn Tích Hợp Frontend — HealHaven

> Tài liệu này dành cho team **Frontend**, mô tả các thay đổi API từ phía Backend.

---

## 🏦 Thanh Toán Qua SePay (Thay Đổi Lớn)

### ❌ Đã xóa — FE cần bỏ:
- Nút **"Xác nhận đã chuyển khoản"** (`POST /api/payments/confirm/{bookingId}`)
- Toàn bộ flow **VNPay** redirect
- Admin: trang duyệt thanh toán (pending / approve / reject)

### ✅ Flow mới:

```
User tạo booking → Hiển thị QR → User chuyển tiền → Tự động xác nhận
```

### Thông tin ngân hàng:

| | Giá trị |
|---|---|
| **Ngân hàng** | MB Bank |
| **Số tài khoản** | `0765953577` |
| **Chủ TK** | *(tên chủ tài khoản)* |

### Tạo QR Code (VietQR):

```javascript
// Hàm tạo URL QR chuyển khoản
function getPaymentQR(bookingId, amount) {
  const bankId = "MB";
  const accountNo = "0765953577";
  const content = `HH${bookingId}`;

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;
}

// Sử dụng:
const qrUrl = getPaymentQR(booking.bookingId, booking.totalPrice);
// <img src={qrUrl} alt="QR Chuyển khoản" />
```

> ⚠️ **Nội dung chuyển khoản BẮT BUỘC phải chứa `HH{bookingId}`** (ví dụ: `HH123`).
> Backend dùng pattern này để tự động match giao dịch với booking.

### Giao diện trang thanh toán cần có:

1. **Mã QR** — dùng URL VietQR ở trên
2. **Thông tin text** (backup nếu không scan được):
   - Ngân hàng: **MB Bank**
   - STK: **0765953577**
   - Số tiền: **{totalPrice} VNĐ**
   - Nội dung: **HH{bookingId}**
3. **Trạng thái realtime**: `Đang chờ...` → `Thanh toán thành công! 🎉`
4. **Cảnh báo**: _"Vui lòng nhập đúng nội dung chuyển khoản để hệ thống tự động xác nhận"_

### Polling trạng thái thanh toán:

```javascript
async function pollPaymentStatus(bookingId, token) {
  const interval = setInterval(async () => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { data } = await res.json();

    if (data.paymentStatus === "PAID") {
      clearInterval(interval);
      // 🎉 Chuyển sang màn "Thanh toán thành công"
    }
  }, 5000); // Mỗi 5 giây

  // Tự dừng sau 10 phút
  setTimeout(() => clearInterval(interval), 600000);
}
```

---

## 🖼️ Upload Ảnh (Supabase Storage)

### Không cần thay đổi code FE!

API upload **giữ nguyên** format. Khác biệt duy nhất: `cloudUrl` giờ là **full URL** thay vì relative path.

**Trước:** `/uploads/abc.jpg` → cần ghép thêm domain
**Sau:** `https://rtahmkkunlwacxdyrnrx.supabase.co/storage/v1/object/public/workshop-images/workshop/abc.jpg` → dùng trực tiếp

```html
<!-- Dùng trực tiếp, không cần prefix -->
<img src={cloudUrl} />
```

---

## 📡 API Endpoints

### Booking & Thanh toán:

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/bookings` | Tạo booking → nhận `bookingId` + `totalPrice` |
| `GET` | `/api/bookings/{id}` | Xem booking (dùng để poll `paymentStatus`) |
| `GET` | `/api/bookings/my-bookings` | Danh sách booking của user |

### Upload ảnh:

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/media/upload` | Upload ảnh (multipart/form-data) |
| `DELETE` | `/api/media/{mediaId}` | Xóa ảnh |

### ❌ Endpoints đã xóa (FE cần gỡ bỏ):

| Endpoint | Thay thế bởi |
|----------|--------------|
| `POST /api/payments/confirm/{id}` | SePay tự động |
| `GET /api/admin/payments/pending` | Đã xóa |
| `PUT /api/admin/payments/{id}/approve` | SePay tự động |
| `PUT /api/admin/payments/{id}/reject` | Đã xóa |

---

## 🔑 Giá trị quan trọng

| Key | Giá trị |
|-----|---------|
| Bank ID (VietQR) | `MB` |
| Số tài khoản | `0765953577` |
| Prefix nội dung CK | `HH` + bookingId |
| Backend URL | `https://be-healhaven.onrender.com/api` |
