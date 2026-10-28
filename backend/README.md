# 🍰 Miette Bakery - Backend & MongoDB Database

Hệ thống Database MongoDB và Backend REST API độc lập, **chạy trên cổng riêng 27018** để không ảnh hưởng đến bất kỳ dự án nào khác đang dùng port 27017 trên máy.

---

## 📌 1. Thông Tin Kết Nối MongoDB Compass

Mở phần mềm **MongoDB Compass** (đang mở trên máy của bạn):
1. Bấm nút **`+ Add new connection`** (hoặc nút **`+`** ở góc trên thanh CONNECTIONS bên trái).
2. Dán chuỗi kết nối sau vào ô URI:
   ```
   mongodb://localhost:27018
   ```
3. Bấm **Connect** (hoặc Save & Connect và đặt tên: `Miette Bakery (Port 27018)`).
4. Bạn sẽ thấy ngay Database: **`miette_bakery`** với 4 collections:
   - `products` (Danh sách 8 món bánh kem & thông số dinh dưỡng, giá bán, size)
   - `orders` (Danh sách đơn hàng, chữ viết kem, tiến độ sản xuất, khiếu nại)
   - `categories` (Các danh mục bánh)
   - `occasions` (Các dịp đặc biệt: Sinh nhật, Kỷ niệm, Cưới hỏi)

> **Lưu ý an toàn:** Port `27017` của bạn hoàn toàn nguyên vẹn 100%, không bị chạm tới.

---

## 🚀 2. Backend REST API (Port 5000)

Server Express đã khởi chạy tại: **`http://localhost:5000`**

### Các Endpoint API chính:
- `GET /api/health`: Kiểm tra trạng thái kết nối Database.
- `GET /api/products`: Lấy toàn bộ sản phẩm (hỗ trợ query: `?category=birthday&gender=female&sort=price_desc`).
- `GET /api/products/:id`: Xem chi tiết 1 sản phẩm.
- `GET /api/orders`: Danh sách đơn hàng.
- `POST /api/orders`: Tạo đơn hàng mới từ quầy POS hoặc Mobile App.
- `PATCH /api/orders/:orderCode/status`: Cập nhật trạng thái quy trình đơn hàng.
- `GET /api/categories`: Danh mục sản phẩm.
- `GET /api/occasions`: Danh sách dịp đáng nhớ.

---

## 🛠️ 3. Các File Chạy Nhanh (Click đúp chuột)
- [start_mongodb_27018.bat](file:///c:/Users/letha/Downloads/MMA301/start_mongodb_27018.bat): Khởi động MongoDB Port 27018.
- [start_backend.bat](file:///c:/Users/letha/Downloads/MMA301/start_backend.bat): Khởi động Backend API Port 5000.
- [seed_database.bat](file:///c:/Users/letha/Downloads/MMA301/seed_database.bat): Nạp lại dữ liệu mẫu vào MongoDB.
