import React, { useState } from 'react';
import { User, Mail, Moon, Sun, Bell, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';
import client from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import { useUIStore } from '../store/uiStore.js';
import { Button, Card, Input } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './Settings.css';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [emailNotifications, setEmailNotifications] = useState(
    user?.preferences?.emailNotifications ?? true
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await client.put('/users/profile', {
        displayName,
        bio,
        preferences: {
          ...user?.preferences,
          emailNotifications
        }
      });
      updateUser(data);
      toast.success('Profile settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout>
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Account Settings</h1>
          <p className="settings-subtitle">Manage your profile, preferences, and Arena appearance.</p>
        </div>

        <form onSubmit={handleSave} className="settings-form">
          {/* Profile Details Card */}
          <Card className="settings-card">
            <h3 className="card-title">Profile Information</h3>

            <div className="form-group">
              <label>Username (Read-only)</label>
              <Input value={user?.username || ''} disabled icon={<User size={18} />} />
            </div>

            <div className="form-group">
              <label>Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name (e.g. Alex Chen)"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <Input value={user?.email || ''} disabled icon={<Mail size={18} />} />
            </div>

            <div className="form-group">
              <label>Bio / University Affiliation</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. NYU Courant CS '26. Prepping for NYC quant rounds."
                className="settings-textarea"
              />
            </div>
          </Card>

          {/* Preferences Card */}
          <Card className="settings-card">
            <h3 className="card-title">Theme & Notifications</h3>

            <div className="preference-row">
              <div className="pref-info">
                <span className="pref-label">Arena Appearance</span>
                <span className="pref-sub">Current theme: {theme} mode</span>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle {theme === 'dark' ? 'Light' : 'Dark'}
              </Button>
            </div>

            <div className="preference-row">
              <div className="pref-info">
                <span className="pref-label">Email Notifications</span>
                <span className="pref-sub">Receive daily challenge and weekly leaderboard summaries</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>
          </Card>

          <div className="settings-action-bar">
            <Button type="submit" size="lg" disabled={isSaving}>
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default Settings;
