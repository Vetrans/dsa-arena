import React from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Zap,
  Trophy,
  Swords,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  BookOpen,
  Calendar
} from "lucide-react";
import { useDemoAuth } from "../store/demoAuthStore.js";
import { useArenaStore } from "../store/arenaStore.js";
import { PROBLEMS } from "../data/problemsData.js";
import "./DashboardPage.css";

export function DashboardPage() {
  const { user } = useDemoAuth();
  const {
    userXP,
    userRating,
    streakDays,
    solvedProblemSlugs,
    submissions
  } = useArenaStore();

  // Level math: Level 1 (0-200), Level 2 (201-500), Level 3 (501-1000)
  const currentLevel = Math.floor(userXP / 250) + 1;
  const levelXPFloor = (currentLevel - 1) * 250;
  const levelXPCeil = currentLevel * 250;
  const progressInLevel = Math.min(
    100,
    Math.round(((userXP - levelXPFloor) / 250) * 100)
  );

  const solvedCount = solvedProblemSlugs.length;
  const totalProblems = PROBLEMS.length;

  const easySolved = PROBLEMS.filter(
    (p) => p.difficulty === "Easy" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const medSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Medium" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const hardSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Hard" && solvedProblemSlugs.includes(p.slug)
  ).length;

  // Recommendations: problems not solved yet
  const recommendations = PROBLEMS.filter(
    (p) => !solvedProblemSlugs.includes(p.slug)
  ).slice(0, 3);

  // 30-day simulated activity matrix
  const activityDays = Array.from({ length: 30 }, (_, i) => {
    const isRecent = i >= 23; // last 7 days active
    return {
      day: i + 1,
      active: isRecent || i % 4 === 0,
      count: isRecent ? Math.floor(Math.random() * 3 + 1) : i % 4 === 0 ? 1 : 0
    };
  });

  return (
    <div className="dashboard-page">
      {/* Top Welcome / Hero Banner */}
      <section className="dashboard-hero">
        <div className="user-profile-summary">
          <div className="avatar-box">🗽</div>
          <div className="profile-details">
            <div className="welcome-tag">WELCOME BACK, ARENA WARRIOR</div>
            <h1>@{user?.username || "arena_engineer"}</h1>
            <p className="rank-title">
              Level {currentLevel} · {userRating >= 1300 ? "Gold Competitor" : "Silver Contender"}
            </p>
          </div>
        </div>

        <div className="hero-stat-cards">
          <div className="stat-card streak-card">
            <div className="sc-icon">
              <Flame size={22} />
            </div>
            <div>
              <span className="sc-label">CURRENT STREAK</span>
              <b className="sc-val">{streakDays} Days</b>
            </div>
          </div>

          <div className="stat-card rating-card">
            <div className="sc-icon">
              <Trophy size={22} />
            </div>
            <div>
              <span className="sc-label">ARENA RATING</span>
              <b className="sc-val">{userRating} PTS</b>
            </div>
          </div>

          <div className="stat-card xp-card">
            <div className="sc-icon">
              <Zap size={22} />
            </div>
            <div>
              <span className="sc-label">TOTAL XP</span>
              <b className="sc-val">{userXP} XP</b>
            </div>
          </div>
        </div>
      </section>

      {/* Level XP Progress Bar */}
      <section className="level-bar-card">
        <div className="lb-header">
          <span>
            <b>Level {currentLevel}</b> Progress
          </span>
          <span>
            {userXP} / {levelXPCeil} XP ({progressInLevel}%)
          </span>
        </div>
        <div className="lb-track">
          <div className="lb-fill" style={{ width: `${progressInLevel}%` }} />
        </div>
      </section>

      {/* Main Grid: Practice Hub + Activity Heatmap */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-col-left">
          {/* Quick Action CTAs */}
          <div className="quick-actions-row">
            <Link to="/problems" className="qa-card qa-yellow">
              <div className="qa-icon">
                <Target size={24} />
              </div>
              <div>
                <b>Practice Problems</b>
                <span>Explore {totalProblems}+ curated DSA challenges</span>
              </div>
              <ArrowRight size={18} className="qa-arrow" />
            </Link>

            <Link to="/battles" className="qa-card qa-blue">
              <div className="qa-icon">
                <Swords size={24} />
              </div>
              <div>
                <b>1v1 Battle Arena</b>
                <span>Duel competitors in real-time speed coding</span>
              </div>
              <ArrowRight size={18} className="qa-arrow" />
            </Link>
          </div>

          {/* 30-Day Activity Heatmap */}
          <div className="dash-card activity-heatmap-card">
            <div className="dash-card-header">
              <span className="dch-title">
                <Calendar size={16} /> 30-Day Consistency Heatmap
              </span>
              <span className="dch-streak-badge">{streakDays} Day Active Streak 🔥</span>
            </div>
            <div className="heatmap-grid">
              {activityDays.map((d) => (
                <div
                  key={d.day}
                  className={`heatmap-cell ${d.active ? "cell-active" : ""}`}
                  title={`Day ${d.day}: ${d.count} submissions`}
                />
              ))}
            </div>
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="legend-cell" />
              <div className="legend-cell cell-active" />
              <span>More</span>
            </div>
          </div>

          {/* Recommended Next Problems */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dch-title">
                <Sparkles size={16} /> Recommended For Your Rating
              </span>
            </div>
            <div className="rec-problems-list">
              {recommendations.map((prob) => (
                <div className="rec-item" key={prob.slug}>
                  <div className="rec-left">
                    <span className="rec-num">#{prob.problemNumber}</span>
                    <div>
                      <Link to={`/problems/${prob.slug}`} className="rec-title">
                        {prob.title}
                      </Link>
                      <div className="rec-tags">
                        <span
                          className={`diff-pill diff-${prob.difficulty.toLowerCase()}`}
                        >
                          {prob.difficulty}
                        </span>
                        <span className="rec-topic">{prob.topics[0]}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/problems/${prob.slug}`}
                    className="button button-yellow rec-solve-btn"
                  >
                    Solve <b>→</b>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-col-right">
          {/* Solved Problems Breakdown */}
          <div className="dash-card solved-breakdown-card">
            <div className="dash-card-header">
              <span className="dch-title">
                <CheckCircle2 size={16} /> Problems Solved
              </span>
              <b>
                {solvedCount} / {totalProblems}
              </b>
            </div>

            <div className="breakdown-list">
              <div className="bd-row">
                <span className="text-easy">Easy</span>
                <div className="bd-bar">
                  <div
                    className="bd-fill fill-easy"
                    style={{ width: `${(easySolved / 4) * 100}%` }}
                  />
                </div>
                <b>{easySolved} / 4</b>
              </div>

              <div className="bd-row">
                <span className="text-medium">Medium</span>
                <div className="bd-bar">
                  <div
                    className="bd-fill fill-medium"
                    style={{ width: `${(medSolved / 4) * 100}%` }}
                  />
                </div>
                <b>{medSolved} / 4</b>
              </div>

              <div className="bd-row">
                <span className="text-hard">Hard</span>
                <div className="bd-bar">
                  <div
                    className="bd-fill fill-hard"
                    style={{ width: `${(hardSolved / 1) * 100}%` }}
                  />
                </div>
                <b>{hardSolved} / 1</b>
              </div>
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dch-title">Recent Submissions</span>
              <Link to="/submissions" className="see-all-link">
                View all →
              </Link>
            </div>
            <div className="recent-subs-list">
              {submissions.slice(0, 4).map((sub) => (
                <div className="recent-sub-item" key={sub.id}>
                  <div>
                    <b className="rs-title">{sub.problemTitle}</b>
                    <span className="rs-meta">
                      {sub.language} · {sub.runtime} ms
                    </span>
                  </div>
                  <span
                    className={`sub-pill sub-pill-${sub.verdict.toLowerCase()}`}
                  >
                    {sub.verdictLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap Shortcut Banner */}
          <div className="roadmap-shortcut-card">
            <BookOpen size={28} />
            <div>
              <b>Algorithm Learning Roadmap</b>
              <p>Step-by-step master path through all 18 core DSA topics.</p>
            </div>
            <Link to="/roadmap" className="button button-outline">
              Explore Roadmap →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
