import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Milestone,
  Layers,
  Maximize2,
  FolderTree,
  GitBranch,
  Cpu,
  Target,
  RefreshCw,
  Share2,
  Zap,
  Trophy,
  Filter,
  CheckSquare,
  Circle
} from "lucide-react";
import { PROBLEMS } from "../data/problemsData.js";
import { useArenaStore } from "../store/arenaStore.js";
import "./RoadmapPage.css";

const TOPIC_ICONS = {
  arrays: Layers,
  "sliding-window": Maximize2,
  stack: FolderTree,
  "linked-lists": GitBranch,
  recursion: RefreshCw,
  graphs: Share2,
  "dynamic-programming": Zap,
  sorting: Trophy
};

const ROADMAP_STAGES = [
  {
    stageNumber: 1,
    title: "Stage 1: Core Linear Foundations",
    description: "Crucial algorithmic patterns for arrays, string manipulation, and stack lifo mechanisms.",
    topics: [
      {
        slug: "arrays",
        title: "Arrays & Hashing",
        summary: "O(1) lookups, hash maps, frequency counters, and contiguous subsegments."
      },
      {
        slug: "sliding-window",
        title: "Sliding Window",
        summary: "Subsegment tracking in linear O(N) time with dynamic boundary expansion/shrinking."
      },
      {
        slug: "stack",
        title: "Stack & Parentheses Scans",
        summary: "LIFO state matching, bracket validation, and monotonic scanning."
      }
    ]
  },
  {
    stageNumber: 2,
    title: "Stage 2: Pointers & Linked Structures",
    description: "In-place pointer mutation, singly linked lists, and recursive iteration fundamentals.",
    topics: [
      {
        slug: "linked-lists",
        title: "Linked Lists",
        summary: "Node pointers, reversal in-place, pointer tracking, and null edge cases."
      },
      {
        slug: "recursion",
        title: "Recursion & Call Stack",
        summary: "Base cases, call stack unwinding, and mathematical transitions."
      }
    ]
  },
  {
    stageNumber: 3,
    title: "Stage 3: Advanced Optimization & State Machines",
    description: "Optimal substructure, memoization, decision trees, and unweighted graph networks.",
    topics: [
      {
        slug: "dynamic-programming",
        title: "Dynamic Programming",
        summary: "Kadane's algorithm, 1D/2D table memoization, coin change, and step transitions."
      },
      {
        slug: "sorting",
        title: "Intervals & Sorting",
        summary: "Start-time ordering, greedy overlaps, and segment coalescence."
      },
      {
        slug: "graphs",
        title: "Graphs & BFS Shortest Paths",
        summary: "Level-order traversals, word transformations, and queue state exploration."
      }
    ]
  }
];

export function RoadmapPage() {
  const { solvedProblemSlugs } = useArenaStore();
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'unsolved' | 'completed'

  const totalCurated = PROBLEMS.length;
  const totalSolved = solvedProblemSlugs.length;
  const overallPercent = Math.min(
    100,
    Math.round((totalSolved / (totalCurated || 1)) * 100)
  );

  return (
    <div className="roadmap-page">
      {/* Header Banner */}
      <div className="roadmap-header">
        <div className="rh-copy">
          <p className="eyebrow">CURATED MASTERY PATH</p>
          <h1>DATA STRUCTURES & ALGORITHMS ROADMAP</h1>
          <p>
            Master foundational engineering topics across 3 structured stages.
            Solve every challenge in sequence to build deep algorithmic intuition.
          </p>
        </div>

        <div className="rh-stats-card">
          <div className="rhs-top">
            <span>OVERALL CURRICULUM PROGRESS</span>
            <b>{overallPercent}%</b>
          </div>
          <div className="rhs-track">
            <div
              className="rhs-fill"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <span className="rhs-sub">
            {totalSolved} of {totalCurated} Core Challenges Conquered
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="roadmap-toolbar">
        <div className="rt-filter-group">
          <span className="rt-lbl">
            <Filter size={14} /> Filter Problems:
          </span>
          <button
            className={`rt-btn ${filterMode === "all" ? "active" : ""}`}
            onClick={() => setFilterMode("all")}
          >
            All Challenges ({totalCurated})
          </button>
          <button
            className={`rt-btn ${filterMode === "unsolved" ? "active" : ""}`}
            onClick={() => setFilterMode("unsolved")}
          >
            Pending ({Math.max(0, totalCurated - totalSolved)})
          </button>
          <button
            className={`rt-btn ${filterMode === "completed" ? "active" : ""}`}
            onClick={() => setFilterMode("completed")}
          >
            Completed ({totalSolved})
          </button>
        </div>
      </div>

      {/* Progressive Stages Timeline */}
      <div className="stages-container">
        {ROADMAP_STAGES.map((stage) => (
          <section className="stage-section" key={stage.stageNumber}>
            <div className="stage-header">
              <div className="stage-badge">STAGE 0{stage.stageNumber}</div>
              <div>
                <h2>{stage.title}</h2>
                <p>{stage.description}</p>
              </div>
            </div>

            <div className="topic-cards-grid">
              {stage.topics.map((topic) => {
                const IconComponent = TOPIC_ICONS[topic.slug] || Layers;
                const allTopicProblems = PROBLEMS.filter((p) =>
                  p.topicSlugs.includes(topic.slug)
                );

                const topicProblems = allTopicProblems.filter((p) => {
                  const solved = solvedProblemSlugs.includes(p.slug);
                  if (filterMode === "unsolved") return !solved;
                  if (filterMode === "completed") return solved;
                  return true;
                });

                const solvedInTopic = allTopicProblems.filter((p) =>
                  solvedProblemSlugs.includes(p.slug)
                ).length;
                const totalInTopic = allTopicProblems.length;
                const isComplete =
                  totalInTopic > 0 && solvedInTopic === totalInTopic;

                return (
                  <div
                    className={`roadmap-topic-card ${
                      isComplete ? "card-completed" : ""
                    }`}
                    key={topic.slug}
                  >
                    <div className="rtc-top">
                      <span className="rtc-icon">
                        <IconComponent size={20} />
                      </span>
                      {isComplete ? (
                        <span className="badge-done">
                          <CheckCircle2 size={13} /> Completed
                        </span>
                      ) : (
                        <span className="badge-progress">
                          {solvedInTopic}/{Math.max(1, totalInTopic)} Solved
                        </span>
                      )}
                    </div>

                    <h3>{topic.title}</h3>
                    <p className="rtc-summary">{topic.summary}</p>

                    {topicProblems.length > 0 ? (
                      <div className="rtc-problems-list">
                        {topicProblems.map((p) => {
                          const isProbSolved = solvedProblemSlugs.includes(p.slug);
                          return (
                            <Link
                              to={`/problems/${p.slug}`}
                              className={`rtc-prob-link ${isProbSolved ? "prob-link-solved" : ""}`}
                              key={p.slug}
                            >
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                {isProbSolved ? (
                                  <CheckCircle2 size={13} className="text-green" style={{ color: "#16a34a" }} />
                                ) : (
                                  <Circle size={12} style={{ color: "#94a3b8" }} />
                                )}
                                <span>#{p.problemNumber} {p.title}</span>
                              </span>
                              <span
                                className={`diff-pill diff-${p.difficulty.toLowerCase()}`}
                              >
                                {p.difficulty}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rtc-no-prob">
                        <span>{filterMode !== "all" ? "No problems matching current filter." : "No problems in this category yet."}</span>
                      </div>
                    )}
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
