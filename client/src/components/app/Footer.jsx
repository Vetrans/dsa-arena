import { Link } from "react-router-dom";
import "./Footer.css";

const columns = [
  [
    "Arena",
    [
      ["Problems", "/problems"],
      ["Contests", "/contests"],
      ["Leaderboard", "/leaderboard"],
    ],
  ],
  [
    "Platform",
    [
      ["Roadmap", "/roadmap"],
      ["1v1 Battles", "/battles"],
      ["Achievements", "/achievements"],
    ],
  ],
  [
    "Account",
    [
      ["Join Arena", "/register"],
      ["Log In", "/login"],
      ["Settings", "/settings"],
    ],
  ],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand footer-brand-text" to="/">
          <span className="brand-nyc-box">NYC</span>
          <span>DSA Arena</span>
        </Link>
        <p>Competitive algorithmic battleground for dedicated engineers.</p>
        <div className="footer-links">
          {columns.map(([title, links]) => (
            <div key={title}>
              <b>{title}</b>
              {links.map(([label, to]) => (
                <Link key={label} to={to}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} NYC DSA Arena. All rights reserved.</span>
        <span>Built for algorithmic mastery</span>
      </div>
    </footer>
  );
}
