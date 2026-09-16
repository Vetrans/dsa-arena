import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Github, Shield, Terminal, Trophy, ArrowRight, Zap, Swords } from "lucide-react";
import logo from "../../assets/nyc-logo-svg.svg";
import "./Footer.css";

const FOOTER_NAV = [
  {
    title: "Platform",
    links: [
      { label: "1v1 Battle Arena", to: "/battles" },
      { label: "Problem Vault", to: "/problems" },
      { label: "Weekly Contests", to: "/contests" },
      { label: "Global Leaderboard", to: "/leaderboard" },
      { label: "Progressive Roadmap", to: "/roadmap" }
    ]
  },
  {
    title: "Curriculum",
    links: [
      { label: "Arrays & Two Pointers", to: "/problems" },
      { label: "Dynamic Programming", to: "/problems" },
      { label: "Monotonic Stacks", to: "/problems" },
      { label: "Graph BFS / DFS", to: "/problems" },
      { label: "Beyond Sigma Program", href: "https://notyourcollege.com/courses/beyondsigma" }
    ]
  },
  {
    title: "Community",
    links: [
      { label: "Join Discord Community", href: "https://discord.gg/3NTygqWDD" },
      { label: "Arena Features", to: "/features" },
      { label: "Contact & Partnerships", to: "/?view=contact" },
      { label: "Member Login", to: "/login" },
      { label: "Create Free Account", to: "/register" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top-grid">
        {/* Left Column: Brand & Ethos */}
        <div className="footer-brand-col">
          <Link className="footer-logo-link" to="/" aria-label="Not Your College Home">
            <img src={logo} alt="Not Your College" className="footer-logo-img" />
          </Link>
          <p className="footer-tagline">
            The live competitive algorithmic battleground. Practice curated interview
            patterns, climb real chess-grade ELO divisions, and dominate technical interviews.
          </p>
          <div className="footer-social-row">
            <a
              href="https://discord.gg/3NTygqWDD"
              target="_blank"
              rel="noreferrer"
              className="footer-social-pill"
            >
              <MessageSquare size={14} /> Discord Server
            </a>
            <a
              href="https://notyourcollege.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-pill"
            >
              <Terminal size={14} /> Official Site
            </a>
          </div>
        </div>

        {/* Right Columns: Nav Links */}
        <div className="footer-nav-columns">
          {FOOTER_NAV.map((col) => (
            <div key={col.title} className="footer-nav-col">
              <span className="footer-col-title">{col.title}</span>
              <ul className="footer-links-list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a href={link.href} target="_blank" rel="noreferrer" className="footer-link">
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link to={link.to} className="footer-link">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} Not Your College. All rights reserved.</p>
          <div className="footer-trust-chips">
            <span className="footer-chip"><Zap size={13} /> Sub-Second Judge</span>
            <span className="footer-chip"><Swords size={13} /> Live 1v1 Matches</span>
            <span className="footer-chip"><Trophy size={13} /> ELO Ranked</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

