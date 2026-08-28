import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/nyc-logo.jpg";
import { useDemoAuth } from "../store/demoAuthStore.js";
const INVITE_KEY = "NYC-DISCORD-2026";
export function AuthPage({ mode }) {
  const register = mode === "register";
  const nav = useNavigate();
  const { login, register: save } = useDemoAuth();
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (register && data.get("inviteKey") !== INVITE_KEY) {
      setError(
        "That invitation key is not valid. Get your key from the NYC Discord.",
      );
      return;
    }
    register
      ? save(data.get("username"), data.get("email"))
      : login(data.get("email"));
    nav("/dashboard");
  };
  return (
    <main className="auth-page">
      <Link className="brand" to="/">
        <img src={logo} alt="Not Your College" />
        <span>DSA Arena</span>
      </Link>
      <section className="auth-card">
        <p className="eyebrow">MEMBERS ONLY</p>
        <h1>{register ? "Claim your arena pass" : "Welcome back."}</h1>
        <p>
          {register
            ? "Use the registration key supplied through the official NYC Discord."
            : "Log in to return to your arena."}
        </p>
        <form onSubmit={submit}>
          {register && (
            <>
              <label>
                Username
                <input required name="username" placeholder="your_username" />
              </label>
              <label>
                NYC registration key
                <input required name="inviteKey" placeholder="NYC-XXXX-XXXX" />
              </label>
            </>
          )}
          <label>
            Email
            <input
              required
              name="email"
              type="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              required
              name="password"
              type="password"
              placeholder="••••••••"
            />
          </label>
          {error && <small className="form-error">{error}</small>}
          <button className="button button-yellow">
            {register ? "Create my account" : "Log in"}
          </button>
        </form>
        <p>
          {register ? "Already a member?" : "Need an invitation key?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Log in" : "Register"}
          </Link>
        </p>
        <small className="prototype-note">
          Prototype key for this frontend preview: <code>{INVITE_KEY}</code>.
          Move this check to the server before launch.
        </small>
      </section>
    </main>
  );
}
