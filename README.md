# Cake Shop MVP

Monorepo cho bản prototype/MVP hệ thống bán bánh kem trực tuyến theo tài liệu BRD/SRS và kế hoạch 2 developer trong 7 ngày.

## Phạm vi MVP

- Mobile khách hàng: OTP giả lập, catalog, chi tiết/biến thể bánh, cá nhân hóa, giỏ hàng, slot, checkout, thanh toán sandbox và theo dõi đơn.
- API: xác thực, sản phẩm, slot, đơn hàng, thanh toán giả lập và kiểm soát chuyển trạng thái.
- Admin/Kitchen: danh sách đơn, lọc trạng thái và thao tác `CONFIRMED -> IN_PRODUCTION -> READY`.
- Một chi nhánh, dữ liệu demo seed sẵn.

Kho BOM, chat bánh custom, ứng dụng shipper và đa chi nhánh nằm ngoài bản MVP 7 ngày.

## Cấu trúc

```text
apps/mobile       Expo React Native
apps/api          Node.js API
apps/admin-web    Admin và Kitchen responsive
packages/shared   API types, order statuses và quy tắc dùng chung
docs              Phạm vi, API contract và quy trình Git
```

## Bắt đầu

```powershell
Copy-Item .env.example .env
npm.cmd install
```

Các lệnh chạy sẽ được hoàn thiện cùng từng ứng dụng. Không commit file `.env`.

## Git

- `main`: phiên bản ổn định để demo.
- `develop`: nhánh tích hợp.
- Mọi thay đổi thực hiện trên `feature/*`, sau đó merge vào `develop`.

Xem [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) để làm việc đồng thời mà không ghi đè code.
