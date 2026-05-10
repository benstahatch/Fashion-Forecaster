import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        
        <div className="footer-col">
          <h2 className="footer-logo">ForeMT <span className="logo-thin">Fashion</span></h2>
          <p className="footer-text">Where students become the future in fashion.</p>
        </div>

        
        <div className="footer-col">
          <h3 className="footer-label">Services</h3>
          <ul className="footer-list">
            <li><Link to="trend">Trend Forecasting</Link></li>
            <li><Link to="color">Color Forecasting</Link></li>
            <li><Link to="market">Market Research</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-label">Legal</h3>
          <ul className="footer-list">
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>© 2026 FOREMT FASHION. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}