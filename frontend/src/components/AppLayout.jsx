import React from 'react';
import { NavLink } from 'react-router-dom';
import './AppLayout.css';

const AppLayout = ({ children }) => {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-inner">
            <div className="app-brand">
              <img src="/logo.ico" alt="Logo" className="logo" />
              <nav className="app-nav" aria-label="Primary">
                <NavLink to="/" className="app-nav-link">
                  Home
                </NavLink>
                <NavLink to="/deals" className="app-nav-link">
                  Deals
                </NavLink>
                <NavLink to="/trends" className="app-nav-link">
                  Trends
                </NavLink>
                <NavLink to="/alerts" className="app-nav-link">
                  Alerts
                </NavLink>
              </nav>
            </div>

            <div className="logintab">
              <a href="/login">LogIn / </a>
              <a href="/signin">SignUp</a>
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
          </div>
        </header>

        <main className="app-main">{children}</main>
      </div>
    );
};

export default AppLayout;
