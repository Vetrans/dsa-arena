import React from 'react';
import { Link } from 'react-router-dom';
import { Code, TrendingUp, Trophy, BarChart3, Flame, Award, Target, Zap, Shield, Users, Brain } from 'lucide-react';
import { Button } from '../components/ui';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="container landing-nav-container">
          <div className="landing-logo">NYC DSA Arena</div>
          <div className="landing-nav-actions">
            <Link to="/login" className="landing-login-link">Login</Link>
            <Link to="/register">
              <Button>Join Arena</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-shape shape-1"></div>
            <div className="hero-shape shape-2"></div>
            <div className="hero-shape shape-3"></div>
          </div>
          <div className="container hero-container">
            <h1 className="hero-title">
              <span className="hero-title-line">Master DSA.</span>
              <span className="hero-title-line hero-title-gradient">Compete with NYC.</span>
              <span className="hero-title-line">Become the best.</span>
            </h1>
            <p className="hero-subtitle">
              Practice problems, build your rating, climb the NYC leaderboard, and improve together.
            </p>
            <div className="hero-actions">
              <Link to="/register">
                <Button size="lg" className="hero-btn-primary">Enter the Arena</Button>
              </Link>
              <Link to="/problems">
                <Button size="lg" variant="outline" className="hero-btn-secondary">Explore Problems</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why NYC DSA Arena?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <Code className="feature-icon" />
                </div>
                <h3 className="feature-title">500+ DSA Problems</h3>
                <p className="feature-desc">Curated problems across 20+ topics from arrays to dynamic programming</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <TrendingUp className="feature-icon" />
                </div>
                <h3 className="feature-title">Rating System</h3>
                <p className="feature-desc">ELO-style competitive rating that reflects your true problem-solving skill</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <Trophy className="feature-icon" />
                </div>
                <h3 className="feature-title">Rank Progression</h3>
                <p className="feature-desc">Climb from Bronze to Master through six competitive tiers</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <BarChart3 className="feature-icon" />
                </div>
                <h3 className="feature-title">Leaderboards</h3>
                <p className="feature-desc">Compete with NYC developers on weekly, monthly, and all-time rankings</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <Flame className="feature-icon" />
                </div>
                <h3 className="feature-title">Daily Streaks</h3>
                <p className="feature-desc">Build consistency with daily challenges and streak tracking</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <Award className="feature-icon" />
                </div>
                <h3 className="feature-title">Achievements</h3>
                <p className="feature-desc">Unlock badges and milestones as you master DSA concepts</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="timeline">
              <div className="timeline-step">
                <div className="timeline-icon-wrapper">
                  <span className="timeline-number">1</span>
                  <Target className="timeline-icon" />
                </div>
                <h4 className="timeline-title">Solve</h4>
                <p className="timeline-desc">Pick a problem and write your solution</p>
              </div>
              <div className="timeline-line"></div>
              <div className="timeline-step">
                <div className="timeline-icon-wrapper">
                  <span className="timeline-number">2</span>
                  <Zap className="timeline-icon" />
                </div>
                <h4 className="timeline-title">Earn XP</h4>
                <p className="timeline-desc">Gain experience points for every solve</p>
              </div>
              <div className="timeline-line"></div>
              <div className="timeline-step">
                <div className="timeline-icon-wrapper">
                  <span className="timeline-number">3</span>
                  <TrendingUp className="timeline-icon" />
                </div>
                <h4 className="timeline-title">Build Rating</h4>
                <p className="timeline-desc">Your competitive rating grows with each success</p>
              </div>
              <div className="timeline-line"></div>
              <div className="timeline-step">
                <div className="timeline-icon-wrapper">
                  <span className="timeline-number">4</span>
                  <Shield className="timeline-icon" />
                </div>
                <h4 className="timeline-title">Rank Up</h4>
                <p className="timeline-desc">Climb through Bronze, Silver, Gold, and beyond</p>
              </div>
              <div className="timeline-line"></div>
              <div className="timeline-step">
                <div className="timeline-icon-wrapper">
                  <span className="timeline-number">5</span>
                  <Users className="timeline-icon" />
                </div>
                <h4 className="timeline-title">Compete</h4>
                <p className="timeline-desc">Race against NYC developers on the leaderboard</p>
              </div>
              <div className="timeline-line"></div>
              <div className="timeline-step">
                <div className="timeline-icon-wrapper">
                  <span className="timeline-number">6</span>
                  <Brain className="timeline-icon" />
                </div>
                <h4 className="timeline-title">Improve</h4>
                <p className="timeline-desc">Get personalized recommendations to fill knowledge gaps</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">1,000+</div>
                <div className="stat-label">Problems</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5,000+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Submissions</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Topics</div>
              </div>
            </div>
            <p className="stats-subtext">Example statistics</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container cta-container">
            <h2 className="cta-title">Ready to enter the arena?</h2>
            <p className="cta-subtitle">Join the NYC DSA community and start your journey today</p>
            <Link to="/register">
              <Button size="lg" className="cta-btn">Enter the Arena</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} NYC DSA Arena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
