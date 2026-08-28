import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../components/app/Pagination.jsx";
import { PublicFrame } from "../components/app/PublicHeader.jsx";
import { useReveal } from "../hooks/useReveal.js";
const players = [
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
    label: "Global rating",
    field: "rating",
    unit: "Rating",
    delta: "Change",
  },
  {
    id: "xp",
    label: "Weekly XP",
    field: "xp",
    unit: "XP earned",
    delta: "This week",
  },
  {
    id: "solved",
    label: "Problems solved",
    field: "solved",
    unit: "Solved",
    delta: "Streak",
  },
];
export function LeaderboardPage() {
  const [tab, setTab] = useState(tabs[0]);
  const [page, setPage] = useState(1);
  const root = useReveal();
  const sorted = useMemo(
    () => [...players].sort((a, b) => b[tab.field] - a[tab.field]),
    [tab],
  );
  const rows = sorted.slice((page - 1) * 4, page * 4);
  const chooseTab = (next) => {
    setTab(next);
    setPage(1);
  };
  return (
    <PublicFrame>
      <section ref={root} className="screen-page">
        <div data-reveal className="page-heading">
          <p className="eyebrow">THE NYC ARENA</p>
          <h1>Leaderboard</h1>
          <p>
            See who is moving through the ranks. Create an account to begin your
            climb.
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
            const rank = (page - 1) * 4 + index + 1;
            const detail =
              tab.id === "solved"
                ? `${Math.max(3, 12 - rank)} days`
                : tab.id === "xp"
                  ? `+${player.xp}`
                  : `+${player.change}`;
            return (
              <Link className="board-row" to="/register" key={player.name}>
                <strong>{String(rank).padStart(2, "0")}</strong>
                <span>
                  <i>{player.name.slice(0, 1)}</i>
                  {player.name}
                </span>
                <b>{player[tab.field].toLocaleString()}</b>
                <em>{detail}</em>
              </Link>
            );
          })}
        </div>
        <Pagination page={page} total={3} onChange={setPage} />
      </section>
    </PublicFrame>
  );
}
