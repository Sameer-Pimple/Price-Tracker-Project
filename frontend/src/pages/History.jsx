import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PriceChart from '../components/PriceChart';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.getPriceHistory('1'); // Hardcoded ID for now
                setHistory(data || []);
            } catch (error) {
                console.error("Failed to fetch price history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div>Loading history...</div>;

    return (
        <div>
            <h1>Price History</h1>

            {/* 
                TODO: Backend Filtering Logic
                - Buttons below are currently UI-only.
                - When real API is ready, clicking these should trigger a fetch with ?range=...
            */}
            {/* Time Range Selector */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>7 Days</button>
                <button style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>30 Days</button>
                <button style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>6 Months</button>
            </div>

            {/* Chart Context */}
            <section style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Price Trends Over Time</h2>
                <p style={{ color: '#4b5563' }}>This chart visualizes the price fluctuations of the product, helping you identify the best time to buy.</p>
            </section>

            {
                history.length < 2 ? (
                    // Improved empty state
                    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'center', border: '1px dashed #d1d5db' }}>
                        <h3 style={{ marginTop: 0 }}>Not Enough Data Yet</h3>
                        <p>We are currently establishing a baseline for this product. Check back in a few days to see price trends.</p>
                    </div>
                ) : (
                    <PriceChart priceHistory={history} />
                )
            }

            {/* Price Insight Summary */}
            <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                <h3 style={{ fontSize: '1.1rem', marginTop: 0, color: '#1e40af' }}>Price Insight</h3>
                <p style={{ margin: 0, color: '#1e3a8a' }}>The price seems to be fluctuating within a normal range. Consider setting an alert for significant drops.</p>
            </section>
        </div >
    );
};

export default History;
