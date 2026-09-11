import { Link, useLocation } from "react-router-dom";
import { Shield, Settings } from "lucide-react";
import logo from "../../assets/nyc-logo.jpg";
import { useDemoAuth } from "../../store/demoAuthStore.js";
import { Footer } from "./Footer.jsx";
import { APP_NAV_LINKS, PUBLIC_NAV_LINKS } from "../../config/navigation.js";

export function PublicHeader() {
  const { user, logout } = useDemoAuth();
  const location = useLocation();
  const links = user ? APP_NAV_LINKS : PUBLIC_NAV_LINKS;

  const isLinkActive = (to) => {
    const currentFull = location.pathname + location.search;
    if (to === "/") {
      return location.pathname === "/" && !location.search;
    }
    if (to.includes("?")) {
      return currentFull === to;
    }
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  return (
    <header className="site-header">
      <Link className="brand" to={user ? "/dashboard" : "/"}>
        <img src={logo} alt="Not Your College" />
        <span>DSA Arena</span>
      </Link>
      <nav>
        {links.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className={isLinkActive(to) ? "active" : ""}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            {user.role === "admin" && (
              <Link className="admin-chip" to="/admin" title="Admin Control Console">
                <Shield size={13} /> Admin
              </Link>
            )}
            <Link className="settings-chip" to="/settings" title="User Settings">
              <Settings size={14} />
            </Link>
            <Link className="user-chip" to={`/profile/${user.username}`}>
              @{user.username}
            </Link>
            <button className="text-button" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link className="button button-yellow" to="/register">
              Join Arena
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export function PublicFrame({ children }) {
  return (
    <>
      <PublicHeader />
      {children}
      <Footer />
    </>
  );
}
