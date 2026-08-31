import React from "react";
import { useParams } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Calendar,
  Award,
  Shield,
  Code2
} from "lucide-react";
import { useDemoAuth } from "../store/demoAuthStore.js";
import { useArenaStore } from "../store/arenaStore.js";
import { PROBLEMS } from "../data/problemsData.js";
import "./ProfilePage.css";

const RATING_HISTORY_DATA = [
  { match: "M1", rating: 1200 },
  { match: "M2", rating: 1235 },
  { match: "M3", rating: 1220 },
  { match: "M4", rating: 1260 },
  { match: "M5", rating: 1295 },
  { match: "M6", rating: 1280 },
  { match: "M7", rating: 1320 },
  { match: "M8", rating: 1340 }
];

export function ProfilePage() {
  const { username } = useParams();
  const { user } = useDemoAuth();
  const {
    userXP,
    userRating,
    streakDays,
    solvedProblemSlugs,
    claimedAchievements
  } = useArenaStore();

  const displayUser = username || user?.username || "arena_user";
  const solvedCount = solvedProblemSlugs.length;

  const easySolved = PROBLEMS.filter(
    (p) => p.difficulty === "Easy" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const medSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Medium" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const hardSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Hard" && solvedProblemSlugs.includes(p.slug)
  ).length;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <section className="profile-hero">
        <div className="ph-left">
          <div className="ph-avatar">
            <span>{displayUser.slice(0, 1).toUpperCase()}</span>
          </div>
          <div className="ph-info">
            <span className="ph-eyebrow">NYC DSA ARENA PROFILE</span>
            <h1>@{displayUser}</h1>
            <p className="ph-bio">
              Software Engineer practicing daily data structures and competitive
              algorithmic duels in the Arena.
            </p>
            <div className="ph-tags">
              <span className="rank-tag">
                <Shield size={13} /> Gold Rank ({userRating} PTS)
              </span>
              <span className="streak-tag">
                <Flame size={13} /> {streakDays} Days Streak
              </span>
            </div>
          </div>
        </div>

        <div className="ph-stats-cluster">
          <div className="stat-brick">
            <span>TOTAL SOLVED</span>
            <b>{solvedCount}</b>
          </div>
          <div className="stat-brick">
            <span>ARENA RATING</span>
            <b>{userRating}</b>
          </div>
          <div className="stat-brick">
            <span>TOTAL XP</span>
            <b>{userXP}</b>
          </div>
        </div>
      </section>

      {/* Grid: Rating Chart + Solved Distribution */}
      <div className="profile-grid">
        {/* Rating Progression Chart */}
        <div className="prof-card chart-card">
          <div className="prof-card-head">
            <span className="card-title">
              <Trophy size={16} /> Rating Progression Over Matches
            </span>
            <span className="current-elo">Current: {userRating} PTS</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={RATING_HISTORY_DATA}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1742e8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1742e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="match" stroke="#64748b" fontSize={12} />
                <YAxis domain={["dataMin - 50", "dataMax + 50"]} stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#0d0f17",
                    border: "1px solid #22293a",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "12px"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="#1742e8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRating)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Solved Problems Breakdown */}
        <div className="prof-card">
          <div className="prof-card-head">
            <span className="card-title">
              <CheckCircle2 size={16} /> Solved Breakdown
            </span>
            <b>{solvedCount} / {PROBLEMS.length} Solved</b>
          </div>

          <div className="prof-dist-bars">
            <div className="dist-item">
              <div className="dist-top">
                <span className="text-easy">Easy</span>
                <b>{easySolved} / 4</b>
              </div>
              <div className="dist-bar">
                <div
                  className="dist-fill fill-easy"
                  style={{ width: `${(easySolved / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="dist-item">
              <div className="dist-top">
                <span className="text-medium">Medium</span>
                <b>{medSolved} / 4</b>
              </div>
              <div className="dist-bar">
                <div
                  className="dist-fill fill-medium"
                  style={{ width: `${(medSolved / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="dist-item">
              <div className="dist-top">
                <span className="text-hard">Hard</span>
                <b>{hardSolved} / 1</b>
              </div>
              <div className="dist-bar">
                <div
                  className="dist-fill fill-hard"
                  style={{ width: `${(hardSolved / 1) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="badges-mini-showcase">
            <span className="bm-label">Claimed Badges:</span>
            <div className="bm-icons">
              {claimedAchievements.map((b) => (
                <span className="bm-badge" key={b}>
                  🏆 {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
