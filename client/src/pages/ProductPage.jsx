import { Link } from "react-router-dom";
import { useReveal } from "../hooks/useReveal.js";
const problemNames = [
  "Two Sum",
  "Valid Parentheses",
  "Merge Intervals",
  "Binary Tree Paths",
  "Course Schedule",
  "Maximum Subarray",
  "Design Browser History",
  "Word Ladder",
];
export function ProductPage({ title, description }) {
  const root = useReveal();
  const isProblems = title === "Problems";
  return (
    <section ref={root} className="screen-page">
      <div data-reveal className="page-heading">
        <p className="eyebrow">NYC DSA ARENA</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {isProblems ? (
        <div data-reveal className="problem-list">
          {problemNames.map((name, index) => (
            <Link
              to={`/problems/${name.toLowerCase().replaceAll(" ", "-")}`}
              key={name}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{name}</b>
              <em>{["Easy", "Medium", "Hard"][index % 3]}</em>
              <i>→</i>
            </Link>
          ))}
        </div>
      ) : (
        <div data-reveal className="content-placeholder">
          <h2>Ready for your next build.</h2>
          <p>
            This route is wired into the protected app. Add its specific UI and
            live API data when you are ready.
          </p>
        </div>
      )}
    </section>
  );
}
