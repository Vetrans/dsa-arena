import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, User, LogOut, Settings, ChevronDown, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../ui';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme, toggleMobileNav } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', authRequired: true },
    { name: 'Problems', path: '/problems', authRequired: false },
    { name: 'Leaderboard', path: '/leaderboard', authRequired: false },
    { name: 'Discussions', path: '/discussions', authRequired: false },
    { name: 'Achievements', path: '/achievements', authRequired: true },
  ];

  return (
    <nav className="layout-navbar">
      <div className="layout-navbar-container">
        <div className="layout-navbar-left">
          <button className="mobile-menu-btn" onClick={toggleMobileNav}>
            <Menu size={24} />
          </button>
          
          <Link to="/" className="layout-navbar-logo">
            <span className="logo-nyc">NYC</span>
            <span className="logo-text">DSA ARENA</span>
          </Link>

          <div className="layout-navbar-links">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="layout-navbar-right">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <>
              <button className="notification-btn" aria-label="Notifications">
                <Bell size={20} />
                <span className="notification-dot"></span>
              </button>

              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="user-menu-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="avatar-placeholder">
                    {user?.username?.charAt(0).toUpperCase() || <User size={16} />}
                  </div>
                  <ChevronDown size={16} className="chevron-icon" />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-username">{user?.username}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link to={`/profile/${user?.username}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Settings size={16} /> Dashboard
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Settings size={16} /> Settings
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <>
                        <div className="dropdown-divider"></div>
                        <Link to="/admin" className="dropdown-item admin-item" onClick={() => setDropdownOpen(false)}>
                          <Shield size={16} /> Admin Panel
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider"></div>
                    
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Join Arena</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
