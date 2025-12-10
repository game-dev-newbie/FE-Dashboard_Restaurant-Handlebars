/**
 * Auth Service - PRODUCTION VERSION (ES6)
 * Gọi API thực từ Backend
 * Hỗ trợ accessToken và refreshToken
 */
import { CONFIG } from '../config.js';
import { ApiService } from './api.js';

export const AuthService = {
    /**
     * Đăng nhập - lưu cả accessToken và refreshToken
     */
    async login(email, password) {
        const response = await ApiService.post('/auth/login', { email, password });
        if (response.accessToken || response.token) {
            // Lưu tokens - hỗ trợ cả format mới và cũ
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
        const response = await ApiService.post('/auth/register-owner', data);
        if (response.accessToken || response.token) {
            ApiService.saveTokens(
                response.accessToken || response.token,
                response.refreshToken
            );
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
        }
        return response;
    },

    /**
     * Đăng ký nhân viên - không nhận token, chờ duyệt
     */
    async registerStaff(data) {
        return ApiService.post('/auth/register-staff', data);
    },

    /**
     * Lấy thông tin user hiện tại
     */
    async getMe() {
        return ApiService.get('/auth/me');
    },

    /**
     * Đăng xuất - xóa tất cả tokens
     */
    logout() {
        ApiService.clearTokens();
        window.location.hash = '#/login';
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
