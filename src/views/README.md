# 🖼️ Views (/src/views)

Mỗi file trong thư mục này đóng vai trò là "Controller" cho một trang hoặc một phần giao diện lớn.

## 🛠️ Trách nhiệm của một View

1.  **Render**: Lấy dữ liệu từ Service và truyền vào Handlebars template để hiển thị.
2.  **Event Binding**: Lắng nghe các sự kiện từ người dùng (Click, Submit, Input) trên giao diện.
3.  **UI Logic**: Xử lý đóng/mở Modal, hiển thị loading, Toast thông báo.
4.  **Data Flow**: Gọi các hàm từ `Service` để gửi hoặc lấy dữ liệu mới.

## 📄 Danh sách View chính

- `auth.view.js`: Xử lý giao diện Đăng nhập, Đăng ký.
- `dashboard.view.js`: Trang tổng quan (Overview) với các biểu đồ và thống kê.
- `bookings.view.js`: Trang quản lý đặt bàn (Lọc, phân trang, đổi trạng thái).
- `tables.view.js`: Quản lý sơ đồ bàn (Thêm, xóa bàn, đổi trạng thái).
- `notifications.view.js`: Trung tâm thông báo.
- `header.view.js`: Thanh điều hướng phía trên (Tìm kiếm nhanh, Thông báo nhanh, User menu).

## 💡 Cấu trúc chung của một View class

```javascript
export class ExampleView {
  async render() {
    // 1. Lấy dữ liệu
    const data = await exampleService.getData();
    // 2. Render HTML từ template
    const html = Handlebars.templates["example-page"](data);
    document.getElementById("app").innerHTML = html;
    // 3. Gán sự kiện
    this.bindEvents();
  }

  bindEvents() {
    // Xử lý sự kiện tại đây
  }
}
```
