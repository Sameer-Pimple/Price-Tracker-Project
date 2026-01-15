/**
 * API Service Layer
 * 
 * RESPONSIBILITY:
 * This file is the ONLY place where backend API calls should be made.
 * Frontend components should import functions from here and must NEVER call fetch/axios directly.
 * 
 * TODO: Replace mock implementations with real backend calls (axios/fetch).
 */
const api = {
    /**
     * Tracks a new product by URL.
     * 
     * TODO: Backend Integration
     * - Endpoint: POST /api/products/track
     * - Payload: { url: string }
     * - Expected Response: { id: string, status: 'active' | 'error', message: string }
     */
    trackProduct: (url) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 'prod_123',
                    url: url,
                    status: 'active',
                    message: 'Product is now being tracked'
                });
            }, 500);
        });
    },

    /**
     * Fetches product details by ID.
     * 
     * TODO: Backend Integration
     * - Endpoint: GET /api/products/:id
     * - Expected Response:
     *   {
     *     id: string,
     *     title: string,
     *     currentPrice: number,
     *     currency: string,
     *     image: string,
     *     url: string,
     *     originalPrice: number (optional),
     *     lastChecked: string (ISO date)
     *   }
     */
    getProductById: (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: id,
                    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
                    currentPrice: 29990,
                    currency: 'INR',
                    image: 'https://m.media-amazon.com/images/I/61+elFLgCKL._SX679_.jpg',
                    url: 'https://www.amazon.in/dp/B09XS7JWHH'
                });
            }, 500);
        });
    },

    /**
     * Fetches price history for a product.
     * 
     * TODO: Backend Integration
     * - Endpoint: GET /api/products/:id/history
     * - Query Params: ?range=7d | 30d | 6m (optional filtering)
     * - Expected Response: Array<{ date: string (ISO), price: number }>
     */
    getPriceHistory: (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { date: '2023-10-01', price: 34990 },
                    { date: '2023-10-05', price: 32990 },
                    { date: '2023-10-10', price: 29990 },
                    { date: '2023-10-15', price: 28490 },
                    { date: '2023-10-20', price: 29990 }
                ]);
            }, 500);
        });
    }
};

export default api;
