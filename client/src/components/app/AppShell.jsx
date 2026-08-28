import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../../assets/nyc-logo.jpg";
const links = [
  ["Dashboard", "/dashboard"],
  ["Problems", "/problems"],
  ["Contests", "/contests"],
  ["Battles", "/battles"],
  ["Leaderboard", "/leaderboard"],
  ["Community", "/discussions"],
  ["Roadmap", "/roadmap"],
];
export function AppShell() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          <img src={logo} alt="Not Your College" />
          <span>DSA Arena</span>
        </Link>
        <nav aria-label="Main navigation">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link to="/notifications">Notifications</Link>
          <Link className="button button-dark" to="/login">
            Login
          </Link>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
