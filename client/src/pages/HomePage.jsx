import React, { useState, useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  MapPin,
  Mail,
  MessageSquare,
  Swords,
  Code2,
  Trophy,
  Zap,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Terminal,
  Award,
  Rocket,
  TrendingUp,
  Check,
  Shield,
  Headphones
} from "lucide-react";
import { PublicFrame } from "../components/app/PublicHeader.jsx";
import { FAQSection } from "../components/app/FAQSection.jsx";
import { useTypewriter } from "../hooks/useTypewriter.js";
import { AnimatedCounter } from "../components/ui/AnimatedCounter.jsx";
import garlandOverlayImg from "../assets/garland-overlay.png";
import "./HomePage.css";

gsap.registerPlugin(ScrollTrigger);

const typewriterWords = ["SPEED & REFLEXES.", "TIER-1 INTERVIEWS.", "SYSTEMS THINKING.", "PATTERNS UNDER PRESSURE."];

const SAMPLE_PROBLEMS = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    slug: "two-sum",
    category: "Arrays & Hash Table",
    companies: ["Google", "Meta", "Amazon"],
    acceptance: "91%"
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    slug: "valid-parentheses",
    category: "Stack & Strings",
    companies: ["Bloomberg", "Apple"],
    acceptance: "88%"
  },
  {
    title: "Longest Substring Without Repeating",
    difficulty: "Medium",
    slug: "longest-substring-without-repeating-characters",
    category: "Sliding Window",
    companies: ["Microsoft", "Uber"],
    acceptance: "74%"
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    slug: "container-with-most-water",
    category: "Two Pointers",
    companies: ["Meta", "Amazon"],
    acceptance: "71%"
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    slug: "trapping-rain-water",
    category: "Monotonic Stack / DP",
    companies: ["Google", "Citadel"],
    acceptance: "59%"
  },
  {
    title: "Binary Search",
    difficulty: "Easy",
    slug: "binary-search",
    category: "Binary Search",
    companies: ["Adobe", "Apple"],
    acceptance: "92%"
  }
];

