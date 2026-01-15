const Alerts = () => {
    return (
        <div>
            {/* Page Heading */}
            <h1>Price Alerts</h1>
            <p>Never miss a deal! Set up alerts to get notified when prices drop to your target range.</p>

            {/* Explanation Section */}
            <section>
                <h2>How it Works</h2>
                <p>1. <strong>Search</strong> for a product you want to track using the home page.</p>
                <p>2. <strong>Set Target</strong> price on the product page.</p>
                <p>3. <strong>Get Notified</strong> via email instantly when the price drops.</p>
            </section>

            {/* Alerts List Section */}
            <section>
                <h2>Your Active Alerts</h2>
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', border: '1px dashed #d1d5db', borderRadius: '8px' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>You don't have any active alerts yet.</p>
                    <p>Start tracking products to see them listed here.</p>
                    <a href="/" style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>Go to Home &rarr;</a>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <p>&copy; 2026 Price Tracker Project</p>
            </footer>
        </div>
    );
};

export default Alerts;
