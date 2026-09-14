import React, { useState, useEffect } from "react";
import {
  Trophy,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { contestApi } from "../../api/arenaApi.js";
import { problemsApi } from "../../api/problems.js";

export function AdminContests() {
  const [contests, setContests] = useState([]);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(90);
  const [penalty, setPenalty] = useState(10);
  const [selectedProblemSlugs, setSelectedProblemSlugs] = useState([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [contestRes, probRes] = await Promise.all([
        contestApi.getContests(),
        problemsApi.getProblems({ limit: 50 })
      ]);
      const contestList = contestRes.data || [];
      setContests(contestList);
      const probList = probRes.data || [];
      setProblems(probList);
      if (probList.length > 0 && selectedProblemSlugs.length === 0) {
        setSelectedProblemSlugs([probList[0].slug]);
      }
    } catch (err) {
      console.error("Failed to load contests or problems:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleCreateContest = async (e) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    try {
      const probItems = selectedProblemSlugs.map((s, idx) => {
        const found = problems.find((p) => p.slug === s);
        return {
          slug: s,
          title: found?.title || s,
          problemId: found?._id || found?.id,
          order: idx + 1,
          points: 250
        };
      });

      const payload = {
        title,
        slug,
        startTime: startTime || new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: Number(duration),
        penaltyMinutes: Number(penalty),
        problems: probItems
      };

      await contestApi.createContest(payload);
      await loadData();
      setShowModal(false);
      setTitle("");
      setSlug("");
      setSelectedProblemSlugs([]);
    } catch (err) {
      alert("Failed to create contest: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteContest = async (slugToDelete) => {
    if (window.confirm(`Are you sure you want to delete contest '${slugToDelete}'?`)) {
      try {
        await contestApi.deleteContest(slugToDelete);
        setContests(contests.filter((c) => c.slug !== slugToDelete));
      } catch (err) {
        alert("Failed to delete contest: " + (err.message || "Unknown error"));
      }
    }
  };

  return (
    <div className="admin-contests-page">
      <div className="admin-page-header">
        <div>
          <h1>Contest Management & Creation</h1>
          <p>Schedule new competitive arenas, assign problem sets, and configure live rules.</p>
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

        {isLoading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#71717a" }}>
            <Loader2 className="animate-spin" size={24} style={{ display: "inline-block", marginRight: "8px" }} />
            Loading contests from database...
          </div>
        ) : (
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
              {contests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#71717a" }}>
                    No contests scheduled yet. Click "Create New Contest" to launch one!
                  </td>
                </tr>
              ) : (
                contests.map((c) => (
                  <tr key={c._id || c.slug}>
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
                    <td>{c.durationMinutes || 90} mins</td>
                    <td>{c.problems?.length || 0} Problems</td>
                    <td>{c.registeredUsers?.length || 0} Users</td>
                    <td>
                      <button
                        className="icon-button"
                        style={{ color: "#ef4444" }}
                        onClick={() => handleDeleteContest(c.slug)}
                        title="Delete Contest"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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
                  {problems.map((p) => (
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
                        #{p.problemNumber || "?"} {p.title} ({p.difficulty})
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
