import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AppLayout.css';
import Button from '@mui/material/Button';
import Navbar from './Navbar'
import { useAuth } from "../context/AuthContext";

const AppLayout = ({ children }) => {

    const navigate = useNavigate();
    const { accessToken, logout} = useAuth();
    const handleLogout = () => {

                    logout();
                  navigate("/", {
                     state: {
                        message: "Logout Successful"
                     }
                  });


    };
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
              {
                 accessToken ? (

                    <Button size="small" variant="text" onClick={handleLogout}>
                       Logout
                    </Button>

                 ) : (

                    <>
                       <Button  size="small" variant="text" onClick={() => navigate("/login")}>
                          Login
                       </Button>

                       <Button   size="small" variant="text" onClick={() => navigate("/signin")}>
                          Sign In
                       </Button>
                    </>
                 )
              }
                    <Navbar/>
            </div>
          </div>
        </header>
        <main className="app-main">{children}</main>
      </div>
    );
};

export default AppLayout;
