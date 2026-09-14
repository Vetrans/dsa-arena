import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Shield, ChevronDown } from "lucide-react";
import { useDemoAuth } from "../../store/demoAuthStore.js";

export function UserNavDropdown() {
  const { user, logout } = useDemoAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div
      className="user-nav-container"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: "relative" }}
    >
      <button
        type="button"
        className="user-chip user-chip-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          background: "#fff",
          border: "1.5px solid var(--ink)",
          padding: "6px 12px",
          borderRadius: "4px",
          boxShadow: "2px 2px 0 var(--ink)",
          fontWeight: 800,
          fontSize: "13px"
        }}
      >
        <span>@{user.username}</span>
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.15s ease"
          }}
        />
      </button>

      {isOpen && (
        <div
          className="user-dropdown-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            width: "210px",
            background: "#fff",
            border: "2px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
            borderRadius: "6px",
            zIndex: 1000,
            padding: "8px 0",
            display: "flex",
            flexDirection: "column",
            animation: "modal-pop 0.18s ease-out"
          }}
        >
          <div
            style={{
              padding: "8px 16px 10px",
              borderBottom: "1px solid var(--line)",
              marginBottom: "4px"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--muted)" }}>
              SIGNED IN AS
            </div>
            <div style={{ fontSize: "13px", fontWeight: 900, color: "var(--ink)" }}>
              {user.displayName || user.username}
            </div>
          </div>

          <Link
            to={`/profile/${user.username}`}
            className="user-dd-item"
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 16px",
              fontSize: "13px",
              fontWeight: 800,
              color: "var(--ink)",
              textDecoration: "none"
            }}
          >
            <User size={15} /> My Profile
          </Link>

          <Link
            to="/settings"
            className="user-dd-item"
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 16px",
              fontSize: "13px",
              fontWeight: 800,
              color: "var(--ink)",
              textDecoration: "none"
            }}
          >
            <Settings size={15} /> Account Settings
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              className="user-dd-item"
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 16px",
                fontSize: "13px",
                fontWeight: 800,
                color: "#1742e8",
                textDecoration: "none"
              }}
            >
              <Shield size={15} /> Admin Console
            </Link>
          )}

          <div
            style={{
              borderTop: "1px solid var(--line)",
              margin: "6px 0 4px"
            }}
          />

          <button
            type="button"
            className="user-dd-item user-dd-logout"
            onClick={() => {
              setIsOpen(false);
              logout();
              navigate("/login");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 16px",
              fontSize: "13px",
              fontWeight: 800,
              color: "#dc2626",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              width: "100%"
            }}
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}
