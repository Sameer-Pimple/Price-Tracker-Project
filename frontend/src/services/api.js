/**
 * API Service Layer
 * 
 * RESPONSIBILITY:
 * This file is the ONLY place where backend API calls should be made.
 * It converts backend contract responses to frontend-safe objects.
 */

// import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAILS, delay } from '../mocks/intelligence'; 
// Note: We need to make sure the path is correct. 
// The file is at src/mocks/intelligence.js and this is src/services/api.js.
// So import should be '../mocks/intelligence'

import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAILS, MOCK_TRENDS, MOCK_ALERTS, delay } from '../mocks/intelligence';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/';
const USE_MOCKS = (process.env.REACT_APP_USE_MOCKS || 'true') === 'true';

/**
 * Centralized HTTP request handler
 * Handles headers, JSON parsing, and basic error normalization
 */
const request = async (endpoint, options = {}) => {
    const base = API_BASE_URL.replace(/\/$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${base}${path}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 204) {
            return null;
        }

        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            const apiError = new Error(data.message || `API Error: ${response.statusText}`);
            apiError.status = response.status;
            apiError.originalError = data;
            throw apiError;
        }

        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            const netError = new Error('Unable to connect to server. Please check your internet connection or server status.');
            netError.status = 0;
            netError.originalError = error;
            throw netError;
        }
        throw error;
    }
};

const mockApi = {
    /**
     * Tracks a new product by URL.
     * MOCK BEHAVIOR: Returns a success mock after delay.
     */
    trackProduct: async (url) => {
        await delay(1000);

        // Return a mock response mimicking the successful tracking of a product
        // We will just return the first mock product id for now
        return {
            id: "prod_1",
            status: 'active',
            message: "Product tracked successfully (MOCK)",
            originalResponse: {}
        };
    },

    /**
     * Fetches all products.
     * MOCK BEHAVIOR: Returns static list of products.
     */
    getAllProducts: async () => {
        await delay(800);
        const data =await fetch(API_BASE_URL + "api/products/All")
        return data.json();
    },
    /**
     * Fetches curated deals.
     * MOCK BEHAVIOR: Filters products with a discount.
     */
    getDeals: async () => {
        await delay(700);
        return MOCK_PRODUCTS.filter(product => (product.price?.discount || 0) > 0).map(product => ({
            ...product,
            reason: product.price?.discount
                ? `${product.price.discount}% under recent average`
                : "Limited-time deal",
        }));
    },

    /**
     * Fetches product details by ID.
     * MOCK BEHAVIOR: Returns detail view from MOCK_PRODUCT_DETAILS.
     */
    getProductById: async (id) => {
        await delay(600);
        const product = MOCK_PRODUCT_DETAILS[id];

        if (!product) {
            throw new Error(`Product with ID ${id} not found (MOCK)`);
        }
        return product;
    },

    /**
     * Fetches price history for a product.
     * MOCK BEHAVIOR: Returns history array from MOCK_PRODUCT_DETAILS.
     */
    getPriceHistory: async (id) => {
        await delay(500);
        const product = MOCK_PRODUCT_DETAILS[id];
        return product ? product.history : [];
    },
    /**
     * Fetches trends data.
     * MOCK BEHAVIOR: Returns aggregate trend snapshot.
     */
    getTrends: async () => {
        await delay(700);
        return MOCK_TRENDS;
    },
    /**
     * Fetches alerts.
     * MOCK BEHAVIOR: Returns static alerts.
     */
    getAlerts: async () => {
        await delay(700);
        return MOCK_ALERTS;
    },
    /**
     * Creates a new alert.
     * MOCK BEHAVIOR: Adds a new item to the mock list.
     */
    createAlert: async (payload) => {
        await delay(600);
        const newAlert = {
            id: `alert_${Date.now()}`,
            productTitle: payload.productTitle || payload.title || "Untitled Product",
            targetPrice: Number(payload.targetPrice) || 0,
            currentPrice: Number(payload.currentPrice) || 0,
            currency: payload.currency || "INR",
            status: "ACTIVE",
            lastTriggered: null
        };
        MOCK_ALERTS.unshift(newAlert);
        return newAlert;
    },
    /**
     * Updates an alert.
     * MOCK BEHAVIOR: Patches local mock entry.
     */
    updateAlert: async (id, updates) => {
        await delay(500);
        const index = MOCK_ALERTS.findIndex(alert => alert.id === id);
        if (index === -1) throw new Error("Alert not found");
        MOCK_ALERTS[index] = { ...MOCK_ALERTS[index], ...updates };
        return MOCK_ALERTS[index];
    },
    /**
     * Deletes an alert.
     * MOCK BEHAVIOR: Removes local mock entry.
     */
    deleteAlert: async (id) => {
        await delay(400);
        const index = MOCK_ALERTS.findIndex(alert => alert.id === id);
        if (index === -1) throw new Error("Alert not found");
        const [removed] = MOCK_ALERTS.splice(index, 1);
        return removed;
    },

    /**
     * Performs a live check of the product status.
     * MOCK BEHAVIOR: Returns current price info from detail mock.
     */
    checkLiveStatus: async (url) => {
        await delay(1500);
        // Simulate a live check returning fresh data
        // For simplicity, just return the data from prod_1
        const mock = MOCK_PRODUCT_DETAILS["prod_1"];
        return {
            Price: mock.price.current,
            MRP: mock.price.original,
            Rating: 4.5,
            availability: "In Stock",
            discount: mock.price.discount + "%"
        };
    }
};

