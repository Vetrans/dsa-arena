import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Sparkles, ArrowRight } from "lucide-react";
import logo from "../../assets/nyc-logo-svg.svg";
import { useDemoAuth } from "../../store/demoAuthStore.js";
import { Footer } from "./Footer.jsx";
import { APP_NAV_LINKS, PUBLIC_NAV_LINKS } from "../../config/navigation.js";
import { UserNavDropdown } from "./UserNavDropdown.jsx";
import { useNavbarScroll } from "../../hooks/useNavbarScroll.js";

export function PublicHeader() {
  const { user } = useDemoAuth();
  const location = useLocation();
  const { isScrolled, isHidden, mobileOpen, setMobileOpen } = useNavbarScroll();

  const links = user ? APP_NAV_LINKS : PUBLIC_NAV_LINKS;

  const isLinkActive = (to) => {
    const currentFull = location.pathname + location.search + location.hash;
    if (to === "/") {
      return location.pathname === "/" && !location.search && !location.hash;
    }
    if (to.startsWith("/#")) {
      return location.hash === to.substring(1);
    }
    if (to.includes("?")) {
      return currentFull === to;
    }
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  const handleNavClick = (to) => {
    setMobileOpen(false);
    if (to.startsWith("/#")) {
      const targetId = to.substring(2);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const headerClassNames = [
    "site-header",
    isScrolled ? "is-scrolled" : "at-top",
    isHidden ? "is-hidden" : "is-visible",
    mobileOpen ? "is-mobile-open" : ""
  ].filter(Boolean).join(" ");

  return (
    <>
      <header className={headerClassNames} role="banner">
        <div className="header-inner">
          {/* Brand Logo Only - Clean SVG with NO trailing text */}
          <Link
            className="brand"
            to={user ? "/dashboard" : "/"}
            onClick={() => setMobileOpen(false)}
            aria-label="Not Your College"
          >
            <img src={logo} alt="Not Your College" className="brand-logo-img" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {links.map(({ label, to, isFeatured }) => {
              const active = isLinkActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`nav-link ${active ? "active" : ""} ${isFeatured ? "featured-nav-link" : ""}`}
                  onClick={() => handleNavClick(to)}
                >
                  {label}
                  {isFeatured && <span className="nav-feature-dot" />}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action / User Profile (Desktop) */}
          <div className="header-actions desktop-actions">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link className="admin-chip" to="/admin" title="Admin Control Console">
                    <Shield size={13} /> Admin
                  </Link>
                )}
                <UserNavDropdown />
              </>
            ) : (
              <>
                <Link to="/login" className="login-text-link">
                  Login
                </Link>
                <Link className="button button-yellow primary-cta" to="/register">
                  Join Arena
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
          <div className="mobile-nav-content">
            <nav className="mobile-nav-links">
              {links.map(({ label, to, isFeatured }) => {
                const active = isLinkActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`mobile-nav-link ${active ? "active" : ""} ${isFeatured ? "featured" : ""}`}
                    onClick={() => handleNavClick(to)}
                  >
                    <span>{label}</span>
                    {isFeatured && (
                      <span className="mobile-featured-tag">FLAGSHIP COURSE</span>
                    )}
                    <ArrowRight size={16} className="mobile-link-arrow" />
                  </Link>
                );
              })}
            </nav>

            <div className="mobile-nav-footer">
              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <span className="mobile-user-tag">SIGNED IN</span>
                    <b>@{user.username}</b>
                  </div>
                  <div className="mobile-actions-row">
                    <Link
                      to="/settings"
                      className="button button-ghost mobile-btn"
                      onClick={() => setMobileOpen(false)}
                    >
                      Settings
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="button button-yellow mobile-btn"
                        onClick={() => setMobileOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mobile-guest-actions">
                  <Link
                    to="/login"
                    className="button button-ghost mobile-btn"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="button button-yellow mobile-btn"
                    onClick={() => setMobileOpen(false)}
                  >
                    Join Arena ↗
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export function PublicFrame({ children }) {
  return (
    <div className="site-layout-wrapper">
      <PublicHeader />
      <div className="site-body-content">
        {children}
      </div>
      <Footer />
    </div>
  );
}
