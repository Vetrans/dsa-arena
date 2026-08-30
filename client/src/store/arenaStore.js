import { create } from "zustand";

const STORAGE_KEY = "nyc_arena_state_v1";

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return {
    solvedProblemSlugs: ["two-sum"],
    attemptedProblemSlugs: ["two-sum", "valid-parentheses", "maximum-subarray"],
    userXP: 380,
    userRating: 1340,
    streakDays: 7,
    lastActiveDate: new Date().toISOString().split("T")[0],
    unlockedHints: { "two-sum": [1] },
    codeDrafts: {},
    submissions: [
      {
        id: "sub_1",
        problemSlug: "two-sum",
        problemTitle: "Two Sum",
        verdict: "ACCEPTED",
        verdictLabel: "Accepted",
        language: "javascript",
        runtime: 48,
        memory: 42.1,
        submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
      }
    ],
    claimedAchievements: ["FIRST_SOLVE", "STREAK_3"]
  };
};

export const useArenaStore = create((set, get) => ({
  ...getInitialState(),

  saveDraftCode: (slug, language, code) => {
    set((state) => {
      const updatedDrafts = {
        ...state.codeDrafts,
        [`${slug}_${language}`]: code
      };
      const nextState = { ...state, codeDrafts: updatedDrafts };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  },

  getDraftCode: (slug, language) => {
    const drafts = get().codeDrafts || {};
    return drafts[`${slug}_${language}`] || null;
  },

  unlockHint: (slug, order) => {
    set((state) => {
      const current = state.unlockedHints[slug] || [];
      if (current.includes(order)) return state;
      const updated = {
        ...state.unlockedHints,
        [slug]: [...current, order]
      };
      const nextState = { ...state, unlockedHints: updated };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  },

  recordSubmission: ({
    problemSlug,
    problemTitle,
    verdict,
    verdictLabel,
    language,
    runtime,
    memory,
    code,
    xpReward = 0,
    ratingReward = 0
  }) => {
    set((state) => {
      const isAC = verdict === "ACCEPTED";
      const isFirstSolve =
        isAC && !state.solvedProblemSlugs.includes(problemSlug);

      const updatedSolved = isFirstSolve
        ? [...state.solvedProblemSlugs, problemSlug]
        : state.solvedProblemSlugs;

      const updatedAttempted = state.attemptedProblemSlugs.includes(problemSlug)
        ? state.attemptedProblemSlugs
        : [...state.attemptedProblemSlugs, problemSlug];

      const newSubmission = {
        id: `sub_${Date.now()}`,
        problemSlug,
        problemTitle,
        verdict,
        verdictLabel,
        language,
        runtime,
        memory,
        submittedAt: new Date().toISOString(),
        code
      };

      const nextState = {
        ...state,
        solvedProblemSlugs: updatedSolved,
        attemptedProblemSlugs: updatedAttempted,
        userXP: state.userXP + (isFirstSolve ? xpReward : 5),
        userRating: state.userRating + (isFirstSolve ? ratingReward : 0),
        submissions: [newSubmission, ...state.submissions]
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  },

  updateRating: (delta) => {
    set((state) => {
      const nextRating = Math.max(800, state.userRating + delta);
      const nextState = { ...state, userRating: nextRating };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  },

  claimAchievement: (achievementKey, xpValue) => {
    set((state) => {
      if (state.claimedAchievements.includes(achievementKey)) return state;
      const nextState = {
        ...state,
        userXP: state.userXP + xpValue,
        claimedAchievements: [...state.claimedAchievements, achievementKey]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  }
}));
