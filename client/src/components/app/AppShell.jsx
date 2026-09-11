import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { Shield, Settings } from "lucide-react";
import logo from "../../assets/nyc-logo.jpg";
import { useDemoAuth } from "../../store/demoAuthStore.js";
import { Footer } from "./Footer.jsx";
import { APP_NAV_LINKS } from "../../config/navigation.js";

export function AppShell() {
  const { user, logout } = useDemoAuth();
  return (
    <div>
      <header className="site-header app-header">
        <Link className="brand" to="/dashboard">
          <img src={logo} alt="Not Your College" />
          <span>DSA Arena</span>
        </Link>
        <nav>
          {APP_NAV_LINKS.map(({ label, to }) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
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
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
