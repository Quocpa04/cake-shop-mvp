# API contract MVP

Base path: `/api`. Response lỗi dùng cấu trúc thống nhất:

```json
{
  "error": {
    "code": "SLOT_FULL",
    "message": "Khung giờ vừa được đặt hết chỗ",
    "details": null
  }
}
```

## Authentication

- `POST /auth/otp` — gửi/yêu cầu OTP giả lập.
- `POST /auth/verify` — xác minh OTP và trả access token.
- `GET /auth/me` — hồ sơ người dùng hiện tại.

## Catalog

- `GET /products` — danh sách sản phẩm đang bán.
- `GET /products/:id` — chi tiết, variants và thông tin dị ứng.

## Slots

- `GET /slots?date=YYYY-MM-DD` — slot hợp lệ, capacity và số chỗ còn lại.
- Lead time mặc định: bánh có sẵn 2 giờ; bánh đặt trước 24 giờ.

## Cart validation and orders

- `POST /cart/validate` — server tính lại giá, kiểm tra variant và slot.
- `POST /orders` — tạo đơn atomically; bắt buộc `Idempotency-Key`.
- `GET /orders` — lịch sử đơn của khách hiện tại.
- `GET /orders/:id` — chi tiết và timeline.
- `POST /orders/:id/cancel` — chỉ hủy trước khi bếp bắt đầu.

## Sandbox payment

- `POST /payments/create` — tạo giao dịch/QR sandbox cho đơn.
- `POST /payments/:id/simulate-success` — chỉ bật ở môi trường demo.
- Callback phải idempotent; không xác nhận thanh toán hai lần.

## Kitchen/Admin

- `GET /admin/orders?status=&date=` — danh sách và bộ lọc đơn.
- `PATCH /admin/orders/:id/status` — chuyển trạng thái hợp lệ.

## Trạng thái MVP

```text
PENDING_PAYMENT -> CONFIRMED -> IN_PRODUCTION -> READY
       |               |
       +-> CANCELLED <-+
```

Không chấp nhận client gửi giá cuối cùng. Backend lấy giá variant/phụ kiện trong database và lưu snapshot vào `order_items`.
