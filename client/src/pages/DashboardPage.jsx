import React, { useEffect, useMemo } from "react";
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
  BookOpen,
  Calendar,
  User,
  Shield,
  Clock,
  Sparkles
} from "lucide-react";
import { useDemoAuth } from "../store/demoAuthStore.js";
import { useArenaStore } from "../store/arenaStore.js";
import { analyticsApi } from "../api/arenaApi.js";
import { submissionsApi } from "../api/submissions.js";
import { PROBLEMS } from "../data/problemsData.js";
import "./DashboardPage.css";

const getDivisionTitle = (rating) => {
  if (rating >= 2000) return "Master Division";
  if (rating >= 1600) return "Platinum Division";
  if (rating >= 1300) return "Gold Division";
  if (rating >= 1000) return "Silver Division";
  return "Bronze Division";
};

export function DashboardPage() {
  const { user } = useDemoAuth();
  const {
    userXP,
    userRating,
    streakDays,
    solvedProblemSlugs,
    submissions,
    syncFromBackend
  } = useArenaStore();

  // Fetch real analytics and submissions from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      try {
        const [analyticsRes, subsRes] = await Promise.allSettled([
          analyticsApi.getPersonalAnalytics(),
          submissionsApi.getHistory({ limit: 10 })
        ]);

        if (!isMounted) return;

        const overview =
          analyticsRes.status === "fulfilled"
            ? analyticsRes.value?.data?.overview || analyticsRes.value?.overview
            : null;

        const subsData =
          subsRes.status === "fulfilled"
            ? subsRes.value?.data?.submissions || subsRes.value?.data || subsRes.value?.submissions || []
            : null;

        if (overview || subsData) {
          syncFromBackend({ overview, submissions: subsData });
        }
      } catch (err) {
        // Graceful offline fallback to current user-scoped store
      }
    }
    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [syncFromBackend]);

  // Dynamic Level math: Level 1 (0-249), Level 2 (250-499), Level 3 (500-749), etc.
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
  const easyTotal = PROBLEMS.filter((p) => p.difficulty === "Easy").length;

  const medSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Medium" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const medTotal = PROBLEMS.filter((p) => p.difficulty === "Medium").length;

  const hardSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Hard" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const hardTotal = PROBLEMS.filter((p) => p.difficulty === "Hard").length;

  // Recommendations: problems not solved yet
  const recommendations = PROBLEMS.filter(
    (p) => !solvedProblemSlugs.includes(p.slug)
  ).slice(0, 3);

  // Dynamic 30-day activity matrix calculated purely from actual submissions
  const activityDays = useMemo(() => {
    const now = new Date();
    const map = {};

    // Group actual submissions by date string (YYYY-MM-DD)
    submissions.forEach((sub) => {
      if (sub.submittedAt) {
        const d = new Date(sub.submittedAt).toISOString().split("T")[0];
        map[d] = (map[d] || 0) + 1;
      }
    });

    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (29 - i));
      const dateKey = d.toISOString().split("T")[0];
      const count = map[dateKey] || 0; // Pure dynamic count with zero fake entries
      return {
        day: i + 1,
        dateKey,
        count,
        active: count > 0
      };
    });
  }, [submissions]);

  const username = user?.username || "arena_engineer";
  const userInitial = username.slice(0, 1).toUpperCase();

  return (
    <div className="dashboard-page">
      {/* Top Welcome / Hero Banner */}
      <section className="dashboard-hero">
        <div className="user-profile-summary">
          <div className="avatar-box-pro">
            <span>{userInitial}</span>
          </div>
          <div className="profile-details">
            <div className="welcome-tag">ARENA COMPETITOR</div>
            <h1>@{username}</h1>
            <p className="rank-title">
              Level {currentLevel} · {getDivisionTitle(userRating)}
            </p>
          </div>
        </div>

        <div className="hero-stat-cards">
          <div className="stat-card streak-card">
            <div className="sc-icon">
              <Flame size={20} />
            </div>
            <div>
              <span className="sc-label">CURRENT STREAK</span>
              <b className="sc-val">{streakDays} Days</b>
            </div>
          </div>

          <div className="stat-card rating-card">
            <div className="sc-icon">
              <Trophy size={20} />
            </div>
            <div>
              <span className="sc-label">ARENA RATING</span>
              <b className="sc-val">{userRating} PTS</b>
            </div>
          </div>

          <div className="stat-card xp-card">
            <div className="sc-icon">
              <Zap size={20} />
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

      {/* Main Multi-Column Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Quick Actions & Heatmap */}
        <div className="dash-col-left">
          {/* Quick Action Tiles */}
          <div className="dash-actions-row">
            <Link to="/problems" className="dash-action-card">
              <div className="dac-icon dac-icon-yellow">
                <Target size={22} />
              </div>
              <div className="dac-text">
                <h3>Problem Catalog</h3>
                <p>Explore algorithmic challenges</p>
              </div>
              <ArrowRight size={16} className="dac-arrow" />
            </Link>

            <Link to="/battles" className="dash-action-card">
              <div className="dac-icon dac-icon-blue">
                <Swords size={22} />
              </div>
              <div className="dac-text">
                <h3>1v1 Duel Arena</h3>
                <p>Speed-code vs rival engineers</p>
              </div>
              <ArrowRight size={16} className="dac-arrow" />
            </Link>
          </div>

          {/* 30-Day Activity Heatmap */}
          <div className="heatmap-card">
            <div className="heatmap-header">
              <div className="heatmap-title">
                <Calendar size={16} />
                <h3>30-Day Activity Heatmap</h3>
              </div>
              <span className="streak-badge">
                <Flame size={13} /> {streakDays} Day Active Streak
              </span>
            </div>

            <div className="heatmap-grid">
              {activityDays.map((item) => (
                <div
                  key={item.day}
                  className={`heatmap-cell ${
                    item.count >= 2
                      ? "heat-high"
                      : item.count === 1
                      ? "heat-medium"
                      : "heat-empty"
                  }`}
                  title={`${item.dateKey}: ${item.count} activity records`}
                />
              ))}
            </div>

            <div className="heatmap-legend">
              <span>Less</span>
              <div className="legend-cell heat-empty" />
              <div className="legend-cell heat-medium" />
              <div className="legend-cell heat-high" />
              <span>More</span>
            </div>
          </div>

          {/* Recommended Next Problems */}
          <div className="recommendations-card">
            <div className="rec-header">
              <BookOpen size={16} />
              <h3>Recommended Next Steps</h3>
            </div>
            <div className="rec-list">
              {recommendations.map((prob) => (
                <Link
                  to={`/problems/${prob.slug}`}
                  key={prob.slug}
                  className="rec-item"
                >
                  <div className="rec-info">
                    <b>#{prob.problemNumber} {prob.title}</b>
                    <div className="rec-meta">
                      <span className={`diff-pill diff-${prob.difficulty.toLowerCase()}`}>
                        {prob.difficulty}
                      </span>
                      <span>+{prob.rewards?.xp || 20} XP</span>
                    </div>
                  </div>
                  <span className="rec-solve-link">
                    Solve <ArrowRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Solved Breakdown & Recent Activity */}
        <div className="dash-col-right">
          {/* Solved Problems Gauge */}
          <div className="dash-panel solved-breakdown-card">
            <div className="panel-head">
              <h3>Solved Breakdown</h3>
              <b className="total-solved-num">
                {solvedCount} / {totalProblems}
              </b>
            </div>

            <div className="difficulty-bars">
              <div className="diff-bar-item">
                <div className="dbi-label">
                  <span className="diff-text text-easy">Easy</span>
                  <b>{easySolved} / {easyTotal}</b>
                </div>
                <div className="dbi-track">
                  <div
                    className="dbi-fill fill-easy"
                    style={{
                      width: `${easyTotal ? (easySolved / easyTotal) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div className="diff-bar-item">
                <div className="dbi-label">
                  <span className="diff-text text-medium">Medium</span>
                  <b>{medSolved} / {medTotal}</b>
                </div>
                <div className="dbi-track">
                  <div
                    className="dbi-fill fill-medium"
                    style={{
                      width: `${medTotal ? (medSolved / medTotal) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div className="diff-bar-item">
                <div className="dbi-label">
                  <span className="diff-text text-hard">Hard</span>
                  <b>{hardSolved} / {hardTotal}</b>
                </div>
                <div className="dbi-track">
                  <div
                    className="dbi-fill fill-hard"
                    style={{
                      width: `${hardTotal ? (hardSolved / hardTotal) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="dash-panel recent-subs-card">
            <div className="panel-head">
              <h3>Recent Submissions</h3>
              <Link to="/submissions" className="see-all-link">
                View All →
              </Link>
            </div>

            {submissions.length === 0 ? (
              <p className="empty-subs-msg">No submissions recorded yet.</p>
            ) : (
              <div className="mini-subs-list">
                {submissions.slice(0, 4).map((sub) => (
                  <div key={sub.id} className="mini-sub-item">
                    <div>
                      <b>{sub.problemTitle}</b>
                      <span className="mini-sub-meta">
                        {sub.language} · {sub.runtime} ms
                      </span>
                    </div>
                    <span
                      className={`mini-verdict verdict-${sub.verdict.toLowerCase()}`}
                    >
                      {sub.verdictLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
