/**
 * Dashboard View
 * Xử lý logic render và sự kiện cho trang Tổng quan
 */
import { OverviewService } from "../services/overview.service.js";
import { BookingsService } from "../services/bookings.service.js";
import { BookingDetailModal } from "../components/booking-detail-modal.js";

export const DashboardView = {
  /**
   * Render trang Dashboard
   * @param {Object} App - Reference đến App object
   */
  async render(App) {
    const data = await OverviewService.getOverview();
    await App.renderPage("dashboard", data, true);
    this.bindEvents(App);
  },

  /**
   * Bind các event handlers cho trang Dashboard
   */
  bindEvents(App) {
    // Start the datetime clock
    this.startClock();

    // View booking - show modal directly using shared component
    document.querySelectorAll('[data-action="viewBooking"]').forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const bookingId = btn.dataset.id;
        await BookingDetailModal.show(bookingId);
      });
    });

    // Confirm booking
    document
      .querySelectorAll('[data-action="confirmBooking"]')
      .forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const bookingId = btn.dataset.id;
          try {
            const result = await BookingsService.confirm(bookingId);
            if (result?.success) {
              App.showSuccess("Xác nhận booking thành công!");
              App.reload();
            }
          } catch (error) {
            App.showError("Có lỗi xảy ra. Vui lòng thử lại.");
          }
        });
      });

    // Cancel booking
    document
      .querySelectorAll('[data-action="cancelBooking"]')
      .forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const bookingId = btn.dataset.id;
          if (confirm("Bạn có chắc muốn huỷ booking này?")) {
            try {
              const result = await BookingsService.cancel(bookingId);
              if (result?.success) {
                App.showSuccess("Đã huỷ booking!");
                App.reload();
              }
            } catch (error) {
              App.showError("Có lỗi xảy ra. Vui lòng thử lại.");
            }
          }
        });
      });
  },

  /**
   * Start the datetime clock widget
   */
  startClock() {
    const clockTime = document.getElementById("clockTime");
    const clockDate = document.getElementById("clockDate");

    if (!clockTime || !clockDate) return;

    const updateClock = () => {
      const now = new Date();

      // Format time: HH:MM:SS
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      clockTime.textContent = `${hours}:${minutes}:${seconds}`;

      // Format date: DD/MM/YYYY - Thứ X
      const days = [
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
      ];
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const dayName = days[now.getDay()];
      clockDate.textContent = `${dayName}, ${day}/${month}/${year}`;
    };

    // Update immediately and then every second
    updateClock();
    this.clockInterval = setInterval(updateClock, 1000);
  },

  /**
   * Cleanup when leaving the dashboard page
   */
  cleanup() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }
};
