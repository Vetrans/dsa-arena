import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Swords,
  Trophy,
  CheckCircle2
} from "lucide-react";
import logo from "../assets/nyc-logo-svg.svg";
import { useDemoAuth } from "../store/demoAuthStore.js";
import "./AuthPage.css";

export function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading } = useDemoAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        navigate(redirectPath);
      } else {
        const result = await login(email.trim(), password);
        const role = (result?.user?.role || "").toLowerCase();
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate(redirectPath);
        }
      }
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
      {/* Top Navigation */}
      <div className="auth-nav-top">
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={15} /> Back to Home
        </Link>
      </div>

      <div className="auth-container">
        {/* Brand Logo Only - Pure Vector Wordmark with Zero Trailing Text */}
        <Link to="/" className="auth-brand-badge" aria-label="Not Your College Home">
          <img src={logo} alt="Not Your College" className="auth-logo-img" />
        </Link>

        {/* Elevated Neo-Brutalist Authentication Card */}
        <section className="auth-card">
          <div className="auth-header">
            <span className="auth-eyebrow">
              {isRegister ? "JOIN THE COMMUNITY" : "MEMBER ACCESS PORTAL"}
            </span>
            <h1 className="auth-title">{isRegister ? "Create Account" : "Welcome Back"}</h1>
            <p className="auth-desc">
              {isRegister
                ? "Enter your credentials to claim your profile and start competing."
                : "Sign in with your account to resume your problem solving streak."}
            </p>
          </div>

          {/* Quick Demo Credentials Strip for Testers & Reviewers */}
          {!isRegister && (
            <div className="auth-demo-banner">
              <div className="auth-demo-info">
                <Shield size={15} color="#d97706" />
                <span>Demo Admin: <b>admin@nycdsaarena.com</b></span>
              </div>
              <button
                type="button"
                className="auth-demo-btn"
                onClick={handleFillAdmin}
              >
                1-Click Fill
              </button>
            </div>
          )}

          {error && (
            <div className="auth-error-banner" role="alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-username">
                  Username
                </label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="auth-username"
                    className="auth-input"
                    required
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="algo_master"
                    autoComplete="username"
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-email">
                Email Address
              </label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="auth-email"
                  className="auth-input"
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-password">
                Password
              </label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="auth-password"
                  className="auth-input"
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              className="auth-submit-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                "Authenticating..."
              ) : isRegister ? (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Log In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer-switch">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <Link
              className="auth-footer-link"
              to={isRegister ? "/login" : "/register"}
            >
              {isRegister ? "Log In" : "Register Now"}
            </Link>
          </div>
        </section>

        {/* Feature Trust Pills */}
        <div className="auth-perks">
          <span className="auth-perk-item">
            <Swords size={14} color="#1742e8" /> 1v1 Live Battles
          </span>
          <span className="auth-perk-item">
            <Trophy size={14} color="#f59e0b" /> Chess ELO Ratings
          </span>
          <span className="auth-perk-item">
            <Sparkles size={14} color="#16a34a" /> 100% Free Practice
          </span>
        </div>
      </div>
    </main>
  );
}

