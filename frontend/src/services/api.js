// Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/";

const request = async (endpoint, options = {}, tokenFromState = null) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${base}${path}`;

  const defaultHeaders = {
    Accept: "application/json",
    Authorization: tokenFromState ? `Bearer ${tokenFromState}` : "",
  };

  if (options.body) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    credentials: "include",
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

    // 🔑 FIXED: Parse the JSON immediately so we can read backend messages
    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text(); // Fallback for plain text responses
    }

    // Now 'data' holds your backend's ResponseEntity body!

    if (!response.ok) {
      let message = data?.error || data?.message || `API Error: ${response.statusText}`;

      switch (response.status) {
        case 400: message = message || "Invalid request data"; break;
        case 401: message = message || "Please login first"; break;
        case 403: message ="Access denied. Please login first."; break;
        case 404: message = message || "API endpoint not found"; break;
        case 409: message = message || "Data already exists"; break; // Will use backend's msg
        case 500: message = message || "Something Went Wrong on the server"; break;
        default: break;
      }

      const apiError = new Error(message);
      apiError.status = response.status;
      apiError.originalError = data; // Keeps the raw backend error structure safe

      throw apiError; // Throws to the catch block in signin.jsx
    }

    return data;

  } catch (error) {
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
//      console.warn("Failed to fetch deals", error);
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
//      console.warn("Failed to fetch history", error);
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
//      console.warn("Failed to fetch trends", error);
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

  updateUser: async (payload) => {
      const data = await request(`/api/user/update`, {
        method: "PATCH",
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

  refreshToken: async () => {
    try {
      // request() already checks for response.ok and parses the JSON for you!
      const data = await request(`/api/user/refresh`, {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        credentials: "include"
      });

      return data; // This will be { AccessToken: "..." } or null
    } catch (error) {
      return null;
    }
  },

  sendOTP: async(payload) =>{

    const data = await request("api/sendEmail/verify", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return data;

  },

  sendForgotOTP: async(payload) =>{

      const data = await request("api/sendEmail/forgot", {
          method: "POST",
          body: JSON.stringify(payload),
      });
      return data;

    },

//   Contract: GET /api/alerts -> Fetches alerts.
  getAlerts: async (token) => {
    try {
      const data = await request("/api/alerts", {}, token);
      return Array.isArray(data) ? data : [];
    } catch (error) {
//      console.warn("Failed to fetch alerts", error);
      return [];
    }
  },

//   Contract: POST /api/alerts -> Creates a new alert.
  createAlert: async (payload,token) => {
    const data = await request("/api/alerts", {
      method: "POST",
      body: JSON.stringify(payload),
    },token);
    return data;
  },

//    Contract: PATCH /api/alerts/:id ->Updates an alert.
  updateAlert: async (id, updates, token) => {
    const data = await request(`/api/alerts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    },token);
    return data;
  },

//    Contract: DELETE /api/alerts/:id ->Deletes an alert.
  deleteAlert: async (id,token) => {
    await request(`/api/alerts/${id}`, {
      method: "DELETE",
    },token);
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
