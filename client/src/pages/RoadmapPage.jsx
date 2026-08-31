import React from "react";
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
  Trophy
} from "lucide-react";
import { PROBLEMS } from "../data/problemsData.js";
import { useArenaStore } from "../store/arenaStore.js";
import "./RoadmapPage.css";

const TOPIC_ICONS = {
  arrays: Layers,
  "two-pointers": ArrowRight,
  "sliding-window": Maximize2,
  stack: FolderTree,
  "linked-lists": GitBranch,
  trees: Cpu,
  heaps: Target,
  recursion: RefreshCw,
  graphs: Share2,
  "dynamic-programming": Zap,
  greedy: Trophy
};

const ROADMAP_STAGES = [
  {
    stageNumber: 1,
    title: "Stage 1: Core Foundations",
    description: "Fundamental time-complexity patterns and memory layouts.",
    topics: [
      {
        slug: "arrays",
        title: "Arrays & Hashing",
        summary: "O(1) lookups, hash maps, frequency tables, prefix sums."
      },
      {
        slug: "two-pointers",
        title: "Two Pointers",
        summary: "Dual index traversal for sorted sequences and partition logic."
      },
      {
        slug: "sliding-window",
        title: "Sliding Window",
        summary: "Subsegment tracking in linear O(N) time."
      },
      {
        slug: "stack",
        title: "Stack & Monotonic Scans",
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
        summary: "Node pointers, reversal, fast & slow pointers, cycle detection."
      },
      {
        slug: "trees",
        title: "Binary Trees & BST",
        summary: "Tree traversal (Inorder, Preorder, Postorder, Level-order), BST properties."
      },
      {
        slug: "heaps",
        title: "Heaps & Priority Queues",
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
        summary: "Combinations, permutations, subset state exploration."
      },
      {
        slug: "graphs",
        title: "Graphs & Shortest Paths",
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
        summary: "1D/2D DP, knapsack variations, longest common subsequence, intervals."
      },
      {
        slug: "greedy",
        title: "Greedy & Intervals",
        summary: "Locally optimal choices yielding global optima, interval scheduling."
      }
    ]
  }
];

export function RoadmapPage() {
  const { solvedProblemSlugs } = useArenaStore();

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
            Master 18 foundational topics across 4 progressive stages to crack
            tier-1 technical interviews and conquer competitive arenas.
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
                      <div className="rtc-no-prob">
                        <span>Curated set coming in Next Sprint</span>
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
