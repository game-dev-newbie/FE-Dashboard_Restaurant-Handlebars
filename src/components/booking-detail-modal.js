/**
 * Booking Detail Modal - Shared component
 * Tái sử dụng ở cả Dashboard và Bookings page
 */
import { BookingsService } from '../services/bookings.service.js';

export const BookingDetailModal = {
    /**
     * Inject modal HTML vào page nếu chưa có
     */
    ensureModal() {
        if (document.getElementById('bookingDetailModal')) return;
        
        const modalHTML = `
            <div id="bookingDetailModal" class="hidden">
                <div class="modal-backdrop" onclick="closeModal('bookingDetailModal')"></div>
                <div class="modal">
                    <div class="modal-header">
                        <h5 class="modal-title">Chi tiết đặt bàn</h5>
                        <button class="modal-close" onclick="closeModal('bookingDetailModal')">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="bookingDetailContent">
                        <div class="text-center py-4">
                            <i class="fa-solid fa-spinner fa-spin text-2xl text-stone-400"></i>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeModal('bookingDetailModal')">Đóng</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    /**
     * Hiển thị chi tiết booking trong modal
     */
    async show(bookingId) {
        this.ensureModal();
        
        const contentEl = document.getElementById('bookingDetailContent');
        if (!contentEl) return;
        
        // Show loading
        contentEl.innerHTML = `
            <div class="text-center py-4">
                <i class="fa-solid fa-spinner fa-spin text-2xl text-stone-400"></i>
            </div>
        `;
        window.openModal('bookingDetailModal');
        
        try {
            const rawBooking = await BookingsService.getById(bookingId);
            
            // Map data from Backend Response (snake_case) or potential Mock (camelCase)
            if (rawBooking) {
                const booking = {
                    ...rawBooking,
                    code: rawBooking.code || `B${rawBooking.id}`,
                    customerName: rawBooking.customer_name || rawBooking.customerName || (rawBooking.user ? rawBooking.user.display_name : 'Khách vãng lai'),
                    customerPhone: rawBooking.phone || rawBooking.customerPhone || (rawBooking.user ? rawBooking.user.phone : ''),
                    guests: rawBooking.people_count || rawBooking.guests || 0,
                    datetime: rawBooking.booking_time || rawBooking.datetime,
                    tableName: rawBooking.table ? rawBooking.table.name : (rawBooking.tableName || 'Chưa gán'),
                    status: rawBooking.status,
                    deposit: rawBooking.deposit_amount || rawBooking.deposit || 0,
                    notes: rawBooking.note || rawBooking.notes // Backend uses 'note'
                };

                const statusMap = {
                    'PENDING': { label: 'Chờ xác nhận', class: 'badge-pending' },
                    'CONFIRMED': { label: 'Đã xác nhận', class: 'badge-confirmed' },
                    'CHECKED_IN': { label: 'Đã check-in', class: 'badge-checked-in' },
                    'CANCELLED': { label: 'Đã hủy', class: 'badge-cancelled' },
                    'NO_SHOW': { label: 'Không đến', class: 'badge-no-show' },
                    'COMPLETED': { label: 'Hoàn tất', class: 'badge-confirmed' }
                };
                const status = statusMap[booking.status] || { label: booking.status, class: 'badge-no-show' };
                
                contentEl.innerHTML = `
                    <div class="space-y-4">
                        <!-- Booking Code -->
                        <div class="flex items-center justify-between">
                            <code class="bg-stone-100 px-3 py-1.5 rounded text-sm font-mono font-semibold">${booking.code}</code>
                            <span class="badge ${status.class}">${status.label}</span>
                        </div>
                        
                        <!-- Customer Info -->
                        <div class="bg-stone-50 rounded-lg p-4">
                            <h4 class="font-semibold text-stone-700 mb-3 flex items-center gap-2">
                                <i class="fa-solid fa-user"></i>
                                Thông tin khách hàng
                            </h4>
                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span class="text-stone-500">Họ tên:</span>
                                    <p class="font-medium text-stone-900">${booking.customerName}</p>
                                </div>
                                <div>
                                    <span class="text-stone-500">Số điện thoại:</span>
                                    <p class="font-medium text-stone-900">${booking.customerPhone || '---'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Booking Info -->
                        <div class="bg-stone-50 rounded-lg p-4">
                            <h4 class="font-semibold text-stone-700 mb-3 flex items-center gap-2">
                                <i class="fa-solid fa-calendar-check"></i>
                                Thông tin đặt bàn
                            </h4>
                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span class="text-stone-500">Thời gian:</span>
                                    <p class="font-medium text-stone-900">${booking.datetime ? new Date(booking.datetime).toLocaleString('vi-VN') : 'N/A'}</p>
                                </div>
                                <div>
                                    <span class="text-stone-500">Số khách:</span>
                                    <p class="font-medium text-stone-900">${booking.guests} người</p>
                                </div>
                                <div>
                                    <span class="text-stone-500">Bàn:</span>
                                    <p class="font-medium text-stone-900">${booking.tableName}</p>
                                </div>
                                <div>
                                    <span class="text-stone-500">Tiền cọc:</span>
                                    <p class="font-medium ${booking.deposit ? 'text-green-600' : 'text-stone-400'}">${booking.deposit ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.deposit) : 'Không có'}</p>
                                </div>
                            </div>
                        </div>
                        
                        ${booking.notes ? `
                        <!-- Notes -->
                        <div class="bg-yellow-50 rounded-lg p-4">
                            <h4 class="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                                <i class="fa-solid fa-note-sticky"></i>
                                Ghi chú
                            </h4>
                            <p class="text-sm text-yellow-800">${booking.notes}</p>
                        </div>
                        ` : ''}
                    </div>
                `;
            } else {
                contentEl.innerHTML = `
                    <div class="text-center py-4 text-stone-500">
                        <i class="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
                        <p>Không tìm thấy thông tin booking</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading booking detail:', error);
            contentEl.innerHTML = `
                <div class="text-center py-4 text-red-500">
                    <i class="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
                    <p>Lỗi khi tải thông tin booking</p>
                </div>
            `;
        }
    }
};
