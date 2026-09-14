import React, { useState, useEffect } from "react";
import { Users, Search, Shield, Ban, CheckCircle, Trash2, Loader2 } from "lucide-react";
import { adminApi } from "../../api/arenaApi.js";

export function AdminUsers() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ limit: 100 });
      const users = res?.data?.users || res?.data || res?.users || [];
      const normalized = users.map((u) => ({
        id: u._id || u.id,
        username: u.username,
        email: u.email,
        role: (u.role || "user").toLowerCase(),
        rating: u.stats?.rating || 1200,
        solved: u.stats?.problemsSolved || 0,
        status: u.isSuspended ? "SUSPENDED" : "ACTIVE",
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

  const filtered = userList.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
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
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const toggleSuspend = async (userId) => {
    const target = userList.find((u) => u.id === userId);
    if (!target) return;
    const shouldSuspend = target.status === "ACTIVE";
    try {
      await adminApi.toggleUserSuspend(userId, {
        suspend: shouldSuspend,
        reason: shouldSuspend ? "Administrative action" : "Reinstated"
      });
      setUserList(
        userList.map((u) => {
          if (u.id === userId) {
            return { ...u, status: shouldSuspend ? "SUSPENDED" : "ACTIVE" };
          }
          return u;
        })
      );
    } catch (err) {
      console.error("Failed to toggle suspension:", err);
    }
  };

  return (
    <div className="admin-users-page">
      <div className="admin-page-header">
        <div>
          <h1>User Database & Moderation</h1>
          <p>Search, manage roles, and review competitive standing for all registered arena users.</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card-head">
          <h2>Registered Arena Accounts ({userList.length})</h2>
          <input
            type="text"
            placeholder="Search by username or email..."
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
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Rating ELO</th>
              <th>Solved</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
                  <Loader2 size={18} className="animate-spin" style={{ display: "inline-block", marginRight: "8px" }} />
                  Loading arena users...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
                  No accounts found matching "{search}".
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <b>@{u.username}</b>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {u.email}
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
                      borderRadius: "3px"
                    }}
                  >
                    {u.role === "admin" && <Shield size={11} />}
                    {u.role.toUpperCase()}
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
                  <b>{u.rating} PTS</b>
                </td>
                <td>{u.solved} Problems</td>
                <td>{u.joined}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => toggleRole(u.id)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontWeight: "800",
                        border: "1px solid var(--ink)",
                        background: "#fff",
                        cursor: "pointer"
                      }}
                    >
                      {u.role === "admin" ? "Demote to User" : "Make Admin"}
                    </button>
                    <button
                      onClick={() => toggleSuspend(u.id)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontWeight: "800",
                        border: "1px solid #dc2626",
                        background: u.status === "ACTIVE" ? "#fee2e2" : "#dcfce7",
                        color: u.status === "ACTIVE" ? "#dc2626" : "#16a34a",
                        cursor: "pointer"
                      }}
                    >
                      {u.status === "ACTIVE" ? "Suspend" : "Unsuspend"}
                    </button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
