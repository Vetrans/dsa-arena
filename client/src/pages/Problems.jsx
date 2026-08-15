import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, CheckCircle2, Circle, Clock, Zap, Trophy, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { problemsApi } from '../api/problems.js';
import { Button, Card, Badge, Input, Skeleton } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Problems.css';

const Problems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states from URL or defaults
  const search = searchParams.get('search') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const selectedTopic = searchParams.get('topic') || '';
  const userStatus = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || 'problemNumber';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  // Fetch topics once
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data } = await problemsApi.getTopics();
        setTopics(data || []);
      } catch (err) {
        console.error('Failed to load topics:', err);
      }
    };
    fetchTopics();
  }, []);

  // Fetch problems on filter changes
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const { data, pagination } = await problemsApi.getProblems({
          search,
          difficulty,
          topic: selectedTopic,
          userStatus,
          sort,
          page,
          limit: 15
        });
        setProblems(data || []);
        setTotal(pagination?.total || 0);
        setPages(pagination?.pages || 1);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [search, difficulty, selectedTopic, userStatus, sort, page]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset page on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  return (
    <PageLayout>
      <div className="problems-container">
        <div className="problems-header">
          <div>
            <h1 className="problems-title">DSA Problem Arena</h1>
            <p className="problems-subtitle">
              Solve algorithmic challenges, earn rating points, and climb the NYC leaderboard.
            </p>
          </div>
          <div className="problems-meta-badge">
            <span>{total} Problems Available</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="problems-controls">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <Input
              placeholder="Search by problem title, keyword, or tag..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon={<Search size={18} />}
            />
          </form>

          <div className="filter-group">
            {/* Difficulty Filter */}
            <div className="pill-filters">
              <button
                className={`filter-pill ${!difficulty ? 'active' : ''}`}
                onClick={() => updateParam('difficulty', '')}
              >
                All Difficulties
              </button>
              <button
                className={`filter-pill easy ${difficulty === 'Easy' ? 'active' : ''}`}
                onClick={() => updateParam('difficulty', difficulty === 'Easy' ? '' : 'Easy')}
              >
                Easy
              </button>
              <button
                className={`filter-pill medium ${difficulty === 'Medium' ? 'active' : ''}`}
                onClick={() => updateParam('difficulty', difficulty === 'Medium' ? '' : 'Medium')}
              >
                Medium
              </button>
              <button
                className={`filter-pill hard ${difficulty === 'Hard' ? 'active' : ''}`}
                onClick={() => updateParam('difficulty', difficulty === 'Hard' ? '' : 'Hard')}
              >
                Hard
              </button>
            </div>

            {/* Status Filter */}
            <div className="pill-filters">
              <button
                className={`filter-pill ${!userStatus ? 'active' : ''}`}
                onClick={() => updateParam('status', '')}
              >
                All Status
              </button>
              <button
                className={`filter-pill ${userStatus === 'SOLVED' ? 'active' : ''}`}
                onClick={() => updateParam('status', userStatus === 'SOLVED' ? '' : 'SOLVED')}
              >
                Solved
              </button>
              <button
                className={`filter-pill ${userStatus === 'ATTEMPTED' ? 'active' : ''}`}
                onClick={() => updateParam('status', userStatus === 'ATTEMPTED' ? '' : 'ATTEMPTED')}
              >
                Attempted
              </button>
              <button
                className={`filter-pill ${userStatus === 'UNSOLVED' ? 'active' : ''}`}
                onClick={() => updateParam('status', userStatus === 'UNSOLVED' ? '' : 'UNSOLVED')}
              >
                Unsolved
              </button>
            </div>
          </div>
        </div>

        {/* Topics Horizontal Scrollbar */}
        <div className="topics-scroll-container">
          <button
            className={`topic-chip ${!selectedTopic ? 'active' : ''}`}
            onClick={() => updateParam('topic', '')}
          >
            <span>🔥</span> All Topics
          </button>
          {topics.map((t) => (
            <button
              key={t.slug}
              className={`topic-chip ${selectedTopic === t.slug ? 'active' : ''}`}
              onClick={() => updateParam('topic', selectedTopic === t.slug ? '' : t.slug)}
            >
              <span>{t.icon || '📌'}</span> {t.name}
            </button>
          ))}
        </div>

        {/* Problems Table / List */}
        <div className="problems-table-card">
          <div className="table-header-row">
            <div className="col-status">Status</div>
            <div className="col-title">Title</div>
            <div className="col-diff">Difficulty</div>
            <div className="col-topics">Topics</div>
            <div className="col-reward">Arena Reward</div>
            <div className="col-success">Success Rate</div>
            <div className="col-action"></div>
          </div>

          {isLoading ? (
            <div className="skeleton-list">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="problem-row skeleton-row">
                  <Skeleton variant="circle" width={24} height={24} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="rect" width={70} height={24} />
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="15%" />
                </div>
              ))}
            </div>
          ) : problems.length === 0 ? (
            <div className="empty-problems">
              <Filter size={48} className="empty-icon" />
              <h3>No problems found</h3>
              <p>Try clearing or adjusting your search filters to find problems.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchParams({})}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="table-body">
              {problems.map((p) => {
                const isSolved = p.userStatus === 'SOLVED';
                const isAttempted = p.userStatus === 'ATTEMPTED';

                return (
                  <Link
                    key={p.slug}
                    to={`/problems/${p.slug}`}
                    className={`problem-row ${isSolved ? 'row-solved' : ''}`}
                  >
                    <div className="col-status">
                      {isSolved ? (
                        <CheckCircle2 size={20} className="status-icon solved" />
                      ) : isAttempted ? (
                        <Clock size={20} className="status-icon attempted" />
                      ) : (
                        <Circle size={20} className="status-icon unsolved" />
                      )}
                    </div>

                    <div className="col-title">
                      <span className="problem-number">{p.problemNumber}.</span>
                      <span className="problem-name">{p.title}</span>
                    </div>

                    <div className="col-diff">
                      <Badge variant={p.difficulty.toLowerCase()}>
                        {p.difficulty}
                      </Badge>
                    </div>

                    <div className="col-topics">
                      {p.topics?.slice(0, 2).map((t) => (
                        <span key={t.slug || t._id} className="topic-tag">
                          {t.name}
                        </span>
                      ))}
                      {p.topics?.length > 2 && (
                        <span className="topic-tag more">+{p.topics.length - 2}</span>
                      )}
                    </div>

                    <div className="col-reward">
                      <span className="reward-xp">
                        <Zap size={14} /> +{p.rewards?.xp || 15} XP
                      </span>
                      <span className="reward-rating">
                        <Trophy size={14} /> +{p.rewards?.rating || 10}
                      </span>
                    </div>

                    <div className="col-success">
                      <span className="success-rate">{p.stats?.successRate || 75}%</span>
                      <span className="solves-count">{p.stats?.solveCount || 0} solves</span>
                    </div>

                    <div className="col-action">
                      <Button size="sm" variant="ghost" className="solve-btn">
                        Solve <ChevronRight size={16} />
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="pagination-bar">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => updateParam('page', (page - 1).toString())}
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
              onClick={() => updateParam('page', (page + 1).toString())}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Problems;
