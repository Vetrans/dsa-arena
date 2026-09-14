import { create } from "zustand";
import { get, set as idbSet } from "idb-keyval";

export const getEmptyState = () => ({
  solvedProblemSlugs: [],
  attemptedProblemSlugs: [],
  userXP: 0,
  userRating: 1200,
  streakDays: 0,
  lastActiveDate: null,
  unlockedHints: {},
  codeDrafts: {},
  submissions: [],
  claimedAchievements: []
});

const getCurrentUserId = () => {
  try {
    const userJson = localStorage.getItem("nyc-arena-user");
    if (userJson) {
      const u = JSON.parse(userJson);
      return u?.id || u?._id || u?.username || null;
    }
  } catch {
    // fallback
  }
  return null;
};

const getUserStorageKey = (userId) => {
  if (!userId) return "nyc_arena_state_guest";
  return `nyc_arena_state_${userId}`;
};

const getInitialState = (userId = getCurrentUserId()) => {
  // Purge legacy shared key to eliminate leaked mock data
  try {
    localStorage.removeItem("nyc_arena_state_v1");
  } catch {}

  const key = getUserStorageKey(userId);
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return getEmptyState();
};

const persistState = (state) => {
  const userId = getCurrentUserId();
  const key = getUserStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Quota or access error
  }
};

export const useArenaStore = create((set, storeGet) => ({
  ...getInitialState(),

  // Switch context when user logs in, registers, or switches accounts
  setUser: (user) => {
    const userId = user?.id || user?._id || user?.username || null;
    const userKey = getUserStorageKey(userId);
    let stateForUser = getEmptyState();

    try {
      const saved = localStorage.getItem(userKey);
      if (saved) {
        stateForUser = { ...stateForUser, ...JSON.parse(saved) };
      } else if (user?.stats) {
        // Initialize with user stats from profile if no cached local state
        stateForUser.userXP = user.stats.xp ?? 0;
        stateForUser.userRating = user.stats.rating ?? 1200;
        stateForUser.streakDays = user.stats.currentStreak ?? 0;
      }
    } catch {}

    set(() => stateForUser);
  },

  // Reset to clean state when user logs out
  resetForUser: () => {
    set(() => getEmptyState());
  },

  // Sync real-time data from backend analytics & submissions API
  syncFromBackend: ({ overview, submissions }) => {
    set((state) => {
      const nextState = { ...state };
      if (overview) {
        if (typeof overview.rating === "number") nextState.userRating = overview.rating;
        if (typeof overview.xp === "number") nextState.userXP = overview.xp;
        if (typeof overview.currentStreak === "number") nextState.streakDays = overview.currentStreak;
      }
      if (Array.isArray(submissions) && submissions.length > 0) {
        // Format backend submissions to match store schema
        const normalized = submissions.map((s) => ({
          id: s._id || s.id,
          problemSlug: s.problemId?.slug || s.problemSlug || "unknown",
          problemTitle: s.problemId?.title || s.problemTitle || "Algorithmic Challenge",
          verdict: s.status || s.verdict,
          verdictLabel: s.status === "ACCEPTED" ? "Accepted" : s.status?.replace(/_/g, " ") || "Executed",
          language: s.language || "javascript",
          runtime: s.runtimeMs || s.runtime || 0,
          memory: s.memoryKb ? Math.round(s.memoryKb / 1024) : s.memory || 0,
          submittedAt: s.createdAt || s.submittedAt,
          code: s.code || ""
        }));

        nextState.submissions = normalized;

        // Extract solved problem slugs from accepted submissions
        const solvedFromSubs = normalized
          .filter((s) => s.verdict === "ACCEPTED")
          .map((s) => s.problemSlug);
        nextState.solvedProblemSlugs = Array.from(
          new Set([...nextState.solvedProblemSlugs, ...solvedFromSubs])
        );
      }
      persistState(nextState);
      return nextState;
    });
  },

  // Asynchronous IndexedDB + In-Memory cache sync
  saveDraftCode: async (slug, language, code) => {
    const draftKey = `${slug}_${language}`;
    // Save to IndexedDB asynchronously without blocking UI
    try {
      await idbSet(`draft_${draftKey}`, code);
    } catch {
      // IndexedDB fallback
    }

    set((state) => {
      const updatedDrafts = {
        ...state.codeDrafts,
        [draftKey]: code
      };
      const nextState = { ...state, codeDrafts: updatedDrafts };
      persistState(nextState);
      return nextState;
    });
  },

  getDraftCode: (slug, language) => {
    const drafts = storeGet().codeDrafts || {};
    return drafts[`${slug}_${language}`] || null;
  },

  // Async hydrate from IndexedDB if in-memory draft is empty
  loadDraftFromIDB: async (slug, language) => {
    try {
      const draftKey = `${slug}_${language}`;
      const savedCode = await get(`draft_${draftKey}`);
      if (savedCode) {
        set((state) => ({
          codeDrafts: {
            ...state.codeDrafts,
            [draftKey]: savedCode
          }
        }));
        return savedCode;
      }
    } catch {
      // Ignore idb errors
    }
    return null;
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
      persistState(nextState);
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

      persistState(nextState);
      return nextState;
    });
  },

  updateRating: (delta) => {
    set((state) => {
      const nextRating = Math.max(800, state.userRating + delta);
      const nextState = { ...state, userRating: nextRating };
      persistState(nextState);
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
      persistState(nextState);
      return nextState;
    });
  }
}));
