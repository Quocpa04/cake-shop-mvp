# Kịch bản demo end-to-end

1. Chạy API, Admin và mobile theo README.
2. Mobile đăng nhập `0912345678`, OTP `123456`.
3. Mở một bánh, đổi size 18cm sang 20cm và kiểm tra giá cập nhật.
4. Nhập chữ bánh, chọn nến/thiệp và thêm vào giỏ.
5. Chọn ngày/slot hợp lệ, chọn nhận tại cửa hàng hoặc giao tận nơi.
6. Tạo đơn và mô phỏng thanh toán thành công; đơn thành `CONFIRMED`.
7. Web Kitchen đăng nhập `0900000002`, OTP `123456`; đơn mới tự xuất hiện.
8. Bếp bấm **Bắt đầu làm**; mobile cập nhật `IN_PRODUCTION` trong tối đa 3 giây.
9. Bếp bấm **Hoàn thành bánh**; mobile cập nhật `READY`.

Kiểm tra ngoại lệ:

- Slot quá khứ/đầy bị vô hiệu hóa.
- Bánh đặt trước yêu cầu tối thiểu 24 giờ.
- Chữ bánh dài hơn 40 ký tự không được gửi.
- Cùng Idempotency-Key không tạo đơn thứ hai.
- Kitchen không thể chuyển `CONFIRMED` thẳng sang `READY`.
- Khách không thể hủy sau khi bếp bắt đầu.
