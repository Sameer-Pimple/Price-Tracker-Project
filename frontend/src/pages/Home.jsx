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
            const data = await api.trackProduct(url);
            if (data && data.id) {
                navigate(`/product/${data.id}`);
            }
        } catch (error) {
            alert("Failed to track product. Please try again.");
        }
    };

    return (
        <div onSubmit={handleUrlSubmit}>
            <h1>Amazon Price Tracker</h1>
            <UrlForm />
        </div>
    );
};

export default Home;
