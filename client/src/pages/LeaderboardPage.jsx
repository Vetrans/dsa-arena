import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../components/app/Pagination.jsx";
import { PublicFrame } from "../components/app/PublicHeader.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useDemoAuth } from "../store/demoAuthStore.js";
import { leaderboardApi } from "../api/arenaApi.js";
import { Trophy, TrendingUp, Zap, CheckCircle2, Flame, Loader2 } from "lucide-react";

const tabs = [
  {
    id: "rating",
    label: "Global Rating",
    metric: "rating",
    unit: "Rating",
    delta: "Tier",
  },
  {
    id: "xp",
    label: "Total XP",
    metric: "xp",
    unit: "XP Earned",
    delta: "Level",
  },
  {
    id: "problems_solved",
    label: "Problems Solved",
    metric: "problems_solved",
    unit: "Solved",
    delta: "Streak",
  },
  {
    id: "streak",
    label: "Daily Streak",
    metric: "streak",
    unit: "Days",
    delta: "Status",
  }
];

export function LeaderboardPage() {
  const [tab, setTab] = useState(tabs[0]);
  const [page, setPage] = useState(1);
  const [rankings, setRankings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const root = useReveal();

  const { user } = useDemoAuth();

  useEffect(() => {
    let isMounted = true;
    async function fetchLeaderboardData() {
      setIsLoading(true);
      try {
        const res = await leaderboardApi.getLeaderboard({
          metric: tab.metric,
          page,
          limit: 10
        });

        if (isMounted && res) {
          const list = res.data || [];
          setRankings(list);
          setTotalPages(res.pages || 1);
          setTotalCount(res.total || list.length);
          if (res.currentUserRank) {
            setCurrentUserRank(res.currentUserRank);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic leaderboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLeaderboardData();
    return () => {
      isMounted = false;
    };
  }, [tab.metric, page]);

  const chooseTab = (next) => {
    setTab(next);
    setPage(1);
  };

  const getMetricValue = (player) => {
    const stats = player.stats || {};
    if (tab.id === "rating") return stats.rating || 1200;
    if (tab.id === "xp") return stats.xp || 0;
    if (tab.id === "problems_solved") return stats.problemsSolved || 0;
    if (tab.id === "streak") return stats.currentStreak || 0;
    return 0;
  };

  const getDeltaValue = (player) => {
    const stats = player.stats || {};
    if (tab.id === "rating") return stats.rank || "Novice";
    if (tab.id === "xp") return `Lvl ${stats.level || 1}`;
    if (tab.id === "problems_solved") return `${stats.currentStreak || 0}d Streak`;
    if (tab.id === "streak") return stats.currentStreak > 0 ? "🔥 Active" : "Inactive";
    return "";
  };

  return (
    <PublicFrame>
      <section ref={root} className="screen-page">
        <div data-reveal className="page-heading">
          <p className="eyebrow">NYC DSA ARENA</p>
          <h1>Live Leaderboard</h1>
          <p>
            Real-time global competitive ratings, solved milestones, and live standings calculated from actual arena submissions.
          </p>
        </div>

        <div data-reveal className="tabs" role="tablist">
          {tabs.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab.id === item.id}
              className={tab.id === item.id ? "selected" : ""}
              onClick={() => chooseTab(item)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div data-reveal className="board">
          <div className="board-row board-head">
            <span>Rank</span>
            <span>Player</span>
            <span>{tab.unit}</span>
            <span>{tab.delta}</span>
          </div>

          {isLoading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary, #a1a1aa)" }}>
              <Loader2 className="animate-spin" size={24} style={{ display: "inline-block", marginRight: "8px", verticalAlign: "middle" }} />
              Loading live arena rankings...
            </div>
          ) : rankings.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary, #a1a1aa)" }}>
              No registered contenders yet for this metric. Start solving to claim rank #1!
            </div>
          ) : (
            rankings.map((player) => {
              const isCurrentUser = user && (user.id === player._id || user.username?.toLowerCase() === player.username?.toLowerCase());
              const displayName = player.displayName || player.username;
              const val = getMetricValue(player);
              const detail = getDeltaValue(player);

              return (
                <Link
                  className={`board-row ${isCurrentUser ? "current-user-row" : ""}`}
                  to={`/profile/${player.username?.toLowerCase()}`}
                  key={player._id || player.username}
                >
                  <strong>{String(player.rank).padStart(2, "0")}</strong>
                  <span>
                    <i className="avatar-initial">{(displayName || "U").slice(0, 1).toUpperCase()}</i>
                    {displayName}
                    {isCurrentUser && <span className="you-pill">YOU</span>}
                  </span>
                  <b>{val.toLocaleString()}</b>
                  <em>{detail}</em>
                </Link>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <Pagination page={page} total={totalPages} onChange={setPage} />
        )}
      </section>
    </PublicFrame>
  );
}
