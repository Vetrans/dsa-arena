import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
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
  ArrowRight,
  Wifi,
  WifiOff
} from "lucide-react";
import { PROBLEMS } from "../data/problemsData.js";
import { executeProblemTests } from "../services/sandboxJudge.js";
import { useArenaStore } from "../store/arenaStore.js";
import { useDemoAuth } from "../store/demoAuthStore.js";
import "./BattleArenaPage.css";

const FALLBACK_OPPONENTS = [
  { name: "ManhattanCoder", rating: 1360, initials: "MC", rank: "Gold II" },
  { name: "BrooklynAlgo", rating: 1315, initials: "BA", rank: "Gold I" },
  { name: "QueensByte", rating: 1390, initials: "QB", rank: "Gold III" },
  { name: "SubwayHacker", rating: 1290, initials: "SH", rank: "Silver III" }
];

export function BattleArenaPage() {
  const { user } = useDemoAuth();
  const { userRating, updateRating, recordSubmission } = useArenaStore();

  const [gameState, setGameState] = useState("lobby"); // 'lobby' | 'searching' | 'battle' | 'finished'
  const [roomId, setRoomId] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [matchProblem, setMatchProblem] = useState(PROBLEMS[0]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [socketConnected, setSocketConnected] = useState(false);

  // Code state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Opponent progress
  const [opponentPassCount, setOpponentPassCount] = useState(0);
  const [opponentStatus, setOpponentStatus] = useState("Analyzing problem...");
  const [matchOutcome, setMatchOutcome] = useState(null); // 'win' | 'loss'
  const [finishReason, setFinishReason] = useState("");

  const socketRef = useRef(null);

  // Connect real-time socket on mount
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
      timeout: 3000
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("match_found", (data) => {
      setRoomId(data.roomId);
      const otherPlayer = data.players.find((p) => p.socketId !== socket.id) || {
        username: "Live Opponent",
        rating: 1350,
        initials: "OP"
      };
      setOpponent({
        name: otherPlayer.username,
        rating: otherPlayer.rating,
        initials: otherPlayer.username.slice(0, 2).toUpperCase()
      });
      if (data.problem) {
        setMatchProblem(data.problem);
        setCode(data.problem?.starterCode?.javascript || "// Write solution");
      }
      setTimeLeft(data.durationSeconds || 900);
      setOpponentPassCount(0);
      setOpponentStatus("Connected. Reading problem...");
      setTestResults(null);
      setMatchOutcome(null);
      setGameState("battle");
    });

    socket.on("opponent_progress", (data) => {
      setOpponentPassCount(data.passedCount || 0);
      setOpponentStatus(data.statusText || "Opponent progressing...");
    });

    socket.on("battle_finished", (data) => {
      if (data.winnerUsername === user?.username || data.winnerSocketId === socket.id) {
        handleFinishMatch("win", "Solved Problem First!");
      } else {
        handleFinishMatch("loss", data.reason || "Opponent Solved First");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Matchmaking trigger
  const handleStartQueue = () => {
    setGameState("searching");

    if (socketConnected && socketRef.current) {
      socketRef.current.emit("join_matchmaking", {
        username: user?.username || "Guest_Coder",
        rating: userRating,
        userId: user?.id
      });
    }

    // Fallback bot matcher if no peer in 4s
    const fallbackTimer = setTimeout(() => {
      if (gameState === "searching" && !roomId) {
        const selectedOpponent =
          FALLBACK_OPPONENTS[Math.floor(Math.random() * FALLBACK_OPPONENTS.length)];
        const pool = PROBLEMS.filter((p) => p.difficulty !== "Hard");
        const chosenProblem = pool[Math.floor(Math.random() * pool.length)];

        setOpponent(selectedOpponent);
        setMatchProblem(chosenProblem);
        setCode(chosenProblem?.starterCode?.javascript || "function solution() {\n  // Code here\n}");
        setTimeLeft(900);
        setOpponentPassCount(0);
        setOpponentStatus("Reading problem statement...");
        setTestResults(null);
        setMatchOutcome(null);
        setGameState("battle");
      }
    }, 3800);

    return () => clearTimeout(fallbackTimer);
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

  const handleFinishMatch = (outcome, reason) => {
    setGameState("finished");
    setMatchOutcome(outcome);
    setFinishReason(reason);

    const ratingDelta = outcome === "win" ? 32 : -18;
    updateRating(ratingDelta);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await executeProblemTests({
        code,
        language,
        testCases: matchProblem.testCases || [
          { input: matchProblem.examples?.[0]?.input || "", expected: matchProblem.examples?.[0]?.output || "" }
        ],
        isFullSubmit: false
      });
      setTestResults(res);

      // Broadcast progress via socket
      if (socketRef.current && roomId) {
        socketRef.current.emit("test_progress", {
          roomId,
          passedCount: res.passedCount,
          totalCount: res.totalTests,
          statusText: `Passed ${res.passedCount}/${res.totalTests} sample test cases`
        });
      }
    } catch (err) {
      setTestResults({
        passed: false,
        summary: "Execution error: " + err.message,
        details: []
      });
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
        testCases: matchProblem.testCases || [
          { input: matchProblem.examples?.[0]?.input || "", expected: matchProblem.examples?.[0]?.output || "" }
        ],
        isFullSubmit: true
      });
      setTestResults(res);

      if (res.passed) {
        if (socketRef.current && roomId) {
          socketRef.current.emit("submit_solution", {
            roomId,
            code,
            language
          });
        }
        handleFinishMatch("win", "All 3/3 Hidden Test Cases Passed!");
      }
    } catch (err) {
      setTestResults({
        passed: false,
        summary: "Execution error: " + err.message,
        details: []
      });
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
              <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Zap size={15} /> Speed Duel
              </b>
              <p>15-minute timer. Write and submit your working solution before your rival.</p>
            </div>
            <div className="rule-card">
              <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Shield size={15} /> Competitive ELO
              </b>
              <p>Win matches to gain +32 Rating. Defeat subtracts -18 Rating.</p>
            </div>
            <div className="rule-card">
              <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Swords size={15} /> Live Progress
              </b>
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
          <p>Matching skill rating within ±150 ELO range ({userRating})</p>
        </div>
      )}

      {/* ACTIVE BATTLE STATE */}
      {gameState === "battle" && (
        <div className="battle-active-arena">
          {/* Battle Header Bar */}
          <div className="battle-statusbar">
            <div className="player-stat user-side">
              <div className="player-avatar">
                <span>YOU</span>
              </div>
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
              <div className="player-avatar">
                <span>{opponent?.initials || "OP"}</span>
              </div>
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
                {matchProblem.examples?.[0] && (
                  <div className="bp-examples">
                    <b>Example:</b>
                    <code>{matchProblem.examples[0].input}</code>
                    <span>Output: {matchProblem.examples[0].output}</span>
                  </div>
                )}
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

              {/* Terminal Feedback Output */}
              {testResults && (
                <div className="be-output-panel">
                  <div className="beo-head">
                    {testResults.passed ? (
                      <span className="beo-success">
                        <CheckCircle2 size={14} /> All Tests Passed
                      </span>
                    ) : (
                      <span className="beo-fail">
                        <AlertCircle size={14} /> Tests Failed
                      </span>
                    )}
                    <span>{testResults.summary}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MATCH FINISHED MODAL */}
      {gameState === "finished" && (
        <div className="battle-finished-modal">
          <div className="bfm-card">
            {matchOutcome === "win" ? (
              <div className="bfm-hero bfm-win">
                <Trophy size={48} />
                <h2>VICTORY!</h2>
                <p>{finishReason || "You solved the problem first and outpaced your opponent!"}</p>
                <div className="elo-gain-pill">+32 RATING POINTS EARNED</div>
              </div>
            ) : (
              <div className="bfm-hero bfm-loss">
                <Skull size={48} />
                <h2>DEFEAT</h2>
                <p>{finishReason || "Opponent solved the problem before you or time expired."}</p>
                <div className="elo-loss-pill">-18 RATING POINTS</div>
              </div>
            )}

            <div className="bfm-actions">
              <button
                className="button button-yellow"
                onClick={() => {
                  setGameState("lobby");
                  setRoomId(null);
                }}
              >
                <RotateCcw size={15} /> Play Another Match
              </button>
              <Link className="button button-outline" to="/dashboard">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
