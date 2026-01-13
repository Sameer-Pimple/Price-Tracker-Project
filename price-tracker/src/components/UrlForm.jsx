import React, { useState } from 'react';

const UrlForm = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!url.includes('amazon.in')) {
            setError('URL must contain "amazon.in"');
            return;
        }

        if (!url.includes('/dp/') && !url.includes('/gp/')) {
            setError('URL must contain "/dp/" or "/gp/"');
            return;
        }

        console.log('Valid URL submitted:', url);
    };

    return (
        <div>
            <h2>URL Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="url-input">Amazon Product URL:</label>
                    <input
                        type="text"
                        id="url-input"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.amazon.in/..."
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Track Price</button>
            </form>
        </div>
    );
};

export default UrlForm;
