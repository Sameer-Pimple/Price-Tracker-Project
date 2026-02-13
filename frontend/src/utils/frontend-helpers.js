/**
 * Frontend Utility Helpers
 * Pure functions for formatting and data processing.
 */

// Format currency (INR default)
export const formatCurrency = (amount, currency = 'INR') => {
    if (amount === undefined || amount === null || amount === 'N/A') return 'N/A';

    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    } catch (e) {
        return `${currency} ${amount}`;
    }
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
};

// Calculate trend direction and stats from history
export const calculateTrends = (history) => {
    if (!history || history.length < 2) return { direction: 'stable', min: null, max: null, current: null };

    // Sort by date ascending just in case
    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    const prices = sorted.map(h => Number(h.price));
    const current = prices[prices.length - 1];
    const previous = prices[prices.length - 2];
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    let direction = 'stable';
    if (current < previous) direction = 'down';
    else if (current > previous) direction = 'up';

    return {
        direction, // 'up', 'down', 'stable'
        min,
        max,
        current,
        change: current - previous
    };
};
