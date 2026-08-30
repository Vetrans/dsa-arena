import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Milestone
} from "lucide-react";
import { PROBLEMS } from "../data/problemsData.js";
import { useArenaStore } from "../store/arenaStore.js";
import "./RoadmapPage.css";

const ROADMAP_STAGES = [
  {
    stageNumber: 1,
    title: "Stage 1: Core Foundations",
    description: "Fundamental time-complexity patterns and memory layouts.",
    topics: [
      {
        slug: "arrays",
        title: "Arrays & Hashing",
        icon: "📊",
        summary: "O(1) lookups, hash maps, frequency tables, prefix sums."
      },
      {
        slug: "two-pointers",
        title: "Two Pointers",
        icon: "👉",
        summary: "Dual index traversal for sorted sequences and partition logic."
      },
      {
        slug: "sliding-window",
        title: "Sliding Window",
        icon: "🪟",
        summary: "Subsegment tracking in linear O(N) time."
      },
      {
        slug: "stack",
        title: "Stack & Monotonic Scans",
        icon: "🥞",
        summary: "LIFO matching, parentheses, next greater element."
      }
    ]
  },
  {
    stageNumber: 2,
    title: "Stage 2: Non-Linear Structures",
    description: "Pointer-based collections, recursive trees, and heap priorities.",
    topics: [
      {
        slug: "linked-lists",
        title: "Linked Lists",
        icon: "🔗",
        summary: "Node pointers, reversal, fast & slow pointers, cycle detection."
      },
      {
        slug: "trees",
        title: "Binary Trees & BST",
        icon: "🌳",
        summary: "Tree traversal (Inorder, Preorder, Postorder, Level-order), BST properties."
      },
      {
        slug: "heaps",
        title: "Heaps & Priority Queues",
        icon: "⛰️",
        summary: "Top-K elements, streaming medians, min/max heap invariants."
      }
    ]
  },
  {
    stageNumber: 3,
    title: "Stage 3: Search, Graphs & Recursion",
    description: "State-space search, network traversals, and pruning algorithms.",
    topics: [
      {
        slug: "recursion",
        title: "Recursion & Backtracking",
        icon: "🔄",
        summary: "Combinations, permutations, subset state exploration."
      },
      {
        slug: "graphs",
        title: "Graphs & Shortest Paths",
        icon: "🕸️",
        summary: "BFS, DFS, cycle detection, topological sort, Dijkstra."
      }
    ]
  },
  {
    stageNumber: 4,
    title: "Stage 4: Advanced Mastery & Dynamic Programming",
    description: "Optimal substructure, memoization, and complex state transitions.",
    topics: [
      {
        slug: "dynamic-programming",
        title: "Dynamic Programming",
        icon: "⚡",
        summary: "1D/2D DP, knapsack variations, longest common subsequence, intervals."
      },
      {
        slug: "greedy",
        title: "Greedy & Intervals",
        icon: "🎯",
        summary: "Locally optimal choices yielding global optima, interval scheduling."
      }
    ]
  }
];

export function RoadmapPage() {
  const { solvedProblemSlugs } = useArenaStore();

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <p className="eyebrow">CURATED MASTER CURRICULUM</p>
        <h1>ALGORITHMIC LEARNING ROADMAP</h1>
        <p className="roadmap-sub">
          A battle-tested progression through all 18 core DSA topics. Master each
          stage to conquer interview coding loops and competitive arena contests.
        </p>
      </div>

      <div className="stages-container">
        {ROADMAP_STAGES.map((stage) => (
          <section className="stage-section" key={stage.stageNumber}>
            <div className="stage-heading">
              <div className="stage-badge">STAGE 0{stage.stageNumber}</div>
              <div>
                <h2>{stage.title}</h2>
                <p>{stage.description}</p>
              </div>
            </div>

            <div className="topic-cards-grid">
              {stage.topics.map((topic) => {
                // Find problems matching this topic
                const topicProblems = PROBLEMS.filter((p) =>
                  p.topicSlugs.includes(topic.slug)
                );
                const solvedInTopic = topicProblems.filter((p) =>
                  solvedProblemSlugs.includes(p.slug)
                ).length;
                const totalInTopic = topicProblems.length;
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
                      <span className="rtc-icon">{topic.icon}</span>
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
                        {topicProblems.map((p) => (
                          <Link
                            to={`/problems/${p.slug}`}
                            className="rtc-prob-link"
                            key={p.slug}
                          >
                            <span>{p.title}</span>
                            <span
                              className={`diff-pill diff-${p.difficulty.toLowerCase()}`}
                            >
                              {p.difficulty}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="rtc-coming-soon">
                        <span>Problems Bank Updated Weekly</span>
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
