import React, { useEffect, useState } from "react";
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
import { analyticsApi } from "../api/arenaApi.js";
import { apiClient } from "../api/client.js";
import { PROBLEMS } from "../data/problemsData.js";
import "./ProfilePage.css";

const getRankTitle = (rating) => {
  if (rating >= 2000) return "Master Rank";
  if (rating >= 1600) return "Platinum Rank";
  if (rating >= 1300) return "Gold Rank";
  if (rating >= 1000) return "Silver Rank";
  return "Bronze Rank";
};

export function ProfilePage() {
  const { username } = useParams();
  const { user: authUser } = useDemoAuth();
  const {
    userXP,
    userRating,
    streakDays,
    solvedProblemSlugs,
    claimedAchievements
  } = useArenaStore();

  const [remoteUser, setRemoteUser] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        if (username && username !== authUser?.username) {
          const res = await apiClient.get(`/users/${username}`);
          if (isMounted && res?.data?.user) {
            setRemoteUser(res.data.user);
          }
        } else {
          const res = await analyticsApi.getPersonalAnalytics();
          if (isMounted && res?.data) {
            if (res.data.ratingHistory) {
              setRatingHistory(res.data.ratingHistory);
            }
          }
        }
      } catch (err) {
        // Silently fall back to local store
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [username, authUser?.username]);

  const displayUser = username || remoteUser?.username || authUser?.username || "arena_user";
  const displayRating = remoteUser?.stats?.rating ?? userRating;
  const displayXP = remoteUser?.stats?.xp ?? userXP;
  const displayStreak = remoteUser?.stats?.currentStreak ?? streakDays;
  const solvedCount = remoteUser?.stats?.problemsSolved ?? solvedProblemSlugs.length;

  const easyTotal = PROBLEMS.filter((p) => p.difficulty === "Easy").length || 1;
  const medTotal = PROBLEMS.filter((p) => p.difficulty === "Medium").length || 1;
  const hardTotal = PROBLEMS.filter((p) => p.difficulty === "Hard").length || 1;

  const easySolved = PROBLEMS.filter(
    (p) => p.difficulty === "Easy" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const medSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Medium" && solvedProblemSlugs.includes(p.slug)
  ).length;
  const hardSolved = PROBLEMS.filter(
    (p) => p.difficulty === "Hard" && solvedProblemSlugs.includes(p.slug)
  ).length;

  // Dynamically constructed rating progression chart data
  const chartData = ratingHistory.length > 0
    ? ratingHistory.map((h, i) => ({
        match: `M${i + 1}`,
        rating: h.newRating || h.rating || displayRating
      }))
    : [
        { match: "Start", rating: displayRating },
        { match: "Current", rating: displayRating }
      ];

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
                <Shield size={13} /> {getRankTitle(displayRating)} ({displayRating} PTS)
              </span>
              <span className="streak-tag">
                <Flame size={13} /> {displayStreak} Days Streak
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
            <b>{displayRating}</b>
          </div>
          <div className="stat-brick">
            <span>TOTAL XP</span>
            <b>{displayXP}</b>
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
            <span className="current-elo">Current: {displayRating} PTS</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
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
                <b>{easySolved} / {easyTotal}</b>
              </div>
              <div className="dist-bar">
                <div
                  className="dist-fill fill-easy"
                  style={{ width: `${(easySolved / easyTotal) * 100}%` }}
                />
              </div>
            </div>

            <div className="dist-item">
              <div className="dist-top">
                <span className="text-medium">Medium</span>
                <b>{medSolved} / {medTotal}</b>
              </div>
              <div className="dist-bar">
                <div
                  className="dist-fill fill-medium"
                  style={{ width: `${(medSolved / medTotal) * 100}%` }}
                />
              </div>
            </div>

            <div className="dist-item">
              <div className="dist-top">
                <span className="text-hard">Hard</span>
                <b>{hardSolved} / {hardTotal}</b>
              </div>
              <div className="dist-bar">
                <div
                  className="dist-fill fill-hard"
                  style={{ width: `${(hardSolved / hardTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="badges-mini-showcase">
            <span className="bm-label">Claimed Badges:</span>
            <div className="bm-icons">
              {claimedAchievements.length === 0 ? (
                <span style={{ fontSize: "12px", color: "#64748b" }}>No badges earned yet. Solve challenges to unlock.</span>
              ) : (
                claimedAchievements.map((b) => (
                  <span className="bm-badge" key={b}>
                    🏆 {b}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
