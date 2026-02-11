import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusComponents';
import "./Deals.css";

const Deals = () => {
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getDeals();
            setDeals(data);
        } catch (err) {
            setError(err.message || 'Unable to load deals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    return (
        <div className="deals-container">
            {/* Page Heading */}
            {/* Page Heading */}
            <div className="deals-header">
                <h1>Smart Deals</h1>
                <p>Curated deals based on historical price lows.</p>
            </div>

            {/* Layout Container */}
            {/* Layout Container */}
            <div className="deals-layout">
                {/* Sidebar Section */}
                {/* Sidebar Section */}
                <aside className="deals-sidebar">
                    <h2>Filters</h2>
                    <p>Category</p>
                    <p>Price Range</p>
                    <p>Platform</p>
                </aside>

                {/* Main Content Section */}
                {/* Main Content Section */}
                <main className="deals-main">
                    <h2>Available Deals</h2>
                    <div className="deal-note">
                        <p>
                            <span style={{ fontWeight: 600 }}>Note:</span> Prices are subject to change by the retailer. Always check the final price on the store page.
                        </p>
                    </div>

                    {loading && <LoadingState message="Hunting for deals..." />}

                    {error && <ErrorState message={error} onRetry={fetchDeals} />}

                    {!loading && !error && deals.length === 0 && (
                        <EmptyState message="No deals found right now.">
                            <p>Check back later or track a new product to see it here.</p>
                        </EmptyState>
                    )}

                    {!loading && !error && deals.length > 0 && (
                        <div className="deals-main-grid">
                            {deals.map(deal => (
                                <div
                                    key={deal.id || Math.random()}
                                    className="deal-card"
                                    onClick={() => deal.id && navigate(`/product/${deal.id}`)}
                                >
                                    <h3 className="deal-card-title">{deal.title}</h3>
                                    {deal.price?.current && (
                                        <div className="deal-price-row">
                                            <p className="deal-price">
                                                {deal.price.currency || '₹'} {deal.price.current.toLocaleString()}
                                            </p>
                                            {deal.price.discount > 0 && (
                                                <span className="deal-discount">
                                                    -{deal.price.discount}%
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {deal.reason && <p className="deal-meta">{deal.reason}</p>}
                                    <p className="deal-meta">Click to view history</p>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Footer */}
            <footer>
                <p>&copy; 2026 Price Tracker Project</p>
            </footer>
        </div>
    );
};

export default Deals;
