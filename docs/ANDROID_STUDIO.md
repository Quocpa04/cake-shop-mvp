# Chạy mobile bằng Android Studio

## Yêu cầu

- Node.js 22.13 trở lên và đã chạy `npm install` ở thư mục gốc.
- Android Studio với Android SDK, Platform Tools và một Android Virtual Device.
- Java 21 hoặc JBR đi kèm Android Studio.

## Mở project

1. Mở Android Studio và chọn **Open**.
2. Chọn thư mục `apps/mobile/android`, không chọn thư mục gốc monorepo.
3. Chờ Gradle Sync hoàn tất.
4. Tạo/chọn Android Virtual Device rồi chạy cấu hình `app`.

## Chạy API và ứng dụng

Terminal 1 tại thư mục gốc:

```powershell
npm.cmd run dev:api
```

Terminal 2:

```powershell
npm.cmd run android --workspace @cake-shop/mobile
```

Android Emulator truy cập máy phát triển qua `10.0.2.2`, đã được cấu hình mặc định. Nếu chạy điện thoại thật, tạo `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://DIA_CHI_IP_LAN_CUA_MAY:4000/api
```

Điện thoại và máy tính phải cùng Wi-Fi; firewall phải cho phép cổng 4000.

## APK debug

```powershell
cd apps\mobile\android
.\gradlew.bat assembleDebug
```

Kết quả: `app/build/outputs/apk/debug/app-debug.apk`.

`debug.keystore` chỉ dùng cho bản demo, không dùng để ký bản phát hành Google Play.
