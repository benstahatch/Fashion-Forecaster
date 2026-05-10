import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ isLoggedIn }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ForeMT <span className="logo-thin">FASHION</span>
        </Link>

        <div className="nav-links">
          {/* Dropdown 1: Forecasting */}
          <div className="dropdown">
            <button className="dropbtn">Forecasting</button>
            <div className="dropdown-content">
              <Link to="/color">Color Forecasting</Link>
              <Link to="/market">Market Research</Link>
            </div>
          </div>

          {/* Dropdown 2: Reviews */}
          <div className="dropdown">
            <button className="dropbtn">Reviews</button>
            <div className="dropdown-content">
              <Link to="/fashionWeek">Fashion Week</Link>
            </div>
          </div>
          
          <Link to="/about">About Us</Link>
          <Link to="/collage">Create</Link>

          <Link to={isLoggedIn ? "/profile" : "/signin"}>
            {isLoggedIn ? "PROFILE" : "SIGN IN"}
          </Link>
        </div>
      </div>
    </nav>
  );
}