import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Code2, Search, ArrowRight, User } from 'lucide-react';
import { discussionsApi } from '../api/arenaApi.js';
import { Card, Badge, Button, Input, Skeleton } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Discussions.css';

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState('top');

  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsLoading(true);
      try {
        const { data } = await discussionsApi.getDiscussions({ sort, limit: 20 });
        setDiscussions(data || []);
      } catch (err) {
        console.error('Error loading discussions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscussions();
  }, [sort]);

  return (
    <PageLayout>
      <div className="discussions-page-container">
        <div className="discussions-header">
          <div>
            <h1 className="discussions-title">Arena Discussions</h1>
            <p className="discussions-subtitle">
              Exchange algorithmic approaches, time/space complexity analysis, and NYC interview tips.
            </p>
          </div>

          <div className="sort-pills">
            <button
              className={`sort-pill ${sort === 'top' ? 'active' : ''}`}
              onClick={() => setSort('top')}
            >
              Top Voted
            </button>
            <button
              className={`sort-pill ${sort === 'newest' ? 'active' : ''}`}
              onClick={() => setSort('newest')}
            >
              Most Recent
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="discussions-list">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="discussion-item-skeleton">
                <Skeleton variant="circle" width={36} height={36} />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="90%" />
              </Card>
            ))}
          </div>
        ) : discussions.length === 0 ? (
          <div className="empty-discussions">
            <MessageSquare size={48} className="empty-icon" />
            <h3>No Discussions Yet</h3>
            <p>Join the conversation by discussing any problem in the Arena problem catalog!</p>
            <Link to="/problems">
              <Button>Browse Problems</Button>
            </Link>
          </div>
        ) : (
          <div className="discussions-list">
            {discussions.map((item) => (
              <Card key={item._id} className="discussion-feed-card">
                <div className="disc-card-top">
                  <div className="disc-user-info">
                    <span className="disc-avatar">
                      {item.userId?.displayName?.[0] || item.userId?.username?.[0] || 'U'}
                    </span>
                    <div>
                      <span className="disc-author-name">
                        {item.userId?.displayName || item.userId?.username || 'NYC Dev'}
                      </span>
                      <span className="disc-author-rank">{item.userId?.stats?.rank || 'Bronze'}</span>
                    </div>
                  </div>

                  <span className="disc-upvotes">
                    <ThumbsUp size={14} /> {item.upvotes || 0} upvotes
                  </span>
                </div>

                <div className="disc-content">
                  <p>{item.content}</p>
                </div>

                <div className="disc-card-bottom">
                  <span className="disc-replies-count">
                    <MessageSquare size={14} /> {item.replies?.length || 0} replies
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Discussions;
