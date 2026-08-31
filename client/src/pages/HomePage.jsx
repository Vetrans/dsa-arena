import { useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import {
  Cpu,
  BookOpen,
  Shield,
  Users,
  MapPin,
  Mail,
  MessageSquare
} from "lucide-react";
import { PublicFrame } from "../components/app/PublicHeader.jsx";
import { useTypewriter } from "../hooks/useTypewriter.js";
import "./HomePage.css";

const words = ["CODE.", "SOLVE.", "CONQUER."];

export function HomePage() {
  const root = useRef(null);
  const location = useLocation();
  const { text, index } = useTypewriter(words, 85, 700);

  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get("view") || "home";

  useLayoutEffect(() => {
    if (view === "home") {
      const ctx = gsap.context(() => {
        gsap.from(".hero-copy > *", {
          opacity: 0,
          y: 42,
          stagger: 0.12,
          duration: 0.75,
          ease: "power3.out",
        });
        gsap.from(".hero-orbit", {
          scale: 0.65,
          rotation: -30,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
        });
      }, root);
      return () => ctx.revert();
    }
  }, [view]);

  return (
    <div ref={root}>
      <PublicFrame>
        <main>
          {/* Main Hero Section (Rendered only on Home) */}
          {view === "home" && (
            <section className="hero-v2">
              <div className="hero-copy">
                <p className="eyebrow">NOT YOUR COLLEGE · DSA ARENA</p>
                <h1 className={`type-hero type-${index}`}>
                  <span>{text}</span>
                  <b className="caret">|</b>
                </h1>
                <p>
                  Practice DSA with a community that expects more from itself.
                  Solve problems, enter contests, and find your rank.
                </p>
                <div className="hero-actions">
                  <Link className="button button-yellow" to="/register">
                    Enter the arena <b>↗</b>
                  </Link>
                  <Link className="button button-outline" to="/leaderboard">
                    View leaderboard
                  </Link>
                </div>
              </div>
              <div className="hero-orbit">
                <div className="orbit-ring ring-one" />
                <div className="orbit-ring ring-two" />
                <div className="orbit-dot dot-a" />
                <div className="orbit-dot dot-b" />
                <div className="orbit-center">NYC</div>
                <span className="orbit-tag tag-one">RANK UP</span>
                <span className="orbit-tag tag-two">+250 XP</span>
                <span className="orbit-tag tag-three">BATTLE</span>
                <span className="orbit-tag tag-four">STREAK ×7</span>
              </div>
            </section>
          )}

          {/* NOT YOUR COLLEGE TEAM SECTION (Rendered only when NYC Team clicked) */}
          {view === "team" && (
            <section className="team-section standalone-view">
              <div className="section-head text-center">
                <p className="eyebrow">NOT YOUR COLLEGE CORE TEAM</p>
                <h2>The Minds Behind The Arena</h2>
                <p className="section-sub">
                  Engineers, competitive programmers, and educators dedicated to
                  elevating algorithmic mastery and tier-1 interview preparation.
                </p>
              </div>

              <div className="team-grid">
                <div className="team-card">
                  <div className="team-avatar">
                    <Cpu size={26} />
                  </div>
                  <h3>Hrishabh</h3>
                  <span className="team-role">Founder & Lead Systems Architect</span>
                  <p className="team-bio">
                    Architecting distributed judging infrastructure, real-time 1v1
                    matchmakers, and the core NYC DSA Arena experience.
                  </p>
                  <div className="team-links">
                    <span className="team-link-pill">Systems & ELO</span>
                    <span className="team-link-pill">Judge0 Sandbox</span>
                  </div>
                </div>

                <div className="team-card">
                  <div className="team-avatar">
                    <BookOpen size={26} />
                  </div>
                  <h3>Rishika</h3>
                  <span className="team-role">Co-Founder & Head of Algorithmic Curriculum</span>
                  <p className="team-bio">
                    Curating the 18-stage DSA roadmap, contest problem sets, and
                    comprehensive mathematical editorials.
                  </p>
                  <div className="team-links">
                    <span className="team-link-pill">Problem Vault</span>
                    <span className="team-link-pill">Editorial Strategy</span>
                  </div>
                </div>

                <div className="team-card">
                  <div className="team-avatar">
                    <Shield size={26} />
                  </div>
                  <h3>Core Engineering Team</h3>
                  <span className="team-role">Sandbox Judge & Infrastructure</span>
                  <p className="team-bio">
                    Optimizing sub-millisecond execution workers, Redis standings
                    queues, and multi-language compiler runtimes.
                  </p>
                  <div className="team-links">
                    <span className="team-link-pill">Docker Containers</span>
                    <span className="team-link-pill">BullMQ Queues</span>
                  </div>
                </div>

                <div className="team-card">
                  <div className="team-avatar">
                    <Users size={26} />
                  </div>
                  <h3>Community & Mentors</h3>
                  <span className="team-role">Contests & Peer Mentorship</span>
                  <p className="team-bio">
                    Leading biweekly community sprints, live code reviews, and
                    technical interview prep for thousands of engineers.
                  </p>
                  <div className="team-links">
                    <span className="team-link-pill">Weekly Sprints</span>
                    <span className="team-link-pill">Live Contests</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CONTACT US SECTION (Rendered only when Contact Us clicked) */}
          {view === "contact" && (
            <section className="contact-section standalone-view">
              <div className="contact-card-wrap">
                <div className="contact-info">
                  <p className="eyebrow">GET IN TOUCH</p>
                  <h2>Contact Not Your College</h2>
                  <p>
                    Have a question about contest sponsorships, university campus
                    chapters, or platform feature requests? Drop us a message.
                  </p>
                  <div className="contact-channels">
                    <div className="channel-item">
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={15} /> Headquarters:
                      </b>
                      <span>NYC DSA Arena · New Delhi & Global</span>
                    </div>
                    <div className="channel-item">
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Mail size={15} /> Direct Email:
                      </b>
                      <span>arena@notyourcollege.com</span>
                    </div>
                    <div className="channel-item">
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <MessageSquare size={15} /> Community Discord:
                      </b>
                      <span>discord.gg/notyourcollege</span>
                    </div>
                  </div>
                </div>

                <div className="contact-form-side">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Thank you for reaching out! We will get back to you shortly.");
                    }}
                  >
                    <div className="form-group-home">
                      <label>Your Name:</label>
                      <input type="text" placeholder="e.g. Alex Rivera" required />
                    </div>
                    <div className="form-group-home">
                      <label>Your Email:</label>
                      <input type="email" placeholder="alex@domain.com" required />
                    </div>
                    <div className="form-group-home">
                      <label>Subject / Topic:</label>
                      <select>
                        <option>General Inquiry</option>
                        <option>Contest & Campus Partnership</option>
                        <option>Problem Vault Feedback</option>
                        <option>Bug / Security Report</option>
                      </select>
                    </div>
                    <div className="form-group-home">
                      <label>Message:</label>
                      <textarea rows={3} placeholder="How can we help you conquer DSA?" required />
                    </div>
                    <button type="submit" className="button button-yellow send-msg-btn">
                      Send Message ↗
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )}
        </main>
      </PublicFrame>
    </div>
  );
}
