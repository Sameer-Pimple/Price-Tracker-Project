import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusComponents';
import { formatCurrency, formatRelativeTime } from '../utils/frontend-helpers';
import History from './History';
import "./Product.css";

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [liveData, setLiveData] = useState(null);
    const [checkingLive, setCheckingLive] = useState(false);

    const fetchProduct = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getProductById(id);
            if (!data) {
                setError("Product not found.");
            } else {
                setProduct(data);
            }
        } catch (err) {
            console.error("Product fetch error:", err);
            setError(err.message || "Failed to fetch product data");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleLiveCheck = async () => {
        if (!product?.url) return;
        setCheckingLive(true);
        try {
            const result = await api.checkLiveStatus(product.url);
            setLiveData(result);
        } catch (err) {
            alert("Live check failed. Amazon might be limiting requests. Please try again later.");
        } finally {
            setCheckingLive(false);
        }
    };

    if (loading) return <LoadingState message="Loading product details..." />;

    if (error) return (
        <div>
            <ErrorState message={error} onRetry={fetchProduct} />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button onClick={() => navigate('/')} className="btn-secondary">
                    &larr; Back to Home
                </button>
            </div>
        </div>
    );

    if (!product) return <EmptyState message="Product not found" />;

    // Determine values to display (prefer live data if available)
    const displayPrice = liveData?.Price || product.price?.current;
    const displayOriginalPrice = liveData?.MRP || product.price?.original;
    const displayCurrency = product.price?.currency || '₹';
    const lastChecked = liveData ? new Date().toISOString() : (product.lastChecked || new Date().toISOString());

    // Intelligence Data
    const { buySignal, predictedDrop, nextExpectedDeal } = product.intelligence || {};
    const { volatilityScore, average } = product.analytics || {};

    return (
        <div className="product-container">
            {/* Flattened Header */}
            <div className="product-header">
                {/* Image Section */}
                <div className="product-image-container">
                    <img src={product.image} alt={product.title} className="product-image" />
                </div>

                {/* Info Section */}
                <div className="product-info">
                    {liveData && (
                        <div className="live-indicator">
                            <span style={{ fontSize: '1.2em' }}>●</span> Live Update
                        </div>
                    )}

                    {buySignal && (
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span className={`badge ${buySignal === 'STRONG_BUY' || buySignal === 'BUY' ? 'badge-success' :
                                buySignal === 'WAIT' ? 'badge-warning' : 'badge-danger'}`}
                            >
                                {buySignal.replace('_', ' ')}
                            </span>
                        </div>
                    )}

                    <h1 className="product-title">{product.title}</h1>

                    {/* Dominant Price */}
                    <div className="price-block">
                        <div className="current-price">
                            {displayPrice ? formatCurrency(displayPrice, displayCurrency) : '---'}
                            {product.price?.discount > 0 && (
                                <span className="discount-badge">-{product.price.discount}%</span>
                            )}
                        </div>
                        {displayOriginalPrice && (
                            <div className="mrp-price">
                                MRP: {formatCurrency(displayOriginalPrice, displayCurrency)}
                            </div>
                        )}
                        <div className="text-helper" style={{ marginTop: '0.5rem' }}>
                            {liveData ? 'Live price from Amazon' : 'Last tracked price'}
                        </div>
                    </div>

                    {/* Intelligence Strip */}
                    <div className="intelligence-strip">
                        <div className="intel-item">
                            <span className="intel-label">Minimum</span>
                            <span className="intel-value">
                                {average ? formatCurrency(average * 0.8, displayCurrency) : '---'}
                                {/* TODO: Replace specific min logic if available in backend, using avg proxy for simple visualization now if min empty */}
                            </span>
                        </div>
                        <div className="intel-item">
                            <span className="intel-label">Average</span>
                            <span className="intel-value">
                                {average ? formatCurrency(average, displayCurrency) : '---'}
                            </span>
                        </div>
                        <div className="intel-item">
                            <span className="intel-label">Maximum</span>
                            <span className="intel-value">
                                {average ? formatCurrency(average * 1.2, displayCurrency) : '---'}
                                {/* TODO: Replace specific max logic */}
                            </span>
                        </div>
                        <div className="intel-item">
                            <span className="intel-label">Trend</span>
                            <span className="intel-value" style={{ color: predictedDrop ? 'var(--success-color)' : 'var(--text-muted)' }}>
                                {predictedDrop ? 'Dropping' : 'Stable'}
                            </span>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="action-bar">
                        {product.url && (
                            <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                View on Amazon ↗
                            </a>
                        )}

                        <button
                            onClick={handleLiveCheck}
                            disabled={checkingLive}
                            className="btn-secondary"
                        >
                            {checkingLive ? 'Checking...' : 'Check Live'}
                        </button>

                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
                <History />
            </div>
        </div>
    );
};

export default Product;
