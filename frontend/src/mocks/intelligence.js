/**
 * MOCK INTELLIGENCE API
 * 
 * Defines the strict data contracts for the "Intelligence" backend upgrade.
 * All frontend components should consume these shapes.
 */

export const MOCK_PRODUCTS = [
  {
    id: "prod_1",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: {
      current: 29990,
      currency: "INR",
      discount: 14,
    },
    image: "https://m.media-amazon.com/images/I/61+elFLgckL._SL1500_.jpg",
    status: "TRACKING",
    lastChecked: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: "prod_2",
    title: "Apple MacBook Air 15-inch M2 Chip",
    price: {
      current: 114900,
      currency: "INR",
      discount: 8,
    },
    image: "https://m.media-amazon.com/images/I/71S4sIPFvBL._SL1500_.jpg",
    status: "TRACKING",
    lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "prod_3",
    title: "Samsung Galaxy S24 Ultra 5G AI Smartphone",
    price: {
      current: 129999,
      currency: "INR",
      discount: 0,
    },
    image: "https://m.media-amazon.com/images/I/81vxWpPpgNL._SL1500_.jpg",
    status: "OUT_OF_STOCK",
    lastChecked: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: "prod_1",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: {
      current: 29990,
      currency: "INR",
      discount: 14,
    },
    image: "https://m.media-amazon.com/images/I/61+elFLgckL._SL1500_.jpg",
    status: "TRACKING",
    lastChecked: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: "prod_2",
    title: "Apple MacBook Air 15-inch M2 Chip",
    price: {
      current: 114900,
      currency: "INR",
      discount: 8,
    },
    image: "https://m.media-amazon.com/images/I/71S4sIPFvBL._SL1500_.jpg",
    status: "TRACKING",
    lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "prod_1",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: {
      current: 29990,
      currency: "INR",
      discount: 14,
    },
    image: "https://m.media-amazon.com/images/I/61+elFLgckL._SL1500_.jpg",
    status: "TRACKING",
    lastChecked: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: "prod_2",
    title: "Apple MacBook Air 15-inch M2 Chip",
    price: {
      current: 114900,
      currency: "INR",
      discount: 8,
    },
    image: "https://m.media-amazon.com/images/I/71S4sIPFvBL._SL1500_.jpg",
    status: "TRACKING",
    lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
];

export const MOCK_PRODUCT_DETAILS = {
    "prod_1": {
        id: "prod_1",
        title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        url: "https://www.amazon.in/Sony-WH-1000XM5-Wireless-Cancelling-Headphones/dp/B09XS7JWHH",
        image: "https://m.media-amazon.com/images/I/61+elFLgckL._SL1500_.jpg",
        platform: "AMAZON",
        price: {
            current: 29990,
            original: 34990,
            currency: "INR",
            discount: 14
        },
        analytics: {
            lowest: 24990,
            highest: 34990,
            average: 28500,
            volatilityScore: 45 // Moderate volatility
        },
        intelligence: {
            buySignal: "WAIT",
            predictedDrop: 0.75, // 75% chance of drop
            nextExpectedDeal: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days
        },
        history: [
            { date: "2024-01-01", price: 34990 },
            { date: "2024-01-15", price: 29990 },
            { date: "2024-02-01", price: 26990 },
            { date: "2024-02-14", price: 29990 }
        ]
    },
    "prod_2": {
        id: "prod_2",
        title: "Apple MacBook Air 15-inch M2 Chip",
        url: "https://www.amazon.in/dp/B0C7679M9X",
        image: "https://m.media-amazon.com/images/I/71S4sIPFvBL._SL1500_.jpg",
        platform: "AMAZON",
        price: {
            current: 114900,
            original: 134900,
            currency: "INR",
            discount: 15
        },
        analytics: {
            lowest: 99900,
            highest: 134900,
            average: 118000,
            volatilityScore: 20 // Low volatility
        },
        intelligence: {
            buySignal: "BUY",
            predictedDrop: 0.2,
            nextExpectedDeal: null
        },
        history: [
            { date: "2023-12-01", price: 134900 },
            { date: "2024-01-01", price: 124900 },
            { date: "2024-02-01", price: 114900 }
        ]
    }
};

export const MOCK_TRENDS = {
    summary: {
        topCategory: "Audio",
        totalTracked: 1280,
        moversToday: 34,
        averageDrop: 7.8
    },
    categories: [
        { name: "Audio", trend: "up", change: 9.2 },
        { name: "Laptops", trend: "down", change: 5.4 },
        { name: "Phones", trend: "up", change: 3.1 },
        { name: "Accessories", trend: "down", change: 6.7 }
    ],
    movers: [
        {
            id: "prod_1",
            title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
            price: { current: 29990, currency: "INR", change: -12 },
            reason: "New all-time low"
        },
        {
            id: "prod_2",
            title: "Apple MacBook Air 15-inch M2 Chip",
            price: { current: 114900, currency: "INR", change: -6 },
            reason: "Festival discount"
        }
    ],
    timeline: [
        { date: "2025-12-01", avgPrice: 100 },
        { date: "2026-01-01", avgPrice: 94 },
        { date: "2026-02-01", avgPrice: 92 }
    ]
};

export const MOCK_ALERTS = [
    {
        id: "alert_1",
        productTitle: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        targetPrice: 27990,
        currentPrice: 29990,
        currency: "INR",
        status: "ACTIVE",
        lastTriggered: null
    },
    {
        id: "alert_2",
        productTitle: "Apple MacBook Air 15-inch M2 Chip",
        targetPrice: 112900,
        currentPrice: 114900,
        currency: "INR",
        status: "PAUSED",
        lastTriggered: "2026-01-18T10:20:00.000Z"
    }
];

/**
 * Simulates API latency
 */
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));
