import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublicFrame } from "../components/app/PublicHeader.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { contestApi } from "../api/arenaApi.js";
import { Trophy, Clock, Users, ArrowRight, Radio, Loader2 } from "lucide-react";

export function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const root = useReveal();

  useEffect(() => {
    let isMounted = true;
    const fetchContests = async () => {
      try {
        setLoading(true);
        const res = await contestApi.getContests();
        if (isMounted && res?.data) {
          setContests(res.data);
        }
      } catch (err) {
        console.error("Failed to load contests:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchContests();
    return () => {
      isMounted = false;
    };
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
