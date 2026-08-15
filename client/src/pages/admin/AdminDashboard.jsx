import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Code2,
  FileCode,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Shield,
  Plus
} from 'lucide-react';
import { adminApi } from '../../api/arenaApi.js';
import { Card, Button, Badge } from '../../components/ui/index.js';
import PageLayout from '../../components/layout/PageLayout.jsx';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const { data } = await adminApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <PageLayout>
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading Arena Administration Console...</p>
        </div>
      </PageLayout>
    );
  }

  const { metrics, recentSubmissions } = stats;

  return (
    <PageLayout>
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <div className="admin-badge-top">
              <Shield size={14} /> Arena Administration Console
            </div>
            <h1 className="admin-title">System Overview & Management</h1>
            <p className="admin-subtitle">
              Monitor platform metrics, curate DSA problems, manage users, and review feedback.
            </p>
          </div>

          <div className="admin-actions-bar">
            <Link to="/admin/problems">
              <Button size="sm">
                <Plus size={16} /> Manage Problems
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button size="sm" variant="outline">
                <Users size={16} /> Users
              </Button>
            </Link>
            <Link to="/admin/feedback">
              <Button size="sm" variant="outline">
                <MessageSquare size={16} /> Feedback
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Overview Grid */}
        <div className="admin-stats-grid">
          <Card className="admin-stat-card">
            <span className="stat-label">Total Users</span>
            <h3 className="stat-val">{metrics.totalUsers}</h3>
            <span className="stat-sub">{metrics.activeUsers} active members</span>
          </Card>

          <Card className="admin-stat-card">
            <span className="stat-label">Problems in Catalog</span>
            <h3 className="stat-val">{metrics.totalProblems}</h3>
            <span className="stat-sub">{metrics.publishedProblems} published</span>
          </Card>

          <Card className="admin-stat-card">
            <span className="stat-label">Total Submissions</span>
            <h3 className="stat-val">{metrics.totalSubmissions}</h3>
            <span className="stat-sub">{metrics.acceptanceRate}% acceptance rate</span>
          </Card>

          <Card className="admin-stat-card">
            <span className="stat-label">Problem Feedback</span>
            <h3 className="stat-val">{metrics.totalFeedback}</h3>
            <span className="stat-sub">{metrics.pendingReports} pending moderation</span>
          </Card>
        </div>

        {/* Recent Platform Submissions */}
        <Card className="admin-section-card">
          <h3 className="section-title">Recent Submissions Stream</h3>
          <div className="admin-submissions-table">
            <div className="table-head">
              <span>User</span>
              <span>Problem</span>
              <span>Language</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {recentSubmissions?.map((sub) => (
              <div key={sub._id} className="table-row">
                <span className="user-name">{sub.userId?.displayName || sub.userId?.username || 'NYC Dev'}</span>
                <span className="prob-title">{sub.problemId?.title || 'Unknown Problem'}</span>
                <span className="lang-tag">{sub.language}</span>
                <span className={`status-tag ${sub.status.toLowerCase()}`}>{sub.status}</span>
                <span className="time-text">
                  {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
