/**
 * Reviews View
 * Xử lý logic render và sự kiện cho trang Quản lý đánh giá
 */
import { ReviewsService } from '../services/reviews.service.js';

export const ReviewsView = {
    async render(App, Router) {
        // Get current query params from URL
        const params = Router.getQueryParams();
        
        // Fetch reviews from API with filter params
        const result = await ReviewsService.getList(params);
        
        // Normalize data structure
        const reviewsData = result.data || {};
        const rawReviews = Array.isArray(reviewsData) ? reviewsData : (reviewsData.items || []);
        const pagination = reviewsData.pagination || {};

        // Map backend fields to template-expected fields
        const reviews = rawReviews.map(r => ({
            id: r.id,
            customerName: r.user?.display_name || r.customerName || 'Khách hàng',
            customerAvatar: r.user?.avatar_url || r.customerAvatar,
            rating: r.rating,
            content: r.comment || r.content || '',
            ownerReply: r.reply_comment || r.ownerReply || null,
            isVisible: r.status === 'VISIBLE',
            createdAt: r.created_at || r.createdAt
        }));

        // Render page with data
        await App.renderPage('reviews', { 
            data: reviews, 
            pagination, 
            total: pagination.total || reviews.length 
        }, true);
        
        // Bind events and pre-fill form
        this.bindEvents(App, Router);
        this.prefillFilters(params);
    },

    /**
     * Pre-fill filter form fields from URL params
     */
    prefillFilters(params) {
        const ratingSelect = document.getElementById('ratingFilter');
        const statusSelect = document.getElementById('statusFilter');
        const fromDate = document.getElementById('fromDate');
        const toDate = document.getElementById('toDate');

        if (ratingSelect && params.rating) {
            ratingSelect.value = params.rating;
        }
        if (statusSelect && params.status) {
            statusSelect.value = params.status;
        }
        if (fromDate && params.from_time) {
            fromDate.value = params.from_time;
        }
        if (toDate && params.to_time) {
            toDate.value = params.to_time;
        }
    },

    bindEvents(App, Router) {
        // Filter form submission
        const filterForm = document.getElementById('reviewFilterForm');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Build new params from form
                const rating = document.getElementById('ratingFilter')?.value || '';
                const status = document.getElementById('statusFilter')?.value || '';
                const from_time = document.getElementById('fromDate')?.value || '';
                const to_time = document.getElementById('toDate')?.value || '';

                const newParams = new URLSearchParams();
                if (rating) newParams.set('rating', rating);
                if (status) newParams.set('status', status);
                if (from_time) newParams.set('from_time', from_time);
                if (to_time) newParams.set('to_time', to_time);
                newParams.set('page', '1');

                Router.navigate(`/reviews?${newParams.toString()}`);
            });
        }

        // Pagination
        window.changePage = (page) => {
            const currentParams = Router.getQueryParams();
            const newParams = new URLSearchParams();
            
            // Copy existing filter params
            if (currentParams.rating) newParams.set('rating', currentParams.rating);
            if (currentParams.status) newParams.set('status', currentParams.status);
            if (currentParams.from_time) newParams.set('from_time', currentParams.from_time);
            if (currentParams.to_time) newParams.set('to_time', currentParams.to_time);
            newParams.set('page', page.toString());
            
            Router.navigate(`/reviews?${newParams.toString()}`);
        };

        // Hide review buttons
        document.querySelectorAll('[data-action="hideReview"]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const reviewId = btn.dataset.id;
                await this.handleToggleVisibility(reviewId, false, App);
            });
        });

        // Show review buttons
        document.querySelectorAll('[data-action="showReview"]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const reviewId = btn.dataset.id;
                await this.handleToggleVisibility(reviewId, true, App);
            });
        });

        // Reply buttons
        document.querySelectorAll('[data-action="replyReview"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const reviewId = btn.dataset.id;
                this.showReplyForm(reviewId);
            });
        });

        // Reply form submission
        document.querySelectorAll('.reply-form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const reviewId = form.dataset.reviewId;
                const reply = form.querySelector('textarea').value;
                await this.handleReply(reviewId, reply, App);
            });
        });

        // Cancel reply buttons
        document.querySelectorAll('[data-action="cancelReply"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const reviewId = btn.dataset.id;
                this.hideReplyForm(reviewId);
            });
        });
    },

    async handleToggleVisibility(reviewId, visible, App) {
        try {
            const result = visible 
                ? await ReviewsService.show(reviewId)
                : await ReviewsService.hide(reviewId);
            if (result.success) {
                App.showSuccess(visible ? 'Đã hiện đánh giá!' : 'Đã ẩn đánh giá!');
                App.reload();
            }
        } catch (error) {
            App.showError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    },

    showReplyForm(reviewId) {
        const form = document.querySelector(`.reply-form[data-review-id="${reviewId}"]`);
        if (form) {
            form.classList.remove('hidden');
            form.querySelector('textarea')?.focus();
        }
    },

    hideReplyForm(reviewId) {
        const form = document.querySelector(`.reply-form[data-review-id="${reviewId}"]`);
        if (form) {
            form.classList.add('hidden');
            form.querySelector('textarea').value = '';
        }
    },

    async handleReply(reviewId, reply, App) {
        if (!reply.trim()) {
            App.showError('Vui lòng nhập nội dung phản hồi');
            return;
        }
        try {
            const result = await ReviewsService.reply(reviewId, reply);
            if (result.success) {
                App.showSuccess('Đã gửi phản hồi thành công!');
                App.reload();
            }
        } catch (error) {
            App.showError('Gửi phản hồi thất bại. Vui lòng thử lại.');
        }
    }
};
