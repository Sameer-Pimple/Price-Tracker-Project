import React from 'react';

const ProductInfo = ({ title, asin, price, lastChecked, category, url, rating, availability }) => {
    // Construct clean shortlink
    const shortLink = asin ? `amzn.in/dp/${asin}` : null;

    return (
        <div className="product-info" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                    {category && (
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#4b5563',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '9999px',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {category}
                        </span>
                    )}
                    <h2 style={{ marginTop: '0.25rem', fontSize: '1.5rem', lineHeight: '1.3' }}>{title}</h2>
                </div>
                {/* Placeholder for future Rating Badge */}
                {rating && (
                    <div style={{ textAlign: 'center', background: '#fffbeb', border: '1px solid #fcd34d', padding: '0.5rem', borderRadius: '8px' }}>
                        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold', color: '#b45309' }}>{rating} ★</span>
                        <span style={{ fontSize: '0.7rem', color: '#92400e' }}>Customer Rating</span>
                    </div>
                )}
            </div>

            <div className="product-details" style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'white', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div>
                    <span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Current Price</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{price}</span>
                </div>
                <div>
                    <span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Availability</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '500', color: availability?.toLowerCase().includes('in stock') ? '#059669' : '#dc2626' }}>
                        {availability || 'Unknown'}
                    </span>
                </div>
                <div>
                    <span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Shortlink</span>
                    {shortLink ? (
                        <a href={`https://${shortLink}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>
                            {shortLink} ↗
                        </a>
                    ) : <span style={{ color: '#9ca3af' }}>N/A</span>}
                </div>
                <div>
                    <span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Last System Check</span>
                    <span style={{ color: '#374151' }}>{lastChecked}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
