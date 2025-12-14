/**
 * Restaurant Service - PRODUCTION VERSION (ES6)
 */
import { ApiService } from './api.js';

export const RestaurantService = {
    async getInfo() {
        return ApiService.get('/restaurant');
    },

    async update(data) {
        return ApiService.patch('/restaurant', data);
    },

    async updateHours(hours) {
        return ApiService.patch('/restaurant/hours', { hours });
    },

    async updateTags(tags) {
        return ApiService.patch('/restaurant/tags', { tags });
    }
};
