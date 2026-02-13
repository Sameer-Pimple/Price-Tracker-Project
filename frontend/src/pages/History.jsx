import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PriceChart from '../components/PriceChart';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusComponents';
import { formatCurrency, calculateTrends } from '../utils/frontend-helpers';
import "./History.css";

const History = () => {
    const { id } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getPriceHistory(id);
            setHistory(data || []);
        } catch (error) {
            console.error("History fetch error:", error);
            setError(error.message || "Failed to load price history.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const stats = calculateTrends(history);

    if (loading) return <LoadingState message="Loading price history..." />;

    if (error) return <ErrorState message={error} onRetry={fetchHistory} />;

    // Calculate Average manually for now
    const averagePrice = history.length > 0
        ? history.reduce((sum, item) => sum + Number(item.price), 0) / history.length
        : 0;

    return (
        <div className="history-container">
            <header className="history-header">
                <h1 className="history-title">Price Analytics</h1>
            </header>

            {/* Metrics Grid */}
            {history.length > 0 && (
                <div className="metrics-grid">
                    {/* Lowest */}
                    <div className="metric-card">
                        <span className="metric-label">Lowest Price</span>
                        <span className="metric-value">{formatCurrency(stats.min)}</span>
                        <span className="metric-trend trend-down">Best recorded</span>
                    </div>

                    {/* Highest */}
                    <div className="metric-card">
                        <span className="metric-label">Highest Price</span>
                        <span className="metric-value">{formatCurrency(stats.max)}</span>
                        <span className="metric-trend trend-up">Peak recorded</span>
                    </div>

                    {/* Average */}
                    <div className="metric-card">
                        <span className="metric-label">Average Price</span>
                        <span className="metric-value">{formatCurrency(averagePrice)}</span>
                        <span className="metric-trend trend-neutral">Historical mean</span>
                    </div>

                    {/* Current */}
                    <div className="metric-card">
                        <span className="metric-label">Current Price</span>
                        <span className="metric-value">{formatCurrency(stats.current)}</span>
                        <span className={`metric-trend ${stats.direction === 'down' ? 'trend-down' : stats.direction === 'up' ? 'trend-up' : 'trend-neutral'}`}>
                            {stats.direction === 'down' ? '↓ Dropping' : stats.direction === 'up' ? '↑ Rising' : '→ Stable'}
                        </span>
                    </div>
                </div>
            )}

            {/* Chart Section */}
            <div className="chart-section">
                <div className="chart-header">
                    <h3 className="chart-title">Price Trend</h3>
                    {/* Placeholder for future time range selector */}
                </div>

                {history.length < 2 ? (
                    <EmptyState message={history.length === 0 ? "No price history available yet." : "Not enough data for a chart."}>
                        <p style={{ fontSize: '0.9rem' }}>
                            {history.length === 0
                                ? "We just started tracking this product. Check back in 24 hours."
                                : "We need at least two data points to show a trend. Check back soon!"}
                        </p>
                    </EmptyState>
                ) : (
                    <PriceChart priceHistory={history} />
                )}
            </div>
        </div>
    );
};

export default History;
