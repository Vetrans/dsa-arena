import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  Loader2,
  Award,
  AlertTriangle,
  RotateCcw,
  Check,
  X
} from "lucide-react";
import { adminApi } from "../../api/arenaApi.js";

export function AdminUsers() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionNotice, setActionNotice] = useState(null);

  // Modals
  const [pointsUser, setPointsUser] = useState(null);
  const [pointsData, setPointsData] = useState({ xp: 100, rating: 25, reason: "Administrative Bonus" });

  const [warnUserTarget, setWarnUserTarget] = useState(null);
  const [warnReason, setWarnReason] = useState("");

  const [deleteUserTarget, setDeleteUserTarget] = useState(null);
  const [submittingAction, setSubmittingAction] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ limit: 100 });
      const users = res?.data?.users || res?.data || res?.users || [];
      const normalized = users.map((u) => ({
        id: u._id || u.id,
        username: u.username,
        displayName: u.displayName || u.username,
        email: u.email,
        role: (u.role || "user").toLowerCase(),
        rating: u.stats?.rating ?? 1200,
        xp: u.stats?.xp ?? 0,
        level: u.stats?.level ?? Math.floor((u.stats?.xp || 0) / 250) + 1,
        solved: u.stats?.problemsSolved ?? 0,
        status: u.status || (u.isSuspended ? "SUSPENDED" : "ACTIVE"),
        reputation: u.reputation || "CLEAN",
        warnings: u.warnings || [],
        joined: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "Recently"
      }));
      setUserList(normalized);
    } catch (err) {
      console.error("Failed to load users from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotice = (msg, isError = false) => {
    setActionNotice({ msg, isError });
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  const filtered = userList.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.displayName && u.displayName.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleRole = async (userId) => {
    const target = userList.find((u) => u.id === userId);
    if (!target) return;
    const nextRole = target.role === "admin" ? "USER" : "ADMIN";
    try {
      await adminApi.updateUserRole(userId, nextRole);
      setUserList(
        userList.map((u) => {
          if (u.id === userId) {
            return { ...u, role: nextRole.toLowerCase() };
          }
          return u;
        })
      );
      showNotice(`Role updated to ${nextRole} for @${target.username}`);
    } catch (err) {
      console.error("Failed to update role:", err);
      showNotice("Failed to update role", true);
    }
  };

  const toggleSuspend = async (userId) => {
    const target = userList.find((u) => u.id === userId);
    if (!target) return;
    const shouldSuspend = target.status === "ACTIVE";
    try {
      await adminApi.toggleUserSuspend(userId, {
        suspend: shouldSuspend,
        reason: shouldSuspend ? "Administrative suspension" : "Reinstated by admin"
      });
      setUserList(
        userList.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              status: shouldSuspend ? "SUSPENDED" : "ACTIVE",
              reputation: shouldSuspend ? "SUSPENDED" : (u.warnings?.length > 0 ? "WARNED" : "CLEAN")
            };
          }
          return u;
        })
      );
      showNotice(`User @${target.username} has been ${shouldSuspend ? "SUSPENDED" : "REINSTATED"}`);
    } catch (err) {
      console.error("Failed to toggle suspension:", err);
      showNotice("Failed to toggle suspension", true);
    }
  };

  const handleGrantPointsSubmit = async (e) => {
    e.preventDefault();
    if (!pointsUser) return;
    setSubmittingAction(true);
    try {
      await adminApi.grantPoints(pointsUser.id, {
        xp: Number(pointsData.xp) || 0,
        rating: Number(pointsData.rating) || 0,
        reason: pointsData.reason
      });
      setUserList((prev) =>
        prev.map((u) => {
          if (u.id === pointsUser.id) {
            const nextXp = Math.max(0, u.xp + Number(pointsData.xp));
            return {
              ...u,
              xp: nextXp,
              rating: Math.max(0, u.rating + Number(pointsData.rating)),
              level: Math.floor(nextXp / 250) + 1
            };
          }
          return u;
        })
      );
      showNotice(`Granted +${pointsData.xp} XP & +${pointsData.rating} Rating to @${pointsUser.username}`);
      setPointsUser(null);
    } catch (err) {
      console.error("Failed to grant points:", err);
      showNotice("Failed to grant points to user", true);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleWarnSubmit = async (e) => {
    e.preventDefault();
    if (!warnUserTarget || !warnReason.trim()) return;
    setSubmittingAction(true);
    try {
      await adminApi.warnUser(warnUserTarget.id, { reason: warnReason.trim() });
      setUserList((prev) =>
        prev.map((u) => {
          if (u.id === warnUserTarget.id) {
            const nextWarnings = [
              ...(u.warnings || []),
              { reason: warnReason.trim(), issuedAt: new Date() }
            ];
            return {
              ...u,
              reputation: "WARNED",
              warnings: nextWarnings
            };
          }
          return u;
        })
      );
      showNotice(`Official warning issued to @${warnUserTarget.username}`);
      setWarnUserTarget(null);
      setWarnReason("");
    } catch (err) {
      console.error("Failed to issue warning:", err);
      showNotice("Failed to issue warning", true);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleClearWarnings = async (userId) => {
    const target = userList.find((u) => u.id === userId);
    if (!target) return;
    try {
      await adminApi.clearWarnings(userId);
      setUserList((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              reputation: u.status === "SUSPENDED" ? "SUSPENDED" : "CLEAN",
              warnings: []
            };
          }
          return u;
        })
      );
      showNotice(`All warnings cleared for @${target.username}. Standing is now CLEAN.`);
    } catch (err) {
      console.error("Failed to clear warnings:", err);
      showNotice("Failed to clear warnings", true);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteUserTarget) return;
    setSubmittingAction(true);
    try {
      await adminApi.deleteUser(deleteUserTarget.id);
      setUserList((prev) => prev.filter((u) => u.id !== deleteUserTarget.id));
      showNotice(`Account @${deleteUserTarget.username} was permanently removed.`);
      setDeleteUserTarget(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      showNotice("Failed to delete user", true);
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="admin-users-page">
      <div className="admin-page-header">
        <div>
          <h1>User Database & Moderation</h1>
          <p>Grant points, enforce warnings, manage role authorizations, and review contender reputations.</p>
        </div>
      </div>

      {actionNotice && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 18px",
            background: actionNotice.isError ? "#fee2e2" : "#dcfce7",
            color: actionNotice.isError ? "#dc2626" : "#16a34a",
            border: `2px solid ${actionNotice.isError ? "#dc2626" : "#16a34a"}`,
            fontWeight: 800,
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {actionNotice.isError ? <AlertTriangle size={18} /> : <Check size={18} />}
          {actionNotice.msg}
        </div>
      )}

      <div className="admin-table-card">
        <div className="admin-table-card-head">
          <h2>Registered Arena Accounts ({userList.length})</h2>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search username or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "8px 12px 8px 32px",
                  border: "2px solid var(--ink)",
                  fontSize: "13px",
                  width: "260px"
                }}
              />
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted)"
                }}
              />
            </div>
            <button
              onClick={loadUsers}
              className="button button-ghost"
              style={{ padding: "6px 12px", fontSize: "12px" }}
              title="Refresh users"
            >
              <RotateCcw size={14} /> Refresh
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contender</th>
                <th>Role</th>
                <th>Reputation</th>
                <th>Standing</th>
                <th>Rating / XP</th>
                <th>Solved</th>
                <th>Joined</th>
                <th style={{ textAlign: "right" }}>Moderation & Powers</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                    <Loader2 size={20} className="animate-spin" style={{ display: "inline-block", marginRight: "8px" }} />
                    Loading arena contender profiles...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
                    No accounts found matching "{search}".
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isClean = u.reputation === "CLEAN";
                  const isWarned = u.reputation === "WARNED";
                  const isSuspended = u.status === "SUSPENDED" || u.reputation === "SUSPENDED";
                  const warningCount = u.warnings?.length || 0;

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              background: "#0d0f17",
                              color: "#fff",
                              fontWeight: 900,
                              fontSize: "13px",
                              display: "grid",
                              placeItems: "center",
                              border: "1.5px solid var(--ink)"
                            }}
                          >
                            {u.username.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <b>@{u.username}</b>
                            {u.displayName && u.displayName !== u.username && (
                              <div style={{ fontSize: "11px", color: "var(--ink)", fontWeight: 600 }}>
                                {u.displayName}
                              </div>
                            )}
                            <div style={{ fontSize: "11px", color: "var(--muted)" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: "900",
                            background: u.role === "admin" ? "#1742e8" : "#f1f5f9",
                            color: u.role === "admin" ? "#fff" : "var(--ink)",
                            padding: "2px 8px",
                            border: "1px solid var(--ink)"
                          }}
                        >
                          {u.role === "admin" && <Shield size={11} />}
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "11px",
                            fontWeight: "900",
                            padding: "3px 8px",
                            border: "1.5px solid var(--ink)",
                            background: isSuspended
                              ? "#fee2e2"
                              : isWarned
                              ? "#fef3c7"
                              : "#dcfce7",
                            color: isSuspended
                              ? "#dc2626"
                              : isWarned
                              ? "#b45309"
                              : "#16a34a"
                          }}
                        >
                          {isSuspended ? (
                            <>
                              <Ban size={12} /> SUSPENDED
                            </>
                          ) : isWarned ? (
                            <>
                              <AlertTriangle size={12} /> WARNED ({warningCount})
                            </>
                          ) : (
                            <>
                              <CheckCircle size={12} /> CLEAN
                            </>
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`diff-pill ${
                            u.status === "ACTIVE" ? "diff-easy" : "diff-hard"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 800 }}>{u.rating} ELO</div>
                        <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                          {u.xp} XP · Lvl {u.level}
                        </div>
                      </td>

                      <td>
                        <b>{u.solved}</b> solved
                      </td>

                      <td style={{ fontSize: "12px", color: "var(--muted)" }}>{u.joined}</td>

                      <td style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            flexWrap: "wrap",
                            gap: "6px",
                            justifyContent: "flex-end"
                          }}
                        >
                          {/* Points grant */}
                          <button
                            onClick={() => {
                              setPointsUser(u);
                              setPointsData({ xp: 100, rating: 25, reason: "Contest Reward / Bonus" });
                            }}
                            title="Grant XP & Rating Points"
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              fontWeight: "800",
                              background: "#fef08a",
                              color: "#854d0e",
                              border: "1.5px solid var(--ink)",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px"
                            }}
                          >
                            <Award size={12} /> +Points
                          </button>

                          {/* Warning issue */}
                          <button
                            onClick={() => {
                              setWarnUserTarget(u);
                              setWarnReason("");
                            }}
                            title="Issue Disciplinary Warning"
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              fontWeight: "800",
                              background: "#ffedd5",
                              color: "#c2410c",
                              border: "1.5px solid var(--ink)",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px"
                            }}
                          >
                            <AlertTriangle size={12} /> Warn
                          </button>

                          {/* Clear warnings if any */}
                          {u.warnings && u.warnings.length > 0 && (
                            <button
                              onClick={() => handleClearWarnings(u.id)}
                              title="Clear all recorded warnings and restore CLEAN status"
                              style={{
                                padding: "4px 8px",
                                fontSize: "11px",
                                fontWeight: "800",
                                background: "#dcfce7",
                                color: "#15803d",
                                border: "1.5px solid var(--ink)",
                                cursor: "pointer"
                              }}
                            >
                              Clear Warns
                            </button>
                          )}

                          {/* Role Toggle */}
                          <button
                            onClick={() => toggleRole(u.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              fontWeight: "800",
                              border: "1.5px solid var(--ink)",
                              background: "#fff",
                              cursor: "pointer"
                            }}
                          >
                            {u.role === "admin" ? "Demote" : "Make Admin"}
                          </button>

                          {/* Suspend / Unsuspend */}
                          <button
                            onClick={() => toggleSuspend(u.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              fontWeight: "800",
                              border: "1.5px solid var(--ink)",
                              background: u.status === "ACTIVE" ? "#fee2e2" : "#dcfce7",
                              color: u.status === "ACTIVE" ? "#dc2626" : "#16a34a",
                              cursor: "pointer"
                            }}
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Unsuspend"}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteUserTarget(u)}
                            title="Delete User Permanently"
                            style={{
                              padding: "4px 6px",
                              fontSize: "11px",
                              fontWeight: "800",
                              border: "1.5px solid var(--ink)",
                              background: "#fee2e2",
                              color: "#dc2626",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center"
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Points Modal */}
      {pointsUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: "480px" }}>
            <h2>Grant XP & Rating Points</h2>
            <p>
              Award experience points or ELO rating to contender <b>@{pointsUser.username}</b>.
            </p>
            <form onSubmit={handleGrantPointsSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>XP to Grant</label>
                  <input
                    type="number"
                    value={pointsData.xp}
                    onChange={(e) => setPointsData({ ...pointsData, xp: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Rating Delta (ELO)</label>
                  <input
                    type="number"
                    value={pointsData.rating}
                    onChange={(e) => setPointsData({ ...pointsData, rating: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Audit Reason / Memo</label>
                <input
                  type="text"
                  placeholder="e.g. Contest 1st Place, Community Contribution"
                  value={pointsData.reason}
                  onChange={(e) => setPointsData({ ...pointsData, reason: e.target.value })}
                  required
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setPointsUser(null)}
                  disabled={submittingAction}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-yellow"
                  disabled={submittingAction}
                >
                  {submittingAction ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Granting...
                    </>
                  ) : (
                    "Apply Points"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warn User Modal */}
      {warnUserTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: "520px" }}>
            <h2 style={{ color: "#c2410c", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={22} /> Issue Disciplinary Warning
            </h2>
            <p>
              Issue an official warning to <b>@{warnUserTarget.username}</b>. This will alter their standing to <b>WARNED</b> and display a notification on their personal dashboard.
            </p>

            {warnUserTarget.warnings && warnUserTarget.warnings.length > 0 && (
              <div
                style={{
                  background: "#fff7ed",
                  border: "1.5px solid #fdba74",
                  padding: "10px 14px",
                  marginBottom: "16px",
                  fontSize: "12px"
                }}
              >
                <b>Previous Warnings ({warnUserTarget.warnings.length}):</b>
                <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                  {warnUserTarget.warnings.map((w, idx) => (
                    <li key={idx}>
                      "{w.reason}"
                      <span style={{ color: "var(--muted)", marginLeft: "6px" }}>
                        ({w.issuedAt ? new Date(w.issuedAt).toLocaleDateString() : "Prior"})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleWarnSubmit}>
              <div className="admin-form-group">
                <label>Reason for Warning (Visible to user & recorded)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Unfair play detected in contest submission, inappropriate language in comments..."
                  value={warnReason}
                  onChange={(e) => setWarnReason(e.target.value)}
                  required
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setWarnUserTarget(null)}
                  disabled={submittingAction}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-danger"
                  style={{ background: "#dc2626", color: "#fff", border: "2px solid var(--ink)" }}
                  disabled={submittingAction || !warnReason.trim()}
                >
                  {submittingAction ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Issuing...
                    </>
                  ) : (
                    "Issue Official Warning"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteUserTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: "460px" }}>
            <h2 style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}>
              <Trash2 size={22} /> Delete Contender Account
            </h2>
            <p>
              Are you sure you want to permanently remove <b>@{deleteUserTarget.username}</b> ({deleteUserTarget.email})?
            </p>
            <div
              style={{
                background: "#fee2e2",
                border: "1.5px solid #fca5a5",
                padding: "12px",
                fontSize: "12px",
                color: "#991b1b",
                marginBottom: "20px"
              }}
            >
              This user will be marked DELETED and immediately blocked from logging in or appearing in leaderboards.
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setDeleteUserTarget(null)}
                disabled={submittingAction}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button-danger"
                style={{ background: "#dc2626", color: "#fff", border: "2px solid var(--ink)" }}
                onClick={handleDeleteSubmit}
                disabled={submittingAction}
              >
                {submittingAction ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  "Confirm Deletion"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
