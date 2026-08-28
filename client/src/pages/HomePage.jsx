import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { PublicFrame } from "../components/app/PublicHeader.jsx";
import { useTypewriter } from "../hooks/useTypewriter.js";
import "./HomePage.css";
const words = ["CODE.", "SOLVE.", "CONQUER."];
export function HomePage() {
  const root = useRef(null);
  const { text, index } = useTypewriter(words, 85, 700);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        opacity: 0,
        y: 42,
        stagger: 0.12,
        duration: 0.75,
        ease: "power3.out",
      });
      gsap.from(".hero-orbit", {
        scale: 0.65,
        rotation: -30,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root}>
      <PublicFrame>
        <main>
          <section className="hero-v2">
            <div className="hero-copy">
              <p className="eyebrow">NOT YOUR COLLEGE · DSA ARENA</p>
              <h1 className={`type-hero type-${index}`}>
                <span>{text}</span>
                <b className="caret">|</b>
              </h1>
              <p>
                Practice DSA with a community that expects more from itself.
                Solve problems, enter contests, and find your rank.
              </p>
              <div className="hero-actions">
                <Link className="button button-yellow" to="/register">
                  Enter the arena <b>↗</b>
                </Link>
                <Link className="button button-outline" to="/leaderboard">
                  View leaderboard
                </Link>
              </div>
            </div>
            <div className="hero-orbit">
              <div className="orbit-ring ring-one" />
              <div className="orbit-ring ring-two" />
              <div className="orbit-dot dot-a" />
              <div className="orbit-dot dot-b" />
              <div className="orbit-center">
                NYC
                <br />
                <small>DSA</small>
                <em>LEVEL 01</em>
              </div>
              <span className="orbit-tag tag-one">RANK UP</span>
              <span className="orbit-tag tag-two">+250 XP</span>
              <span className="orbit-tag tag-three">BATTLE</span>
              <span className="orbit-tag tag-four">STREAK ×7</span>
            </div>
          </section>
          <section className="stat-strip">
            <div>
              <b>250+</b>
              <span>Problems</span>
            </div>
            <div>
              <b>Every week</b>
              <span>Live contests</span>
            </div>
            <div>
              <b>One goal</b>
              <span>Get better</span>
            </div>
          </section>
        </main>
      </PublicFrame>
    </div>
  );
}
