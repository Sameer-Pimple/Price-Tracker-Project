import React, { useState } from 'react';

const UrlForm = ({ disabled }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        // e.preventDefault() is critical here to prevent browser reload,
        // but we assume the parent 'onSubmit' handler (bubble catch) will handle data
        // logic. However, since the parent uses a wrapping logic for bubble catch,
        // standard form submission might still trigger page reload if not prevented.
        // Actually, the previous Home.jsx uses a <div> wrapper with onSubmit.
        // A <form> submit bubbles to a <div> onSubmit.
        // But if e.preventDefault() is called here, the bubble event is cancelled?
        // No, preventDefault prevents default action (reload), not propagation.
        // Propagation is stopped by stopPropagation().
        // So this is safe.
        // EDIT: Actually, for safety, let's allow the parent to handle the API call
        // validation is mostly UI here.
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

        // Implicitly, the submit event bubbles up if we didn't stop it.
        // But wait, React synthetic events bubbles.
        // If we want to support the parent's onSubmit, we should rely on the event bubbling
        // The parent Home.jsx expects an event with target.elements.
        // If we validation fails, we return early.
        // If validation passes, we let it bubble? 
        // Actually, the cleanest way without 'onSubmit' prop is tricky if we want validation first.
        // But assuming the parent's logic is "Form submitted, check validity, then call API", 
        // we can just let the event bubble.
        // Code below just logs. 
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
                        disabled={disabled}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={disabled}>{disabled ? 'Tracking...' : 'Track Price'}</button>
            </form>
        </div>
    );
};

export default UrlForm;
