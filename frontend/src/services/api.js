


// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/";

/**
 * Centralized HTTP request handler
 * Handles headers, JSON parsing, and basic error normalization
 */
const request = async (endpoint, options = {}) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${base}${path}`;

  const defaultHeaders = {
    Accept: "application/json",
  };

  if (options.body) {
    defaultHeaders["Content-Type"] = "application/json";
  }

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

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let data;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const apiError = new Error(
        data?.message || `API Error: ${response.statusText}`
      );
      apiError.status = response.status;
      apiError.originalError = data;
      throw apiError;
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      const netError = new Error(
        "Unable to connect to server. Please check your internet connection or server status."
      );
      netError.status = 0;
      netError.originalError = error;
      throw netError;
    }
    throw error;
  }
};


const realApi = {
  /**
   * Tracks a new product by URL.
   *
   * Contract: POST /api/track
   */
  trackProduct: async (url) => {
    const data = await request("/api/track", {
      method: "POST",
      body: JSON.stringify({ url }),
    });

    return {
      id: data?.productId ? data.productId.toString() : null,
      status: data?.success ? "active" : "error",
      message: data?.message || "",
      originalResponse: data,
    };
  },

  /**
   * Fetches all products.
   *
   * Contract: GET /api/products
   */
  getAllProducts: async () => {
    return await request(`/api/products/All`);
  },
  /**
   * Fetches curated deals.
   *
   * Contract: GET /api/deals
   * Fallback: Filter products client-side if endpoint isn't ready.
   */
  getDeals: async () => {
    try {
      const data = await request("/api/deals");

      if (!Array.isArray(data)) return [];

      return data.map((deal) => ({
        id: deal.id?.toString(),
        title: deal.title || "Untitled Deal",
        pid: deal.pid,
        image: deal.imageUrl || deal.image || "",
        url: deal.url || "",
        price: deal.price || deal.currentPrice || {},
        lastChecked: deal.updatedAt || deal.lastChecked || null,
        status: deal.status || "TRACKING",
        reason: deal.reason || deal.badge || "",
      }));
    } catch (error) {
      if (error?.status === 404) {
        const products = await realApi.getAllProducts();
        return products.filter((product) => (product.price?.discount || 0) > 0);
      }
      console.warn("Failed to fetch deals", error);
      return [];
    }
  },

  /**
   * Fetches product details by ID.
   *
   * Contract: GET /api/products/:id
   */
  getProductById: async (pid) => {
    return await request(`/api/products/Details/${pid}`);
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

      return data.map((item) => ({
        date: item.recordedAt,
        price: item.price,
        currency: item.currency,
      }));
    } catch (error) {
      console.warn("Failed to fetch history", error);
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
      const data = await request("/api/trends");

      return {
        summary: data.summary || null,
        categories: Array.isArray(data.categories) ? data.categories : [],
        movers: Array.isArray(data.movers) ? data.movers : [],
        timeline: Array.isArray(data.timeline) ? data.timeline : [],
      };
    } catch (error) {
      console.warn("Failed to fetch trends", error);
      return {
        summary: null,
        categories: [],
        movers: [],
        timeline: [],
      };
    }
  },

  /*
   *Register User
   *
   * Contract: Post /api/user/SignUp
   */
  registerUser: async (payload) => {
    const data = await request(`/api/user/signin`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data; // expecting token or user info
  },

  /*
   *Login User
   *
   * Contract: Post /api/user/login
   */
  loginUser: async (payload) => {
    const data = await request(`/api/user/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data; // expecting token or user info
  },

  /**
   * Fetches alerts.
   *
   * Contract: GET /api/alerts
   */
  getAlerts: async () => {
    try {
      const data = await request("/api/alerts");
      if (!Array.isArray(data)) return [];
      return data.map((alert) => ({
        id: alert.id?.toString(),
        productTitle: alert.productTitle || alert.title || "Untitled Product",
        targetPrice: alert.targetPrice || alert.target || 0,
        currentPrice: alert.currentPrice || 0,
        currency: alert.currency || "INR",
        status: alert.status || "ACTIVE",
        lastTriggered: alert.lastTriggered || null,
      }));
    } catch (error) {
      console.warn("Failed to fetch alerts", error);
      return [];
    }
  },
  /**
   * Creates a new alert.
   *
   * Contract: POST /api/alerts
   */
  createAlert: async (payload) => {
    const data = await request("/api/alerts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return {
      id: data?.id?.toString(),
      productTitle:
        data?.productTitle ||
        data?.title ||
        payload.productTitle ||
        payload.title,
      targetPrice: data?.targetPrice || payload.targetPrice || 0,
      currentPrice: data?.currentPrice || 0,
      currency: data?.currency || payload.currency || "INR",
      status: data?.status || "ACTIVE",
      lastTriggered: data?.lastTriggered || null,
    };
  },
  /**
   * Updates an alert.
   *
   * Contract: PATCH /api/alerts/:id
   */
  updateAlert: async (id, updates) => {
    const data = await request(`/api/alerts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return {
      id: data?.id?.toString() || id,
      productTitle: data?.productTitle || data?.title || updates.productTitle,
      targetPrice: data?.targetPrice || updates.targetPrice || 0,
      currentPrice: data?.currentPrice || updates.currentPrice || 0,
      currency: data?.currency || updates.currency || "INR",
      status: data?.status || updates.status || "ACTIVE",
      lastTriggered: data?.lastTriggered || updates.lastTriggered || null,
    };
  },
  /**
   * Deletes an alert.
   *
   * Contract: DELETE /api/alerts/:id
   */
  deleteAlert: async (id) => {
    await request(`/api/alerts/${id}`, {
      method: "DELETE",
    });
    return { id };
  },

  /**
   * Performs a live check of the product status.
   *
   * Contract: POST /api/scrape/amazon
   */
  checkLiveStatus: async (url) => {
    const data = await request("/api/scrape/amazon", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    return data;
  },
};

// export default api;
export default realApi;
