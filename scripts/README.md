# 🛠️ Scripts (/scripts)

Các công cụ dạng dòng lệnh (CLI) chạy bằng Node.js để hỗ trợ quá trình phát triển.

## 📄 Danh sách Script

### `toggle-mock.js` (Quan trọng nhất)

Script điều khiển chính cho môi trường làm việc.

- **Tính năng**:
  - `sync`: Đọc file `.env` và cập nhật `config.js`, đồng thời đổi file Service tương ứng.
  - `mock`: Chuyển cưỡng bức dự án sang dùng dữ liệu giả.
  - `prod`: Chuyển cưỡng bức dự án sang dùng API thật.
  - `status`: Xem dự án đang ở chế độ nào.

### `manage-mock.js`

- Quản lý các file backup của Service trong thư mục `mock-versions` và `prod-versions`.
- Đảm bảo cấu trúc file đồng nhất trước khi thực hiện `toggle`.

### `replace-icons.js`

- Script hỗ trợ quét và thay thế các icon Lucide trong template Handlebars hoặc file HTML.

## 🚀 Cách chạy

Sử dụng `npm run` (đã được cấu hình trong `package.json`):

```bash
npm run dev     # Khởi động app và đồng bộ .env
npm run mock    # Bật chế độ giả lập
npm run prod    # Bật chế độ API thật
```
