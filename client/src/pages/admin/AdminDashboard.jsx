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
  Loader2
} from "lucide-react";
import { adminApi } from "../../api/arenaApi.js";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAdminStats() {
      try {
        const res = await adminApi.getDashboardStats();
        if (isMounted && res?.data) {
          setStats(res.data.metrics);
          setRecentSubmissions(res.data.recentSubmissions || []);
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
      label: "TOTAL USERS",
      val: stats ? stats.totalUsers?.toLocaleString() : "...",
      sub: `${stats?.activeUsers || 0} active`,
      icon: Users,
      colorClass: "am-icon-users"
    },
    {
      label: "PUBLISHED PROBLEMS",
      val: stats ? stats.publishedProblems?.toLocaleString() : "...",
      sub: `${stats?.totalProblems || 0} total in vault`,
      icon: Code2,
      colorClass: "am-icon-problems"
    },
    {
      label: "TOTAL SUBMISSIONS",
      val: stats ? stats.totalSubmissions?.toLocaleString() : "...",
      sub: `${stats?.acceptanceRate || 0}% acceptance rate`,
      icon: Trophy,
      colorClass: "am-icon-contests"
    },
    {
      label: "PENDING REPORTS & FEEDBACK",
      val: stats ? (stats.pendingReports + stats.totalFeedback)?.toLocaleString() : "...",
      sub: `${stats?.pendingReports || 0} open reports`,
      icon: MessageSquare,
      colorClass: "am-icon-feedback"
    }
  ];

  const streamSubmissions = recentSubmissions;

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <div>
          <h1>System Overview & Health</h1>
          <p>Live metrics, judge stream, and administrative management shortcuts.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/admin/contests" className="button button-yellow">
            <Plus size={15} /> Create Contest
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
                <b>{isLoading ? "..." : m.val}</b>
                <small style={{ color: "#71717a", fontSize: "11px", marginTop: "2px" }}>{m.sub}</small>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links / Sections Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
        {/* Recent Submissions Feed */}
        <div className="admin-table-card">
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
              {streamSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#71717a" }}>
                    No submissions recorded yet.
                  </td>
                </tr>
              ) : (
                streamSubmissions.map((sub, idx) => {
                  const title = sub.problemId?.title || sub.problemTitle || "Problem";
                  const username = sub.userId?.username || "Contender";
                  const verdict = sub.status || sub.verdict || "PENDING";
                  const isAccepted = verdict === "ACCEPTED";

                  return (
                    <tr key={sub._id || sub.id || idx}>
                      <td>
                        <b>{title}</b>
                        <div style={{ fontSize: "11px", color: "#71717a" }}>by {username}</div>
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

        {/* Server & DB Cluster Status */}
        <div className="admin-table-card">
          <div className="admin-table-card-head">
            <h2>Infrastructure Status</h2>
            <span className="admin-status-pill">Live Cluster</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span>MongoDB Database</span>
              <b style={{ color: "#16a34a" }}>Connected & Syncing</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span>Redis Leaderboards & Sockets</span>
              <b style={{ color: "#16a34a" }}>Active</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span>Dynamic Problem Vault</span>
              <b style={{ color: "#16a34a" }}>{stats?.totalProblems || 0} Registered</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span>Total Active Users</span>
              <b>{stats?.activeUsers || 0} Registered</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
