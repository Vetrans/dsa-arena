import React from "react";
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Crown,
  Shield,
  Target,
  Medal,
  Activity
} from "lucide-react";
import { useArenaStore } from "../store/arenaStore.js";
import { PROBLEMS } from "../data/problemsData.js";
import "./AchievementsPage.css";

const ALL_ACHIEVEMENTS = [
  {
    key: "FIRST_SOLVE",
    category: "First Steps",
    name: "First Blood Solve",
    description: "Solve your very first DSA problem in the NYC Arena.",
    icon: Award,
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
    icon: Zap,
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
    icon: Shield,
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
    icon: Flame,
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
    icon: Flame,
    xp: 100,
    rarity: "Uncommon",
    target: 7,
    currentType: "streak"
  },
  {
    key: "STREAK_30",
    category: "Consistency",
    name: "Wall Street Grind",
    description: "Maintain a 30-day continuous problem solving streak.",
    icon: Activity,
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
    icon: Target,
    xp: 75,
    rarity: "Common",
    target: 10,
    currentType: "solved"
  },
  {
    key: "SOLVE_25",
    category: "Milestones",
    name: "Algorithm Adept",
    description: "Solve 25 DSA problems in the Arena.",
    icon: Medal,
    xp: 150,
    rarity: "Uncommon",
    target: 25,
    currentType: "solved"
  },
  {
    key: "RATING_1500",
    category: "Competitive",
    name: "Gold Contender",
    description: "Reach a competitive rating of 1,300+ in the Arena.",
    icon: Trophy,
    xp: 150,
    rarity: "Uncommon",
    target: 1300,
    currentType: "rating"
  },
  {
    key: "RATING_2000",
    category: "Competitive",
    name: "Diamond Mastermind",
    description: "Reach a competitive rating of 2,000+ (Master tier).",
    icon: Crown,
    xp: 500,
    rarity: "Epic",
    target: 2000,
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

  const getProgressVal = (type) => {
    if (type === "solved") return solvedProblemSlugs.length;
    if (type === "medium_solved") {
      return PROBLEMS.filter(
        (p) => p.difficulty === "Medium" && solvedProblemSlugs.includes(p.slug)
      ).length;
    }
    if (type === "hard_solved") {
      return PROBLEMS.filter(
        (p) => p.difficulty === "Hard" && solvedProblemSlugs.includes(p.slug)
      ).length;
    }
    if (type === "streak") return streakDays;
    if (type === "rating") return userRating;
    return 0;
  };

  const categories = ["First Steps", "Consistency", "Milestones", "Competitive"];

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <p className="eyebrow">ARENA REWARDS & MILESTONES</p>
        <h1>ACHIEVEMENTS & TROPHIES</h1>
        <p>Unlock trophies, level up your ranking, and claim bonus XP for your milestones.</p>
      </div>

      <div className="achievements-categories">
        {categories.map((cat) => {
          const catList = ALL_ACHIEVEMENTS.filter((a) => a.category === cat);
          return (
            <section className="ach-category-section" key={cat}>
              <h2>{cat}</h2>
              <div className="ach-grid">
                {catList.map((ach) => {
                  const current = getProgressVal(ach.currentType);
                  const isUnlocked = current >= ach.target;
                  const isClaimed = claimedAchievements.includes(ach.key);
                  const percent = Math.min(100, Math.round((current / ach.target) * 100));
                  const IconComp = ach.icon;

                  return (
                    <div
                      key={ach.key}
                      className={`ach-card ${isUnlocked ? "ach-unlocked" : "ach-locked"} ${
                        isClaimed ? "ach-claimed" : ""
                      }`}
                    >
                      <div className="ach-card-top">
                        <div className="ach-icon-box">
                          <IconComp size={24} />
                        </div>
                        <span className={`rarity-badge rarity-${ach.rarity.toLowerCase()}`}>
                          {ach.rarity}
                        </span>
                      </div>

                      <div className="ach-card-body">
                        <h3>{ach.name}</h3>
                        <p>{ach.description}</p>
                      </div>

                      <div className="ach-card-footer">
                        <div className="ach-progress-bar">
                          <div
                            className="ach-fill"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="ach-meta">
                          <span className="ach-current-target">
                            {Math.min(current, ach.target)} / {ach.target}
                          </span>
                          <span className="ach-reward-xp">+{ach.xp} XP</span>
                        </div>

                        {isUnlocked && !isClaimed && (
                          <button
                            className="claim-xp-btn"
                            onClick={() => claimAchievement(ach.key, ach.xp)}
                          >
                            <Sparkles size={13} /> Claim +{ach.xp} XP
                          </button>
                        )}
                        {isClaimed && (
                          <div className="claimed-badge">
                            <CheckCircle2 size={13} /> Claimed
                          </div>
                        )}
                        {!isUnlocked && (
                          <div className="locked-badge">
                            <Lock size={12} /> Locked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
