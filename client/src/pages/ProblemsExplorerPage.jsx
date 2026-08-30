import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  CheckCircle2,
  Circle,
  HelpCircle,
  Shuffle,
  Flame,
  Zap,
  ArrowRight,
  TrendingUp,
  Filter,
  Sparkles
} from "lucide-react";
import { PROBLEMS, TOPICS } from "../data/problemsData.js";
import { useArenaStore } from "../store/arenaStore.js";
import "./ProblemsExplorerPage.css";

export function ProblemsExplorerPage() {
  const navigate = useNavigate();
  const { solvedProblemSlugs, attemptedProblemSlugs, streakDays } =
    useArenaStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  // Daily Challenge problem
  const dailyProblem = PROBLEMS[2]; // e.g. Maximum Subarray

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((prob) => {
      // Search
      const matchesSearch =
        prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prob.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Difficulty
      const matchesDiff =
        selectedDifficulty === "all" ||
        prob.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      // Topic
      const matchesTopic =
        selectedTopic === "all" ||
        prob.topicSlugs.includes(selectedTopic.toLowerCase());

      // Status
      const isSolved = solvedProblemSlugs.includes(prob.slug);
      const isAttempted =
        attemptedProblemSlugs.includes(prob.slug) && !isSolved;

      let matchesStatus = true;
      if (selectedStatus === "solved") matchesStatus = isSolved;
      if (selectedStatus === "attempted") matchesStatus = isAttempted;
      if (selectedStatus === "todo") matchesStatus = !isSolved && !isAttempted;

      return matchesSearch && matchesDiff && matchesTopic && matchesStatus;
    });
  }, [
    searchQuery,
    selectedDifficulty,
    selectedTopic,
    selectedStatus,
    solvedProblemSlugs,
    attemptedProblemSlugs
  ]);

  // Solved Stats calculation
  const totalCount = PROBLEMS.length;
  const solvedCount = solvedProblemSlugs.length;
  const easyTotal = PROBLEMS.filter((p) => p.difficulty === "Easy").length;
  const easySolved = PROBLEMS.filter(
    (p) => p.difficulty === "Easy" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const medTotal = PROBLEMS.filter((p) => p.difficulty === "Medium").length;
  const medSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Medium" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const hardTotal = PROBLEMS.filter((p) => p.difficulty === "Hard").length;
  const hardSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Hard" && solvedProblemSlugs.includes(p.slug)
  ).length;

  const handlePickRandom = () => {
    const unsolved = PROBLEMS.filter(
      (p) => !solvedProblemSlugs.includes(p.slug)
    );
    const pool = unsolved.length > 0 ? unsolved : PROBLEMS;
    const randomIndex = Math.floor(Math.random() * pool.length);
    navigate(`/problems/${pool[randomIndex].slug}`);
  };

  return (
    <div className="problems-page">
      {/* Top Banner & Stats Strip */}
      <section className="problems-hero">
        <div className="daily-challenge-card">
          <div className="daily-badge">
            <Flame size={15} /> DAILY ARENA CHALLENGE · {streakDays} DAY STREAK
          </div>
          <h2>{dailyProblem.title}</h2>
          <p>
            Conquer today's curated problem to maintain your streak and earn{" "}
            <b>+{dailyProblem.rewards?.xp * 2} XP (2x Boost)</b>.
          </p>
          <div className="daily-actions">
            <Link
              to={`/problems/${dailyProblem.slug}`}
              className="button button-yellow"
            >
              Solve Challenge <ArrowRight size={15} />
            </Link>
            <span className="diff-pill diff-medium">Medium</span>
          </div>
        </div>

        <div className="problems-stats-widget">
          <div className="stats-top">
            <div>
              <span className="stat-label">TOTAL SOLVED</span>
              <b className="stat-value">
                {solvedCount} <small>/ {totalCount}</small>
              </b>
            </div>
            <button className="random-btn" onClick={handlePickRandom}>
              <Shuffle size={14} /> Pick Random
            </button>
          </div>

          <div className="diff-progress-bars">
            <div className="prog-item">
              <div className="prog-header">
                <span className="text-easy">Easy</span>
                <span>
                  {easySolved}/{easyTotal}
                </span>
              </div>
              <div className="prog-bar-bg">
                <div
                  className="prog-bar-fill fill-easy"
                  style={{
                    width: `${(easySolved / Math.max(1, easyTotal)) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="prog-item">
              <div className="prog-header">
                <span className="text-medium">Medium</span>
                <span>
                  {medSolved}/{medTotal}
                </span>
              </div>
              <div className="prog-bar-bg">
                <div
                  className="prog-bar-fill fill-medium"
                  style={{
                    width: `${(medSolved / Math.max(1, medTotal)) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="prog-item">
              <div className="prog-header">
                <span className="text-hard">Hard</span>
                <span>
                  {hardSolved}/{hardTotal}
                </span>
              </div>
              <div className="prog-bar-bg">
                <div
                  className="prog-bar-fill fill-hard"
                  style={{
                    width: `${(hardSolved / Math.max(1, hardTotal)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="catalog-controls">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search problems, patterns, or tags (e.g. Sliding Window, Kadane)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-chip-group">
          <select
            className="filter-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="solved">Solved</option>
            <option value="attempted">Attempted</option>
            <option value="todo">To Do</option>
          </select>
        </div>
      </section>

      {/* Topic Chips Carousel */}
      <section className="topics-carousel">
        {TOPICS.map((topic) => (
          <button
            key={topic.slug}
            className={`topic-chip ${
              selectedTopic === topic.slug ? "active" : ""
            }`}
            onClick={() => setSelectedTopic(topic.slug)}
          >
            <span>{topic.name}</span>
            <span className="topic-count">{topic.count}</span>
          </button>
        ))}
      </section>

      {/* Problems Table */}
      <section className="problems-table-wrap">
        <table className="problems-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}>Status</th>
              <th style={{ width: "60px" }}>#</th>
              <th>Title</th>
              <th>Topics</th>
              <th style={{ width: "120px" }}>Acceptance</th>
              <th style={{ width: "100px" }}>Difficulty</th>
              <th style={{ width: "90px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-results">
                  No problems matched your current filters.
                </td>
              </tr>
            ) : (
              filteredProblems.map((prob) => {
                const isSolved = solvedProblemSlugs.includes(prob.slug);
                const isAttempted =
                  attemptedProblemSlugs.includes(prob.slug) && !isSolved;

                return (
                  <tr key={prob.slug}>
                    <td className="status-cell">
                      {isSolved ? (
                        <CheckCircle2 size={18} className="icon-solved" />
                      ) : isAttempted ? (
                        <Circle size={18} className="icon-attempted" />
                      ) : (
                        <Circle size={18} className="icon-todo" />
                      )}
                    </td>
                    <td className="num-cell">
                      {String(prob.problemNumber).padStart(2, "0")}
                    </td>
                    <td className="title-cell">
                      <Link to={`/problems/${prob.slug}`} className="title-link">
                        {prob.title}
                      </Link>
                    </td>
                    <td className="topics-cell">
                      <div className="cell-tags">
                        {prob.topics.map((t, idx) => (
                          <span className="cell-tag" key={idx}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="acc-cell">{prob.acceptance}</td>
                    <td className="diff-cell">
                      <span
                        className={`diff-pill diff-${prob.difficulty.toLowerCase()}`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="action-cell">
                      <Link
                        to={`/problems/${prob.slug}`}
                        className="solve-link"
                      >
                        Solve <b>→</b>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