const realApi = {
    /**
     * Tracks a new product by URL.
     *
     * Contract: POST /api/track
     */
    trackProduct: async (url) => {
        const data = await request('/api/track', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });

        return {
            id: data?.productId ? data.productId.toString() : null,
            status: data?.success ? 'active' : 'error',
            message: data?.message || '',
            originalResponse: data,
        };
    },

    /**
     * Fetches all products.
     *
     * Contract: GET /api/products
     */
    getAllProducts: async () => {
        try {
            const data = await request('/api/products');

            if (!Array.isArray(data)) return [];

            return data.map(product => ({
                id: product.id?.toString(),
                title: product.title || 'Untitled Product',
                pid: product.pid,
                image: product.imageUrl || '',
                url: product.url || '',
                price: product.price || product.currentPrice || product.priceSnapshot || {},
                lastChecked: product.updatedAt || product.lastChecked || null,
                status: product.status || 'TRACKING',
            }));
        } catch (error) {
            console.warn('Failed to fetch products', error);
            return [];
        }
    },
    /**
     * Fetches curated deals.
     *
     * Contract: GET /api/deals
     * Fallback: Filter products client-side if endpoint isn't ready.
     */
    getDeals: async () => {
        try {
            const data = await request('/api/deals');

            if (!Array.isArray(data)) return [];

            return data.map(deal => ({
                id: deal.id?.toString(),
                title: deal.title || 'Untitled Deal',
                pid: deal.pid,
                image: deal.imageUrl || deal.image || '',
                url: deal.url || '',
                price: deal.price || deal.currentPrice || {},
                lastChecked: deal.updatedAt || deal.lastChecked || null,
                status: deal.status || 'TRACKING',
                reason: deal.reason || deal.badge || '',
            }));
        } catch (error) {
            if (error?.status === 404) {
                const products = await realApi.getAllProducts();
                return products.filter(product => (product.price?.discount || 0) > 0);
            }
            console.warn('Failed to fetch deals', error);
            return [];
        }
    },

    /**
     * Fetches product details by ID.
     *
     * Contract: GET /api/products/:id
     */
    getProductById: async (id) => {
        const data = await request(`/api/products/${id}`);

        return {
            id: data.id?.toString(),
            title: data.title || 'Unknown Product',
            pid: data.pid,
            image: data.imageUrl || '',
            url: data.url || '',
            price: data.price || data.currentPrice || {},
            lastChecked: data.updatedAt || new Date().toISOString(),
            intelligence: data.intelligence || null,
            analytics: data.analytics || null,
        };
    },

    /**
     * Fetches price history for a product.
     *
     * Contract: GET /api/products/:id/history
     */
    getPriceHistory: async (id) => {
        try {
            const data = await request(`/api/products/${id}/history`);

            if (!Array.isArray(data)) return [];

            return data.map(item => ({
                date: item.recordedAt,
                price: item.price,
                currency: item.currency,
            }));
        } catch (error) {
            console.warn('Failed to fetch history', error);
            return [];
        }
    },
    /**
     * Fetches trends data.
     *
     * Contract: GET /api/trends
     */
    getTrends: async () => {
        try {
            const data = await request('/api/trends');

            return {
                summary: data.summary || null,
                categories: Array.isArray(data.categories) ? data.categories : [],
                movers: Array.isArray(data.movers) ? data.movers : [],
                timeline: Array.isArray(data.timeline) ? data.timeline : []
            };
        } catch (error) {
            console.warn('Failed to fetch trends', error);
            return {
                summary: null,
                categories: [],
                movers: [],
                timeline: []
            };
        }
    },
    /**
     * Fetches alerts.
     *
     * Contract: GET /api/alerts
     */
    getAlerts: async () => {
        try {
            const data = await request('/api/alerts');
            if (!Array.isArray(data)) return [];
            return data.map(alert => ({
                id: alert.id?.toString(),
                productTitle: alert.productTitle || alert.title || 'Untitled Product',
                targetPrice: alert.targetPrice || alert.target || 0,
                currentPrice: alert.currentPrice || 0,
                currency: alert.currency || 'INR',
                status: alert.status || 'ACTIVE',
                lastTriggered: alert.lastTriggered || null
            }));
        } catch (error) {
            console.warn('Failed to fetch alerts', error);
            return [];
        }
    },
    /**
     * Creates a new alert.
     *
     * Contract: POST /api/alerts
     */
    createAlert: async (payload) => {
        const data = await request('/api/alerts', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return {
            id: data?.id?.toString(),
            productTitle: data?.productTitle || data?.title || payload.productTitle || payload.title,
            targetPrice: data?.targetPrice || payload.targetPrice || 0,
            currentPrice: data?.currentPrice || 0,
            currency: data?.currency || payload.currency || 'INR',
            status: data?.status || 'ACTIVE',
            lastTriggered: data?.lastTriggered || null
        };
    },
    /**
     * Updates an alert.
     *
     * Contract: PATCH /api/alerts/:id
     */
    updateAlert: async (id, updates) => {
        const data = await request(`/api/alerts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
        return {
            id: data?.id?.toString() || id,
            productTitle: data?.productTitle || data?.title || updates.productTitle,
            targetPrice: data?.targetPrice || updates.targetPrice || 0,
            currentPrice: data?.currentPrice || updates.currentPrice || 0,
            currency: data?.currency || updates.currency || 'INR',
            status: data?.status || updates.status || 'ACTIVE',
            lastTriggered: data?.lastTriggered || updates.lastTriggered || null
        };
    },
    /**
     * Deletes an alert.
     *
     * Contract: DELETE /api/alerts/:id
     */
    deleteAlert: async (id) => {
        await request(`/api/alerts/${id}`, {
            method: 'DELETE',
        });
        return { id };
    },

    /**
     * Performs a live check of the product status.
     *
     * Contract: POST /api/scrape/amazon
     */
    checkLiveStatus: async (url) => {
        const data = await request('/api/scrape/amazon', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
        return data;
    },
};

const api = USE_MOCKS ? mockApi : realApi;

export default api;
