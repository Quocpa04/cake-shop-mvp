# Phạm vi MVP 7 ngày

## Luồng demo bắt buộc

1. Khách đăng nhập bằng số điện thoại và OTP giả lập.
2. Khách xem catalog, mở chi tiết bánh và đổi size; giá cập nhật đúng biến thể.
3. Khách nhập chữ trên bánh tối đa 40 ký tự, lời chúc và chọn phụ kiện.
4. Khách chọn slot; slot quá khứ hoặc vi phạm lead time bị vô hiệu hóa.
5. Checkout tạo đơn `PENDING_PAYMENT`; thanh toán sandbox chuyển đơn sang `CONFIRMED`.
6. Kitchen nhận đơn, hiển thị đầy đủ size/chữ/dị ứng và chuyển sang `IN_PRODUCTION`, sau đó `READY`.
7. Mobile cập nhật timeline đơn hàng.

## Must have

- Một chi nhánh và 10–15 sản phẩm seed.
- Product variants theo size và giá.
- Giỏ hàng local, nhưng server phải tính lại giá khi tạo đơn.
- Slot có capacity và được giữ/trừ atomically khi tạo đơn.
- Không tạo hai giao dịch/đơn do người dùng bấm lặp.
- State machine chặn chuyển trạng thái sai.
- Đơn chờ thanh toán quá 15 phút được hủy và hoàn slot.
- Giao diện xử lý loading, validation và lỗi mạng rõ ràng.

## Chưa làm trong MVP

- Kho nguyên liệu/BOM và nhà cung cấp.
- Chat, báo giá và duyệt mẫu bánh custom.
- Ứng dụng shipper, bản đồ và đối tác giao hàng.
- Loyalty nâng cao, đa chi nhánh và báo cáo chuyên sâu.
- Thanh toán production; MVP sử dụng sandbox/mô phỏng có trạng thái rõ ràng.

## Tiêu chí hoàn thành

- Sáu kịch bản demo trong kế hoạch chạy xuyên suốt.
- Không có lỗi nghiêm trọng làm mất dữ liệu hoặc tạo đơn trùng.
- Vai trò khách, bếp và admin không truy cập sai chức năng.
- Định dạng giờ Việt Nam và tiền VND nhất quán.
