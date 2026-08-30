import React, { useState } from "react";
import {
  Code2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  FileCode2,
  Search
} from "lucide-react";
import { PROBLEMS } from "../../data/problemsData.js";

export function AdminProblems() {
  const [problemList, setProblemList] = useState(PROBLEMS);
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

  const handleAddProblem = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProb = {
      id: slug || `prob-${Date.now()}`,
      problemNumber: problemList.length + 1,
      title,
      slug,
      difficulty,
      topics: topics.split(",").map((t) => t.trim()),
      topicSlugs: topics.split(",").map((t) => t.trim().toLowerCase().replace(/\s+/g, "-")),
      tags: topics.split(",").map((t) => t.trim()),
      acceptance: "50.0%",
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
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
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

    setProblemList([...problemList, newProb]);
    setShowModal(false);
    setTitle("");
    setSlug("");
    setDescription("");
  };

  const handleDelete = (slugToDelete) => {
    if (window.confirm(`Delete problem '${slugToDelete}' from vault?`)) {
      setProblemList(problemList.filter((p) => p.slug !== slugToDelete));
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

        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Topics</th>
              <th>Acceptance</th>
              <th>Rewards</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prob) => (
              <tr key={prob.slug}>
                <td>{prob.problemNumber}</td>
                <td>
                  <b>{prob.title}</b>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                    /{prob.slug}
                  </div>
                </td>
                <td>
                  <span
                    className={`diff-pill diff-${prob.difficulty.toLowerCase()}`}
                  >
                    {prob.difficulty}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {prob.topics.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: "10px",
                          background: "#f1f5f9",
                          padding: "2px 6px",
                          borderRadius: "3px"
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{prob.acceptance}</td>
                <td>
                  +{prob.rewards?.xp || 20} XP · +{prob.rewards?.rating || 15} PTS
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(prob.slug)}
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
            ))}
          </tbody>
        </table>
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
