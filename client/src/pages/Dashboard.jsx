import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Code2,
  Flame,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Play
} from 'lucide-react';
import { dailyChallengeApi, recommendationsApi, analyticsApi } from '../api/arenaApi.js';
import { useAuthStore } from '../store/authStore.js';
import { Button, Card, Badge, ProgressBar, Skeleton } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuthStore();
  const username = user?.displayName || user?.username || 'Developer';
  const stats = user?.stats || {};

  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [dcRes, recRes, anaRes] = await Promise.allSettled([
          dailyChallengeApi.getTodayChallenge(),
          recommendationsApi.getRecommendations(3),
          analyticsApi.getPersonalAnalytics()
        ]);

        if (dcRes.status === 'fulfilled') setDailyChallenge(dcRes.value.data);
        if (recRes.status === 'fulfilled') setRecommendations(recRes.value.data);
        if (anaRes.status === 'fulfilled') setAnalytics(anaRes.value.data);
      } catch (err) {
        console.error('Error fetching dashboard widgets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <PageLayout>
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {username}</h1>
            <p className="dashboard-subtitle">
              NYC Arena competitive overview and daily problem-solving roadmap.
            </p>
          </div>
          <Link to="/problems">
            <Button size="md">
              Browse Arena Catalog <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Daily Challenge Card (Featured) */}
        {dailyChallenge?.problem && (
          <Card className="daily-challenge-card">
            <div className="dc-header">
              <div className="dc-badge">
                <Flame size={16} /> Daily Arena Challenge
              </div>
              <span className="dc-bonus-pill">
                +{dailyChallenge.bonusXp} XP • +{dailyChallenge.bonusRating} Rating Bonus
              </span>
            </div>

            <div className="dc-content">
              <div className="dc-info">
                <h3 className="dc-title">
                  #{dailyChallenge.problem.problemNumber}. {dailyChallenge.problem.title}
                </h3>
                <div className="dc-tags">
                  <Badge variant={dailyChallenge.problem.difficulty.toLowerCase()}>
                    {dailyChallenge.problem.difficulty}
                  </Badge>
                  {dailyChallenge.problem.topics?.map((t) => (
                    <span key={t.slug || t._id} className="topic-tag">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="dc-action">
                <Link to={`/problems/${dailyChallenge.problem.slug}`}>
                  <Button variant="primary">
                    <Play size={16} /> Solve Daily Challenge
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* 4 Stats Cards */}
        <div className="dashboard-stats-grid">
          <Card className="stat-card">
            <div className="stat-icon-wrapper rating-icon">
              <Trophy size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Arena Rating</p>
              <h3 className="stat-value">{stats.rating || 0}</h3>
              <p className="stat-subtext text-rank-bronze">{stats.rank || 'Bronze III'}</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-wrapper xp-icon">
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Experience</p>
              <h3 className="stat-value">{stats.xp || 0} XP</h3>
              <p className="stat-subtext">Level {stats.level || 1}</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-wrapper problems-icon">
              <Code2 size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Problems Solved</p>
              <h3 className="stat-value">{stats.problemsSolved || 0}</h3>
              <p className="stat-subtext">Accuracy: {stats.accuracy || 0}%</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-wrapper streak-icon">
              <Flame size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Current Streak</p>
              <h3 className="stat-value">{stats.currentStreak || 0} Days</h3>
              <p className="stat-subtext">Best: {stats.longestStreak || 0} Days</p>
            </div>
          </Card>
        </div>

        {/* Personalized Recommendations Section */}
        {recommendations && (
          <div className="recommendations-section">
            <div className="rec-header">
              <div className="rec-title-group">
                <Sparkles size={20} className="rec-icon" />
                <h2 className="rec-heading">Target Practice Recommendations</h2>
              </div>
              <p className="rec-reason">{recommendations.reason}</p>
            </div>

            <div className="rec-problems-grid">
              {recommendations.problems?.map((p) => (
                <Card key={p.slug} className="rec-problem-card">
                  <div className="rec-card-top">
                    <span className="rec-num">#{p.problemNumber}</span>
                    <Badge variant={p.difficulty.toLowerCase()}>{p.difficulty}</Badge>
                  </div>
                  <h4 className="rec-prob-title">{p.title}</h4>
                  <div className="rec-topics">
                    {p.topics?.slice(0, 2).map((t) => (
                      <span key={t.slug || t._id} className="topic-tag">
                        {t.name}
                      </span>
                    ))}
                  </div>
                  <Link to={`/problems/${p.slug}`} className="rec-solve-link">
                    <Button size="sm" variant="outline" className="w-full">
                      Solve Now <ArrowRight size={14} />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
