import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, ArrowLeft, UserX, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api/arenaApi.js';
import { Card, Button, Badge } from '../../components/ui/index.js';
import PageLayout from '../../components/layout/PageLayout.jsx';
import './AdminDashboard.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.getUsers({ limit: 50 });
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await adminApi.updateUserRole(userId, role);
      toast.success(`User role updated to ${role}.`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user role.');
    }
  };

  const handleToggleSuspend = async (userId, currentlySuspended) => {
    try {
      await adminApi.toggleUserSuspend(userId, {
        suspend: !currentlySuspended,
        reason: 'Admin moderation action'
      });
      toast.success(currentlySuspended ? 'User unsuspended.' : 'User suspended.');
      fetchUsers();
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  return (
    <PageLayout>
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <Link to="/admin" className="back-link">
              <ArrowLeft size={16} /> Back to Admin Overview
            </Link>
            <h1 className="admin-title">User & Role Moderation</h1>
            <p className="admin-subtitle">Inspect student profiles, adjust roles, and manage user suspensions.</p>
          </div>
        </div>

        <div className="admin-users-list">
          {users.map((u) => {
            const isSuspended = u.status === 'SUSPENDED';

            return (
              <Card key={u._id} className={`admin-user-item ${isSuspended ? 'suspended' : ''}`}>
                <div className="user-item-left">
                  <div className="user-avatar-small">
                    {u.displayName?.[0] || u.username[0]}
                  </div>
                  <div>
                    <h4 className="user-name-title">
                      {u.displayName || u.username} <span className="user-handle">@{u.username}</span>
                    </h4>
                    <p className="user-email">{u.email}</p>
                    <div className="user-meta-tags">
                      <Badge variant={u.role === 'ADMIN' ? 'gold' : 'default'}>{u.role}</Badge>
                      <span className="user-meta-stat">Rating: {u.stats?.rating || 0}</span>
                      <span className="user-meta-stat">Solved: {u.stats?.problemsSolved || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="user-item-actions">
                  {u.role !== 'ADMIN' ? (
                    <Button size="sm" variant="outline" onClick={() => handleRoleChange(u._id, 'ADMIN')}>
                      Promote to Admin
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleRoleChange(u._id, 'USER')}>
                      Demote to User
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant={isSuspended ? 'secondary' : 'danger'}
                    onClick={() => handleToggleSuspend(u._id, isSuspended)}
                  >
                    {isSuspended ? 'Unsuspend' : 'Suspend'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminUsers;
