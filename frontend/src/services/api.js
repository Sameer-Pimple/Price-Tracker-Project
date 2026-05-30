// Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/";

/**
 * Centralized HTTP request handler
 *
 * Responsibilities:
 * - Creates full API URL
 * - Adds default headers
 * - Adds JWT token automatically
 * - Parses JSON/text responses
 * - Converts backend errors into readable frontend errors
 * - Handles network/server failures
 */
const request = async (endpoint, options = {}) => {

  // Remove trailing slash from base url
  // Example:
  // http://localhost:8080/ -> http://localhost:8080
  const base = API_BASE_URL.replace(/\/$/, "");

  // Ensure endpoint starts with "/"
  // Example:
  // api/products -> /api/products
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Final URL
  const url = `${base}${path}`;

  // JWT token stored after login
  const token = localStorage.getItem("token");

  /**
   * Default headers sent with every request
   *
   * Accept:
   * tells backend frontend expects JSON
   *
   * Authorization:
   * sends JWT token for protected routes
   */
  const defaultHeaders = {
    Accept: "application/json",

    // Example:
    // Authorization: Bearer eyJhbGc...
    Authorization: token ? `Bearer ${token}` : "",
  };

  /**
   * If request has body
   * tell backend body contains JSON
   */
  if (options.body) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  /**
   * Final fetch configuration
   */
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {

    /**
     * Send HTTP request
     */
    const response = await fetch(url, config);
//
//    console.log("========== API REQUEST ==========");
//    console.log("URL:", url);
//    console.log("METHOD:", config.method || "GET");
//    console.log("HEADERS:", config.headers);
//    console.log("BODY:", options.body);
//    console.log("STATUS:", response.status);
//    console.log("================================");

    /**
     * 204 = success but no content
     */
    if (response.status === 204) {
      return null;
    }

    /**
     * Check response type
     *
     * Example:
     * application/json
     * text/plain
     */
    const contentType = response.headers.get("content-type") || "";

    const isJson = contentType.includes("application/json");

    /**
     * Parse response body
     */
    let data;

    try {
      data = isJson
        ? await response.json()
        : await response.text();

    } catch {

      /**
       * Happens when:
       * - backend sends empty response
       * - invalid JSON
       */
      data = null;
    }


    /**
     * Handle backend errors
     *
     * Common status codes:
     *
     * 400 -> Bad request
     * 401 -> Unauthorized (not logged in)
     * 403 -> Forbidden / invalid JWT
     * 404 -> API not found
     * 409 -> Duplicate data
     * 500 -> Backend crashed
     */
    if (!response.ok) {

      let message =
        data?.message ||
        data ||
        `API Error: ${response.statusText}`;

      /**
       * Better readable errors
       */
      switch (response.status) {

        case 400:
          message = message || "Invalid request data";
          break;

        case 401:
          message = "Please login first";
          break;

        case 403:
          message =
            "Please Login First.";
          break;

        case 404:
          message = "API endpoint not found";
          break;

        case 409:
          message = message || "Data already exists";
          break;

        case 500:
          message = "Something Went Wrong";
          break;

        default:
          break;
      }

      console.error("API ERROR:", message);

      const apiError = new Error(message);

      apiError.status = response.status;

      apiError.originalError = data;

      throw apiError;
    }

    return data;

  } catch (error) {

    console.error("FETCH ERROR:", error);

    /**
     * TypeError usually means:
     *
     * - backend server stopped
     * - CORS issue
     * - internet disconnected
     * - wrong API url
     */
    if (error instanceof TypeError) {

      const netError = new Error(
        "Unable to connect to server. Please check backend server, internet connection, or CORS configuration."
      );

      netError.status = 0;

      netError.originalError = error;

      throw netError;
    }

    throw error;
  }
};


const realApi = {
//   Contract: POST /api/track -> Tracks a new product by URL.
  trackProduct: async (url) => {
    const data = await request("/api/track", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    return {
      status: data?.success ? "active" : "error",
      message: data?.message || "",
      originalResponse: data,
    };
  },


//  Contract: GET /api/products -> Fetches all products.
  getAllProducts: async () => {
    return await request(`/api/products/All`);
  },



//    Contract: GET /api/deals -> Fetches curated deals.
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


//    Contract: GET /api/products/:id -> Fetches product details by ID.
  getProductById: async (pid) => {
    return await request(`/api/products/Details/${pid}`);
  },


//    Contract: GET /api/products/:id/history -> Fetches price history for a product.
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



//   Contract: GET /api/trends -> Fetches trends data.
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


//    Contract: Post /api/user/SignUp -> Register User
  registerUser: async (payload) => {
    const data = await request(`/api/user/signin`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data;
  },


//    Contract: Post /api/user/login ->Login User
  loginUser: async (payload) => {
    const data = await request(`/api/user/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data;
  },


//   Contract: GET /api/alerts -> Fetches alerts.
  getAlerts: async () => {
    try {
      const data = await request("/api/alerts");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn("Failed to fetch alerts", error);
      return [];
    }
  },

//   Contract: POST /api/alerts -> Creates a new alert.
  createAlert: async (payload) => {
    const data = await request("/api/alerts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  },

//    Contract: PATCH /api/alerts/:id ->Updates an alert.
  updateAlert: async (id, updates) => {
    const data = await request(`/api/alerts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return data;
  },

//    Contract: DELETE /api/alerts/:id ->Deletes an alert.
  deleteAlert: async (id) => {
    await request(`/api/alerts/${id}`, {
      method: "DELETE",
    });
    return { id };
  },


//    Contract: POST /api/scrape/amazon -> Performs a live check of the product status.
  checkLiveStatus: async (url) => {
    const data = await request("/api/track", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    return data;
  },
};

// export default api;
export default realApi;
