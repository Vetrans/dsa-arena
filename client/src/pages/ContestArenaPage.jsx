import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Timer,
  Trophy,
  Play,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Users,
  ChevronLeft
} from "lucide-react";
import { PROBLEMS } from "../data/problemsData.js";
import { executeProblemTests } from "../services/sandboxJudge.js";
import { useArenaStore } from "../store/arenaStore.js";
import "./ContestArenaPage.css";

const CONTEST_PROBLEMS = [
  { label: "Problem A", points: 100, problem: PROBLEMS[0] },
  { label: "Problem B", points: 250, problem: PROBLEMS[1] },
  { label: "Problem C", points: 400, problem: PROBLEMS[2] },
  { label: "Problem D", points: 600, problem: PROBLEMS[3] }
];

const LEADERBOARD = [
  { rank: 1, name: "AlgoWhiz_NYC", solved: 4, penalty: "42:15", pA: "08:12", pB: "16:45", pC: "28:10", pD: "42:15" },
  { rank: 2, name: "SubwayByte", solved: 4, penalty: "56:08", pA: "05:20", pB: "18:30", pC: "34:12", pD: "56:08" },
  { rank: 3, name: "EmpireDev", solved: 3, penalty: "38:40", pA: "06:15", pB: "14:20", pC: "38:40", pD: "-" },
  { rank: 4, name: "You (arena_user)", solved: 1, penalty: "12:00", pA: "12:00", pB: "-", pC: "-", pD: "-" },
  { rank: 5, name: "QueensCoder", solved: 2, penalty: "44:10", pA: "11:05", pB: "33:05", pC: "-", pD: "-" }
];

export function ContestArenaPage() {
  const { slug } = useParams();
  const { recordSubmission } = useArenaStore();

  const [activeTab, setActiveTab] = useState("A"); // 'A' | 'B' | 'C' | 'D' | 'standings'
  const [timeLeft, setTimeLeft] = useState(5400); // 1h 30m
  const [solvedInContest, setSolvedInContest] = useState(["A"]);

  // Problem & Editor state
  const activeProbObj =
    CONTEST_PROBLEMS.find((p) => p.label.endsWith(activeTab)) ||
    CONTEST_PROBLEMS[0];
  const problem = activeProbObj.problem;

  const [code, setCode] = useState(problem.starterCode.javascript);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    setCode(problem.starterCode.javascript);
    setTestResult(null);
  }, [problem.slug]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await executeProblemTests({
        code,
        language: "javascript",
        testCases: problem.testCases,
        isFullSubmit: false
      });
      setTestResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await executeProblemTests({
        code,
        language: "javascript",
        testCases: problem.testCases,
        isFullSubmit: true
      });
      setTestResult(res);

      if (res.verdict === "ACCEPTED") {
        if (!solvedInContest.includes(activeTab)) {
          setSolvedInContest([...solvedInContest, activeTab]);
        }
        recordSubmission({
          problemSlug: problem.slug,
          problemTitle: `[Contest] ${problem.title}`,
          verdict: "ACCEPTED",
          verdictLabel: "Accepted (Contest)",
          language: "javascript",
          runtime: res.runtime,
          memory: res.memory,
          code,
          xpReward: activeProbObj.points,
          ratingReward: 20
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contest-arena-page">
      {/* Contest Top Status Bar */}
      <header className="contest-header">
        <div className="ch-left">
          <Link to="/contests" className="back-link">
            <ChevronLeft size={16} /> All Contests
          </Link>
          <span className="divider">/</span>
          <h1>
            {slug
              ? slug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")
              : "NYC Biweekly Arena #12"}
          </h1>
        </div>

        <div className="ch-center">
          <div className="contest-timer-pill">
            <Timer size={16} />
            <span>{formatTimer(timeLeft)} REMAINING</span>
          </div>
        </div>

        <div className="ch-right">
          <div className="contest-rank-chip">
            <span>YOUR RANK</span>
            <b>#4 / 312</b>
          </div>
        </div>
      </header>

      {/* Tabs Strip */}
      <div className="contest-tabs-bar">
        <div className="prob-tabs">
          {CONTEST_PROBLEMS.map((item) => {
            const tabKey = item.label.replace("Problem ", "");
            const isTabSolved = solvedInContest.includes(tabKey);
            return (
              <button
                key={tabKey}
                className={`ct-tab ${activeTab === tabKey ? "active" : ""}`}
                onClick={() => setActiveTab(tabKey)}
              >
                {isTabSolved && <CheckCircle2 size={13} className="text-green" />}
                <span>{item.label}</span>
                <small>({item.points} pts)</small>
              </button>
            );
          })}
        </div>

        <button
          className={`ct-tab standings-tab ${
            activeTab === "standings" ? "active" : ""
          }`}
          onClick={() => setActiveTab("standings")}
        >
          <Users size={14} /> Live Standings
        </button>
      </div>

      {/* Main Content Pane */}
      {activeTab === "standings" ? (
        <div className="standings-pane">
          <h2>Contest Live Scoreboard</h2>
          <table className="standings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Competitor</th>
                <th>Solved</th>
                <th>Penalty</th>
                <th>A (100)</th>
                <th>B (250)</th>
                <th>C (400)</th>
                <th>D (600)</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((row) => (
                <tr
                  key={row.rank}
                  className={row.name.includes("You") ? "user-row" : ""}
                >
                  <td className="rank-cell">#{row.rank}</td>
                  <td className="name-cell">
                    <b>{row.name}</b>
                  </td>
                  <td>
                    <span className="solved-badge-sm">{row.solved} / 4</span>
                  </td>
                  <td>{row.penalty}</td>
                  <td>{row.pA}</td>
                  <td>{row.pB}</td>
                  <td>{row.pC}</td>
                  <td>{row.pD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="contest-workspace-grid">
          {/* Left Problem Statement */}
          <div className="c-dossier">
            <div className="c-dossier-head">
              <h2>{problem.title}</h2>
              <span className={`diff-pill diff-${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
            </div>
            <div className="c-dossier-body">
              <p>{problem.description}</p>
              <h3>Example</h3>
              <div className="c-example">
                <div>
                  <b>Input:</b> <code>{problem.examples[0].input}</code>
                </div>
                <div>
                  <b>Output:</b> <code>{problem.examples[0].output}</code>
                </div>
              </div>
              <h3>Constraints</h3>
              <ul>
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Monaco & Console */}
          <div className="c-editor-pane">
            <div className="c-toolbar">
              <span>JavaScript (Node 20)</span>
              <div className="c-actions">
                <button
                  className="run-btn"
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                >
                  <Play size={14} /> Run Code
                </button>
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                >
                  <Send size={14} /> Submit ({activeProbObj.points} pts)
                </button>
              </div>
            </div>

            <div className="c-monaco">
              <Editor
                height="100%"
                language="javascript"
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>

            {testResult && (
              <div className={`c-result-bar c-res-${testResult.verdict.toLowerCase()}`}>
                {testResult.verdict === "ACCEPTED" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>
                  {testResult.verdictLabel} ({testResult.passedTestCases}/
                  {testResult.totalTestCases} Testcases)
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
