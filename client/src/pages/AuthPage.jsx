import { Link } from "react-router-dom";
import logo from "../assets/nyc-logo.jpg";
export function AuthPage({ mode }) {
  const register = mode === "register";
  return (
    <main className="auth-page">
      <Link className="brand" to="/">
        <img src={logo} alt="Not Your College" />
        <span>DSA Arena</span>
      </Link>
      <section className="auth-card">
        <p className="eyebrow">NYC DSA ARENA</p>
        <h1>{register ? "Create your account" : "Welcome back"}</h1>
        <p>
          {register
            ? "Join the community and start your DSA journey."
            : "Sign in to continue your journey."}
        </p>
        <form onSubmit={(event) => event.preventDefault()}>
          {register && (
            <label>
              Username
              <input placeholder="your_username" />
            </label>
          )}
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>
          <button className="button button-yellow" type="submit">
            {register ? "Create account" : "Log in"}
          </button>
        </form>
        <p>
          {register ? "Already have an account?" : "New to the arena?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
