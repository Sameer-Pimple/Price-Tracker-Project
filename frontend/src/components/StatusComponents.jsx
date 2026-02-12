import React from 'react';

/**
 * Standard Loading State
 * Used when data is being fetched from the backend.
 */
/**
 * Standard Loading State
 * Uses a skeleton placeholder pattern for better perceived performance.
 */
export const LoadingState = ({ message = "Loading..." }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', opacity: 0.7 }}>
        {[1, 2, 3,4,5,6,7,8].map((i) => (
            <div key={i} className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="skeleton" style={{ height: '160px', borderRadius: '8px' }}></div>
                <div className="skeleton" style={{ height: '1.5rem', width: '80%' }}></div>
                <div className="skeleton" style={{ height: '1.5rem', width: '40%' }}></div>
                <div className="skeleton" style={{ height: '0.875rem', width: '60%', marginTop: 'auto' }}></div>
            </div>
        ))}
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem', display: 'none' }}>
            {message}
        </div>
    </div>
);

/**
 * Standard Error State
 * Used when API calls fail (Network or Backend).
 */
export const ErrorState = ({ message, onRetry }) => (
    <div style={{
        padding: '1.5rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#991b1b',
        margin: '1rem 0'
    }}>
        <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Something went wrong</h3>
        <p style={{ margin: '0.5rem 0' }}>{message || "Unable to load data. Please try again later."}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                style={{
                    backgroundColor: '#fff',
                    border: '1px solid #fca5a5',
                    color: '#b91c1c',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                }}
            >
                Retry
            </button>
        )}
    </div>
);

/**
 * Standard Empty State
 * Used when API returns successful but empty data (e.g., no history, no products).
 */
export const EmptyState = ({ message, children }) => (
    <div style={{
        padding: '3rem 1rem',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px dashed #d1d5db',
        color: '#6b7280'
    }}>
        <h3 style={{ marginTop: 0, fontSize: '1.25rem', color: '#374151' }}>No Data Available</h3>
        <p>{message || "We couldn't find anything here."}</p>
        {children}
    </div>
);
