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

## Cài đặt

```powershell
Copy-Item .env.example .env
npm.cmd install
```

Không commit file `.env`.

## Chạy hệ thống

Mở ba terminal tại thư mục gốc:

```powershell
npm.cmd run dev:api
npm.cmd run dev:admin
npm.cmd run dev:mobile
```

- API: `http://localhost:4000/api`
- Admin/Kitchen: `http://localhost:3000`
- Android Emulator gọi API bằng `http://10.0.2.2:4000/api`.

| Vai trò | Số điện thoại | OTP |
|---|---|---|
| Customer | `0912345678` | `123456` |
| Kitchen | `0900000002` | `123456` |
| Admin | `0900000003` | `123456` |

## Android Studio

Mở thư mục `apps/mobile/android` bằng Android Studio, chờ Gradle Sync rồi chạy cấu hình `app`. API phải đang chạy trên cổng 4000. Tạo APK debug:

```powershell
cd apps\mobile\android
.\gradlew.bat assembleDebug
```

APK nằm tại `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`. Xem [docs/ANDROID_STUDIO.md](docs/ANDROID_STUDIO.md).

## Kiểm tra

```powershell
npm.cmd test
npm.cmd run build:admin
cd apps\mobile
npx.cmd expo export --platform android --output-dir dist-test --clear
```

## Git

- `main`: phiên bản ổn định để demo.
- `develop`: nhánh tích hợp.
- Mọi thay đổi thực hiện trên `feature/*`, sau đó merge vào `develop`.

Xem [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) để làm việc đồng thời mà không ghi đè code.
