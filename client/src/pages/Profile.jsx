import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Zap, Flame, Target, CheckCircle, Award, Calendar, Code2 } from 'lucide-react';
import client from '../api/client.js';
import { Card, Badge, ProgressBar } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await client.get(`/users/${username}`);
        setProfileUser(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading NYC Member Profile...</p>
        </div>
      </PageLayout>
    );
  }

  if (!profileUser) {
    return (
      <PageLayout>
        <div className="profile-not-found">
          <h2>Member Not Found</h2>
          <p>No user found with username @{username}.</p>
          <Link to="/leaderboard">
            <button className="back-btn">Back to Leaderboard</button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const stats = profileUser.stats || {};

  return (
    <PageLayout>
      <div className="profile-container">
        {/* Profile Hero Header */}
        <Card className="profile-hero-card">
          <div className="profile-avatar-large">
            {profileUser.displayName?.[0] || profileUser.username[0]}
          </div>

          <div className="profile-main-info">
            <div className="profile-name-row">
              <h1 className="profile-display-name">{profileUser.displayName || profileUser.username}</h1>
              <span className="profile-username">@{profileUser.username}</span>
              <Badge variant="platinum">{stats.rank || 'Bronze III'}</Badge>
            </div>

            {profileUser.bio && <p className="profile-bio">{profileUser.bio}</p>}

            <div className="profile-badges-row">
              <span className="profile-badge-item">
                <Trophy size={14} /> Rating: <strong>{stats.rating || 0}</strong>
              </span>
              <span className="profile-badge-item">
                <Zap size={14} /> XP: <strong>{stats.xp || 0}</strong> (Level {stats.level || 1})
              </span>
              <span className="profile-badge-item">
                <Flame size={14} /> Streak: <strong>{stats.currentStreak || 0} days</strong>
              </span>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <Card className="p-stat-card">
            <span className="p-stat-title">Problems Solved</span>
            <h3 className="p-stat-val">{stats.problemsSolved || 0}</h3>
            <div className="p-stat-breakdown">
              <span className="text-easy">Easy: {stats.easySolved || 0}</span>
              <span className="text-medium">Medium: {stats.mediumSolved || 0}</span>
              <span className="text-hard">Hard: {stats.hardSolved || 0}</span>
            </div>
          </Card>

          <Card className="p-stat-card">
            <span className="p-stat-title">Accuracy Rate</span>
            <h3 className="p-stat-val">{stats.accuracy || 0}%</h3>
            <span className="p-stat-sub">
              {stats.acceptedSubmissions || 0} / {stats.totalSubmissions || 0} submissions
            </span>
          </Card>

          <Card className="p-stat-card">
            <span className="p-stat-title">Streak Record</span>
            <h3 className="p-stat-val">{stats.longestStreak || 0} Days</h3>
            <span className="p-stat-sub">Current: {stats.currentStreak || 0} days active</span>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
