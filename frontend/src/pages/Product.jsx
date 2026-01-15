import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductInfo from '../components/ProductInfo';

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.getProductById('1'); // Hardcoded ID for now
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product data');
                setLoading(false);
            }
        };

        fetchProduct();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h1>Product Page</h1>
            {product && (
                <>
                    <ProductInfo
                        // TODO: Data Source: Backend (GET /api/products/:id)
                        title={product.title}
                        asin={product.id}
                        // Note: Price formatting should ideally happen on frontend, but currency symbol comes from backend
                        price={`${product.currency} ${product.currentPrice}`}
                        lastChecked={new Date().toLocaleDateString()}
                    />

                    {/* Price Summary Section */}
                    {/* TODO: Future Backend Data: Statistics should be pre-calculated by backend and sent in response. */}
                    {/* Frontend should NOT calculate min/max/avg from raw history if possible. */}
                    <section>
                        <h2>Price Summary</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ flex: 1, padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Lowest Price Seen</h3>
                                <p style={{ margin: 0, color: '#6b7280' }}>Data will appear after tracking</p>
                            </div>
                            <div style={{ flex: 1, padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Highest Price Seen</h3>
                                <p style={{ margin: 0, color: '#6b7280' }}>Data will appear after tracking</p>
                            </div>
                            <div style={{ flex: 1, padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Average Price</h3>
                                <p style={{ margin: 0, color: '#6b7280' }}>Data will appear after tracking</p>
                            </div>
                        </div>
                    </section>

                    {/* Buy Decision Insight Section */}
                    <section>
                        <h2>Buy Decision Insight</h2>
                        <p>Based on current data, the price is stable. It might be a good time to buy if you need it now.</p>
                    </section>

                    {/* Actions Section */}
                    <section>
                        <h2>Actions</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => navigate(`/history/${id}`)}
                                style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                            >
                                View Price History
                            </button>
                            <a
                                href="#"
                                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '1rem' }}
                            >
                                View on Amazon
                            </a>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Product;
