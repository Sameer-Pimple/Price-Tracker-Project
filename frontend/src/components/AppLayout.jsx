import React from 'react';
import { NavLink } from 'react-router-dom';
import './AppLayout.css';

const AppLayout = ({ children }) => {
    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-header-inner">
                    <div className="app-brand">
                        <h1 className="app-logo">PriceTracker</h1>
                        <nav className="app-nav" aria-label="Primary">
                            <NavLink to="/" className="app-nav-link">Home</NavLink>
                            <NavLink to="/deals" className="app-nav-link">Deals</NavLink>
                            <NavLink to="/trends" className="app-nav-link">Trends</NavLink>
                            <NavLink to="/alerts" className="app-nav-link">Alerts</NavLink>
                        </nav>
                    </div>

                    <button
                        className="theme-toggle"
                        onClick={() => {
                            const root = document.documentElement;
                            const current = root.getAttribute("data-theme");
                            root.setAttribute(
                                "data-theme",
                                current === "dark" ? "light" : "dark"
                            );
                        }}
                    >
                        🌙
                    </button>
                </div>
            </header>

            <main className="app-main">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
