import React, { useState } from "react";
import { Users, Search, Shield, Ban, CheckCircle, Trash2 } from "lucide-react";

const INITIAL_USERS = [
  { id: "u_1", username: "alex_coder", email: "alex@nycdsa.com", role: "admin", rating: 1540, solved: 8, status: "ACTIVE", joined: "2026-06-12" },
  { id: "u_2", username: "sarah_algo", email: "sarah@nycdsa.com", role: "user", rating: 1420, solved: 6, status: "ACTIVE", joined: "2026-07-01" },
  { id: "u_3", username: "manhattan_dev", email: "mdev@gmail.com", role: "user", rating: 1360, solved: 5, status: "ACTIVE", joined: "2026-07-15" },
  { id: "u_4", username: "queens_hacker", email: "qhacker@yahoo.com", role: "user", rating: 1290, solved: 3, status: "SUSPENDED", joined: "2026-08-02" },
  { id: "u_5", username: "subway_byte", email: "sbyte@outlook.com", role: "user", rating: 1315, solved: 4, status: "ACTIVE", joined: "2026-08-10" }
];

export function AdminUsers() {
  const [userList, setUserList] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");

  const filtered = userList.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = (userId) => {
    setUserList(
      userList.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === "admin" ? "user" : "admin";
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const toggleSuspend = (userId) => {
    setUserList(
      userList.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
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
            {filtered.map((u) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
