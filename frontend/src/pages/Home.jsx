import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UrlForm from '../components/UrlForm';
import api from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusComponents';
import Helper from '../components/Helper';
import { formatRelativeTime } from '../utils/frontend-helpers';
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [pageState, setPageState] = useState('loading'); // loading, success, error
    const [trackState, setTrackState] = useState('idle'); // idle, tracking, error
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getAllProducts();
                // Client-side sort if needed, though backend does it.
                // Start with raw data
                setProducts(data);
                setPageState('success');
            } catch (error) {
                console.error("Home load error:", error);
                setErrorMessage("Unable to load tracked products. The backend might be unreachable.");
                setPageState('error');
            }
        };

        fetchProducts();
    }, []);

    const handleUrlSubmit = async (e) => {
        const url = e.target.elements['url-input'].value;

        // Basic validation matching UrlForm
        if (!url.includes('amazon.in')) return;
        if (!url.includes('/dp/') && !url.includes('/gp/')) return;

        setTrackState('tracking');

        try {
            const data = await api.trackProduct(url);
            if (data && data.status === 'active') {
                // Navigate to product page on success
                // Fallback to home if ID is missing (though contract says ID should be there)
                const targetId = data.id || '';
                if (targetId) navigate(`/product/${targetId}`);
                else {
                    setTrackState('idle');
                    alert("Product tracked, but no ID returned to navigate.");
                    // Refresh list
                    const updated = await api.getAllProducts();
                    setProducts(updated);
                }
            } else {
                setTrackState('error');
                alert(data?.message || "Failed to track product.");
            }
        } catch (error) {
            setTrackState('error');
            alert(error.message || "Network error while tracking.");
        } finally {
            if (trackState !== 'success') setTrackState('idle');
        }
    };

    const handleRetry = () => {
        setPageState('loading');
        setErrorMessage('');
        api.getAllProducts()
            .then(data => {
                setProducts(data);
                setPageState('success');
            })
            .catch(err => {
                setErrorMessage("Retry failed: " + (err.message || "Unknown error"));
                setPageState('error');
            });
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>

            {/* Dashboard Input Section - Top of Flow */}
            <div className="dashboard-header">
                <form onSubmit={handleUrlSubmit} className="track-input-form">
                    <div className="input-group-unified">
                        <input
                            type="url"
                            name="url-input"
                            placeholder="Paste multiple Amazon URLs..."
                            required
                            className="input-unified"
                            disabled={trackState === 'tracking'}
                        />
                        <button
                            type="submit"
                            disabled={trackState === 'tracking'}
                            className="btn-unified"
                        >
                            {trackState === 'tracking' ? 'Tracking...' : 'Track Product'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Main Content Area */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--heading-color)', fontSize: '1.25rem' }}>Your Tracking List</h3>
                    {products.length > 0 && <span className="badge badge-neutral">{products.length} Products</span>}
                </div>

                {/* Product List Section */}
                <section style={{ padding: 0, background: 'transparent', boxShadow: 'none', border: 'none' }}>
                    {pageState === 'loading' && <LoadingState message="Syncing your dashboard..." />}

                    {pageState === 'error' && (
                        <ErrorState
                            message={errorMessage}
                            onRetry={handleRetry}
                        />
                    )}

                    {pageState === 'success' && products.length === 0 && (
                        <EmptyState message="Your dashboard is empty.">
                            <p className="text-muted">Paste an Amazon link above to start tracking prices.</p>
                        </EmptyState>
                    )}

                    {pageState === 'success' && products.length > 0 && (
                        <div className="product-card-grid">
                            {products.map(product => (
                                <div
                                    key={product.id || Math.random()}
                                    onClick={() => product.id && navigate(`/product/${product.id}`)}
                                    className="product-card"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && product.id) navigate(`/product/${product.id}`);
                                    }}
                                >
                                    <div className="card-image-wrap">
                                        <img
                                            src={product.image || 'https://via.placeholder.com/220'}
                                            alt={product.title}
                                            className="card-image"
                                        />
                                    </div>

                                    <div className="card-body">
                                        <div className="card-title-row">
                                            <h4 className="card-title">{product.title}</h4>
                                            <span
                                                className={`card-status ${product.status === 'TRACKING' ? 'status-active' : 'status-error'}`}
                                                title={`Status: ${product.status}`}
                                            ></span>
                                        </div>

                                        <div className="card-meta">
                                            checked {formatRelativeTime(product.lastChecked)}
                                        </div>

                                        <div className="card-price-row">
                                            <span className="card-price">
                                                ₹{(product.price?.current || 0).toLocaleString()}
                                            </span>
                                            {product.price?.discount > 0 && (
                                                <span className="card-discount">
                                                    -{product.price.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;
