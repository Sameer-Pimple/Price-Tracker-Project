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
                        title={product.title}
                        asin={product.id} // Using ID as ASIN for now based on mock
                        price={`${product.currency} ${product.currentPrice}`}
                        lastChecked={new Date().toLocaleDateString()} // Mock date
                    />
                    <button onClick={() => navigate(`/history/${id}`)}>
                        View Price History
                    </button>
                </>
            )}
        </div>
    );
};

export default Product;
