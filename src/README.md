# 🧠 Source Code (/src)

Thư mục này chứa toàn bộ logic điều hướng và xử lý cốt lõi của ứng dụng SPA.

## 📄 Các file quan trọng

### `app.js`

- **Điểm xuất phát (Entry Point)** của ứng dụng.
- Khởi tạo Router, các Service global.
- Xử lý kiểm tra Token và đăng nhập khi khởi động App.
- Cài đặt các Event Listener toàn cục.

### `router.js`

- Hệ thống định tuyến (Routing) cho SPA.
- Ánh xạ đường dẫn URL (như `/bookings`, `/tables`) với các **Views** tương ứng.
- Xử lý chuyển trang không tải lại (Single Page Navigation).

### `config.js`

- Chứa toàn bộ hằng số cấu hình của App:
  - `API_BASE_URL`: URL Backend.
  - `ROUTES`: Danh sách các đường dẫn.
  - `STORAGE_KEYS`: Các key lưu trong LocalStorage.
  - `ENUMS`: Trạng thái đặt bàn, loại thông báo...
- **Lưu ý**: Một số giá trị được tự động cập nhật từ file `.env` qua script.

## 📁 Thư mục con

- **[`/views`](./views/README.md)**: Logic giao diện cho từng màn hình.
- **[`/services`](./services/README.md)**: Logic xử lý dữ liệu và gọi API.
- **`/components`**: Các thành phần UI dùng chung (Modals, Toast, Table helpers).
- **`/utils`**: Các hàm tiện ích (Format tiền, Format ngày tháng, xử lý chuỗi).
- **`/mock`**: Dữ liệu giả lập mẫu cho chế độ Mock Data.
