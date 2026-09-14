import React, { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, Clock, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/arenaApi.js";

export function AdminFeedback() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getFeedback({ limit: 50 });
      const list = res?.data?.feedbackList || res?.data || res?.feedbackList || [];
      const normalized = list.map((f) => ({
        id: f._id || f.id,
        problemSlug: f.problemId?.slug || "two-sum",
        problemTitle: f.problemId?.title || "Algorithmic Challenge",
        category: f.type || f.category || "GENERAL_ISSUE",
        reporter: f.userId?.username || "arena_user",
        details: f.content || f.details || f.message || "Feedback submitted",
        status: f.status || "OPEN",
        date: f.createdAt ? new Date(f.createdAt).toISOString().split("T")[0] : "Recent"
      }));
      setReports(normalized);
    } catch (err) {
      console.error("Failed to load feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await adminApi.updateFeedbackStatus(id, { status: newStatus });
      setReports(
        reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      console.error("Failed to update feedback status:", err);
    }
  };

  return (
    <div className="admin-feedback-page">
      <div className="admin-page-header">
        <div>
          <h1>Problem Bug Reports & Feedback</h1>
          <p>Review issue reports submitted by arena users on specific problem test cases and descriptions.</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card-head">
          <h2>Reported Issues ({reports.length})</h2>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Problem</th>
              <th>Category</th>
              <th>Reporter</th>
              <th>Issue Details</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
                  <Loader2 size={18} className="animate-spin" style={{ display: "inline-block", marginRight: "8px" }} />
                  Loading feedback reports...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
                  No feedback reports pending.
                </td>
              </tr>
            ) : (
              reports.map((rep) => (
              <tr key={rep.id}>
                <td>
                  <span
                    className={`diff-pill ${
                      rep.status === "RESOLVED"
                        ? "diff-easy"
                        : rep.status === "IN_REVIEW"
                        ? "diff-medium"
                        : "diff-hard"
                    }`}
                  >
                    {rep.status}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/problems/${rep.problemSlug}`}
                    target="_blank"
                    style={{ fontWeight: "800", color: "#1742e8" }}
                  >
                    {rep.problemTitle} ↗
                  </Link>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      background: "#f1f5f9",
                      padding: "2px 6px",
                      borderRadius: "3px"
                    }}
                  >
                    {rep.category}
                  </span>
                </td>
                <td>@{rep.reporter}</td>
                <td style={{ maxWidth: "340px", fontSize: "12px", lineHeight: "1.4" }}>
                  {rep.details}
                </td>
                <td>{rep.date}</td>
                <td>
                  <select
                    value={rep.status}
                    onChange={(e) => updateStatus(rep.id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      border: "1px solid var(--ink)",
                      fontSize: "12px",
                      fontWeight: "700"
                    }}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_REVIEW">IN REVIEW</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
