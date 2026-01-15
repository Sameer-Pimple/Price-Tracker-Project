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
            <h1>History Page</h1>
            {history.length < 2 ? (
                <p>Price history will appear after daily scans.</p>
            ) : (
                <PriceChart priceHistory={history} />
            )}
        </div>
    );
};

export default History;
