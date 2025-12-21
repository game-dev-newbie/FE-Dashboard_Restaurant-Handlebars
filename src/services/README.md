# 🔌 Services (/src/services)

Thư mục này chịu trách nhiệm giao tiếp với Backend và quản lý logic nghiệp vụ dữ liệu.

## 🏗️ Kiến trúc Mock/Prod

Dự án sử dụng cơ chế **Swapping (Tráo đổi)** để chuyển đổi giữa API thật và Mock Data:

1.  **`api.js`**: Lớp xử lý HTTP (sử dụng `fetch`) với các tính năng:
    - Tự động đính kèm `Authorization` token.
    - Xử lý Refresh Token khi Access Token hết hạn.
    - Xử lý lỗi tập trung.
2.  **Các Service cụ thể** (như `bookings.service.js`): Chứa các hàm nghiệp vụ (ví dụ: `getAllBookings`, `updateStatus`).

## 📁 Chế độ hoạt động

- **`/prod-versions`**: Chứa code gọi API thực tế qua `fetch`.
- **`/mock-versions`**: Chứa code trả về dữ liệu giả lập từ bộ nhớ (InMemory) hoặc LocalStorage.
- **File gốc** (ví dụ `auth.service.js`): Là file hiện tại đang được sử dụng bởi App. Khi chạy lệnh `npm run mock/prod`, nội dung từ thư mục con sẽ được copy đè ra file gốc.

## 📄 Danh sách Service

- `auth.service.js`: Đăng nhập, đăng ký, quên mật khẩu.
- `bookings.service.js`: Quản lý danh sách đặt bàn.
- `tables.service.js`: Quản lý sơ đồ bàn.
- `notifications.service.js`: Nhận và xử lý thông báo.
- `restaurant.service.js`: Thông tin nhà hàng và cấu hình.
- `profile.service.js`: Thông tin cá nhân của admin/nhân viên.
- `deposit.service.js`: Xử lý cấu hình tiền cọc.
