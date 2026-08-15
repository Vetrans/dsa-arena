import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Trophy,
  Zap,
  Target,
  Flame,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Calendar
} from 'lucide-react';
import { analyticsApi } from '../api/arenaApi.js';
import { Card, Badge, ProgressBar } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Analytics.css';

const DIFFICULTY_COLORS = {
  Easy: 'var(--easy)',
  Medium: 'var(--medium)',
  Hard: 'var(--hard)'
};

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const { data } = await analyticsApi.getPersonalAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading || !analyticsData) {
    return (
      <PageLayout>
        <div className="analytics-loading">
          <div className="spinner"></div>
          <p>Analyzing Arena Performance Data...</p>
        </div>
      </PageLayout>
    );
  }

  const { overview, difficultyStats, topicPerformance, ratingHistory, activityCalendar } =
    analyticsData;

  const chartData = ratingHistory.map((rh, idx) => ({
    time: `Solve ${idx + 1}`,
    rating: rh.newRating,
    change: rh.change
  }));

  const pieData = [
    { name: 'Easy', value: difficultyStats.easy.solved, color: 'var(--easy)' },
    { name: 'Medium', value: difficultyStats.medium.solved, color: 'var(--medium)' },
    { name: 'Hard', value: difficultyStats.hard.solved, color: 'var(--hard)' }
  ].filter((d) => d.value > 0);

  return (
    <PageLayout>
      <div className="analytics-container">
        <div className="analytics-header">
          <div>
            <h1 className="analytics-title">Performance Analytics</h1>
            <p className="analytics-subtitle">
              Comprehensive breakdown of your problem-solving metrics, rating trajectory, and topic proficiencies.
            </p>
          </div>
        </div>

        {/* Overview Stat Cards Grid */}
        <div className="analytics-overview-grid">
          <Card className="analytics-stat-card">
            <div className="stat-header">
              <span className="stat-label">Current Rating</span>
              <Trophy size={18} className="icon-rating" />
            </div>
            <h3 className="stat-main">{overview.rating}</h3>
            <span className="stat-badge-sub text-rank-bronze">{overview.rank}</span>
          </Card>

          <Card className="analytics-stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Solved</span>
              <Target size={18} className="icon-target" />
            </div>
            <h3 className="stat-main">{overview.totalSolved}</h3>
            <span className="stat-badge-sub">Problems Mastered</span>
          </Card>

          <Card className="analytics-stat-card">
            <div className="stat-header">
              <span className="stat-label">Accuracy Rate</span>
              <TrendingUp size={18} className="icon-accuracy" />
            </div>
            <h3 className="stat-main">{overview.accuracy}%</h3>
            <span className="stat-badge-sub">Accepted Submissions</span>
          </Card>

          <Card className="analytics-stat-card">
            <div className="stat-header">
              <span className="stat-label">Active Streak</span>
              <Flame size={18} className="icon-streak" />
            </div>
            <h3 className="stat-main">{overview.currentStreak} Days</h3>
            <span className="stat-badge-sub">Best: {overview.longestStreak} Days</span>
          </Card>
        </div>

        {/* Difficulty Breakdown & Rating Timeline */}
        <div className="analytics-charts-grid">
          {/* Difficulty Breakdown Card */}
          <Card className="analytics-chart-card">
            <h3 className="card-heading">Difficulty Distribution</h3>
            <div className="difficulty-progress-stack">
              <div className="diff-bar-item">
                <div className="diff-bar-labels">
                  <span className="diff-label text-easy">Easy</span>
                  <span>
                    {difficultyStats.easy.solved} / {difficultyStats.easy.total} ({difficultyStats.easy.percentage}%)
                  </span>
                </div>
                <ProgressBar
                  value={difficultyStats.easy.percentage}
                  color="var(--easy)"
                  size="md"
                />
              </div>

              <div className="diff-bar-item">
                <div className="diff-bar-labels">
                  <span className="diff-label text-medium">Medium</span>
                  <span>
                    {difficultyStats.medium.solved} / {difficultyStats.medium.total} ({difficultyStats.medium.percentage}%)
                  </span>
                </div>
                <ProgressBar
                  value={difficultyStats.medium.percentage}
                  color="var(--medium)"
                  size="md"
                />
              </div>

              <div className="diff-bar-item">
                <div className="diff-bar-labels">
                  <span className="diff-label text-hard">Hard</span>
                  <span>
                    {difficultyStats.hard.solved} / {difficultyStats.hard.total} ({difficultyStats.hard.percentage}%)
                  </span>
                </div>
                <ProgressBar
                  value={difficultyStats.hard.percentage}
                  color="var(--hard)"
                  size="md"
                />
              </div>
            </div>
          </Card>

          {/* Rating Progression Line Chart */}
          <Card className="analytics-chart-card">
            <h3 className="card-heading">Rating Progression</h3>
            {chartData.length > 0 ? (
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis dataKey="time" stroke="var(--text-tertiary)" fontSize={11} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={11} domain={['dataMin - 20', 'dataMax + 20']} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="var(--accent-primary)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: 'var(--accent-primary)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-chart-box">
                <p>Solve problems to start building your rating trajectory curve!</p>
              </div>
            )}
          </Card>
        </div>

        {/* Topic Mastery Performance Section */}
        <div className="topic-mastery-section">
          <h2 className="section-title">Topic Competency Breakdown</h2>
          <div className="topics-competency-grid">
            {topicPerformance.map((tp) => (
              <Card key={tp.id || tp.slug} className="topic-competency-card">
                <div className="topic-comp-header">
                  <span className="topic-comp-icon">{tp.icon || '📊'}</span>
                  <div>
                    <h4 className="topic-comp-name">{tp.name}</h4>
                    <span className="topic-comp-solved">{tp.solved} problems solved</span>
                  </div>
                  <span className={`comp-status-badge ${tp.status.toLowerCase().replace(' ', '-')}`}>
                    {tp.status}
                  </span>
                </div>

                <div className="topic-comp-accuracy-row">
                  <span className="acc-label">Accuracy</span>
                  <span className="acc-val">{tp.accuracy}%</span>
                </div>
                <ProgressBar value={tp.accuracy} size="sm" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analytics;
