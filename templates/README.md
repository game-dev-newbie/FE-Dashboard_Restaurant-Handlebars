# 🎨 Templates (/templates)

Thư mục chứa các file giao diện sử dụng ngôn ngữ lập trình mẫu **Handlebars (.hbs)**.

## 📁 Cấu trúc

### `/layouts`

- Chứa các khung giao diện lớn (Layout).
- `main.hbs`: Layout chính bao gồm Sidebar và Header, nội dung trang sẽ được chèn vào phần giữa.
- `auth.hbs`: Layout tối giản cho các trang Đăng nhập/Đăng ký.

### `/pages`

- Chứa nội dung chi tiết của từng trang.
- Ví dụ: `bookings.hbs`, `tables.hbs`, `login.hbs`.
- Đây là nơi định nghĩa cấu trúc HTML cho phần nội dung thay đổi của App.

### `/partials`

- Chứa các thành phần nhỏ dùng lại ở nhiều nơi.
- Ví dụ: `sidebar.hbs`, `footer.hbs`, `loading-spinner.hbs`.

## ⚙️ Cách sử dụng

Dự án này sử dụng Handlebars chạy trực tiếp trên trình duyệt hoặc được compile sẵn qua script (tùy cấu hình). Các biến truyền từ `View` sẽ được truy cập trong này bằng cú pháp `{{propertyName}}`.
