import React, { useState } from "react";
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
  ArrowRight
} from "lucide-react";
import { PROBLEMS } from "../../data/problemsData.js";
import { useArenaStore } from "../../store/arenaStore.js";

export function AdminDashboard() {
  const { submissions } = useArenaStore();

  const metrics = [
    {
      label: "TOTAL REGISTERED USERS",
      val: "4,820",
      icon: Users,
      colorClass: "am-icon-users"
    },
    {
      label: "ACTIVE PROBLEMS IN VAULT",
      val: String(PROBLEMS.length),
      icon: Code2,
      colorClass: "am-icon-problems"
    },
    {
      label: "CONTESTS HOSTED",
      val: "12",
      icon: Trophy,
      colorClass: "am-icon-contests"
    },
    {
      label: "OPEN BUG REPORTS",
      val: "3",
      icon: MessageSquare,
      colorClass: "am-icon-feedback"
    }
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <div>
          <h1>System Overview & Health</h1>
          <p>Global metrics, platform activity, and administrative management shortcuts.</p>
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
                <b>{m.val}</b>
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
                <th>Problem</th>
                <th>Language</th>
                <th>Verdict</th>
                <th>Runtime</th>
              </tr>
            </thead>
            <tbody>
              {submissions.slice(0, 5).map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <b>{sub.problemTitle}</b>
                  </td>
                  <td style={{ textTransform: "uppercase", fontSize: "11px" }}>
                    {sub.language}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "900",
                        color: sub.verdict === "ACCEPTED" ? "#16a34a" : "#dc2626"
                      }}
                    >
                      {sub.verdictLabel}
                    </span>
                  </td>
                  <td>{sub.runtime} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Server & DB Cluster Status */}
        <div className="admin-table-card">
          <div className="admin-table-card-head">
            <h2>Infrastructure Status</h2>
            <span className="admin-status-pill">All Systems Operational</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span>MongoDB Primary Cluster</span>
              <b style={{ color: "#16a34a" }}>Healthy (3 Nodes)</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span>Redis Standings Cache</span>
              <b style={{ color: "#16a34a" }}>Active (0.4ms latency)</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span>Judge0 / Sandbox Workers</span>
              <b style={{ color: "#16a34a" }}>8 Containers Ready</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span>Active WebSocket Sockets</span>
              <b>1,240 Connected</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
