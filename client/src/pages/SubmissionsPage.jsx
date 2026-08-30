import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Code2,
  Calendar,
  Filter,
  Copy,
  Check,
  Eye,
  History
} from "lucide-react";
import { useArenaStore } from "../store/arenaStore.js";
import "./SubmissionsPage.css";

export function SubmissionsPage() {
  const { submissions } = useArenaStore();
  const [selectedVerdict, setSelectedVerdict] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [activeCodeModal, setActiveCodeModal] = useState(null);
  const [copied, setCopied] = useState(false);

  const filteredSubs = submissions.filter((sub) => {
    const matchesVerdict =
      selectedVerdict === "all" ||
      sub.verdict.toLowerCase() === selectedVerdict.toLowerCase();
    const matchesLang =
      selectedLanguage === "all" ||
      sub.language.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesVerdict && matchesLang;
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="submissions-page">
      <div className="submissions-header">
        <p className="eyebrow">SUBMISSIONS HISTORY</p>
        <h1>YOUR ARENA ATTEMPTS</h1>
        <p>Review every code attempt, inspect execution stats, and track improvements.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="subs-toolbar">
        <div className="subs-filters">
          <select
            className="filter-select"
            value={selectedVerdict}
            onChange={(e) => setSelectedVerdict(e.target.value)}
          >
            <option value="all">All Verdicts</option>
            <option value="accepted">Accepted (AC)</option>
            <option value="wrong_answer">Wrong Answer (WA)</option>
            <option value="runtime_error">Runtime Error (RE)</option>
          </select>

          <select
            className="filter-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <span className="subs-count">
          Showing {filteredSubs.length} of {submissions.length} submissions
        </span>
      </div>

      {/* Submissions Table */}
      <div className="subs-table-wrap">
        <table className="subs-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Problem</th>
              <th>Language</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Submitted At</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-subs">
                  No submissions found matching your filters.
                </td>
              </tr>
            ) : (
              filteredSubs.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <span
                      className={`verdict-tag verdict-${sub.verdict.toLowerCase()}`}
                    >
                      {sub.verdict === "ACCEPTED" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {sub.verdictLabel}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/problems/${sub.problemSlug}`}
                      className="prob-name-link"
                    >
                      {sub.problemTitle}
                    </Link>
                  </td>
                  <td className="lang-cell">{sub.language}</td>
                  <td>{sub.runtime} ms</td>
                  <td>{sub.memory} MB</td>
                  <td className="time-cell">
                    {new Date(sub.submittedAt).toLocaleDateString()}{" "}
                    {new Date(sub.submittedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td>
                    <button
                      className="view-code-btn"
                      onClick={() => setActiveCodeModal(sub)}
                    >
                      <Eye size={13} /> View Code
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Code Viewer Modal */}
      {activeCodeModal && (
        <div className="code-modal-overlay">
          <div className="code-modal-card">
            <div className="cm-header">
              <div>
                <h2>{activeCodeModal.problemTitle}</h2>
                <div className="cm-meta">
                  <span
                    className={`verdict-tag verdict-${activeCodeModal.verdict.toLowerCase()}`}
                  >
                    {activeCodeModal.verdictLabel}
                  </span>
                  <span>{activeCodeModal.language}</span>
                  <span>{activeCodeModal.runtime} ms</span>
                  <span>{activeCodeModal.memory} MB</span>
                </div>
              </div>
              <button
                className="cm-close-btn"
                onClick={() => setActiveCodeModal(null)}
              >
                ×
              </button>
            </div>

            <div className="cm-body">
              <div className="cm-actions-bar">
                <span>Submitted Code:</span>
                <button
                  className="copy-btn"
                  onClick={() => handleCopyCode(activeCodeModal.code)}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="code-display">
                <code>{activeCodeModal.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
