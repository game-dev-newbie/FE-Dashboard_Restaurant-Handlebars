/**
 * Reviews Service - PRODUCTION VERSION (ES6)
 */
import { ApiService } from './api.js';

export const ReviewsService = {
    async getList(params = {}) {
        try {
            const query = new URLSearchParams(params).toString();
            const response = await ApiService.get(`/reviews${query ? '?' + query : ''}`);
            return { data: response.data || response, success: true };
        } catch (error) {
            console.warn('Could not fetch reviews:', error);
            return { data: [], success: false };
        }
    },

    async getById(id) {
        // BE doesn't have GET /reviews/:id endpoint, so fetch from list
        try {
            const response = await ApiService.get('/reviews');
            const data = response.data || response;
            const list = Array.isArray(data) ? data : (data.items || []);
            const review = list.find(r => r.id === parseInt(id) || r.id === id);
            
            if (review) {
                // Map to expected format for view
                return {
                    id: review.id,
                    bookingId: review.booking_id,
                    customerName: review.user?.display_name || review.user?.name || 'Khách hàng',
                    customerAvatar: review.user?.avatar_url,
                    rating: review.rating,
                    content: review.comment || review.content || '',
                    ownerReply: review.reply_comment || review.ownerReply,
                    status: review.status,
                    createdAt: review.created_at
                };
            }
            return null;
        } catch (error) {
            console.warn('Could not fetch review by id:', error);
            return null;
        }
    },

    async reply(id, reply) {
        // BE uses PATCH and expects 'comment' field, not 'reply'
        const response = await ApiService.patch(`/reviews/${id}/reply`, { comment: reply });
        return { success: true, ...response };
    },

    async hide(id) {
        // BE might not have this endpoint yet
        try {
            const response = await ApiService.patch(`/reviews/${id}/hide`, {});
            return { success: true, ...response };
        } catch (error) {
            console.warn('hide endpoint not available');
            return { success: false, message: 'Endpoint not available' };
        }
    },

    async show(id) {
        // BE might not have this endpoint yet
        try {
            const response = await ApiService.patch(`/reviews/${id}/show`, {});
            return { success: true, ...response };
        } catch (error) {
            console.warn('show endpoint not available');
            return { success: false, message: 'Endpoint not available' };
        }
    }
};