export function HomePage({ defaultView }) {
  const root = useRef(null);
  const location = useLocation();
  const [activeStudioTab, setActiveStudioTab] = useState("duel");
  const { text } = useTypewriter(typewriterWords, 80, 700);

  const searchParams = new URLSearchParams(location.search);
  const view = defaultView || searchParams.get("view") || "home";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HOME VIEW ANIMATIONS
      if (view === "home") {
        gsap.from(".nyc-hero-left > *", {
          opacity: 0,
          y: 28,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out"
        });

        gsap.from(".apple-studio-preview", {
          scale: 0.95,
          opacity: 0,
          y: 24,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out"
        });

        gsap.from(".nyc-floating-badge", {
          scale: 0.6,
          opacity: 0,
          duration: 0.5,
          stagger: 0.12,
          delay: 0.4,
          ease: "back.out(1.6)"
        });

        gsap.to(".badge-pulse", {
          y: -6,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        gsap.to(".badge-discord", {
          y: 6,
          duration: 3.0,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.3
        });
        gsap.to(".badge-runtime", {
          y: -5,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5
        });

        // Comparison Section (Traditional with Garland vs NYC Path)
        gsap.from(".nyc-comparison-section .section-head", {
          y: 35,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".nyc-comparison-section",
            start: "top 82%"
          }
        });
        gsap.from(".comparison-card", {
          y: 45,
          opacity: 0,
          duration: 0.75,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".comparison-grid",
            start: "top 82%"
          }
        });

        // Community Section Scroll Reveal
        gsap.from(".nyc-community-section .section-head", {
          y: 35,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".nyc-community-section",
            start: "top 82%"
          }
        });
        gsap.from(".community-pillar-box", {
          y: 35,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".community-pillars-grid",
            start: "top 85%"
          }
        });
        gsap.from(".community-spotlight-card", {
          scale: 0.96,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".community-spotlight-card",
            start: "top 85%"
          }
        });

        // Problem Vault Showcase
        gsap.from(".nyc-problems-preview-section .section-head", {
          y: 35,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".nyc-problems-preview-section",
            start: "top 82%"
          }
        });
        gsap.from(".problem-preview-card", {
          y: 35,
          opacity: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".problems-preview-grid",
            start: "top 85%"
          }
        });

        // Beyond Sigma Section
        gsap.from(".beyond-sigma-card", {
          y: 45,
          opacity: 0,
          scale: 0.97,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".beyond-sigma-section",
            start: "top 82%"
          }
        });

        // Stats Numbers
        gsap.from(".nyc-stat-box", {
          scale: 0.88,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: ".nyc-stats-section",
            start: "top 88%"
          }
        });
      }

      // 2. DEDICATED FEATURES VIEW ANIMATIONS
      if (view === "features") {
        gsap.from(".nyc-bento-section .section-head", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out"
        });
        gsap.from(".bento-card", {
          y: 35,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out"
        });
        gsap.from(".features-cta-banner", {
          y: 30,
          opacity: 0,
          duration: 0.65,
          delay: 0.35,
          ease: "power3.out"
        });
      }

      // 3. CONTACT VIEW ANIMATIONS
      if (view === "contact") {
        gsap.from(".contact-card-wrap", {
          y: 45,
          opacity: 0,
          scale: 0.97,
          duration: 0.75,
          ease: "power3.out"
        });
      }
    }, root);

    return () => ctx.revert();
  }, [view]);

  return (
    <div ref={root} className="nyc-home-root">
      <PublicFrame>
        <main className="nyc-main-body">
          {/* =================================================================
              HOME VIEW: Dedicated Landing Experience
              (Features Bento Grid is hidden from Home and lives on /features)
              ================================================================= */}
          {view === "home" && (
            <>
              {/* 1. HERO SECTION: Standardized DSA ARENA + Apple Studio Preview */}
              <section className="nyc-hero-section">
                <div className="nyc-hero-container">
                  {/* Left Column: Bold Typography & Ethos */}
                  <div className="nyc-hero-left">
                    <div className="nyc-hero-badge-pill">
                      <span className="nhb-dot" />
                      <span>OFFICIAL NOT YOUR COLLEGE PLATFORM · V2.4</span>
                    </div>

                    <h1 className="nyc-hero-heading">
                      <span className="nyc-hero-title-top">THE COMPETITIVE CODING ENGINE</span>
                      <div className="nyc-yellow-highlight">DSA ARENA</div>
                      <div className="nyc-arena-subhead">
                        CRUSH PATTERNS <span className="nyc-typewriter-wrap">· {text}</span>
                      </div>
                    </h1>

                    <p className="nyc-hero-sub">
                      Re-engineered for developers who refuse to grind alone in the dark. Experience synchronous 1v1 battles, instant sandboxed execution, and an active community that transforms coding interview anxiety into algorithmic instinct.
                    </p>

                    <div className="nyc-hero-actions">
                      <Link className="button button-yellow nyc-hero-cta" to="/problems">
                        Enter DSA Arena <b>↗</b>
                      </Link>
                      <Link className="button button-ghost nyc-hero-sub-cta" to="/battles">
                        <Swords size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                        Join 1v1 Duels
                      </Link>
                    </div>

                    <div className="nyc-hero-tech-strip">
                      <span className="nht-label">RUNTIME COMPILERS:</span>
                      <span className="nht-pill">C++ 20</span>
                      <span className="nht-pill">Java 21</span>
                      <span className="nht-pill">Python 3.12</span>
                      <span className="nht-pill">Node.js 20</span>
                    </div>
                  </div>

                  {/* Right Column: Apple-Style Interactive Studio Preview */}
                  <div className="nyc-hero-right">
                    <div className="apple-studio-wrapper">
                      {/* Interactive Studio Device Mockup */}
                      <div className="apple-studio-preview">
                        {/* Chrome Header Bar */}
                        <div className="asp-header">
                          <div className="asp-dots">
                            <span className="asp-dot dot-red" />
                            <span className="asp-dot dot-yellow" />
                            <span className="asp-dot dot-green" />
                          </div>
                          <div className="asp-title-bar">
                            <span className="asp-title-badge">ARENA OS</span>
                            <span className="asp-title-text">NYC_DSA_ARENA // Live Workspace</span>
                          </div>
                          <div className="asp-status-tag">
                            <span className="asp-live-pulse" />
                            <span>CONNECTED</span>
                          </div>
                        </div>

                        {/* Interactive Tab Controls */}
                        <div className="asp-tabs-bar">
                          <button
                            type="button"
                            className={`asp-tab-btn ${activeStudioTab === "duel" ? "tab-active" : ""}`}
                            onClick={() => setActiveStudioTab("duel")}
                          >
                            <Swords size={13} /> 1v1 Duel Engine
                          </button>
                          <button
                            type="button"
                            className={`asp-tab-btn ${activeStudioTab === "sandbox" ? "tab-active" : ""}`}
                            onClick={() => setActiveStudioTab("sandbox")}
                          >
                            <Terminal size={13} /> Sandboxed Judge
                          </button>
                          <button
                            type="button"
                            className={`asp-tab-btn ${activeStudioTab === "telemetry" ? "tab-active" : ""}`}
                            onClick={() => setActiveStudioTab("telemetry")}
                          >
                            <Trophy size={13} /> ELO & Telemetry
                          </button>
                        </div>

                        {/* Interactive Tab Body */}
                        <div className="asp-body">
                          {activeStudioTab === "duel" && (
                            <div className="asp-duel-view">
                              <div className="asdv-match-meta">
                                <span className="asdv-badge-live">RANKED DUEL IN PROGRESS</span>
                                <span className="asdv-time">03:42 REMAINING</span>
                              </div>
                              <div className="asdv-challenge-name">
                                Trapping Rain Water <span className="diff-tag hard">HARD</span>
                              </div>

                              <div className="asdv-players-grid">
                                <div className="asdv-player player-self">
                                  <div className="asdv-player-header">
                                    <span className="asdv-name">@you (Master)</span>
                                    <span className="asdv-elo">1,940 ELO</span>
                                  </div>
                                  <div className="asdv-progress-row">
                                    <span>Passed 3/3 Tests</span>
                                    <span className="text-green font-mono">100%</span>
                                  </div>
                                  <div className="asdv-bar-wrap">
                                    <div className="asdv-bar bar-self" style={{ width: "100%" }} />
                                  </div>
                                  <div className="asdv-badge-status badge-success">
                                    <CheckCircle2 size={12} /> Accepted · 14ms (Beats 98%)
                                  </div>
                                </div>

                                <div className="asdv-vs-badge">VS</div>

                                <div className="asdv-player player-opp">
                                  <div className="asdv-player-header">
                                    <span className="asdv-name">@siddharth_algo</span>
                                    <span className="asdv-elo">1,915 ELO</span>
                                  </div>
                                  <div className="asdv-progress-row">
                                    <span>Passed 2/3 Tests</span>
                                    <span className="text-yellow font-mono">66%</span>
                                  </div>
                                  <div className="asdv-bar-wrap">
                                    <div className="asdv-bar bar-opp" style={{ width: "66%" }} />
                                  </div>
                                  <div className="asdv-badge-status badge-coding">
                                    <Code2 size={12} /> Compiling Python 3.12...
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeStudioTab === "sandbox" && (
                            <div className="asp-code-view font-mono">
                              <div className="asp-code-bar">
                                <span className="acb-lang">Solution.cpp · C++ 20</span>
                                <span className="acb-run-tag"><Zap size={11} /> 12ms Execution</span>
                              </div>
                              <pre className="asp-code-block">
{`class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxL = 0, maxR = 0, water = 0;
        while (left < right) {
            if (height[left] <= height[right]) {
                height[left] >= maxL ? maxL = height[left] : water += maxL - height[left];
                left++;
            } else {
                height[right] >= maxR ? maxR = height[right] : water += maxR - height[right];
                right--;
            }
        }
        return water;
    }
};`}
                              </pre>
                              <div className="asp-terminal-verdict">
                                <span className="verdict-pill success">
                                  <Check size={12} /> ALL 48 TESTCASES PASSED
                                </span>
                                <span className="verdict-metrics">Memory: 16.2 MB · Runtime: 8ms</span>
                              </div>
                            </div>
                          )}

                          {activeStudioTab === "telemetry" && (
                            <div className="asp-telemetry-view">
                              <div className="atv-stat-row">
                                <div className="atv-stat-card">
                                  <span className="atv-label">CURRENT RATING</span>
                                  <b className="atv-val text-yellow">2,148 ELO</b>
                                  <span className="atv-sub text-green"><TrendingUp size={12} style={{ display: "inline" }} /> +32 Last Match</span>
                                </div>
                                <div className="atv-stat-card">
                                  <span className="atv-label">ARENA DIVISION</span>
                                  <b className="atv-val">Diamond II</b>
                                  <span className="atv-sub">Top 2.4% Globally</span>
                                </div>
                                <div className="atv-stat-card">
                                  <span className="atv-label">WIN STREAK</span>
                                  <b className="atv-val text-blue">7 Matches</b>
                                  <span className="atv-sub">x1.5 XP Multiplier</span>
                                </div>
                              </div>
                              <div className="atv-graph-teaser">
                                <div className="atv-graph-label">
                                  <span>Testcase Percentile Curve (Speed vs Space)</span>
                                  <span className="text-green font-mono">99.4th Percentile</span>
                                </div>
                                <div className="atv-graph-bar">
                                  <div className="atv-graph-fill" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Floating Micro-Widgets with Safe Responsive Positioning */}
                      <div className="nyc-floating-badge badge-pulse">
                        <div className="nfb-icon icon-yellow">
                          <Zap size={15} />
                        </div>
                        <div className="nfb-content">
                          <span className="nfb-title">SUB-10MS MATCHMAKER</span>
                          <span className="nfb-sub">Average Queue: 1.4 seconds</span>
                        </div>
                      </div>

                      <a
                        href="https://discord.gg/3NTygqWDD"
                        target="_blank"
                        rel="noreferrer"
                        className="nyc-floating-badge badge-discord"
                      >
                        <div className="nfb-icon icon-discord">
                          <MessageSquare size={15} />
                        </div>
                        <div className="nfb-content">
                          <span className="nfb-tag">COMMUNITY ACTIVE</span>
                          <span className="nfb-title"><AnimatedCounter end={3200} suffix="+" /> Members</span>
                        </div>
                      </a>

                      <div className="nyc-floating-badge badge-runtime">
                        <span className="nbr-dot" />
                        <span className="nbr-text">Isolated Docker Sandboxes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. COMPARISON SECTION: The Traditional Path vs. The NYC DSA Arena Way
                     (With Garland & Agarbatti Frame on the Outdated Way!) */}
              <section id="difference" className="nyc-comparison-section">
                <div className="section-head text-center">
                  <p className="eyebrow">THE ARCHITECTURAL DIFFERENCE</p>
                  <h2>The Traditional Path vs. The NYC DSA Arena Way</h2>
                  <p className="section-sub">
                    Grinding hundreds of problems in isolated silence gives you a false sense of security. The moment an interviewer watches your screen, you freeze. DSA Arena was designed to shatter that cycle.
                  </p>
                </div>

                <div className="comparison-grid">
                  {/* The Outdated Way (With Garland & Agarbatti Overlay Frame) */}
                  <div className="comparison-card card-traditional has-garland">
                    <img
                      src={garlandOverlayImg}
                      alt="Garland and agarbatti memorial frame over traditional grind"
                      className="garland-frame-overlay"
                      aria-hidden="true"
                    />

                    <div className="comp-card-badge badge-old">
                      <span>R.I.P. THE CONVENTIONAL WAY</span>
                    </div>
                    <h3 className="comp-card-title">Isolated Solo Grinding</h3>
                    <p className="comp-card-desc">
                      Solving static problems on conventional platforms without peers, time pressure, or direct feedback.
                    </p>

                    <div className="comp-points-list">
                      <div className="comp-point-item item-negative">
                        <div className="cpi-icon"><XCircle size={18} /></div>
                        <div>
                          <b>Zero Pressure Simulation</b>
                          <p>Spending 50 minutes without urgency means instant panic when faced with a 20-minute timer on an actual interview screen-share.</p>
                        </div>
                      </div>

                      <div className="comp-point-item item-negative">
                        <div className="cpi-icon"><XCircle size={18} /></div>
                        <div>
                          <b>Passive Rote Memorization</b>
                          <p>Copying solutions from YouTube or LeetCode discussions leads to forgetting key problem patterns within 2 weeks.</p>
                        </div>
                      </div>

                      <div className="comp-point-item item-negative">
                        <div className="cpi-icon"><XCircle size={18} /></div>
                        <div>
                          <b>Isolated In The Dark</b>
                          <p>When you get stuck on an obscure edge-case, you have no peers or mentors to bounce ideas off, leading to weeks of demotivation.</p>
                        </div>
                      </div>

                      <div className="comp-point-item item-negative">
                        <div className="cpi-icon"><XCircle size={18} /></div>
                        <div>
                          <b>Slow & Opaque Execution</b>
                          <p>Clunky cloud compilers that take 12 seconds per run with vague errors and zero algorithmic memory analysis.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* The NYC DSA Arena Way */}
                  <div className="comparison-card card-arena">
                    <div className="comp-card-badge badge-arena">
                      <Zap size={13} />
                      <span>THE NYC DSA ARENA ADVANTAGE</span>
                    </div>
                    <h3 className="comp-card-title text-yellow">Synchronous Competitive Mastery</h3>
                    <p className="comp-card-desc">
                      High-stakes head-to-head battles, sub-second execution, and an active peer network engineered for tier-1 domination.
                    </p>

                    <div className="comp-points-list">
                      <div className="comp-point-item item-positive">
                        <div className="cpi-icon"><CheckCircle2 size={18} /></div>
                        <div>
                          <b>Live 1v1 Code Showdowns</b>
                          <p>Battle real peers in real-time. Feel the adrenaline, test your speed under pressure, and conquer interview anxiety permanently.</p>
                        </div>
                      </div>

                      <div className="comp-point-item item-positive">
                        <div className="cpi-icon"><CheckCircle2 size={18} /></div>
                        <div>
                          <b>Active 3,200+ Discord Peer Ecosystem</b>
                          <p>Find study buddies at your exact ELO, join voice rooms for live mock interviews, and receive direct reviews from senior engineers.</p>
                        </div>
                      </div>

                      <div className="comp-point-item item-positive">
                        <div className="cpi-icon"><CheckCircle2 size={18} /></div>
                        <div>
                          <b>Sub-Second Multi-Language Sandbox</b>
                          <p>Instant isolated execution across C++ 20, Java 21, Python 3.12, and Node.js 20 with hidden stress-test edge cases.</p>
                        </div>
                      </div>

                      <div className="comp-point-item item-positive">
                        <div className="cpi-icon"><CheckCircle2 size={18} /></div>
                        <div>
                          <b>True Chess ELO & Diagnostic Telemetry</b>
                          <p>Climb transparent division ladders with granular post-match percentiles, memory benchmarks, and Big-O verification.</p>
                        </div>
                      </div>
                    </div>

                    <div className="comp-card-cta">
                      <Link to="/problems" className="button button-yellow comp-btn">
                        Experience The Arena Difference ↗
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. PROBLEM VAULT SHOWCASE: Curated Challenges */}
              <section className="nyc-problems-preview-section">
                <div className="section-head text-center">
                  <p className="eyebrow">CURATED CHALLENGES</p>
                  <h2>High-Frequency Questions Tested By Tier-1 Tech</h2>
                  <p className="section-sub">
                    Master the foundational patterns asked by Google, Meta, Amazon, and top NYC quantitative trading firms.
                  </p>
                </div>

                <div className="problems-preview-grid">
                  {SAMPLE_PROBLEMS.map((prob, idx) => {
                    const isEasy = prob.difficulty === "Easy";
                    const isMedium = prob.difficulty === "Medium";

                    return (
                      <Link to={`/problems/${prob.slug}`} key={idx} className="problem-preview-card">
                        <div className="ppc-top">
                          <span
                            className={`diff-pill ${
                              isEasy ? "diff-easy" : isMedium ? "diff-medium" : "diff-hard"
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                          <span className="ppc-accept">{prob.acceptance} pass</span>
                        </div>

                        <h3 className="ppc-title">{prob.title}</h3>
                        <p className="ppc-cat">{prob.category}</p>

                        <div className="ppc-companies">
                          {prob.companies.map((c, i) => (
                            <span key={i} className="company-tag">{c}</span>
                          ))}
                        </div>

                        <div className="ppc-solve-btn">
                          Solve Challenge <ArrowRight size={14} />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="problems-preview-cta">
                  <Link to="/problems" className="button button-dark browse-vault-btn">
                    Browse All Problems in Vault ↗
                  </Link>
                </div>
              </section>

              {/* 4. COMMUNITY & DISCORD ECOSYSTEM */}
              <section id="community" className="nyc-community-section">
                <div className="section-head text-center">
                  <p className="eyebrow">THE NYC DEVELOPER NETWORK</p>
                  <h2>Never Code Alone. Conquer Together.</h2>
                  <p className="section-sub">
                    The single biggest differentiator between engineers who land tier-1 offers and those who get stuck is community. When you join the NYC DSA Arena, you step into an ecosystem of ambitious builders.
                  </p>
                </div>

                <div className="community-pillars-grid">
                  <div className="community-pillar-box">
                    <div className="cpb-icon icon-users">
                      <Users size={24} />
                    </div>
                    <h4>24/7 Peer Matchmaking</h4>
                    <p>
                      Find sparring partners at your exact skill level for daily 1v1 battles, collaborative problem debriefs, and shared study roadmaps.
                    </p>
                  </div>

                  <div className="community-pillar-box">
                    <div className="cpb-icon icon-mentor">
                      <Shield size={24} />
                    </div>
                    <h4>Senior Engineer Guidance</h4>
                    <p>
                      Get your solutions and resumes reviewed by senior engineers from top tech companies who actively participate in discussions and office hours.
                    </p>
                  </div>

                  <div className="community-pillar-box">
                    <div className="cpb-icon icon-voice">
                      <Headphones size={24} />
                    </div>
                    <h4>Live Voice Coding Rooms</h4>
                    <p>
                      Hop into 24/7 drop-in voice rooms for collaborative problem solving, live screen-shares, and real mock behavioral & technical rounds.
                    </p>
                  </div>

                  <div className="community-pillar-box">
                    <div className="cpb-icon icon-sprints">
                      <Rocket size={24} />
                    </div>
                    <h4>Daily Sprints & Debriefs</h4>
                    <p>
                      Participate in daily problem sprints with comprehensive community discussion threads, optimal code templates, and mathematical proofs.
                    </p>
                  </div>
                </div>

                {/* Community Spotlight Banner */}
                <div className="community-spotlight-card">
                  <div className="csc-left">
                    <div className="csc-badge">
                      <span className="csc-live-dot" />
                      <span>3,200+ ACTIVE ENGINEERS ON DISCORD</span>
                    </div>
                    <h3>Ready To Join The Most Driven Developer Community?</h3>
                    <p>
                      Stop grinding in isolation. Join thousands of developers practicing daily, finding study buddies, and cracking technical interviews together.
                    </p>
                    <div className="csc-actions">
                      <a
                        href="https://discord.gg/3NTygqWDD"
                        target="_blank"
                        rel="noreferrer"
                        className="button button-yellow csc-discord-btn"
                      >
                        <MessageSquare size={16} /> Join Discord Server ↗
                      </a>
                      <Link to="/leaderboard" className="button button-ghost csc-rank-btn">
                        <Trophy size={16} /> Check Global Standings
                      </Link>
                    </div>
                  </div>

                  <div className="csc-right">
                    <div className="csc-metric-card">
                      <div className="csc-metric-row">
                        <span>Daily Battles Fought</span>
                        <b>1,420+</b>
                      </div>
                      <div className="csc-metric-row">
                        <span>Average Response Time</span>
                        <b>&lt; 4 mins</b>
                      </div>
                      <div className="csc-metric-row">
                        <span>Mock Interviews Hosted</span>
                        <b>850+</b>
                      </div>
                      <div className="csc-metric-row">
                        <span>Access Fee</span>
                        <b className="text-green">100% Free</b>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. BEYOND SIGMA FLAGSHIP PROGRAM */}
              <section id="beyond-sigma" className="beyond-sigma-section">
                <div className="beyond-sigma-card">
                  <div className="bs-header">
                    <div className="bs-eyebrow">
                      <Award size={16} color="#ffe500" />
                      <span>FLAGSHIP WEB DEV & PRODUCTION SYSTEMS CAREER PROGRAM · NOT YOUR COLLEGE</span>
                    </div>
                    <h2>BEYOND SIGMA</h2>
                    <p className="bs-subhead">
                      The premier industry-ready engineering program crafted specifically for 1st & 2nd year students. Master production web development, distributed architecture, and AI tooling.
                    </p>
                  </div>

                  <div className="bs-pillars-grid">
                    <div className="bs-pillar-box">
                      <div className="bsp-num">01</div>
                      <h4>Full Stack Production Systems</h4>
                      <p>Build and deploy large-scale web architectures using modern TypeScript, Next.js, distributed microservices, and databases.</p>
                    </div>

                    <div className="bs-pillar-box">
                      <div className="bsp-num">02</div>
                      <h4>Generative AI & Agentic Tooling</h4>
                      <p>Integrate LLMs, vector search, RAG pipelines, and autonomous AI agents directly into real-world applications.</p>
                    </div>

                    <div className="bs-pillar-box">
                      <div className="bsp-num">03</div>
                      <h4>Advanced DSA & System Design</h4>
                      <p>Master the computer science fundamentals, concurrency patterns, and architecture necessary for Tier-1 placements.</p>
                    </div>

                    <div className="bs-pillar-box">
                      <div className="bsp-num">04</div>
                      <h4>1-on-1 Mentorship & Placements</h4>
                      <p>Direct guidance from seasoned engineers, mock technical interviews, resume overhauls, and open-source hackathons.</p>
                    </div>
                  </div>

                  <div className="bs-footer">
                    <div className="bs-callout">
                      <b>Join the elite cohort of engineers building real momentum.</b>
                      <span>Limited seats per batch with personalized mentor assignment from Not Your College.</span>
                    </div>
                    <div className="bs-actions">
                      <a
                        href="https://notyourcollege.com/courses/beyondsigma"
                        target="_blank"
                        rel="noreferrer"
                        className="button button-yellow bs-btn-primary"
                      >
                        Enroll in Beyond Sigma ↗
                      </a>
                      <a
                        href="https://discord.gg/3NTygqWDD"
                        target="_blank"
                        rel="noreferrer"
                        className="button button-ghost bs-btn-secondary"
                      >
                        Join Discord Community
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. INTERACTIVE FAQ SECTION (Above Numbers) */}
              <FAQSection />

              {/* 7. LIVE ARENA NUMBERS & METRICS */}
              <section className="nyc-stats-section">
                <div className="nyc-stats-grid">
                  <div className="nyc-stat-box">
                    <b><AnimatedCounter end={3200} suffix="+" /></b>
                    <span>Active Discord Members</span>
                  </div>
                  <div className="nyc-stat-box">
                    <b><AnimatedCounter end={18} suffix=" Tracks" /></b>
                    <span>Curated DSA Patterns</span>
                  </div>
                  <div className="nyc-stat-box">
                    <b><AnimatedCounter end={150} prefix="< " suffix="ms" /></b>
                    <span>Sub-Second Judge Compilation</span>
                  </div>
                  <div className="nyc-stat-box">
                    <b><AnimatedCounter end={100} suffix="%" /></b>
                    <span>Free Community DSA Arena</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* =================================================================
              DEDICATED FEATURES VIEW: Only shown on /features or ?view=features
              ================================================================= */}
          {view === "features" && (
            <section className="nyc-bento-section standalone-view">
              <div className="section-head text-center">
                <p className="eyebrow">ARENA ARSENAL & SUBSYSTEMS</p>
                <h2>Engineered From Scratch For Algorithmic Speed</h2>
                <p className="section-sub">
                  Every subsystem—from our sub-10ms matchmaker to our containerized judge—is optimized to turn theoretical concepts into muscle memory.
                </p>
              </div>

              <div className="bento-grid">
                {/* Bento Card 1: 1v1 Battle Arena (Hero feature) */}
                <div className="bento-card bento-hero-duel">
                  <div className="bento-badge">
                    <Swords size={14} /> LIVE COMPETITIVE ENGINE
                  </div>
                  <div className="bento-content">
                    <h3>Synchronous 1v1 Battle Arena</h3>
                    <p>
                      Match against rivals in real-time with split-screen progress bars, live testcase counters, and rating points on the line. Experience the exact psychological pressure of tier-1 whiteboard rounds.
                    </p>
                    <div className="bento-pill-row">
                      <span className="bento-pill"><Check size={12} /> WebSocket Sub-10ms Matchmaker</span>
                      <span className="bento-pill"><Check size={12} /> Real-Time Telemetry</span>
                      <span className="bento-pill"><Check size={12} /> Instant Rematches</span>
                    </div>
                  </div>
                  <div className="bento-visual visual-duel">
                    <div className="bv-duel-mini">
                      <div className="bvd-row">
                        <span className="bvd-name">@you</span>
                        <span className="bvd-score text-green font-mono">100% (3/3 Tests)</span>
                      </div>
                      <div className="bvd-track"><div className="bvd-fill fill-green" /></div>
                      <div className="bvd-row mt-2">
                        <span className="bvd-name">@rival</span>
                        <span className="bvd-score text-yellow font-mono">66% (2/3 Tests)</span>
                      </div>
                      <div className="bvd-track"><div className="bvd-fill fill-yellow" /></div>
                    </div>
                  </div>
                </div>

                {/* Bento Card 2: Sub-Second Multi-Language Sandbox */}
                <div className="bento-card bento-sandbox">
                  <div className="bento-badge">
                    <Terminal size={14} /> ZERO-LAG COMPILER
                  </div>
                  <div className="bento-content">
                    <h3>Sub-Second Sandboxed Judge</h3>
                    <p>
                      Zero setup. Instant execution in C++ 20, Java 21, Python 3.12, and Node.js 20 powered by isolated execution workers and stress-test suites.
                    </p>
                    <div className="bento-pill-row">
                      <span className="bento-pill">C++ 20</span>
                      <span className="bento-pill">Java 21</span>
                      <span className="bento-pill">Python 3.12</span>
                      <span className="bento-pill">Node.js 20</span>
                    </div>
                  </div>
                </div>

                {/* Bento Card 3: 18 Pattern Vault */}
                <div className="bento-card bento-vault">
                  <div className="bento-badge">
                    <Trophy size={14} /> CURATED CURRICULUM
                  </div>
                  <div className="bento-content">
                    <h3>18-Topic Problem Vault</h3>
                    <p>
                      Master the core interview patterns: Sliding Window, Monotonic Stacks, Fast/Slow Pointers, Dynamic Programming, and Graph Traversals.
                    </p>
                    <div className="bento-stat font-mono text-yellow">50+ Handpicked Problems</div>
                  </div>
                </div>

                {/* Bento Card 4: Chess-Grade ELO Ladder */}
                <div className="bento-card bento-elo">
                  <div className="bento-badge">
                    <Zap size={14} /> TRANSPARENT STANDINGS
                  </div>
                  <div className="bento-content">
                    <h3>FIDE Chess ELO System</h3>
                    <p>
                      Climb from Bronze to Diamond and Grandmaster. Daily streak multipliers and real mathematical rating adjustments reflect true skill.
                    </p>
                    <div className="bento-divisions">
                      <span className="div-pill">Bronze</span>
                      <span className="div-pill">Silver</span>
                      <span className="div-pill">Gold</span>
                      <span className="div-pill">Platinum</span>
                      <span className="div-pill div-gold">Master</span>
                    </div>
                  </div>
                </div>

                {/* Bento Card 5: Post-Match Telemetry */}
                <div className="bento-card bento-telemetry">
                  <div className="bento-badge">
                    <TrendingUp size={14} /> DIAGNOSTIC ANALYTICS
                  </div>
                  <div className="bento-content">
                    <h3>Deep Post-Match Telemetry</h3>
                    <p>
                      Inspect testcase percentile curves, memory allocation graphs, and Big-O runtime benchmarks immediately after every duel.
                    </p>
                    <div className="bento-stat font-mono text-green">Sub-Millisecond Profiling</div>
                  </div>
                </div>

                {/* Bento Card 6: Weekly Contests */}
                <div className="bento-card bento-contests">
                  <div className="bento-badge">
                    <Rocket size={14} /> LIVE CONTESTS
                  </div>
                  <div className="bento-content">
                    <h3>Weekly Arena Showdowns</h3>
                    <p>
                      Compete against the entire NYC community in scheduled 90-minute algorithmic contests with frozen scoreboards and live rating recalculations.
                    </p>
                    <Link to="/contests" className="bento-link">
                      View Upcoming Contests <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dedicated Features Bottom CTA Banner */}
              <div className="features-cta-banner">
                <div className="fcb-inner">
                  <div className="fcb-text">
                    <h3>Ready To Experience High-Velocity Algorithmic Duels?</h3>
                    <p>Choose your preferred runtime, match against developers at your ELO, and climb global divisions.</p>
                  </div>
                  <div className="fcb-actions">
                    <Link to="/battles" className="button button-yellow">
                      <Swords size={16} /> Enter Live 1v1 Battles
                    </Link>
                    <Link to="/problems" className="button button-ghost">
                      Explore Problem Vault ↗
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =================================================================
              DEDICATED COMMUNITY / NETWORK VIEW (When ?view=team clicked)
              ================================================================= */}
          {view === "team" && (
            <section id="community" className="nyc-community-section standalone-view">
              <div className="section-head text-center">
                <p className="eyebrow">THE NYC DEVELOPER NETWORK</p>
                <h2>Never Code Alone. Conquer Together.</h2>
                <p className="section-sub">
                  The single biggest differentiator between engineers who land tier-1 offers and those who get stuck is community. When you join the NYC DSA Arena, you step into an ecosystem of ambitious builders.
                </p>
              </div>

              <div className="community-pillars-grid">
                <div className="community-pillar-box">
                  <div className="cpb-icon icon-users">
                    <Users size={24} />
                  </div>
                  <h4>24/7 Peer Matchmaking</h4>
                  <p>
                    Find sparring partners at your exact skill level for daily 1v1 battles, collaborative problem debriefs, and shared study roadmaps.
                  </p>
                </div>

                <div className="community-pillar-box">
                  <div className="cpb-icon icon-mentor">
                    <Shield size={24} />
                  </div>
                  <h4>Senior Engineer Guidance</h4>
                  <p>
                    Get your solutions and resumes reviewed by senior engineers from top tech companies who actively participate in discussions and office hours.
                  </p>
                </div>

                <div className="community-pillar-box">
                  <div className="cpb-icon icon-voice">
                    <Headphones size={24} />
                  </div>
                  <h4>Live Voice Coding Rooms</h4>
                  <p>
                    Hop into 24/7 drop-in voice rooms for collaborative problem solving, live screen-shares, and real mock behavioral & technical rounds.
                  </p>
                </div>

                <div className="community-pillar-box">
                  <div className="cpb-icon icon-sprints">
                    <Rocket size={24} />
                  </div>
                  <h4>Daily Sprints & Debriefs</h4>
                  <p>
                    Participate in daily problem sprints with comprehensive community discussion threads, optimal code templates, and mathematical proofs.
                  </p>
                </div>
              </div>

              <div className="community-spotlight-card">
                <div className="csc-left">
                  <div className="csc-badge">
                    <span className="csc-live-dot" />
                    <span>3,200+ ACTIVE ENGINEERS ON DISCORD</span>
                  </div>
                  <h3>Ready To Join The Most Driven Developer Community?</h3>
                  <p>
                    Stop grinding in isolation. Join thousands of developers practicing daily, finding study buddies, and cracking technical interviews together.
                  </p>
                  <div className="csc-actions">
                    <a
                      href="https://discord.gg/3NTygqWDD"
                      target="_blank"
                      rel="noreferrer"
                      className="button button-yellow csc-discord-btn"
                    >
                      <MessageSquare size={16} /> Join Discord Server ↗
                    </a>
                    <Link to="/leaderboard" className="button button-ghost csc-rank-btn">
                      <Trophy size={16} /> Check Global Standings
                    </Link>
                  </div>
                </div>

                <div className="csc-right">
                  <div className="csc-metric-card">
                    <div className="csc-metric-row">
                      <span>Daily Battles Fought</span>
                      <b>1,420+</b>
                    </div>
                    <div className="csc-metric-row">
                      <span>Average Response Time</span>
                      <b>&lt; 4 mins</b>
                    </div>
                    <div className="csc-metric-row">
                      <span>Mock Interviews Hosted</span>
                      <b>850+</b>
                    </div>
                    <div className="csc-metric-row">
                      <span>Access Fee</span>
                      <b className="text-green">100% Free</b>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =================================================================
              DEDICATED CONTACT US VIEW (When ?view=contact clicked)
              ================================================================= */}
          {view === "contact" && (
            <section className="contact-section standalone-view">
              <div className="contact-card-wrap">
                <div className="contact-info">
                  <p className="eyebrow">GET IN TOUCH</p>
                  <h2>Contact Not Your College</h2>
                  <p>
                    Have a question about contest sponsorships, university campus
                    chapters, or platform feature requests? Drop us a message.
                  </p>
                  <div className="contact-channels">
                    <div className="channel-item">
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={15} /> Headquarters:
                      </b>
                      <span>NYC DSA Arena · New Delhi & Global</span>
                    </div>
                    <div className="channel-item">
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Mail size={15} /> Direct Email:
                      </b>
                      <span>arena@notyourcollege.com</span>
                    </div>
                    <div className="channel-item">
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <MessageSquare size={15} /> Community Discord:
                      </b>
                      <a
                        href="https://discord.gg/3NTygqWDD"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#1742e8", fontWeight: 800, textDecoration: "underline" }}
                      >
                        discord.gg/3NTygqWDD ↗
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-form-side">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Thank you for reaching out! We will get back to you shortly.");
                    }}
                  >
                    <div className="form-group-home">
                      <label>Your Name:</label>
                      <input type="text" placeholder="e.g. Alex Rivera" required />
                    </div>
                    <div className="form-group-home">
                      <label>Your Email:</label>
                      <input type="email" placeholder="alex@domain.com" required />
                    </div>
                    <div className="form-group-home">
                      <label>Subject / Topic:</label>
                      <select>
                        <option>General Inquiry</option>
                        <option>Contest & Campus Partnership</option>
                        <option>Problem Vault Feedback</option>
                        <option>Bug / Security Report</option>
                      </select>
                    </div>
                    <div className="form-group-home">
                      <label>Message:</label>
                      <textarea rows={3} placeholder="How can we help you conquer DSA?" required />
                    </div>
                    <button type="submit" className="button button-yellow send-msg-btn">
                      Send Message ↗
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )}
        </main>
      </PublicFrame>
    </div>
  );
}
