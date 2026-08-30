import React, { useState } from "react";
import { MessageSquare, CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const INITIAL_REPORTS = [
  {
    id: "rep_1",
    problemSlug: "two-sum",
    problemTitle: "Two Sum",
    category: "WRONG_TESTCASE",
    reporter: "subway_coder",
    details: "Test case 3 expects 0-indexed result [0, 1] but explanation mentioned 1-based order in older prompt.",
    status: "RESOLVED",
    date: "2026-08-28"
  },
  {
    id: "rep_2",
    problemSlug: "word-ladder",
    problemTitle: "Word Ladder",
    category: "AMBIGUOUS_DESCRIPTION",
    reporter: "queens_hacker",
    details: "Please clarify if words in wordList are guaranteed to be lowercase in all languages.",
    status: "IN_REVIEW",
    date: "2026-08-30"
  },
  {
    id: "rep_3",
    problemSlug: "coin-change",
    problemTitle: "Coin Change",
    category: "RUNTIME_ISSUE",
    reporter: "manhattan_dev",
    details: "Large test case amount=6249 passes in JS in 28ms but might need larger time limit for Python recursion.",
    status: "OPEN",
    date: "2026-08-31"
  }
];

export function AdminFeedback() {
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const updateStatus = (id, newStatus) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
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
            {reports.map((rep) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
