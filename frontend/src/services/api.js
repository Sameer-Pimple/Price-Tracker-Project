const api = {
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
