import React, { useState } from "react";
import {
  User,
  Settings,
  Code2,
  Lock,
  Globe,
  Save,
  CheckCircle2,
  Shield
} from "lucide-react";
import { useDemoAuth } from "../store/demoAuthStore.js";
import "./SettingsPage.css";

const AVATARS = ["🗽", "👨‍💻", "👩‍💻", "⚡", "👑", "🥋", "🛡️", "🔥"];

export function SettingsPage() {
  const { user } = useDemoAuth();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'editor' | 'security'
  const [avatar, setAvatar] = useState("🗽");
  const [username, setUsername] = useState(user?.username || "arena_engineer");
  const [email, setEmail] = useState(user?.email || "engineer@nycdsa.com");
  const [bio, setBio] = useState(
    "Software Engineer practicing daily data structures and competitive algorithmic duels."
  );
  const [college, setCollege] = useState("Not Your College (NYC)");
  const [country, setCountry] = useState("United States");
  const [github, setGithub] = useState("github.com/engineer");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/engineer");

  // Editor Preferences
  const [defaultLanguage, setDefaultLanguage] = useState("javascript");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [tabSize, setTabSize] = useState(2);
  const [keybindings, setKeybindings] = useState("standard");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <p className="eyebrow">ACCOUNT & ARENA PREFERENCES</p>
        <h1>Settings & Customization</h1>
        <p>Manage your public identity, code editor configuration, and security options.</p>
      </div>

      <div className="settings-layout">
        {/* Settings Navigation */}
        <aside className="settings-nav">
          <button
            className={`settings-nav-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={16} /> Profile Details
          </button>
          <button
            className={`settings-nav-btn ${activeTab === "editor" ? "active" : ""}`}
            onClick={() => setActiveTab("editor")}
          >
            <Code2 size={16} /> Code Editor Setup
          </button>
          <button
            className={`settings-nav-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Lock size={16} /> Security & Auth
          </button>
        </aside>

        {/* Settings Form Body */}
        <main className="settings-content">
          <form onSubmit={handleSave} className="settings-form">
            {activeTab === "profile" && (
              <div className="settings-section">
                <h2>Public Profile Settings</h2>
                <p className="section-desc">
                  This information will be displayed on your public arena portfolio.
                </p>

                <div className="avatar-picker-group">
                  <label>Select Arena Avatar:</label>
                  <div className="avatar-options">
                    {AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av}
                        className={`av-btn ${avatar === av ? "selected" : ""}`}
                        onClick={() => setAvatar(av)}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Username:</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Email Address:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Bio Statement:</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>College / Organization:</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Country:</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>GitHub Profile:</label>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>LinkedIn Profile:</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "editor" && (
              <div className="settings-section">
                <h2>Code Editor Preferences</h2>
                <p className="section-desc">
                  Customize the Monaco code workspace for problem solving and duels.
                </p>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Default Programming Language:</label>
                    <select
                      value={defaultLanguage}
                      onChange={(e) => setDefaultLanguage(e.target.value)}
                    >
                      <option value="javascript">JavaScript (Node 20)</option>
                      <option value="python">Python 3.11</option>
                      <option value="cpp">C++ 20</option>
                      <option value="java">Java 17</option>
                      <option value="go">Go 1.22</option>
                      <option value="rust">Rust 1.76</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Monaco Theme:</label>
                    <select
                      value={editorTheme}
                      onChange={(e) => setEditorTheme(e.target.value)}
                    >
                      <option value="vs-dark">VS Code Dark (Default)</option>
                      <option value="hc-black">High Contrast Black</option>
                      <option value="light">Light Paper</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Tab Indentation Size:</label>
                    <select
                      value={tabSize}
                      onChange={(e) => setTabSize(Number(e.target.value))}
                    >
                      <option value={2}>2 Spaces (Recommended)</option>
                      <option value={4}>4 Spaces</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Keybinding Emulation:</label>
                    <select
                      value={keybindings}
                      onChange={(e) => setKeybindings(e.target.value)}
                    >
                      <option value="standard">Standard IDE</option>
                      <option value="vim">Vim Keybindings</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="settings-section">
                <h2>Security & Password</h2>
                <p className="section-desc">
                  Update your authentication credentials and session tokens.
                </p>

                <div className="form-field">
                  <label>Current Password:</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>New Password:</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-field">
                    <label>Confirm New Password:</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            )}

            <div className="settings-actions-footer">
              {savedSuccess && (
                <span className="save-toast">
                  <CheckCircle2 size={16} /> Preferences successfully saved!
                </span>
              )}
              <button type="submit" className="button button-yellow save-btn">
                <Save size={15} /> Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
