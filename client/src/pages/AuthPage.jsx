import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2 } from "lucide-react";
import logo from "../assets/nyc-logo.jpg";
import { useDemoAuth } from "../store/demoAuthStore.js";

export function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading } = useDemoAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      if (isRegister) {
        if (!username.trim()) {
          setError("Username is required.");
          return;
        }
        await register(username.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    }
  };

  const handleFillAdmin = () => {
    setEmail("admin@nycdsaarena.com");
    setPassword("Admin@123456");
  };

  return (
    <main className="auth-page">
      <Link className="brand" to="/">
        <img src={logo} alt="Not Your College" />
        <span>DSA Arena</span>
      </Link>
      <section className="auth-card">
        <p className="eyebrow">
          {isRegister ? "CLAIM YOUR ARENA PASS" : "ARENA ACCESS PORTAL"}
        </p>
        <h1>{isRegister ? "Join the NYC Arena" : "Welcome back."}</h1>
        <p>
          {isRegister
            ? "Create your competitive profile and enter real-time 1v1 algorithmic duels."
            : "Log in with your credentials to continue your problem solving streak."}
        </p>

        {/* Admin Quick Credentials Option on Login */}
        {!isRegister && (
          <div className="admin-hint-strip" style={{
            background: "#f8fafc",
            border: "1.5px dashed var(--line)",
            padding: "10px 14px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px"
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "var(--muted)" }}>
              <Shield size={14} color="#1742e8" /> <b>Admin Account:</b> admin@nycdsaarena.com
            </span>
            <button
              type="button"
              onClick={handleFillAdmin}
              style={{
                background: "#ffe500",
                border: "1px solid #000",
                fontWeight: 800,
                fontSize: "11px",
                padding: "3px 8px",
                cursor: "pointer"
              }}
            >
              Fill Admin
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Username
              <input
                required
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. algo_warrior"
                autoComplete="username"
              />
            </label>
          )}

          <label>
            Email Address
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </label>

          {error && <small className="form-error" style={{ color: "#e11d48", fontWeight: 700, margin: "6px 0", display: "block" }}>{error}</small>}

          <button className="button button-yellow" type="submit" disabled={isLoading}>
            {isLoading ? "Authenticating..." : isRegister ? "Create Account ↗" : "Log In ↗"}
          </button>
        </form>

        <p style={{ marginTop: "16px" }}>
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Log In" : "Register"}
          </Link>
        </p>
      </section>
    </main>
  );
}
