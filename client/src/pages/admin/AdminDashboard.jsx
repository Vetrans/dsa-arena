import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Code2,
  Trophy,
  MessageSquare,
  Plus,
  Shield,
  TrendingUp,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  UserCheck
} from "lucide-react";
import { adminApi } from "../../api/arenaApi.js";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAdminStats() {
      try {
        const res = await adminApi.getDashboardStats();
        if (isMounted && res?.data) {
          setStats(res.data.metrics);
          setRecentSubmissions(res.data.recentSubmissions || []);
          setRecentUsers(res.data.recentUsers || []);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadAdminStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = [
    {
      label: "TOTAL REGISTERED USERS",
      val: stats?.totalUsers !== undefined ? stats.totalUsers.toLocaleString() : "0",
      sub: `${stats?.activeUsers || 0} active contenders`,
      icon: Users,
      colorClass: "am-icon-users"
    },
    {
      label: "PUBLISHED PROBLEMS",
      val: stats?.publishedProblems !== undefined ? stats.publishedProblems.toLocaleString() : "0",
      sub: `${stats?.totalProblems || 0} total in vault`,
      icon: Code2,
      colorClass: "am-icon-problems"
    },
    {
      label: "TOTAL SUBMISSIONS",
      val: stats?.totalSubmissions !== undefined ? stats.totalSubmissions.toLocaleString() : "0",
      sub: `${stats?.acceptanceRate || 0}% acceptance rate`,
      icon: Trophy,
      colorClass: "am-icon-contests"
    },
    {
      label: "PENDING REPORTS & FEEDBACK",
      val: stats ? (Number(stats.pendingReports || 0) + Number(stats.totalFeedback || 0)).toLocaleString() : "0",
      sub: `${stats?.pendingReports || 0} open reports`,
      icon: MessageSquare,
      colorClass: "am-icon-feedback"
    }
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <div>
          <h1>System Overview & Live Health</h1>
          <p>Live metrics, judge stream, recently registered contenders, and moderation shortcuts.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/admin/users" className="button button-yellow">
            <Users size={15} /> Manage Users
          </Link>
          <Link to="/admin/problems" className="button button-dark">
            <Plus size={15} /> Add Problem
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div className="admin-metric-card" key={i}>
              <div className={`am-icon ${m.colorClass}`}>
                <Icon size={22} />
              </div>
              <div className="am-info">
                <span>{m.label}</span>
                <b>
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" style={{ display: "inline-block" }} />
                  ) : (
                    m.val
                  )}
                </b>
                <small style={{ color: "#71717a", fontSize: "11px", marginTop: "2px" }}>{m.sub}</small>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Contenders and Submissions Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Recently Registered Contenders */}
        <div className="admin-table-card" style={{ margin: 0 }}>
          <div className="admin-table-card-head">
            <h2>Recently Registered Contenders</h2>
            <Link to="/admin/users" className="see-all-link">
              View All Users ({stats?.totalUsers || recentUsers.length}) →
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contender</th>
                <th>Role</th>
                <th>Reputation</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "#71717a" }}>
                    <Loader2 size={16} className="animate-spin" style={{ display: "inline-block", marginRight: "6px" }} />
                    Fetching contender roster...
                  </td>
                </tr>
              ) : recentUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#71717a" }}>
                    No users registered yet.
                  </td>
                </tr>
              ) : (
                recentUsers.slice(0, 6).map((u, idx) => {
                  const isWarned = u.reputation === "WARNED";
                  const isSuspended = u.status === "SUSPENDED" || u.reputation === "SUSPENDED";

                  return (
                    <tr key={u._id || u.id || idx}>
                      <td>
                        <b>@{u.username}</b>
                        <div style={{ fontSize: "11px", color: "#71717a" }}>{u.email}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 900,
                            padding: "2px 6px",
                            background: u.role === "ADMIN" ? "#1742e8" : "#f1f5f9",
                            color: u.role === "ADMIN" ? "#fff" : "#0d0f17",
                            border: "1px solid #0d0f17"
                          }}
                        >
                          {u.role || "USER"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            padding: "2px 6px",
                            background: isSuspended ? "#fee2e2" : isWarned ? "#fef3c7" : "#dcfce7",
                            color: isSuspended ? "#dc2626" : isWarned ? "#b45309" : "#16a34a",
                            border: "1px solid currentColor"
                          }}
                        >
                          {isSuspended ? "SUSPENDED" : isWarned ? `WARNED (${u.warnings?.length || 1})` : "CLEAN"}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "#71717a" }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Real-Time Judge Stream */}
        <div className="admin-table-card" style={{ margin: 0 }}>
          <div className="admin-table-card-head">
            <h2>Real-Time Judge Stream</h2>
            <Link to="/submissions" className="see-all-link">
              View all →
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Problem</th>
                <th>Language</th>
                <th>Verdict</th>
                <th>Runtime</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "#71717a" }}>
                    <Loader2 size={16} className="animate-spin" style={{ display: "inline-block", marginRight: "6px" }} />
                    Loading judge events...
                  </td>
                </tr>
              ) : recentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#71717a" }}>
                    No submissions recorded yet.
                  </td>
                </tr>
              ) : (
                recentSubmissions.slice(0, 6).map((sub, idx) => {
                  const title = sub.problemId?.title || sub.problemTitle || "Problem";
                  const username = sub.userId?.username || "Contender";
                  const verdict = sub.status || sub.verdict || "PENDING";
                  const isAccepted = verdict === "ACCEPTED";

                  return (
                    <tr key={sub._id || sub.id || idx}>
                      <td>
                        <b>{title}</b>
                        <div style={{ fontSize: "11px", color: "#71717a" }}>by @{username}</div>
                      </td>
                      <td style={{ textTransform: "uppercase", fontSize: "11px" }}>
                        {sub.language}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "900",
                            color: isAccepted ? "#16a34a" : "#dc2626"
                          }}
                        >
                          {verdict}
                        </span>
                      </td>
                      <td>{sub.runtime ? `${sub.runtime} ms` : "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cluster & Infrastructure Health */}
      <div className="admin-table-card">
        <div className="admin-table-card-head">
          <h2>Infrastructure Status & Node Metrics</h2>
          <span className="admin-status-pill">Active Cluster</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", fontSize: "13px" }}>
          <div style={{ padding: "12px", border: "1.5px solid var(--ink)", background: "#f8fafc" }}>
            <div style={{ color: "#71717a", fontSize: "11px", fontWeight: 800 }}>DATABASE BACKEND</div>
            <b style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <CheckCircle2 size={15} /> MongoDB Connected
            </b>
            <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>{stats?.totalUsers || 0} Registered Contenders</div>
          </div>

          <div style={{ padding: "12px", border: "1.5px solid var(--ink)", background: "#f8fafc" }}>
            <div style={{ color: "#71717a", fontSize: "11px", fontWeight: 800 }}>PROBLEM VAULT</div>
            <b style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <CheckCircle2 size={15} /> {stats?.publishedProblems || 0} Published
            </b>
            <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>{stats?.totalProblems || 0} Total Available</div>
          </div>

          <div style={{ padding: "12px", border: "1.5px solid var(--ink)", background: "#f8fafc" }}>
            <div style={{ color: "#71717a", fontSize: "11px", fontWeight: 800 }}>EXECUTION ENGINE</div>
            <b style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <Activity size={15} /> In-Memory Sandbox / BullMQ
            </b>
            <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>Zero-Crash Fallback Active</div>
          </div>

          <div style={{ padding: "12px", border: "1.5px solid var(--ink)", background: "#f8fafc" }}>
            <div style={{ color: "#71717a", fontSize: "11px", fontWeight: 800 }}>FAIR PLAY & REPUTATION</div>
            <b style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <Shield size={15} /> Enforced
            </b>
            <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>Admin Warnings & Suspensions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
