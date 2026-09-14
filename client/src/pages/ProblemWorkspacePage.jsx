import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  History,
  MessageSquare,
  FileCode2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Sparkles,
  Trophy,
  Zap,
  ArrowRight,
  Maximize2,
  Bug,
  AlertOctagon
} from "lucide-react";
import { PROBLEMS } from "../data/problemsData.js";
import { executeProblemTests } from "../services/sandboxJudge.js";
import { useArenaStore } from "../store/arenaStore.js";
import { submissionsApi } from "../api/submissions.js";
import "./ProblemWorkspacePage.css";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript (Node 20)" },
  { id: "python", label: "Python 3.11" },
  { id: "cpp", label: "C++ 20" },
  { id: "java", label: "Java 17" },
  { id: "go", label: "Go 1.22" },
  { id: "rust", label: "Rust 1.76" }
];

export function ProblemWorkspacePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find problem or fallback to first
  const problemIndex = PROBLEMS.findIndex((p) => p.slug === slug);
  const problem = problemIndex !== -1 ? PROBLEMS[problemIndex] : PROBLEMS[0];

  const prevProblem = problemIndex > 0 ? PROBLEMS[problemIndex - 1] : null;
  const nextProblem =
    problemIndex < PROBLEMS.length - 1 ? PROBLEMS[problemIndex + 1] : null;

  // Arena Store
  const {
    solvedProblemSlugs,
    saveDraftCode,
    getDraftCode,
    loadDraftFromIDB,
    unlockedHints,
    unlockHint,
    recordSubmission,
    submissions
  } = useArenaStore();

  const isSolved = solvedProblemSlugs.includes(problem.slug);
  const problemSubmissions = submissions.filter(
    (s) => s.problemSlug === problem.slug
  );

  // Workspace Local State
  const [activeTab, setActiveTab] = useState("description"); // description, hints, editorial, submissions, discussions
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Bug report modal state
  const [showBugModal, setShowBugModal] = useState(false);
  const [bugCategory, setBugCategory] = useState("WRONG_TESTCASE");
  const [bugDetails, setBugDetails] = useState("");
  const [bugSuccess, setBugSuccess] = useState(false);

  // Discussions state
  const [discussionsList, setDiscussionsList] = useState([
    {
      id: 1,
      author: "subway_coder",
      time: "2 hours ago",
      text: "Optimal O(N) approach using hash maps handles duplicate values seamlessly!",
      upvotes: 14
    },
    {
      id: 2,
      author: "algo_queen",
      time: "1 day ago",
      text: "Make sure to watch out for edge cases where the target is formed by adding negative numbers.",
      upvotes: 9
    }
  ]);
  const [newComment, setNewComment] = useState("");

  // Sync / Load code
  useEffect(() => {
    let isCurrent = true;
    const saved = getDraftCode(problem.slug, language);
    if (saved) {
      setCode(saved);
    } else {
      setCode(problem.starterCode[language] || "");
      // Check IndexedDB
      if (loadDraftFromIDB) {
        loadDraftFromIDB(problem.slug, language).then((idbCode) => {
          if (isCurrent && idbCode) {
            setCode(idbCode);
          }
        });
      }
    }
    setExecutionResult(null);
    return () => {
      isCurrent = false;
    };
  }, [problem.slug, language]);

  const handleCodeChange = (newVal) => {
    setCode(newVal || "");
    saveDraftCode(problem.slug, language, newVal || "");
  };

  const handleResetCode = () => {
    if (window.confirm("Reset code to starter boilerplate?")) {
      const initial = problem.starterCode[language] || "";
      setCode(initial);
      saveDraftCode(problem.slug, language, initial);
    }
  };

  // Run visible test cases
  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);

    try {
      const testsToRun = useCustomInput
        ? [{ input: customInput, expected: "N/A", isHidden: false }]
        : problem.testCases;

      const res = await executeProblemTests({
        code,
        language,
        testCases: testsToRun,
        isFullSubmit: false
      });

      setExecutionResult(res);
    } catch (err) {
      setExecutionResult({
        verdict: "RUNTIME_ERROR",
        verdictLabel: "Runtime Error",
        errorMessage: err.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Full submit against all test cases
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setExecutionResult(null);

    try {
      const res = await executeProblemTests({
        code,
        language,
        testCases: problem.testCases,
        isFullSubmit: true
      });

      setExecutionResult(res);

      recordSubmission({
        problemSlug: problem.slug,
        problemTitle: problem.title,
        verdict: res.verdict,
        verdictLabel: res.verdictLabel,
        language,
        runtime: res.runtime || 45,
        memory: res.memory || 42.5,
        code,
        xpReward: problem.rewards?.xp || 25,
        ratingReward: problem.rewards?.rating || 15
      });

      if (problem._id || problem.id) {
        submissionsApi.submitCode({
          problemId: problem._id || problem.id,
          language,
          code
        }).catch(() => {});
      }

      if (res.verdict === "ACCEPTED") {
        setShowCelebration(true);
      }
    } catch (err) {
      setExecutionResult({
        verdict: "RUNTIME_ERROR",
        verdictLabel: "Runtime Error",
        errorMessage: err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setDiscussionsList([
      {
        id: Date.now(),
        author: "you",
        time: "Just now",
        text: newComment.trim(),
        upvotes: 1
      },
      ...discussionsList
    ]);
    setNewComment("");
  };

  const problemHintsUnlocked = unlockedHints[problem.slug] || [];

  return (
    <div className="arena-workspace">
      {/* Top Workspace Header Bar */}
      <header className="workspace-header">
        <div className="workspace-nav-left">
          <Link to="/problems" className="back-btn">
            <ChevronLeft size={16} /> All Problems
          </Link>
          <span className="divider-slash">/</span>
          <div className="problem-title-chip">
            <span className="p-num">#{problem.problemNumber}</span>
            <span className="p-name">{problem.title}</span>
            <span className={`diff-pill diff-${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            {isSolved && (
              <span className="solved-badge">
                <CheckCircle2 size={13} /> Solved
              </span>
            )}
          </div>
        </div>

        <div className="workspace-nav-center">
          <button
            className="pager-btn"
            disabled={!prevProblem}
            onClick={() => prevProblem && navigate(`/problems/${prevProblem.slug}`)}
            title="Previous Problem"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="pager-count">
            {problemIndex + 1} / {PROBLEMS.length}
          </span>
          <button
            className="pager-btn"
            disabled={!nextProblem}
            onClick={() => nextProblem && navigate(`/problems/${nextProblem.slug}`)}
            title="Next Problem"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="workspace-nav-right">
          <button
            className="action-btn report-issue-btn"
            onClick={() => setShowBugModal(true)}
            title="Report an issue or bug with this problem"
          >
            <Bug size={14} /> Report Bug
          </button>
          <button
            className="action-btn run-btn"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
          >
            <Play size={14} className={isRunning ? "spinning" : ""} />
            {isRunning ? "Running..." : "Run"}
          </button>
          <button
            className="action-btn submit-btn"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
          >
            <Send size={14} className={isSubmitting ? "spinning" : ""} />
            {isSubmitting ? "Judging..." : "Submit"}
          </button>
        </div>
      </header>

      {/* Main Dual Pane Workspace */}
      <div className="workspace-body">
        {/* Left Dossier Panel */}
        <aside className="dossier-pane">
          <nav className="dossier-tabs">
            <button
              className={`dossier-tab ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              <FileCode2 size={15} /> Description
            </button>
            <button
              className={`dossier-tab ${activeTab === "hints" ? "active" : ""}`}
              onClick={() => setActiveTab("hints")}
            >
              <Lightbulb size={15} /> Hints ({problem.hints.length})
            </button>
            <button
              className={`dossier-tab ${activeTab === "editorial" ? "active" : ""}`}
              onClick={() => setActiveTab("editorial")}
            >
              <BookOpen size={15} /> Editorial
            </button>
            <button
              className={`dossier-tab ${activeTab === "submissions" ? "active" : ""}`}
              onClick={() => setActiveTab("submissions")}
            >
              <History size={15} /> History ({problemSubmissions.length})
            </button>
            <button
              className={`dossier-tab ${activeTab === "discussions" ? "active" : ""}`}
              onClick={() => setActiveTab("discussions")}
            >
              <MessageSquare size={15} /> Discuss
            </button>
          </nav>

          <div className="dossier-content">
            {activeTab === "description" && (
              <div className="tab-pane-description">
                <div className="problem-meta-bar">
                  <span className="meta-tag">
                    Acceptance: <b>{problem.acceptance}</b>
                  </span>
                  <span className="meta-tag">
                    XP Reward: <b>+{problem.rewards?.xp || 20} XP</b>
                  </span>
                  <span className="meta-tag">
                    Rating: <b>+{problem.rewards?.rating || 15}</b>
                  </span>
                </div>

                <div className="description-text">
                  {problem.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="examples-section">
                  <h3>Examples</h3>
                  {problem.examples.map((ex, i) => (
                    <div className="example-card" key={i}>
                      <div className="example-header">Example {i + 1}</div>
                      <div className="example-row">
                        <span className="label">Input:</span>
                        <code>{ex.input}</code>
                      </div>
                      <div className="example-row">
                        <span className="label">Output:</span>
                        <code>{ex.output}</code>
                      </div>
                      {ex.explanation && (
                        <div className="example-row">
                          <span className="label">Explanation:</span>
                          <span className="text">{ex.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="constraints-section">
                  <h3>Constraints</h3>
                  <ul>
                    {problem.constraints.map((c, i) => (
                      <li key={i}>
                        <code>{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tags-section">
                  <h3>Topics & Tags</h3>
                  <div className="tag-pills">
                    {problem.tags.map((t, i) => (
                      <span className="tag-pill" key={i}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "hints" && (
              <div className="tab-pane-hints">
                <p className="hints-intro">
                  Need a nudge in the right direction? Unlock hints progressively.
                </p>
                {problem.hints.map((hint) => {
                  const isUnlocked = problemHintsUnlocked.includes(hint.order);
                  return (
                    <div className="hint-card" key={hint.order}>
                      <div className="hint-card-head">
                        <span className="hint-num">Hint #{hint.order}</span>
                        {!isUnlocked && (
                          <button
                            className="unlock-hint-btn"
                            onClick={() => unlockHint(problem.slug, hint.order)}
                          >
                            <Zap size={13} /> Unlock Hint
                          </button>
                        )}
                      </div>
                      {isUnlocked ? (
                        <p className="hint-body">{hint.content}</p>
                      ) : (
                        <div className="hint-locked">
                          <AlertTriangle size={15} /> Click unlock above to reveal this hint.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "editorial" && (
              <div className="tab-pane-editorial">
                <div className="editorial-card">
                  <div className="editorial-badge">OFFICIAL EDITORIAL</div>
                  <h2>{problem.editorial.approach}</h2>
                  <p className="editorial-intuition">{problem.editorial.intuition}</p>

                  <div className="complexity-grid">
                    <div className="comp-item">
                      <span className="comp-lbl">Time Complexity</span>
                      <b>{problem.editorial.timeComplexity}</b>
                    </div>
                    <div className="comp-item">
                      <span className="comp-lbl">Space Complexity</span>
                      <b>{problem.editorial.spaceComplexity}</b>
                    </div>
                  </div>

                  <h3>Reference Implementation (JavaScript)</h3>
                  <pre className="editorial-code">
                    <code>{problem.editorial.solutionCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="tab-pane-submissions">
                {problemSubmissions.length === 0 ? (
                  <div className="empty-submissions">
                    <History size={32} />
                    <p>No attempts recorded yet for this problem.</p>
                    <small>Hit "Submit" when you are ready to evaluate your code.</small>
                  </div>
                ) : (
                  <div className="submissions-list">
                    {problemSubmissions.map((sub) => (
                      <div className={`sub-item sub-${sub.verdict.toLowerCase()}`} key={sub.id}>
                        <div className="sub-item-top">
                          <span className="sub-verdict">
                            {sub.verdict === "ACCEPTED" ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <XCircle size={16} />
                            )}
                            {sub.verdictLabel}
                          </span>
                          <span className="sub-lang">{sub.language}</span>
                        </div>
                        <div className="sub-item-bottom">
                          <span>Runtime: {sub.runtime} ms</span>
                          <span>Memory: {sub.memory} MB</span>
                          <span className="sub-date">
                            {new Date(sub.submittedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "discussions" && (
              <div className="tab-pane-discussions">
                <form onSubmit={handleAddComment} className="comment-form">
                  <textarea
                    rows={3}
                    placeholder="Share your insight or ask a question about this problem..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className="submit-comment-btn">
                    Post Comment
                  </button>
                </form>

                <div className="comments-feed">
                  {discussionsList.map((c) => (
                    <div className="comment-bubble" key={c.id}>
                      <div className="comment-top">
                        <b className="comment-author">@{c.author}</b>
                        <span className="comment-time">{c.time}</span>
                      </div>
                      <p className="comment-text">{c.text}</p>
                      <span className="comment-votes">▲ {c.upvotes} upvotes</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Code + Console Pane */}
        <section className="editor-console-pane">
          {/* Editor Header Toolbar */}
          <div className="editor-toolbar">
            <div className="tool-group">
              <Code2 size={16} className="tool-icon" />
              <select
                className="lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="tool-group">
              <button
                className="tool-btn"
                onClick={handleResetCode}
                title="Reset Code"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <select
                className="font-select"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="monaco-wrapper">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "phase",
                fontFamily: "JetBrains Mono, Fira Code, Menlo, monospace",
                lineNumbersMinChars: 3,
                tabSize: 2,
                automaticLayout: true
              }}
            />
          </div>

          {/* Test Runner & Output Console */}
          <div className="console-panel">
            <div className="console-header">
              <div className="console-tabs">
                {!useCustomInput ? (
                  problem.testCases
                    .filter((tc) => !tc.isHidden)
                    .map((tc, idx) => (
                      <button
                        key={idx}
                        className={`console-tab ${
                          activeTestCaseIdx === idx ? "active" : ""
                        }`}
                        onClick={() => setActiveTestCaseIdx(idx)}
                      >
                        Case {idx + 1}
                      </button>
                    ))
                ) : (
                  <button className="console-tab active">Custom Input</button>
                )}
                <button
                  className={`console-tab custom-tab ${
                    useCustomInput ? "active" : ""
                  }`}
                  onClick={() => setUseCustomInput(!useCustomInput)}
                >
                  {useCustomInput ? "Use Standard Cases" : "Custom Test"}
                </button>
              </div>

              {executionResult && (
                <div
                  className={`verdict-pill verdict-${executionResult.verdict.toLowerCase()}`}
                >
                  {executionResult.verdict === "ACCEPTED" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  <span>{executionResult.verdictLabel}</span>
                  {executionResult.runtime && (
                    <small>({executionResult.runtime} ms)</small>
                  )}
                </div>
              )}
            </div>

            <div className="console-body">
              {useCustomInput ? (
                <div className="custom-input-box">
                  <label>Enter comma-separated arguments:</label>
                  <textarea
                    rows={3}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder='e.g. [2, 7, 11, 15], 9'
                  />
                </div>
              ) : (
                <div className="testcase-display">
                  {problem.testCases[activeTestCaseIdx] && (
                    <>
                      <div className="io-group">
                        <span className="io-label">Input:</span>
                        <pre className="io-val">
                          {problem.testCases[activeTestCaseIdx].input}
                        </pre>
                      </div>
                      <div className="io-group">
                        <span className="io-label">Expected:</span>
                        <pre className="io-val">
                          {problem.testCases[activeTestCaseIdx].expected}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Execution Output Details */}
              {executionResult && (
                <div className="execution-output-section">
                  {executionResult.verdict === "ACCEPTED" && (
                    <div className="result-banner ac-banner">
                      <b>All {executionResult.totalTestCases} Testcases Passed!</b>
                      <span>
                        Runtime: {executionResult.runtime} ms · Memory:{" "}
                        {executionResult.memory} MB
                      </span>
                    </div>
                  )}

                  {executionResult.errorMessage && (
                    <div className="result-banner err-banner">
                      <b>{executionResult.verdictLabel}:</b>
                      <pre>{executionResult.errorMessage}</pre>
                    </div>
                  )}

                  {executionResult.failedCase && (
                    <div className="diff-box">
                      <div>
                        <span>Input:</span>
                        <code>{executionResult.failedCase.input}</code>
                      </div>
                      <div>
                        <span>Expected:</span>
                        <code>{executionResult.failedCase.expected}</code>
                      </div>
                      <div>
                        <span>Output:</span>
                        <code className="text-red">
                          {executionResult.failedCase.actual}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Victory Celebration Modal */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-card">
            <div className="trophy-circle">
              <Trophy size={48} />
            </div>
            <h2>SOLVED CONQUERED!</h2>
            <p className="celebration-sub">
              You successfully solved <b>{problem.title}</b>
            </p>

            <div className="celebration-stats">
              <div className="stat-pill">
                <span>XP EARNED</span>
                <b>+{problem.rewards?.xp || 20} XP</b>
              </div>
              <div className="stat-pill">
                <span>ARENA RATING</span>
                <b>+{problem.rewards?.rating || 15} PTS</b>
              </div>
            </div>

            <div className="celebration-actions">
              <button
                className="button button-yellow"
                onClick={() => {
                  setShowCelebration(false);
                  if (nextProblem) navigate(`/problems/${nextProblem.slug}`);
                }}
              >
                Next Problem <ArrowRight size={16} />
              </button>
              <button
                className="button button-outline"
                onClick={() => setShowCelebration(false)}
              >
                Stay in Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Modal */}
      {showBugModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h2>Report Issue with #{problem.problemNumber} {problem.title}</h2>
            <p>
              Found a faulty testcase, typo, ambiguous description, or runtime issue?
              Submit it directly to the Arena Administration team.
            </p>

            {bugSuccess ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
                <h3 style={{ margin: "0 0 6px" }}>Report Submitted!</h3>
                <p style={{ color: "var(--muted)", fontSize: "13px" }}>
                  Thank you! Our engineering team has logged this issue for review.
                </p>
                <button
                  className="button button-yellow"
                  onClick={() => {
                    setShowBugModal(false);
                    setBugSuccess(false);
                    setBugDetails("");
                  }}
                  style={{ marginTop: "16px" }}
                >
                  Back to Problem
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBugSuccess(true);
                }}
              >
                <div className="admin-form-group">
                  <label>Issue Category:</label>
                  <select
                    value={bugCategory}
                    onChange={(e) => setBugCategory(e.target.value)}
                  >
                    <option value="WRONG_TESTCASE">Incorrect or Missing Testcase</option>
                    <option value="AMBIGUOUS_DESCRIPTION">Ambiguous Problem Description</option>
                    <option value="RUNTIME_ISSUE">Runtime / Memory Benchmark Issue</option>
                    <option value="TYPO">Typo / Formatting Error</option>
                    <option value="OTHER">Other Issue</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Detailed Explanation:</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the issue, expected behavior vs observed behavior, or test case values..."
                    value={bugDetails}
                    onChange={(e) => setBugDetails(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => setShowBugModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button button-yellow">
                    Submit Issue Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
