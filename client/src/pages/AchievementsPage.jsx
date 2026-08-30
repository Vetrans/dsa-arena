import React from "react";
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Crown
} from "lucide-react";
import { useArenaStore } from "../store/arenaStore.js";
import "./AchievementsPage.css";

const ALL_ACHIEVEMENTS = [
  {
    key: "FIRST_SOLVE",
    category: "First Steps",
    name: "First Blood Solve",
    description: "Solve your very first DSA problem in the NYC Arena.",
    icon: "⚔️",
    xp: 25,
    rarity: "Common",
    target: 1,
    currentType: "solved"
  },
  {
    key: "FIRST_MEDIUM",
    category: "First Steps",
    name: "Stepping Up",
    description: "Conquer your first Medium difficulty algorithmic challenge.",
    icon: "⚡",
    xp: 50,
    rarity: "Uncommon",
    target: 1,
    currentType: "medium_solved"
  },
  {
    key: "FIRST_HARD",
    category: "First Steps",
    name: "NYC Titan",
    description: "Conquer a Hard difficulty problem in the Arena.",
    icon: "🛡️",
    xp: 100,
    rarity: "Rare",
    target: 1,
    currentType: "hard_solved"
  },
  {
    key: "STREAK_3",
    category: "Consistency",
    name: "Subway Regular",
    description: "Maintain a 3-day problem solving streak.",
    icon: "🚇",
    xp: 30,
    rarity: "Common",
    target: 3,
    currentType: "streak"
  },
  {
    key: "STREAK_7",
    category: "Consistency",
    name: "Empire State Habit",
    description: "Maintain a 7-day problem solving streak.",
    icon: "🔥",
    xp: 100,
    rarity: "Uncommon",
    target: 7,
    currentType: "streak"
  },
  {
    key: "STREAK_30",
    category: "Consistency",
    name: "Wall Street Grind",
    description: "Maintain a 30-day continuous solving streak.",
    icon: "💎",
    xp: 500,
    rarity: "Epic",
    target: 30,
    currentType: "streak"
  },
  {
    key: "SOLVE_10",
    category: "Milestones",
    name: "Problem Initiate",
    description: "Solve 10 DSA problems in the Arena.",
    icon: "🎯",
    xp: 75,
    rarity: "Common",
    target: 10,
    currentType: "solved"
  },
  {
    key: "RATING_1300",
    category: "Competitive",
    name: "Gold Contender",
    description: "Reach a competitive rating of 1,300+ in Arena duels.",
    icon: "🥇",
    xp: 150,
    rarity: "Uncommon",
    target: 1300,
    currentType: "rating"
  }
];

export function AchievementsPage() {
  const {
    userXP,
    userRating,
    streakDays,
    solvedProblemSlugs,
    claimedAchievements,
    claimAchievement
  } = useArenaStore();

  const getProgress = (ach) => {
    if (ach.currentType === "solved") return solvedProblemSlugs.length;
    if (ach.currentType === "streak") return streakDays;
    if (ach.currentType === "rating") return userRating;
    return 0;
  };

  const categories = ["First Steps", "Consistency", "Milestones", "Competitive"];

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <p className="eyebrow">ARENA REWARDS & TROPHIES</p>
        <h1>ACHIEVEMENTS SHOWCASE</h1>
        <p>Unlock badges, conquer milestones, and claim bonus XP as you advance.</p>
      </div>

      <div className="achievements-categories">
        {categories.map((cat) => (
          <section className="ach-category-section" key={cat}>
            <h2 className="cat-title">{cat}</h2>
            <div className="ach-cards-grid">
              {ALL_ACHIEVEMENTS.filter((a) => a.category === cat).map((ach) => {
                const currentVal = getProgress(ach);
                const isCompleted = currentVal >= ach.target;
                const isClaimed = claimedAchievements.includes(ach.key);
                const progressPct = Math.min(
                  100,
                  Math.round((currentVal / ach.target) * 100)
                );

                return (
                  <div
                    className={`ach-card ${
                      isCompleted ? "ach-completed" : "ach-locked"
                    }`}
                    key={ach.key}
                  >
                    <div className="ach-top">
                      <span className="ach-icon">{ach.icon}</span>
                      <span className={`rarity-tag rarity-${ach.rarity.toLowerCase()}`}>
                        {ach.rarity}
                      </span>
                    </div>

                    <h3>{ach.name}</h3>
                    <p className="ach-desc">{ach.description}</p>

                    <div className="ach-progress-bar">
                      <div
                        className="ach-fill"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="ach-progress-text">
                      <span>Progress</span>
                      <b>
                        {currentVal} / {ach.target}
                      </b>
                    </div>

                    <div className="ach-bottom">
                      <span className="ach-reward">+{ach.xp} XP</span>
                      {isClaimed ? (
                        <span className="claimed-badge">
                          <CheckCircle2 size={13} /> Claimed
                        </span>
                      ) : isCompleted ? (
                        <button
                          className="claim-btn"
                          onClick={() => claimAchievement(ach.key, ach.xp)}
                        >
                          <Zap size={13} /> Claim Reward
                        </button>
                      ) : (
                        <span className="locked-badge">
                          <Lock size={12} /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
