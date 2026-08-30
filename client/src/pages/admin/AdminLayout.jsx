import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  Trophy,
  Code2,
  Users,
  MessageSquare,
  ArrowLeft,
  Flame,
  Plus
} from "lucide-react";
import logo from "../../assets/nyc-logo.jpg";
import { useDemoAuth } from "../../store/demoAuthStore.js";
import "./AdminDashboard.css";

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/contests", label: "Contests Manager", icon: Trophy },
  { to: "/admin/problems", label: "Problem Vault", icon: Code2 },
  { to: "/admin/users", label: "User Accounts", icon: Users },
  { to: "/admin/feedback", label: "Bug Reports", icon: MessageSquare }
];

export function AdminLayout() {
  const { user } = useDemoAuth();

  return (
    <div className="admin-root">
      {/* Admin Top Navigation Header */}
      <header className="admin-header-bar">
        <div className="ah-left">
          <Link to="/dashboard" className="ah-back-link">
            <ArrowLeft size={16} /> Exit to Arena
          </Link>
          <span className="ah-divider">/</span>
          <div className="ah-brand">
            <img src={logo} alt="NYC DSA Arena" />
            <span>NYC SUPER-ADMIN CONSOLE</span>
          </div>
        </div>

        <div className="ah-right">
          <span className="admin-status-pill">
            <Shield size={14} /> Full Access Mode
          </span>
          <span className="ah-user">@{user?.username || "admin"}</span>
        </div>
      </header>

      {/* Admin Sidebar + Content Body */}
      <div className="admin-layout-body">
        <aside className="admin-sidebar">
          <div className="sidebar-nav-title">MANAGEMENT MODULES</div>
          <nav className="admin-sidebar-nav">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `admin-nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={17} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="sidebar-info-card">
              <b>⚡ High-Scale Engine</b>
              <p>Managing live contests, problem vault testcases, and user ELO.</p>
            </div>
          </div>
        </aside>

        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
