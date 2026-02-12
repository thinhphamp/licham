# Hướng dẫn Build Xcode và Cài đặt qua AltStore (Khi hết hạn Developer Program)

Khi tài khoản Apple Developer bị hết hạn, bạn không thể sử dụng EAS Build (cloud) để tự động đăng ký Bundle ID. Hướng dẫn này giúp bạn build bộ cài đặt `.ipa` thủ công trên máy tính và cài đặt qua AltStore.

## Bước 1: Chuẩn bị mã nguồn Native

Nếu bạn chưa có thư mục `ios` trong dự án, hãy chạy lệnh sau:

```bash
npx expo prebuild
```

## Bước 2: Cấu hình trong Xcode

1. Mở file `ios/LichViet.xcworkspace` bằng Xcode.
2. Chọn project **LichViet** ở cột bên trái.
3. Trong tab **General**:
   - Kiểm tra **Bundle Identifier** (ví dụ: `com.thinh.lichviet.personal`).
4. Trong tab **Signing & Capabilities**:
   - Chọn **Team** là Apple ID cá nhân của bạn.
   - Nếu gặp lỗi "Failed to register bundle identifier", hãy thử đổi tên Bundle ID thành một tên khác duy nhất (ví dụ thêm số hoặc ký tự: `com.thinh.lichviet.personal.v1`). Xcode sẽ tự động đăng ký ID này dưới dạng tài khoản cá nhân miễn phí.

## Bước 3: Build ứng dụng ở chế độ Release

Để ứng dụng chạy mượt mà và không cần server development, chúng ta cần build bản Release:

1. Trên thanh công cụ Xcode, chọn thiết bị là **Any iOS Device (arm64)**.
2. Menu **Product** > **Scheme** > **Edit Scheme...**.
3. Chọn mục **Run** ở cột trái, đổi **Build Configuration** từ `Debug` sang **Release**. Nhấn Close.
4. Nhấn **Cmd + B** (hoặc Product > Build) để bắt đầu build.

## Bước 4: Tạo file .ipa từ bản build

1. Sau khi build xong, bạn cần tìm file `.app`. Cách nhanh nhất:
   - Mở Xcode **Settings** (Cmd + ,) > **Locations**.
   - Nhấn vào mũi tên nhỏ bên cạnh đường dẫn **Derived Data**.
   - Trong thư mục vừa mở, tìm theo cấu trúc: `LichViet-xxxx/Build/Products/Release-iphoneos/LichViet.app`.
2. Tạo một thư mục mới tên là `Payload` (viết hoa chữ P).
3. Copy file `LichViet.app` vào trong thư mục `Payload`.
4. Nén thư mục `Payload` thành file `.zip`.
5. Đổi tên file vừa nén từ `Payload.zip` thành `LichViet.ipa`.

## Bước 5: Cài đặt qua AltStore

1. Đảm bảo iPhone và máy tính chạy AltServer đang kết nối cùng một mạng Wi-Fi.
2. Gửi file `LichViet.ipa` sang iPhone (qua AirDrop, iCloud Drive, hoặc gửi qua Telegram/Zalo).
3. Trên iPhone, mở ứng dụng **Tệp (Files)**, nhấn giữ vào file `LichViet.ipa` và chọn **Chia sẻ (Share)** > chọn **AltStore**.
4. AltStore sẽ tự động ký lại ứng dụng và cài đặt lên máy của bạn.

---

## Các lỗi thường gặp

- **Lỗi "App is not extension safe"**: Đây là lỗi thường gặp khi build Expo. AltStore vẫn có thể cài đặt được, bạn chỉ cần nhấn "Keep" hoặc "Install" nếu có thông báo.
- **Lỗi Signing**: Đảm bảo ngày giờ trên iPhone và Máy tính khớp nhau.
- **Refresh 7 ngày**: Đừng quên ứng dụng sẽ hết hạn sau 7 ngày, bạn cần nhấn "Refresh" trong AltStore khi đang ở gần máy tính.
