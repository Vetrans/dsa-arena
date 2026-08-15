import React from 'react';
import { Trophy, Shield, Zap, Target, ArrowRight, Award, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { Button, Card, ProgressBar } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Rankings.css';

const TIERS = [
  {
    name: 'Bronze',
    range: '0 – 499',
    min: 0,
    max: 499,
    icon: '🥉',
    color: 'var(--rank-bronze)',
    description: 'Starting tier for all new NYC developers. Master fundamentals in arrays and strings.'
  },
  {
    name: 'Silver',
    range: '500 – 999',
    min: 500,
    max: 999,
    icon: '🥈',
    color: 'var(--rank-silver)',
    description: 'Solid foundation. Solving two-pointers, hash tables, and basic recursive structures.'
  },
  {
    name: 'Gold',
    range: '1,000 – 1,499',
    min: 1000,
    max: 1499,
    icon: '🥇',
    color: 'var(--rank-gold)',
    description: 'Advanced competitor. Confident with trees, binary search, sliding windows, and stacks.'
  },
  {
    name: 'Platinum',
    range: '1,500 – 1,999',
    min: 1500,
    max: 1999,
    icon: '💠',
    color: 'var(--rank-platinum)',
    description: 'Elite problem solver. Tackling Dynamic Programming, Graphs, and complex optimizations.'
  },
  {
    name: 'Diamond',
    range: '2,000 – 2,499',
    min: 2000,
    max: 2499,
    icon: '💎',
    color: 'var(--rank-diamond)',
    description: 'Top-tier NYC talent. Ready for high-frequency trading and Big Tech L5 algorithmic rounds.'
  },
  {
    name: 'Master',
    range: '2,500+',
    min: 2500,
    max: 5000,
    icon: '👑',
    color: 'var(--rank-master)',
    description: 'Arena Champions. The undisputed top competitive algorithmists in New York City.'
  }
];

const Rankings = () => {
  const { user } = useAuthStore();
  const currentRating = user?.stats?.rating || 0;
  const currentRankName = user?.stats?.rank || 'Bronze III';

  // Calculate current tier and next tier
  const currentTierObj = TIERS.find((t) => currentRating >= t.min && currentRating <= t.max) || TIERS[0];
  const nextTierObj = TIERS[TIERS.indexOf(currentTierObj) + 1] || null;

  const ratingNeeded = nextTierObj ? Math.max(0, nextTierObj.min - currentRating) : 0;
  const tierProgress = nextTierObj
    ? Math.min(100, Math.round(((currentRating - currentTierObj.min) / (nextTierObj.min - currentTierObj.min)) * 100))
    : 100;

  return (
    <PageLayout>
      <div className="rankings-container">
        <div className="rankings-header">
          <h1 className="rankings-title">Arena Rank Progression</h1>
          <p className="rankings-subtitle">
            Climb from Bronze to Master tier as your problem solving rating increases in the Arena.
          </p>
        </div>

        {/* User Current Tier Status Card */}
        <Card className="current-rank-hero-card">
          <div className="rank-hero-content">
            <div className="rank-badge-large">
              <span>{currentTierObj.icon}</span>
            </div>
            <div className="rank-hero-details">
              <span className="hero-sublabel">Your Current Rank</span>
              <h2 className="hero-rank-name">{currentRankName}</h2>
              <p className="hero-rating-text">
                <strong>{currentRating}</strong> Arena Rating Points
              </p>
            </div>
          </div>

          <div className="next-tier-progress-box">
            <div className="progress-labels">
              <span>{currentTierObj.name} ({currentRating})</span>
              {nextTierObj ? (
                <span>
                  Next: {nextTierObj.name} ({nextTierObj.min} pts) • <strong>{ratingNeeded} pts away</strong>
                </span>
              ) : (
                <span>Max Rank Tier Achieved!</span>
              )}
            </div>
            <ProgressBar value={tierProgress} size="lg" animated />
          </div>
        </Card>

        {/* All Tiers Roadmap */}
        <div className="tiers-grid">
          {TIERS.map((tier, index) => {
            const isCurrent = tier.name === currentTierObj.name;
            const isAchieved = currentRating >= tier.min;

            return (
              <Card
                key={tier.name}
                className={`tier-card ${isCurrent ? 'current' : ''} ${isAchieved ? 'achieved' : ''}`}
              >
                <div className="tier-card-header">
                  <div className="tier-icon-wrap">
                    <span className="tier-icon">{tier.icon}</span>
                  </div>
                  <div>
                    <h3 className="tier-name">{tier.name}</h3>
                    <span className="tier-range">{tier.range} Rating</span>
                  </div>
                </div>

                <p className="tier-desc">{tier.description}</p>

                <div className="tier-subdivisions">
                  <span className="subdiv-label">Subdivisions:</span>
                  <div className="subdiv-pills">
                    <span className="subdiv-pill">{tier.name} III</span>
                    <span className="subdiv-pill">{tier.name} II</span>
                    <span className="subdiv-pill">{tier.name} I</span>
                  </div>
                </div>

                {isCurrent && (
                  <div className="current-tier-tag">
                    <CheckCircle size={14} /> Current Tier
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default Rankings;
