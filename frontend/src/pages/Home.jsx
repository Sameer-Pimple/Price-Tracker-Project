import React from 'react';
import { useNavigate } from 'react-router-dom';
import UrlForm from '../components/UrlForm';
import api from '../services/api';

const Home = () => {
    const navigate = useNavigate();

    const handleUrlSubmit = async (e) => {
        // Validation logic duplicated from UrlForm to ensure we only proceed on valid inputs
        // This allows us to use event bubbling without modifying UrlForm logic
        const url = e.target.elements['url-input'].value;

        if (!url.includes('amazon.in')) return;
        if (!url.includes('/dp/') && !url.includes('/gp/')) return;

        try {
            // TODO: Backend Responsibility
            // 1. Backend should validate the URL structure (e.g. is it a valid product page?)
            // 2. Backend should extract the ASIN/ID.
            // 3. Backend should return { id: '...' } so we can navigate.
            const data = await api.trackProduct(url);
            if (data && data.id) {
                navigate(`/product/${data.id}`);
            }
        } catch (error) {
            alert("Failed to track product. Please try again.");
        }
    };

    return (
        <div>
            {/* Header */}
            <header>
                <h1>Price Tracker App</h1>
            </header>

            {/* Hero Section */}
            <section>
                <h2>Track Amazon Price History & Shop Smarter</h2>
                <p>Paste a product link to see historical pricing and make informed buying decisions.</p>

                <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#4b5563' }}>Paste an Amazon product link below to start tracking.</p>

                {/* Wrapped UrlForm to capture submit event via bubbling, same as before */}
                <div onSubmit={handleUrlSubmit} style={{ marginTop: '0.5rem' }}>
                    <UrlForm />
                </div>
            </section>

            {/* How It Works Section */}
            <section>
                <h3>How It Works</h3>
                <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                    <p>1. <strong>Paste URL:</strong> Copy an Amazon product link and paste it above.</p>
                    <p>2. <strong>Track History:</strong> View price changes over time to spot trends.</p>
                    <p>3. <strong>Get Insights:</strong> Receive alerts when prices drop to your target.</p>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <p>&copy; 2026 Price Tracker Project</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '1rem' }}>
                    This tool is not affiliated with Amazon. Prices are tracked based on publicly available information.
                </p>
            </footer>
        </div>
    );
};

export default Home;
