import React, { useState } from "react";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Award,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  X,
  FileCode2,
  Share2
} from "lucide-react";
import "./ContestAnalysisModal.css";

export function ContestAnalysisModal({
  isOpen,
  onClose,
  contestTitle = "NYC Biweekly Arena #12",
  solvedCount = 3,
  totalProblems = 4,
  penalty = "48:12",
  ratingChange = 34,
  problems = [],
  onAcceptAnalysis
}) {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    setAccepted(true);
    if (onAcceptAnalysis) {
      onAcceptAnalysis();
    }
  };

  return (
    <div className="cam-overlay" onClick={onClose}>
      <div className="cam-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cam-header">
          <div className="cam-header-left">
            <div className="cam-trophy-badge">
              <Trophy size={18} />
            </div>
            <div>
              <span className="cam-tag">OFFICIAL POST-CONTEST BREAKDOWN</span>
              <h2>{contestTitle} · Performance Analysis</h2>
            </div>
          </div>
          <button className="cam-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="cam-body">
          {/* Top Score Banner */}
          <div className="cam-stat-banner">
            <div className="cam-stat-box">
              <span className="csb-label">SOLVED</span>
              <b className="csb-val text-green">
                {solvedCount} / {totalProblems}
              </b>
              <small>75% Accuracy</small>
            </div>

            <div className="cam-stat-box">
              <span className="csb-label">TOTAL PENALTY</span>
              <b className="csb-val">{penalty}</b>
              <small>Submissions + Time</small>
            </div>

            <div className="cam-stat-box highlight-yellow">
              <span className="csb-label">PROJECTED RATING DELTA</span>
              <b className="csb-val text-blue">+{ratingChange} ELO</b>
              <small className="cam-rating-pill">
                <TrendingUp size={11} /> 1,850 → {1850 + ratingChange}
              </small>
            </div>

            <div className="cam-stat-box">
              <span className="csb-label">GLOBAL RANK</span>
              <b className="csb-val">#4 / 312</b>
              <small>Top 1.2% Percentile</small>
            </div>
          </div>

          {/* Problem-by-Problem Testcase & Runtime Breakdown */}
          <div className="cam-section">
            <h3 className="cam-section-title">
              <FileCode2 size={16} /> Problem Diagnostic Report
            </h3>
            <div className="cam-problems-table-wrap">
              <table className="cam-problems-table">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Status</th>
                    <th>Runtime</th>
                    <th>Memory</th>
                    <th>Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Problem A: Two Sum</b>
                      <small className="cam-meta">Easy · 100 pts</small>
                    </td>
                    <td>
                      <span className="cam-verdict-pill verdict-ac">
                        <CheckCircle2 size={12} /> Accepted
                      </span>
                    </td>
                    <td>14ms</td>
                    <td>38.2 MB</td>
                    <td>
                      <span className="cam-pct-bar">
                        <span className="cam-pct-fill" style={{ width: "98%" }} />
                      </span>
                      <small>Beats 98.4%</small>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Problem B: Valid Parentheses</b>
                      <small className="cam-meta">Easy · 250 pts</small>
                    </td>
                    <td>
                      <span className="cam-verdict-pill verdict-ac">
                        <CheckCircle2 size={12} /> Accepted
                      </span>
                    </td>
                    <td>22ms</td>
                    <td>41.0 MB</td>
                    <td>
                      <span className="cam-pct-bar">
                        <span className="cam-pct-fill" style={{ width: "89%" }} />
                      </span>
                      <small>Beats 89.1%</small>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Problem C: Longest Substring</b>
                      <small className="cam-meta">Medium · 400 pts</small>
                    </td>
                    <td>
                      <span className="cam-verdict-pill verdict-ac">
                        <CheckCircle2 size={12} /> Accepted
                      </span>
                    </td>
                    <td>36ms</td>
                    <td>44.5 MB</td>
                    <td>
                      <span className="cam-pct-bar">
                        <span className="cam-pct-fill" style={{ width: "82%" }} />
                      </span>
                      <small>Beats 82.5%</small>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Problem D: Trapping Rain Water</b>
                      <small className="cam-meta">Hard · 600 pts</small>
                    </td>
                    <td>
                      <span className="cam-verdict-pill verdict-wa">
                        <XCircle size={12} /> Wrong Answer
                      </span>
                    </td>
                    <td>--</td>
                    <td>--</td>
                    <td>
                      <small>Failed on Edge Case #7 (Monotonic Stack Boundary)</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI / Algorithmic Insights */}
          <div className="cam-insights-box">
            <div className="cib-icon">
              <BrainCircuit size={20} />
            </div>
            <div className="cib-text">
              <b>Arena Engine Coaching Insights:</b>
              <p>
                Strong baseline in Linear Scans & Hash Tables. For Problem D, your Two-Pointer approach struggled with asymmetric peaks. Practicing monotonic decreasing stack patterns will eliminate edge-case boundary errors.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="cam-footer">
          <div className="cam-footer-left">
            <span className="cam-verified-badge">
              <Award size={14} /> Verified Sandbox Telemetry
            </span>
          </div>
          <div className="cam-footer-actions">
            <button className="button button-ghost" onClick={onClose}>
              Dismiss
            </button>
            <button
              className={`button button-yellow cam-accept-btn ${
                accepted ? "accepted-btn" : ""
              }`}
              onClick={handleAccept}
              disabled={accepted}
            >
              {accepted ? (
                <>
                  <CheckCircle2 size={15} /> Analysis Accepted & ELO Sunk
                </>
              ) : (
                <>
                  Accept & Record Contest Results <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
