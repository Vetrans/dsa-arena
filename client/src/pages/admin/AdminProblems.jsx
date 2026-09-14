import React, { useState, useEffect } from "react";
import {
  Code2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  FileCode2,
  Search,
  Loader2
} from "lucide-react";
import { problemsApi } from "../../api/problems.js";
import { adminApi } from "../../api/arenaApi.js";

export function AdminProblems() {
  const [problemList, setProblemList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [topics, setTopics] = useState("Arrays, Hashing");
  const [description, setDescription] = useState("");
  const [xpReward, setXpReward] = useState(35);
  const [ratingReward, setRatingReward] = useState(25);
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [starterJs, setStarterJs] = useState("function solution(input) {\n  // Write code\n}");
  const [starterPy, setStarterPy] = useState("def solution(input):\n    # Write code\n    pass");
  const [starterCpp, setStarterCpp] = useState("class Solution {\npublic:\n    void solve() {}\n};");

  const loadProblems = async () => {
    setIsLoading(true);
    try {
      const res = await problemsApi.getProblems({ limit: 100 });
      if (res?.data) {
        setProblemList(res.data);
      }
    } catch (err) {
      console.error("Failed to load problems:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const filtered = problemList.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleTitleChange = (val) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProb = {
      title,
      slug,
      difficulty,
      topicSlugs: topics.split(",").map((t) => t.trim().toLowerCase().replace(/\s+/g, "-")),
      tags: topics.split(",").map((t) => t.trim()),
      rewards: { xp: Number(xpReward), rating: Number(ratingReward) },
      description,
      examples: [
        {
          input: sampleInput || "input = 1",
          output: sampleOutput || "output = 1",
          explanation: "Standard case"
        }
      ],
      constraints: ["1 <= input <= 10^5"],
      hints: [{ order: 1, content: "Think about optimal subproblems." }],
      editorial: {
        approach: "Optimal Algorithm",
        intuition: "Linear scan with cache.",
        complexity: { time: "O(N)", space: "O(1)" },
        solutionCode: starterJs
      },
      testCases: [
        { input: sampleInput || "1", expected: sampleOutput || "1", isHidden: false },
        { input: "2", expected: "2", isHidden: true }
      ],
      starterCode: {
        javascript: starterJs,
        python: starterPy,
        cpp: starterCpp,
        java: "class Solution {\n    public void solve() {}\n}"
      }
    };

    try {
      await adminApi.createProblem(newProb);
      await loadProblems();
      setShowModal(false);
      setTitle("");
      setSlug("");
      setDescription("");
    } catch (err) {
      alert("Failed to create problem: " + (err.message || "Unknown error"));
    }
  };

  const handleDelete = async (probId, slugToDelete) => {
    if (window.confirm(`Delete problem '${slugToDelete}' from vault?`)) {
      try {
        await adminApi.deleteProblem(probId);
        setProblemList(problemList.filter((p) => p._id !== probId && p.slug !== slugToDelete));
      } catch (err) {
        alert("Failed to delete problem: " + (err.message || "Unknown error"));
      }
    }
  };


  return (
    <div className="admin-problems-page">
      <div className="admin-page-header">
        <div>
          <h1>Problem Vault Management</h1>
          <p>Author, modify, and manage DSA challenges, test cases, and starter templates.</p>
        </div>
        <button
          className="button button-yellow"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Add New Problem
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card-head">
          <h2>All Problems ({problemList.length})</h2>
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "6px 12px",
              border: "1.5px solid var(--ink)",
              fontSize: "13px"
            }}
          />
        </div>

        {isLoading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#71717a" }}>
            <Loader2 className="animate-spin" size={24} style={{ display: "inline-block", marginRight: "8px" }} />
            Loading problems from database...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Topics / Tags</th>
                <th>Acceptance</th>
                <th>Rewards</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#71717a" }}>
                    No problems found matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((prob, idx) => {
                  const tagList = prob.tags || prob.topicSlugs || (Array.isArray(prob.topics) ? prob.topics.map(t => t.name || t) : []);
                  const acceptancePct = prob.stats?.totalSubmissions > 0
                    ? `${Math.round((prob.stats.acceptedSubmissions / prob.stats.totalSubmissions) * 100)}%`
                    : (prob.acceptance || "N/A");

                  return (
                    <tr key={prob._id || prob.slug || idx}>
                      <td>{prob.problemNumber || idx + 1}</td>
                      <td>
                        <b>{prob.title}</b>
                        <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                          /{prob.slug}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`diff-pill diff-${(prob.difficulty || 'medium').toLowerCase()}`}
                        >
                          {prob.difficulty || 'Medium'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {tagList.map((t, tidx) => (
                            <span
                              key={tidx}
                              style={{
                                fontSize: "10px",
                                background: "#f1f5f9",
                                padding: "2px 6px",
                                borderRadius: "3px"
                              }}
                            >
                              {typeof t === 'string' ? t : t.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{acceptancePct}</td>
                      <td>
                        +{prob.rewards?.xp || 20} XP · +{prob.rewards?.rating || 15} PTS
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(prob._id, prob.slug)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            cursor: "pointer"
                          }}
                          title="Delete Problem"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Problem Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h2>Add New DSA Problem to Vault</h2>
            <p>Author description, test cases, and multi-language boilerplates.</p>

            <form onSubmit={handleAddProblem}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Problem Title:</label>
                  <input
                    type="text"
                    placeholder="e.g. Trapping Rain Water"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Difficulty:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
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
                  <label>Topics (comma-separated):</label>
                  <input
                    type="text"
                    placeholder="e.g. Arrays, Two Pointers, Stack"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Problem Description (Markdown supported):</label>
                <textarea
                  rows={4}
                  placeholder="Given an array of integers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Sample Input:</label>
                  <input
                    type="text"
                    placeholder="[0,1,0,2,1,0,1,3,2,1,2,1]"
                    value={sampleInput}
                    onChange={(e) => setSampleInput(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Sample Expected Output:</label>
                  <input
                    type="text"
                    placeholder="6"
                    value={sampleOutput}
                    onChange={(e) => setSampleOutput(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>JavaScript Starter Code:</label>
                  <textarea
                    rows={3}
                    value={starterJs}
                    onChange={(e) => setStarterJs(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Python Starter Code:</label>
                  <textarea
                    rows={3}
                    value={starterPy}
                    onChange={(e) => setStarterPy(e.target.value)}
                  />
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
                  Save Problem to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
