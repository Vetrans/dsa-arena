import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublicFrame } from "../components/app/PublicHeader.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { apiClient } from "../api/client.js";
import { Trophy, Clock, Users, ArrowRight, Radio } from "lucide-react";

const DEFAULT_CONTESTS = [
  {
    title: "NYC Weekly Contest #07",
    slug: "nyc-weekly-07",
    status: "LIVE",
    durationMinutes: 90,
    timeText: "Live now · 01:45:12 remaining",
    problemCount: 4,
    registeredCount: 342
  },
  {
    title: "Monsoon Algorithm Sprint",
    slug: "monsoon-algorithm-sprint",
    status: "UPCOMING",
    durationMinutes: 120,
    timeText: "Starts Friday · 18:00 IST",
    problemCount: 5,
    registeredCount: 218
  },
  {
    title: "Graph Theory & Trees Duel Night",
    slug: "graph-theory-night",
    status: "UPCOMING",
    durationMinutes: 90,
    timeText: "Starts Sunday · 20:00 IST",
    problemCount: 4,
    registeredCount: 175
  }
];

export function ContestsPage() {
  const [contests, setContests] = useState(DEFAULT_CONTESTS);
  const [loading, setLoading] = useState(false);
  const root = useReveal();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/contests");
        if (res.data?.data && res.data.data.length > 0) {
          setContests(res.data.data);
        }
      } catch (err) {
        // Keep default dynamic list if backend endpoint is initializing
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  return (
    <PublicFrame>
      <section ref={root} className="screen-page">
        <div data-reveal className="page-heading">
          <p className="eyebrow">NYC COMPETITIVE LEAGUE</p>
          <h1>Live & Upcoming Contests</h1>
          <p>
            Rated algorithmic showdowns, live ELO leaderboards, and instant execution sandboxes.
          </p>
        </div>

        <div className="contest-grid">
          {contests.map((contest, index) => {
            const isLive = contest.status === "LIVE" || index === 0;
            const slug = contest.slug || contest.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

            return (
              <article data-reveal className="contest-card" key={slug}>
                <span className={isLive ? "live-pill" : "date-pill"}>
                  {isLive ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <Radio size={12} /> LIVE NOW
                    </span>
                  ) : (
                    contest.status || "UPCOMING"
                  )}
                </span>
                <h2>{contest.title}</h2>
                <p>
                  {contest.problemCount || contest.problems?.length || 4} Problems ·{" "}
                  {contest.timeText || `${contest.durationMinutes || 90} Minutes`}
                </p>

                <Link
                  className={isLive ? "button button-yellow" : "button button-outline"}
                  to={`/contests/${slug}`}
                >
                  {isLive ? "Enter Arena Room ↗" : "View Contest Details"}
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </PublicFrame>
  );
}
