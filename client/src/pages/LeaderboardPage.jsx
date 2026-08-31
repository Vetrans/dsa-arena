import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../components/app/Pagination.jsx";
import { PublicFrame } from "../components/app/PublicHeader.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useDemoAuth } from "../store/demoAuthStore.js";
import { useArenaStore } from "../store/arenaStore.js";
import { Trophy, TrendingUp, Zap, CheckCircle2 } from "lucide-react";

const BASE_PLAYERS = [
  { name: "Aarav Shah", rating: 2113, xp: 2850, solved: 178, change: 38 },
  { name: "Meera Iyer", rating: 2058, xp: 3180, solved: 191, change: 26 },
  { name: "Rohan Kapoor", rating: 1994, xp: 2660, solved: 169, change: 18 },
  { name: "Ishita Jain", rating: 1937, xp: 3510, solved: 204, change: 31 },
  { name: "Dev Malhotra", rating: 1879, xp: 2210, solved: 154, change: 14 },
  { name: "Sara Khan", rating: 1826, xp: 2930, solved: 183, change: 22 },
  { name: "Kabir Singh", rating: 1773, xp: 2450, solved: 161, change: 17 },
  { name: "Anaya Rao", rating: 1718, xp: 3380, solved: 199, change: 29 },
  { name: "Arjun Gupta", rating: 1662, xp: 2040, solved: 146, change: 11 },
  { name: "Zoya Ali", rating: 1604, xp: 2760, solved: 175, change: 20 },
  { name: "Vihaan Das", rating: 1548, xp: 2380, solved: 158, change: 15 },
  { name: "Tanya Bose", rating: 1491, xp: 3090, solved: 188, change: 25 },
];

const tabs = [
  {
    id: "rating",
    label: "Global Rating",
    field: "rating",
    unit: "Rating",
    delta: "Change",
  },
  {
    id: "xp",
    label: "Weekly XP",
    field: "xp",
    unit: "XP Earned",
    delta: "This Week",
  },
  {
    id: "solved",
    label: "Problems Solved",
    field: "solved",
    unit: "Solved",
    delta: "Streak",
  },
];

export function LeaderboardPage() {
  const [tab, setTab] = useState(tabs[0]);
  const [page, setPage] = useState(1);
  const root = useReveal();

  const { user } = useDemoAuth();
  const { userRating, userXP, solvedProblemSlugs, streakDays } = useArenaStore();

  // Combine live user with base leaderboard dynamically
  const dynamicPlayers = useMemo(() => {
    const list = [...BASE_PLAYERS];
    if (user?.username) {
      const existingIdx = list.findIndex(
        (p) => p.name.toLowerCase() === user.username.toLowerCase()
      );
      const userEntry = {
        name: user.username,
        rating: userRating,
        xp: userXP,
        solved: solvedProblemSlugs.length,
        change: 25,
        isCurrentUser: true,
      };
      if (existingIdx !== -1) {
        list[existingIdx] = userEntry;
      } else {
        list.push(userEntry);
      }
    }
    return list;
  }, [user, userRating, userXP, solvedProblemSlugs]);

  const sorted = useMemo(
    () => [...dynamicPlayers].sort((a, b) => b[tab.field] - a[tab.field]),
    [dynamicPlayers, tab]
  );

  const PAGE_SIZE = 8;
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE) || 1;
  const rows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const chooseTab = (next) => {
    setTab(next);
    setPage(1);
  };

  return (
    <PublicFrame>
      <section ref={root} className="screen-page">
        <div data-reveal className="page-heading">
          <p className="eyebrow">NYC DSA ARENA</p>
          <h1>Leaderboard</h1>
          <p>
            Real-time global competitive ratings, solved milestones, and weekly XP standings.
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
          {rows.map((player, index) => {
            const rank = (page - 1) * PAGE_SIZE + index + 1;
            const detail =
              tab.id === "solved"
                ? `${Math.max(1, streakDays || 3)} Days`
                : tab.id === "xp"
                ? `+${player.xp}`
                : `+${player.change}`;

            return (
              <Link
                className={`board-row ${player.isCurrentUser ? "current-user-row" : ""}`}
                to={`/profile/${player.name.toLowerCase().replace(/\s+/g, "_")}`}
                key={player.name}
              >
                <strong>{String(rank).padStart(2, "0")}</strong>
                <span>
                  <i className="avatar-initial">{player.name.slice(0, 1).toUpperCase()}</i>
                  {player.name}
                  {player.isCurrentUser && <span className="you-pill">YOU</span>}
                </span>
                <b>{player[tab.field].toLocaleString()}</b>
                <em>{detail}</em>
              </Link>
            );
          })}
        </div>

        {totalPages > 1 && (
          <Pagination page={page} total={totalPages} onChange={setPage} />
        )}
      </section>
    </PublicFrame>
  );
}
