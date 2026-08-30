import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Swords,
  Shield,
  Zap,
  Timer,
  Play,
  Send,
  Trophy,
  Skull,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { PROBLEMS } from "../data/problemsData.js";
import { executeProblemTests } from "../services/sandboxJudge.js";
import { useArenaStore } from "../store/arenaStore.js";
import "./BattleArenaPage.css";

const OPPONENTS = [
  { name: "ManhattanCoder", rating: 1360, avatar: "🗽", rank: "Gold II" },
  { name: "BrooklynAlgo", rating: 1315, avatar: "🌉", rank: "Gold I" },
  { name: "QueensByte", rating: 1390, avatar: "👑", rank: "Gold III" },
  { name: "SubwayHacker", rating: 1290, avatar: "🚇", rank: "Silver III" }
];

export function BattleArenaPage() {
  const { userRating, updateRating, recordSubmission } = useArenaStore();

  const [gameState, setGameState] = useState("lobby"); // 'lobby' | 'searching' | 'battle' | 'finished'
  const [opponent, setOpponent] = useState(null);
  const [matchProblem, setMatchProblem] = useState(PROBLEMS[0]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins

  // Code state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Opponent progress simulation
  const [opponentPassCount, setOpponentPassCount] = useState(0);
  const [opponentStatus, setOpponentStatus] = useState("Analyzing problem...");
  const [matchOutcome, setMatchOutcome] = useState(null); // 'win' | 'loss'

  // Matchmaking
  const handleStartQueue = () => {
    setGameState("searching");
    setTimeout(() => {
      const selectedOpponent =
        OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
      const pool = PROBLEMS.filter((p) => p.difficulty !== "Hard");
      const chosenProblem = pool[Math.floor(Math.random() * pool.length)];

      setOpponent(selectedOpponent);
      setMatchProblem(chosenProblem);
      setCode(chosenProblem.starterCode.javascript);
      setTimeLeft(900);
      setOpponentPassCount(0);
      setOpponentStatus("Reading problem statement...");
      setTestResults(null);
      setMatchOutcome(null);
      setGameState("battle");
    }, 2800);
  };

  // Timer countdown during battle
  useEffect(() => {
    if (gameState !== "battle") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishMatch("loss", "Time Expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Opponent simulated progression
  useEffect(() => {
    if (gameState !== "battle") return;

    const t1 = setTimeout(() => {
      setOpponentStatus("Drafting solution...");
    }, 6000);

    const t2 = setTimeout(() => {
      setOpponentStatus("Running sample test cases (1/3)...");
      setOpponentPassCount(1);
    }, 18000);

    const t3 = setTimeout(() => {
      setOpponentStatus("Debugging edge cases (2/3)...");
      setOpponentPassCount(2);
    }, 38000);

    const t4 = setTimeout(() => {
      setOpponentStatus("Submitting full solution...");
      setOpponentPassCount(3);
      // If user hasn't won yet by 65s, opponent wins
      handleFinishMatch("loss", "Opponent Solved First");
    }, 65000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [gameState]);

  const handleFinishMatch = (outcome, reason) => {
    if (gameState === "finished") return;
    setGameState("finished");
    setMatchOutcome(outcome);

    const ratingDelta = outcome === "win" ? 32 : -18;
    updateRating(ratingDelta);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await executeProblemTests({
        code,
        language,
        testCases: matchProblem.testCases,
        isFullSubmit: false
      });
      setTestResults(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      const res = await executeProblemTests({
        code,
        language,
        testCases: matchProblem.testCases,
        isFullSubmit: true
      });
      setTestResults(res);

      if (res.verdict === "ACCEPTED") {
        handleFinishMatch("win", "All Testcases Accepted");
        recordSubmission({
          problemSlug: matchProblem.slug,
          problemTitle: matchProblem.title,
          verdict: "ACCEPTED",
          verdictLabel: "Accepted (1v1 Battle)",
          language,
          runtime: res.runtime || 40,
          memory: res.memory || 41.2,
          code,
          xpReward: 50,
          ratingReward: 32
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="battle-arena-page">
      {/* LOBBY STATE */}
      {gameState === "lobby" && (
        <div className="battle-lobby">
          <div className="lobby-hero">
            <div className="swords-icon">
              <Swords size={56} />
            </div>
            <h1>1v1 DUEL ARENA</h1>
            <p>
              Match against rival engineers in real-time head-to-head algorithmic
              battles. First to solve passes with full rating glory.
            </p>

            <div className="user-rating-card">
              <span className="ur-lbl">YOUR BATTLE RATING</span>
              <b className="ur-val">{userRating} PTS</b>
              <span className="ur-tier">GOLD DIVISION</span>
            </div>

            <button className="button button-yellow start-queue-btn" onClick={handleStartQueue}>
              <Zap size={18} /> Find Match Now
            </button>
          </div>

          <div className="duel-rules-grid">
            <div className="rule-card">
              <b>⚡ Speed Duel</b>
              <p>15-minute timer. Write and submit your working solution before your rival.</p>
            </div>
            <div className="rule-card">
              <b>🛡️ Competitive ELO</b>
              <p>Win matches to gain +32 Rating. Defeat subtracts -18 Rating.</p>
            </div>
            <div className="rule-card">
              <b>⚔️ Live Progress</b>
              <p>Watch your opponent's testcase pass progression live as they write code.</p>
            </div>
          </div>
        </div>
      )}

      {/* SEARCHING STATE */}
      {gameState === "searching" && (
        <div className="battle-searching">
          <div className="radar-spinner" />
          <h2>SEARCHING FOR OPPONENT...</h2>
          <p>Matching skill rating within ±50 ELO range ({userRating})</p>
        </div>
      )}

      {/* ACTIVE BATTLE STATE */}
      {gameState === "battle" && (
        <div className="battle-active-arena">
          {/* Battle Header Bar */}
          <div className="battle-statusbar">
            <div className="player-stat user-side">
              <div className="player-avatar">👨‍💻</div>
              <div>
                <b className="p-title">YOU</b>
                <span className="p-sub">{userRating} PTS</span>
              </div>
            </div>

            <div className="battle-timer">
              <Timer size={18} />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <div className="player-stat opponent-side">
              <div>
                <b className="p-title">{opponent?.name}</b>
                <span className="p-sub">{opponent?.rating} PTS</span>
              </div>
              <div className="player-avatar">{opponent?.avatar}</div>
            </div>
          </div>

          {/* Opponent Progress Bar Strip */}
          <div className="opponent-live-strip">
            <span className="opp-label">OPPONENT LIVE:</span>
            <span className="opp-status-text">{opponentStatus}</span>
            <div className="opp-meter">
              <div
                className="opp-meter-fill"
                style={{ width: `${(opponentPassCount / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Battle Grid */}
          <div className="battle-grid">
            {/* Left Problem View */}
            <div className="battle-problem-pane">
              <div className="bp-head">
                <h2>{matchProblem.title}</h2>
                <span className={`diff-pill diff-${matchProblem.difficulty.toLowerCase()}`}>
                  {matchProblem.difficulty}
                </span>
              </div>
              <div className="bp-body">
                <p>{matchProblem.description}</p>
                <div className="bp-examples">
                  <b>Example:</b>
                  <code>{matchProblem.examples[0].input}</code>
                  <span>Output: {matchProblem.examples[0].output}</span>
                </div>
              </div>
            </div>

            {/* Right Editor & Controls */}
            <div className="battle-editor-pane">
              <div className="be-toolbar">
                <span>Language: JavaScript</span>
                <div className="be-actions">
                  <button className="run-btn" onClick={handleRunCode} disabled={isRunning || isSubmitting}>
                    <Play size={14} /> Run
                  </button>
                  <button className="submit-btn" onClick={handleSubmitCode} disabled={isRunning || isSubmitting}>
                    <Send size={14} /> Submit Solution
                  </button>
                </div>
              </div>

              <div className="be-monaco">
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

              {testResults && (
                <div className={`battle-result-bar res-${testResults.verdict.toLowerCase()}`}>
                  {testResults.verdict === "ACCEPTED" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{testResults.verdictLabel} ({testResults.passedTestCases}/{testResults.totalTestCases} Tests)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FINISHED STATE MODAL */}
      {gameState === "finished" && (
        <div className="match-outcome-overlay">
          <div className={`outcome-card outcome-${matchOutcome}`}>
            {matchOutcome === "win" ? (
              <>
                <div className="outcome-icon win-icon">
                  <Trophy size={54} />
                </div>
                <h2>VICTORY ACHIEVED!</h2>
                <p>You conquered the challenge before {opponent?.name}!</p>
                <div className="rating-reward-box">
                  <span>RATING CHANGE</span>
                  <b className="plus-rating">+32 PTS</b>
                  <small>New Rating: {userRating + 32} PTS</small>
                </div>
              </>
            ) : (
              <>
                <div className="outcome-icon loss-icon">
                  <Skull size={54} />
                </div>
                <h2>DEFEAT</h2>
                <p>{opponent?.name} solved the problem first.</p>
                <div className="rating-reward-box">
                  <span>RATING CHANGE</span>
                  <b className="minus-rating">-18 PTS</b>
                  <small>New Rating: {Math.max(800, userRating - 18)} PTS</small>
                </div>
              </>
            )}

            <div className="outcome-btns">
              <button className="button button-yellow" onClick={handleStartQueue}>
                Rematch / Find Another
              </button>
              <button className="button button-outline" onClick={() => setGameState("lobby")}>
                Return to Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
