import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="layout-footer">
      <div className="layout-footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-logo">
            <span className="logo-nyc">NYC</span>
            <span className="logo-text">DSA ARENA</span>
          </Link>
          <p className="footer-tagline">Built for the NYC developer community</p>
          <p className="footer-copyright">© 2026 NYC DSA Arena</p>
        </div>
        
        <div className="footer-right">
          <div className="footer-links">
            <Link to="/about" className="footer-link">About</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <Link to="/privacy" className="footer-link">Privacy</Link>
            <Link to="/terms" className="footer-link">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
