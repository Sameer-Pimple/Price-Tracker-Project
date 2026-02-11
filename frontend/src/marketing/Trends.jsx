import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusComponents';
import "./Trends.css";

const Trends = () => {
    const [trendData, setTrendData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTrends = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getTrends();
            setTrendData(data);
        } catch (err) {
            setError(err.message || 'Unable to load trends');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrends();
    }, []);

    const hasData = trendData?.categories?.length || trendData?.movers?.length || trendData?.timeline?.length;

    return (
        <div className="trends-container">
            {/* Page Heading */}
            <div className="trends-header">
                <h1>Price Trends & Market Insights</h1>
                <p>Track pricing momentum and spot the best timing to buy.</p>
            </div>

            {loading && <LoadingState message="Analyzing the market..." />}

            {error && <ErrorState message={error} onRetry={fetchTrends} />}

            {!loading && !error && !hasData && (
                <EmptyState message="No trends data available yet.">
                    <p>Start tracking products to unlock trend insights.</p>
                </EmptyState>
            )}

            {!loading && !error && hasData && (
                <>
                    {/* Summary Strip */}
                    {trendData.summary && (
                        <section className="trends-summary">
                            <div className="summary-item">
                                <span className="summary-label">Top Category</span>
                                <span className="summary-value">{trendData.summary.topCategory}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Tracked</span>
                                <span className="summary-value">{trendData.summary.totalTracked}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Movers Today</span>
                                <span className="summary-value">{trendData.summary.moversToday}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Avg Drop</span>
                                <span className="summary-value">{trendData.summary.averageDrop}%</span>
                            </div>
                        </section>
                    )}

                    {/* Category Trends */}
                    <section>
                        <h2>Category Momentum</h2>
                        <div className="trend-grid">
                            {trendData.categories.map((category, index) => (
                                <div className="trend-card" key={`${category.name}-${index}`}>
                                    <h3>{category.name}</h3>
                                    <p className={`trend-change ${category.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                                        {category.trend === 'up' ? 'Up' : 'Down'} {category.change}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Movers */}
                    <section>
                        <h2>Top Movers</h2>
                        <div className="trend-grid">
                            {trendData.movers.map((mover, index) => (
                                <div className="trend-card" key={`${mover.id || 'mover'}-${index}`}>
                                    <h3>{mover.title}</h3>
                                    <p className="trend-meta">
                                        {mover.price?.currency || '₹'} {mover.price?.current?.toLocaleString?.() || mover.price?.current}
                                        {mover.price?.change ? ` · ${mover.price.change}%` : ''}
                                    </p>
                                    {mover.reason && <p className="trend-reason">{mover.reason}</p>}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Timeline */}
                    <section>
                        <h2>Average Price Trend</h2>
                        <div className="trend-timeline">
                            {trendData.timeline.map((point, index) => (
                                <div className="timeline-point" key={`${point.date}-${index}`}>
                                    <span className="timeline-date">{point.date}</span>
                                    <span className="timeline-value">{point.avgPrice}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {/* Footer */}
            <footer>
                <p>&copy; 2026 Price Tracker Project</p>
            </footer>
        </div>
    );
};

export default Trends;
