/**
 * Auth Service - MOCK VERSION (ES6)
 * Sử dụng MockHandlers thay vì gọi API thực
 * Hỗ trợ accessToken và refreshToken
 */
import { CONFIG } from '../config.js';
import { MockHandlers } from '../mock/handlers.js';
import { ApiService } from './api.js';

export const AuthService = {
    /**
     * Đăng nhập - lưu cả accessToken và refreshToken
     */
    async login(email, password) {
        const response = await MockHandlers.login(email, password);
        if (response.accessToken || response.token) {
            // Lưu tokens - hỗ trợ cả format mới (accessToken/refreshToken) và cũ (token)
            ApiService.saveTokens(
                response.accessToken || response.token,
                response.refreshToken
            );
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
        }
        return response;
    },

    /**
     * Đăng ký chủ nhà hàng - nhận token ngay sau đăng ký
     */
    async registerOwner(data) {
        await MockHandlers.delay(500);
        const newUser = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            role: 'OWNER',
            avatar: null,
            restaurantId: Date.now() + 1,
            restaurantName: data.restaurantName
        };
        
        // Tạo mock tokens
        const accessToken = 'mock_access_token_owner_' + Date.now();
        const refreshToken = 'mock_refresh_token_owner_' + Date.now();
        
        // Lưu tokens
        ApiService.saveTokens(accessToken, refreshToken);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(newUser));
        
        return { 
            success: true, 
            message: 'Đăng ký thành công!', 
            accessToken,
            refreshToken,
            user: newUser 
        };
    },

    /**
     * Đăng ký nhân viên - không nhận token, chờ duyệt
     */
    async registerStaff(data) {
        await MockHandlers.delay(500);
        return { 
            success: true, 
            message: 'Đã gửi yêu cầu, vui lòng chờ quản lý duyệt!', 
            requiresApproval: true 
        };
    },

    /**
     * Yêu cầu đặt lại mật khẩu
     */
    async forgotPassword(email) {
        await MockHandlers.delay(800);
        // Mock: always return success for valid email format
        if (email && email.includes('@')) {
            return { 
                success: true, 
                message: 'Email đặt lại mật khẩu đã được gửi!' 
            };
        }
        return { 
            success: false, 
            message: 'Email không hợp lệ' 
        };
    },

    /**
     * Lấy thông tin user hiện tại
     */
    async getMe() {
        return MockHandlers.getProfile();
    },

    /**
     * Đăng xuất - xóa tất cả tokens
     */
    logout() {
        ApiService.clearTokens();
        window.location.pathname = '/login';
    },

    /**
     * Kiểm tra đã đăng nhập chưa
     */
    isAuthenticated() {
        return !!ApiService.getAccessToken();
    },

    /**
     * Lấy thông tin user đã lưu
     */
    getStoredUser() {
        const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Cập nhật thông tin user đã lưu
     */
    updateStoredUser(data) {
        const user = this.getStoredUser();
        if (user) {
            Object.assign(user, data);
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
        }
    },

    /**
     * Refresh token thủ công (nếu cần)
     */
    async refreshToken() {
        return ApiService.refreshAccessToken();
    }
};
