import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import './MobileNav.css';

export const MobileNav = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { mobileNavOpen, closeMobileNav } = useUIStore();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', authRequired: true },
    { name: 'Problems', path: '/problems', authRequired: false },
    { name: 'Leaderboard', path: '/leaderboard', authRequired: false },
    { name: 'Discussions', path: '/discussions', authRequired: false },
    { name: 'Achievements', path: '/achievements', authRequired: true },
  ];

  return (
    <AnimatePresence>
      {mobileNavOpen && (
        <div className="mobile-nav-container">
          <motion.div
            className="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileNav}
          />
          <motion.div
            className="mobile-nav-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          >
            <div className="mobile-nav-header">
              <Link to="/" className="mobile-nav-logo" onClick={closeMobileNav}>
                <span className="logo-nyc">NYC</span>
                <span className="logo-text">DSA ARENA</span>
              </Link>
              <button className="mobile-nav-close" onClick={closeMobileNav}>
                <X size={24} />
              </button>
            </div>

            <div className="mobile-nav-links">
              {navLinks.map((link) => {
                if (link.authRequired && !isAuthenticated) return null;
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                    onClick={closeMobileNav}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              {!isAuthenticated && (
                <>
                  <div className="mobile-nav-divider"></div>
                  <Link to="/login" className="mobile-nav-link" onClick={closeMobileNav}>
                    Login
                  </Link>
                  <Link to="/register" className="mobile-nav-link text-accent" onClick={closeMobileNav}>
                    Join Arena
                  </Link>
                </>
              )}
            </div>

            {isAuthenticated && (
              <div className="mobile-nav-footer">
                <div className="mobile-user-info">
                  <div className="mobile-avatar">
                    {user?.username?.charAt(0).toUpperCase() || <User size={20} />}
                  </div>
                  <div>
                    <div className="mobile-username">{user?.username}</div>
                    <div className="mobile-email">{user?.email}</div>
                  </div>
                </div>
                <button
                  className="mobile-logout-btn"
                  onClick={() => {
                    logout();
                    closeMobileNav();
                  }}
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
