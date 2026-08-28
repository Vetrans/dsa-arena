import { Link } from "react-router-dom";
import logo from "../assets/nyc-logo.jpg";
export function HomePage() {
  return (
    <main className="welcome">
      <header className="site-header">
        <Link className="brand" to="/">
          <img src={logo} alt="Not Your College" />
          <span>DSA Arena</span>
        </Link>
        <nav>
          <Link to="/problems">Problems</Link>
          <Link to="/contests">Contests</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </nav>
        <div className="header-actions">
          <Link to="/login">Login</Link>
          <Link className="button button-yellow" to="/register">
            Join Arena
          </Link>
        </div>
      </header>
      <section className="hero">
        <p className="eyebrow">NOT YOUR COLLEGE · COMPETITIVE PROGRAMMING</p>
        <h1>
          Build real skills.
          <br />
          <em>Compete together.</em>
        </h1>
        <p>
          NYC DSA Arena is your space to practice, compete, track progress, and
          grow with the community.
        </p>
        <div className="hero-actions">
          <Link className="button button-yellow" to="/register">
            Create account
          </Link>
          <Link className="button button-outline" to="/problems">
            Browse problems
          </Link>
        </div>
      </section>
      <section className="journey">
        <h2>Your product pages are ready to connect.</h2>
        <div>
          {[
            ["Practice", "/problems"],
            ["Compete", "/contests"],
            ["Track progress", "/dashboard"],
            ["Learn", "/roadmap"],
          ].map(([label, to]) => (
            <Link key={to} to={to}>
              {label} <span>→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
