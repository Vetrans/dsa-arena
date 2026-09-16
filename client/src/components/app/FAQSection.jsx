import React, { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles, Terminal, Shield, Award } from "lucide-react";
import "./FAQSection.css";

const FAQ_ITEMS = [
  {
    question: "What makes NYC DSA Arena different from LeetCode or HackerRank?",
    answer:
      "NYC DSA Arena is purpose-built by Not Your College for ambitious engineers who learn best through competitive velocity and pattern mastery. Instead of passive problem solving, you experience sub-second sandboxed compiler execution, real-time 1v1 battle matchmakers, curated 18-stage pattern tracks, and direct alignment with Tier-1 engineering interview loops."
  },
  {
    question: "Is NYC DSA Arena completely free to use?",
    answer:
      "Yes, 100% free. All curated algorithmic problem sets, in-browser sandbox compilers, weekly ranked contests, community standings, and detailed mathematical editorials are completely accessible to everyone without paywalls or subscriptions."
  },
  {
    question: "Which programming languages and runtimes are supported?",
    answer:
      "We support modern C++ (C++20 with full STL), Java (OpenJDK 21), Python (Python 3.12 with math/collections), and JavaScript / TypeScript (Node.js 20). Every submission is compiled and verified against multi-tier stress tests and hidden edge cases."
  },
  {
    question: "How does the in-browser sandbox judge work?",
    answer:
      "Our judge executes your code inside isolated, dedicated Web Workers and containerized workers. This guarantees zero-latency execution (sub-150ms feedback) while preventing infinite loops or UI freezing with hard execution timeouts and memory profiling."
  },
  {
    question: "How do Contest Ratings and ELO Work?",
    answer:
      "Every rated contest and 1v1 battle dynamically computes your ELO rating based on speed, testcase completeness, and opponent strength using a modified Glicko-2 / Chess ELO algorithm. Winning duels earns +20 to +35 points and climbs the global rankings."
  },
  {
    question: "What is Beyond Sigma and its relationship to Not Your College?",
    answer:
      "Beyond Sigma is the flagship industry engineering career program by Not Your College. It guides 1st and 2nd year college students from algorithmic fundamentals all the way to distributed microservices, production AI agent architecture, and high-impact placement readiness."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <div className="section-head text-center">
          <div className="faq-badge">
            <HelpCircle size={14} />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2>Everything You Need To Know</h2>
          <p className="section-sub">
            Clear answers about the Arena's judging engine, language runtimes, contests, and zero-cost ethos.
          </p>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`faq-item ${isOpen ? "faq-open" : ""}`}
                onClick={() => toggle(idx)}
              >
                <div className="faq-question-row">
                  <span className="faq-q-number">0{idx + 1}</span>
                  <h3 className="faq-question-text">{item.question}</h3>
                  <div className="faq-chevron-box">
                    <ChevronDown
                      size={18}
                      className={`faq-chevron ${isOpen ? "rotated" : ""}`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="faq-answer-row">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
