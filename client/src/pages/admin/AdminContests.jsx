import React, { useState } from "react";
import {
  Trophy,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  AlertTriangle
} from "lucide-react";
import { PROBLEMS } from "../../data/problemsData.js";

const INITIAL_CONTESTS = [
  {
    id: "c_1",
    title: "NYC Biweekly Arena #12",
    slug: "nyc-biweekly-12",
    status: "LIVE",
    startTime: "2026-08-31T18:00:00Z",
    duration: 90,
    penalty: 10,
    problemSlugs: ["two-sum", "valid-parentheses", "maximum-subarray", "merge-intervals"],
    registeredCount: 312
  },
  {
    id: "c_2",
    title: "Monsoon Algorithm Sprint",
    slug: "monsoon-algo-sprint",
    status: "UPCOMING",
    startTime: "2026-09-04T18:00:00Z",
    duration: 120,
    penalty: 10,
    problemSlugs: ["reverse-linked-list", "climbing-stairs", "coin-change", "word-ladder"],
    registeredCount: 184
  },
  {
    id: "c_3",
    title: "Graph Theory Night #01",
    slug: "graph-theory-night-01",
    status: "UPCOMING",
    startTime: "2026-09-10T19:30:00Z",
    duration: 90,
    penalty: 10,
    problemSlugs: ["word-ladder", "maximum-subarray"],
    registeredCount: 95
  }
];

export function AdminContests() {
  const [contests, setContests] = useState(INITIAL_CONTESTS);
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(90);
  const [penalty, setPenalty] = useState(10);
  const [selectedProblemSlugs, setSelectedProblemSlugs] = useState([
    PROBLEMS[0]?.slug,
    PROBLEMS[1]?.slug
  ]);

  const handleTitleChange = (val) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  const handleToggleProblem = (pSlug) => {
    if (selectedProblemSlugs.includes(pSlug)) {
      setSelectedProblemSlugs(selectedProblemSlugs.filter((s) => s !== pSlug));
    } else {
      setSelectedProblemSlugs([...selectedProblemSlugs, pSlug]);
    }
  };

  const handleCreateContest = (e) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const newContest = {
      id: `c_${Date.now()}`,
      title,
      slug,
      status: "UPCOMING",
      startTime: startTime || new Date(Date.now() + 86400000).toISOString(),
      duration: Number(duration),
      penalty: Number(penalty),
      problemSlugs: selectedProblemSlugs,
      registeredCount: 0
    };

    setContests([newContest, ...contests]);
    setShowModal(false);
    setTitle("");
    setSlug("");
  };

  const handleDeleteContest = (id) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      setContests(contests.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="admin-contests-page">
      <div className="admin-page-header">
        <div>
          <h1>Contest Management & Creation</h1>
          <p>Schedule new competitive arenas, assign problem sets, and configure scoring rules.</p>
        </div>
        <button
          className="button button-yellow"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Create New Contest
        </button>
      </div>

      {/* Contests Table */}
      <div className="admin-table-card">
        <div className="admin-table-card-head">
          <h2>All Scheduled & Live Contests ({contests.length})</h2>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Contest Title</th>
              <th>Start Date / Time</th>
              <th>Duration</th>
              <th>Problems Included</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((c) => (
              <tr key={c.id}>
                <td>
                  <span
                    className={`diff-pill ${
                      c.status === "LIVE" ? "diff-hard" : "diff-medium"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td>
                  <b>{c.title}</b>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                    /{c.slug}
                  </div>
                </td>
                <td>{new Date(c.startTime).toLocaleString()}</td>
                <td>{c.duration} mins</td>
                <td>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {c.problemSlugs.map((ps) => (
                      <span
                        key={ps}
                        style={{
                          fontSize: "10px",
                          background: "#f1f5f9",
                          padding: "2px 6px",
                          borderRadius: "3px"
                        }}
                      >
                        {ps}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{c.registeredCount} users</td>
                <td>
                  <button
                    onClick={() => handleDeleteContest(c.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      cursor: "pointer"
                    }}
                    title="Delete Contest"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Contest Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h2>Create New Arena Contest</h2>
            <p>Define contest rules, timeline, and problem point distribution.</p>

            <form onSubmit={handleCreateContest}>
              <div className="admin-form-group">
                <label>Contest Title:</label>
                <input
                  type="text"
                  placeholder="e.g. NYC Weekly Algorithm Duel #13"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>URL Slug:</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Start Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Duration (Minutes):</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Wrong Attempt Penalty (Minutes):</label>
                  <input
                    type="number"
                    value={penalty}
                    onChange={(e) => setPenalty(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Select Problems for this Contest ({selectedProblemSlugs.length} Selected):</label>
                <div
                  style={{
                    maxHeight: "180px",
                    overflowY: "auto",
                    border: "1.5px solid var(--ink)",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  {PROBLEMS.map((p) => (
                    <label
                      key={p.slug}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProblemSlugs.includes(p.slug)}
                        onChange={() => handleToggleProblem(p.slug)}
                      />
                      <span>
                        #{p.problemNumber} {p.title} ({p.difficulty})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-yellow">
                  Publish Contest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
