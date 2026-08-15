import React, { useState, useEffect } from 'react';
import { Trophy, Award, Lock, CheckCircle2, Zap, Flame, Shield, Users, Target } from 'lucide-react';
import { achievementsApi } from '../api/arenaApi.js';
import { Card, Badge, ProgressBar, Skeleton } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Achievements.css';

const CATEGORY_NAMES = {
  FIRST_STEPS: 'First Steps',
  CONSISTENCY: 'Consistency & Streaks',
  MILESTONES: 'Problem Milestones',
  COMPETITIVE: 'Competitive Rating',
  SKILL: 'Topic Mastery',
  COMMUNITY: 'Community & Discussions'
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        const { data } = await achievementsApi.getAchievements();
        setAchievements(data || []);
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const unlockPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const filteredAchievements =
    activeCategory === 'ALL'
      ? achievements
      : achievements.filter((a) => a.category === activeCategory);

  return (
    <PageLayout>
      <div className="achievements-container">
        <div className="achievements-header">
          <div>
            <h1 className="achievements-title">Arena Achievements</h1>
            <p className="achievements-subtitle">
              Unlock badges, claim XP rewards, and showcase your DSA mastery milestones.
            </p>
          </div>
        </div>

        {/* Global Progress Card */}
        <Card className="achievements-summary-card">
          <div className="summary-left">
            <Trophy size={36} className="summary-icon" />
            <div>
              <span className="summary-label">Badges Unlocked</span>
              <h2 className="summary-count">
                {unlockedCount} / {totalCount}
              </h2>
            </div>
          </div>
          <div className="summary-progress-box">
            <div className="summary-progress-labels">
              <span>Progress</span>
              <span>{unlockPercentage}%</span>
            </div>
            <ProgressBar value={unlockPercentage} size="md" animated />
          </div>
        </Card>

        {/* Category Filters */}
        <div className="category-filter-bar">
          <button
            className={`cat-pill ${activeCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveCategory('ALL')}
          >
            All Badges ({totalCount})
          </button>
          {Object.keys(CATEGORY_NAMES).map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_NAMES[cat]}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        {isLoading ? (
          <div className="achievements-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="achievement-skeleton">
                <Skeleton variant="circle" width={56} height={56} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="90%" />
              </div>
            ))}
          </div>
        ) : (
          <div className="achievements-grid">
            {filteredAchievements.map((ach) => {
              const isUnlocked = ach.isUnlocked;

              return (
                <Card
                  key={ach._id || ach.key}
                  className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="ach-card-top">
                    <div className={`ach-icon-circle ${isUnlocked ? 'unlocked' : 'locked'}`}>
                      {isUnlocked ? (
                        <span className="ach-emoji">{ach.icon || '🏆'}</span>
                      ) : (
                        <Lock size={20} className="lock-icon" />
                      )}
                    </div>
                    <Badge variant={ach.rarity?.toLowerCase() || 'default'}>
                      {ach.rarity || 'COMMON'}
                    </Badge>
                  </div>

                  <div className="ach-card-content">
                    <h3 className="ach-name">{ach.name}</h3>
                    <p className="ach-desc">{ach.description}</p>
                  </div>

                  <div className="ach-card-footer">
                    <span className="ach-xp-reward">
                      <Zap size={14} /> +{ach.xpReward || 50} XP
                    </span>
                    {isUnlocked ? (
                      <span className="ach-status unlocked">
                        <CheckCircle2 size={14} /> Unlocked
                      </span>
                    ) : (
                      <span className="ach-status locked">Locked</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Achievements;
