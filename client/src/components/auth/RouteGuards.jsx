import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDemoAuth } from "../../store/demoAuthStore.js";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { user } = useDemoAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { user } = useDemoAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user.role !== "admin") {
    return (
      <div style={{
        minHeight: "80vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
        textAlign: "center"
      }}>
        <div style={{
          maxWidth: "480px",
          background: "#fff",
          border: "2px solid #000",
          boxShadow: "6px 6px 0 #000",
          padding: "36px"
        }}>
          <ShieldAlert size={48} color="#e11d48" style={{ marginBottom: "16px" }} />
          <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "8px" }}>403 · Access Restricted</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
            The NYC Super-Admin Console requires an administrator account (e.g. <b>admin@nycdsaarena.com</b>). Your current account (@{user.username}) does not have admin permissions.
          </p>
          <Link to="/dashboard" className="button button-yellow" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ArrowLeft size={16} /> Return to Member Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
