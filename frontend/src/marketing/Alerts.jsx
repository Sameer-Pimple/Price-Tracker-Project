import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusComponents';
import "./Alerts.css";

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'ALL',
        sortBy: 'TARGET_ASC'
    });
    const [form, setForm] = useState({
        productId: '',
        productTitle: '',
        targetPrice: '',
        currency: 'INR'
    });

    const fetchAlerts = async () => {
        setLoading(true);
        setError(null);
        try {
            const [alertData, productData] = await Promise.all([
                api.getAlerts(),
                api.getAllProducts()
            ]);
            setAlerts(alertData);
            setProducts(productData);
        } catch (err) {
            setError(err.message || 'Unable to load alerts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const suggestions = useMemo(() => {
        if (!form.productTitle.trim()) return [];
        const query = form.productTitle.toLowerCase();
        return products
            .filter(product => product.title?.toLowerCase().includes(query))
            .slice(0, 6);
    }, [form.productTitle, products]);

    const handleSelectProduct = (product) => {
        setForm(prev => ({
            ...prev,
            productId: product.id || '',
            productTitle: product.title || '',
            currency: product.price?.currency || prev.currency
        }));
    };

    const handleCreateAlert = async (event) => {
        event.preventDefault();
        if (!form.productTitle || !form.targetPrice) return;

        try {
            const created = await api.createAlert({
                productId: form.productId || undefined,
                productTitle: form.productTitle.trim(),
                targetPrice: Number(form.targetPrice),
                currency: form.currency
            });
            setAlerts((prev) => [created, ...prev]);
            setForm({ productId: '', productTitle: '', targetPrice: '', currency: form.currency });
        } catch (err) {
            setError(err.message || 'Unable to create alert');
        }
    };

    const handleToggle = async (alert) => {
        const nextStatus = alert.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        try {
            const updated = await api.updateAlert(alert.id, { status: nextStatus });
            setAlerts((prev) => prev.map(item => item.id === alert.id ? updated : item));
        } catch (err) {
            setError(err.message || 'Unable to update alert');
        }
    };

    const handleDelete = async (alertId) => {
        try {
            await api.deleteAlert(alertId);
            setAlerts((prev) => prev.filter(alert => alert.id !== alertId));
        } catch (err) {
            setError(err.message || 'Unable to delete alert');
        }
    };

    const filteredAlerts = useMemo(() => {
        let next = [...alerts];

        if (filters.status !== 'ALL') {
            next = next.filter(alert => alert.status === filters.status);
        }

        next.sort((a, b) => {
            if (filters.sortBy === 'TARGET_ASC') {
                return Number(a.targetPrice) - Number(b.targetPrice);
            }
            if (filters.sortBy === 'TARGET_DESC') {
                return Number(b.targetPrice) - Number(a.targetPrice);
            }
            if (filters.sortBy === 'LAST_TRIGGERED') {
                return new Date(b.lastTriggered || 0) - new Date(a.lastTriggered || 0);
            }
            if (filters.sortBy === 'TITLE') {
                return a.productTitle.localeCompare(b.productTitle);
            }
            return 0;
        });

        return next;
    }, [alerts, filters]);

    return (
        <div className="alerts-container">
            {/* Page Heading */}
            <div className="alerts-header">
                <h1>Price Alerts</h1>
                <p>Never miss a deal. Set alerts and get notified when your target price hits.</p>
            </div>

            {/* Quick Create */}
            <section className="alerts-create">
                <h2>Create Alert</h2>
                <form className="alert-form" onSubmit={handleCreateAlert}>
                    <div className="alert-autocomplete">
                        <input
                            type="text"
                            placeholder="Search tracked products"
                            value={form.productTitle}
                            onChange={(event) => setForm(prev => ({
                                ...prev,
                                productTitle: event.target.value,
                                productId: ''
                            }))}
                            className="alert-input"
                        />
                        {suggestions.length > 0 && (
                            <div className="alert-suggestions">
                                {suggestions.map((product) => (
                                    <button
                                        type="button"
                                        key={product.id}
                                        className="alert-suggestion"
                                        onClick={() => handleSelectProduct(product)}
                                    >
                                        <span>{product.title}</span>
                                        {product.price?.current ? (
                                            <span className="alert-suggestion-meta">
                                                {product.price.currency || '₹'} {Number(product.price.current).toLocaleString()}
                                            </span>
                                        ) : null}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                        type="number"
                        placeholder="Target price"
                        value={form.targetPrice}
                        onChange={(event) => setForm(prev => ({ ...prev, targetPrice: event.target.value }))}
                        className="alert-input"
                        min="0"
                    />
                    <select
                        value={form.currency}
                        onChange={(event) => setForm(prev => ({ ...prev, currency: event.target.value }))}
                        className="alert-select"
                    >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                    </select>
                    <button type="submit" className="btn-primary">Save Alert</button>
                </form>
            </section>

            <section className="alerts-create">
                            <form className="alert-form" onSubmit={handleCreateAlert}>
                                <input
                                    type="number"
                                    placeholder="Target price"
                                    value={form.targetPrice}
                                    onChange={(event) => setForm(prev => ({ ...prev, targetPrice: event.target.value }))}
                                    className="alert-input"
                                    min="0"
                                />
                                <button type="submit" className="btn-primary">Set Alert</button>
                            </form>
                        </section>

            {loading && <LoadingState message="Checking your alerts..." />}

            {error && <ErrorState message={error} onRetry={fetchAlerts} />}

            {!loading && !error && alerts.length === 0 && (
                <EmptyState message="No alerts yet.">
                    <p>Create your first price alert to start tracking.</p>
                </EmptyState>
            )}

            {!loading && !error && alerts.length > 0 && (
                <section className="alerts-list">
                    <div className="alerts-toolbar">
                        <h2>Your Alerts</h2>
                        <div className="alerts-controls">
                            <select
                                value={filters.status}
                                onChange={(event) => setFilters(prev => ({ ...prev, status: event.target.value }))}
                                className="alert-select"
                            >
                                <option value="ALL">All</option>
                                <option value="ACTIVE">Active</option>
                                <option value="PAUSED">Paused</option>
                            </select>
                            <select
                                value={filters.sortBy}
                                onChange={(event) => setFilters(prev => ({ ...prev, sortBy: event.target.value }))}
                                className="alert-select"
                            >
                                <option value="TARGET_ASC">Target price (low → high)</option>
                                <option value="TARGET_DESC">Target price (high → low)</option>
                                <option value="LAST_TRIGGERED">Last triggered</option>
                                <option value="TITLE">Product name</option>
                            </select>
                        </div>
                    </div>
                    <div className="alerts-grid">
                        {filteredAlerts.map(alert => (
                            <div className="alert-card" key={alert.id}>
                                <div>
                                    <h3>{alert.productTitle}</h3>
                                    <p className="alert-meta">
                                        Target: {alert.currency || '₹'} {Number(alert.targetPrice).toLocaleString()}
                                    </p>
                                    {alert.currentPrice ? (
                                        <p className="alert-meta">
                                            Current: {alert.currency || '₹'} {Number(alert.currentPrice).toLocaleString()}
                                        </p>
                                    ) : null}
                                    {alert.lastTriggered && (
                                        <p className="alert-meta">
                                            Last triggered: {new Date(alert.lastTriggered).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="alert-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => handleToggle(alert)}
                                    >
                                        {alert.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                                    </button>
                                    <button
                                        type="button"
                                        className="alert-delete"
                                        onClick={() => handleDelete(alert.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <span className={`alert-status ${alert.status === 'ACTIVE' ? 'status-active' : 'status-paused'}`}>
                                    {alert.status === 'ACTIVE' ? 'Active' : 'Paused'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer>
                <p>&copy; 2026 Price Tracker Project</p>
            </footer>
        </div>
    );
};

export default Alerts;
