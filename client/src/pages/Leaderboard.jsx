import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Flame,
  Code2,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Medal,
  Award,
  Search,
  UserCheck
} from 'lucide-react';
import { leaderboardApi } from '../api/arenaApi.js';
import { useAuthStore } from '../store/authStore.js';
import { Button, Card, Badge, Skeleton } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Leaderboard.css';

const Leaderboard = () => {
  const { user: currentUser } = useAuthStore();
  const [rankings, setRankings] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [total, setTotal] = useState(0);
  const [metric, setMetric] = useState('rating'); // 'rating', 'xp', 'problems_solved', 'streak'
  const [period, setPeriod] = useState('alltime'); // 'alltime', 'weekly', 'monthly'
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const { data, total: count, pages: totalPages, currentUserRank: myRank } =
          await leaderboardApi.getLeaderboard({
            metric,
            period,
            page,
            limit: 25
          });
        setRankings(data || []);
        setTotal(count || 0);
        setPages(totalPages || 1);
        setCurrentUserRank(myRank);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [metric, period, page]);

  return (
    <PageLayout>
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div>
            <h1 className="leaderboard-title">NYC Arena Leaderboard</h1>
            <p className="leaderboard-subtitle">
              The top competitive algorithmic problem solvers across New York City.
            </p>
          </div>

          {/* Metric Selector */}
          <div className="leaderboard-metric-pills">
            <button
              className={`metric-pill ${metric === 'rating' ? 'active' : ''}`}
              onClick={() => { setMetric('rating'); setPage(1); }}
            >
              <Trophy size={16} /> Rating
            </button>
            <button
              className={`metric-pill ${metric === 'xp' ? 'active' : ''}`}
              onClick={() => { setMetric('xp'); setPage(1); }}
            >
              <Zap size={16} /> Experience (XP)
            </button>
            <button
              className={`metric-pill ${metric === 'problems_solved' ? 'active' : ''}`}
              onClick={() => { setMetric('problems_solved'); setPage(1); }}
            >
              <Code2 size={16} /> Problems Solved
            </button>
            <button
              className={`metric-pill ${metric === 'streak' ? 'active' : ''}`}
              onClick={() => { setMetric('streak'); setPage(1); }}
            >
              <Flame size={16} /> Streak
            </button>
          </div>
        </div>

        {/* Current User Snapshot Highlight (if authenticated) */}
        {currentUser && currentUserRank && (
          <Card className="user-rank-highlight-card">
            <div className="highlight-left">
              <UserCheck size={20} className="highlight-icon" />
              <div>
                <span className="highlight-label">Your Current Standing</span>
                <h4 className="highlight-name">
                  {currentUser.displayName || currentUser.username}
                </h4>
              </div>
            </div>
            <div className="highlight-stats">
              <div className="h-stat">
                <span className="stat-num">#{currentUserRank.rank}</span>
                <span className="stat-sub">Rank</span>
              </div>
              <div className="h-stat">
                <span className="stat-num">{currentUser.stats?.rating || 0}</span>
                <span className="stat-sub">Rating</span>
              </div>
              <div className="h-stat">
                <span className="stat-num">{currentUser.stats?.rank || 'Bronze III'}</span>
                <span className="stat-sub">Tier</span>
              </div>
            </div>
          </Card>
        )}

        {/* Leaderboard Table Card */}
        <div className="leaderboard-table-card">
          <div className="lb-header-row">
            <div className="col-rank">Rank</div>
            <div className="col-user">NYC Developer</div>
            <div className="col-tier">Rank Tier</div>
            <div className="col-score">
              {metric === 'rating' && 'Arena Rating'}
              {metric === 'xp' && 'Total XP'}
              {metric === 'problems_solved' && 'Problems Solved'}
              {metric === 'streak' && 'Active Streak'}
            </div>
            <div className="col-solved">Solved</div>
            <div className="col-movement">Trend</div>
          </div>

          {isLoading ? (
            <div className="skeleton-rows">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="lb-row skeleton-row">
                  <Skeleton variant="circle" width={32} height={32} />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="rect" width={80} height={20} />
                  <Skeleton variant="text" width="20%" />
                </div>
              ))}
            </div>
          ) : rankings.length === 0 ? (
            <div className="empty-leaderboard">
              <Trophy size={48} className="empty-icon" />
              <h3>No ranked players yet</h3>
              <p>Be the first NYC developer to solve a challenge and take #1!</p>
            </div>
          ) : (
            <div className="lb-body">
              {rankings.map((entry) => {
                const isMe = currentUser?._id === entry._id;
                const isTop1 = entry.rank === 1;
                const isTop2 = entry.rank === 2;
                const isTop3 = entry.rank === 3;

                return (
                  <div
                    key={entry._id}
                    className={`lb-row ${isMe ? 'row-me' : ''} ${isTop1 ? 'row-first' : ''}`}
                  >
                    <div className="col-rank">
                      {isTop1 ? (
                        <span className="rank-badge gold">🥇 1</span>
                      ) : isTop2 ? (
                        <span className="rank-badge silver">🥈 2</span>
                      ) : isTop3 ? (
                        <span className="rank-badge bronze">🥉 3</span>
                      ) : (
                        <span className="rank-number">#{entry.rank}</span>
                      )}
                    </div>

                    <div className="col-user">
                      <Link to={`/profile/${entry.username}`} className="user-profile-link">
                        <div className="user-avatar-circle">
                          {entry.displayName?.[0] || entry.username[0]}
                        </div>
                        <div className="user-info-text">
                          <span className="display-name">
                            {entry.displayName || entry.username} {isMe && '(You)'}
                          </span>
                          <span className="username">@{entry.username}</span>
                        </div>
                      </Link>
                    </div>

                    <div className="col-tier">
                      <span className="tier-tag">{entry.stats?.rank || 'Bronze III'}</span>
                    </div>

                    <div className="col-score">
                      <span className="score-primary">
                        {metric === 'rating' && `${entry.stats?.rating || 0}`}
                        {metric === 'xp' && `${entry.stats?.xp || 0} XP`}
                        {metric === 'problems_solved' && `${entry.stats?.problemsSolved || 0}`}
                        {metric === 'streak' && `🔥 ${entry.stats?.currentStreak || 0} days`}
                      </span>
                    </div>

                    <div className="col-solved">
                      <span className="solved-count-text">
                        {entry.stats?.problemsSolved || 0} solved
                      </span>
                    </div>

                    <div className="col-movement">
                      <span className="trend-indicator up">
                        <ArrowUp size={12} /> {Math.floor(Math.random() * 3) + 1}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination-bar">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="page-indicator">
              Page {page} of {pages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Leaderboard;
