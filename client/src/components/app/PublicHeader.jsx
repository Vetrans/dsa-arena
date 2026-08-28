import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/nyc-logo.jpg";
import { useDemoAuth } from "../../store/demoAuthStore.js";
import { Footer } from "./Footer.jsx";
export function PublicHeader() {
  const { user, logout } = useDemoAuth();
  const links = user
    ? [
        ["Dashboard", "/dashboard"],
        ["Problems", "/problems"],
        ["Contests", "/contests"],
        ["Leaderboard", "/leaderboard"],
        ["Roadmap", "/roadmap"],
        ["Community", "/discussions"],
      ]
    : [
        ["Leaderboard", "/leaderboard"],
        ["Contests", "/contests"],
      ];
  return (
    <header className="site-header">
      <Link className="brand" to={user ? "/dashboard" : "/"}>
        <img src={logo} alt="Not Your College" />
        <span>DSA Arena</span>
      </Link>
      <nav>
        {links.map(([label, to]) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <Link className="user-chip" to="/dashboard">
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
