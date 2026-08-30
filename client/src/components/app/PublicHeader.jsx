import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/nyc-logo.jpg";
import { useDemoAuth } from "../../store/demoAuthStore.js";
import { Footer } from "./Footer.jsx";
import { APP_NAV_LINKS, PUBLIC_NAV_LINKS } from "../../config/navigation.js";

export function PublicHeader() {
  const { user, logout } = useDemoAuth();
  const links = user ? APP_NAV_LINKS : PUBLIC_NAV_LINKS;

  return (
    <header className="site-header">
      <Link className="brand" to={user ? "/dashboard" : "/"}>
        <img src={logo} alt="Not Your College" />
        <span>DSA Arena</span>
      </Link>
      <nav>
        {links.map(({ label, to }) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <Link className="admin-chip" to="/admin" title="Admin Control Console">
              🛡️ Admin
            </Link>
            <Link className="settings-chip" to="/settings" title="User Settings">
              ⚙️
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
