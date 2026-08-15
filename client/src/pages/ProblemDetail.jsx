import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  History,
  MessageSquare,
  Star,
  Zap,
  Trophy,
  Flame,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ThumbsUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

import { problemsApi } from '../api/problems.js';
import { submissionsApi } from '../api/submissions.js';
import { discussionsApi, feedbackApi } from '../api/arenaApi.js';
import { useAuthStore } from '../store/authStore.js';
import { Button, Card, Badge, Modal } from '../components/ui/index.js';
import PageLayout from '../components/layout/PageLayout.jsx';
import './ProblemDetail.css';

const DEFAULT_STARTER = {
  javascript: '// Write your solution here\nfunction solution() {\n  \n}',
  python: '# Write your solution here\ndef solution():\n    pass',
  cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write code here\n};',
  java: 'class Solution {\n    // Write code here\n}'
};

const ProblemDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description'); // description, hints, editorial, submissions, discussions, feedback

  // Editor states
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hints state
  const [unlockedHints, setUnlockedHints] = useState({});

  // Editorial state
  const [editorialData, setEditorialData] = useState(null);

  // Submissions state
  const [submissionsList, setSubmissionsList] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Output / Test Results state
  const [selectedTestCaseTab, setSelectedTestCaseTab] = useState(0);
  const [executionResult, setExecutionResult] = useState(null);

  // Discussions state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSpoilerComment, setIsSpoilerComment] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  // Feedback state
  const [feedbackDiff, setFeedbackDiff] = useState('APPROPRIATE');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Gamification Modal
  const [showGamificationModal, setShowGamificationModal] = useState(false);
  const [gamificationData, setGamificationData] = useState(null);

  // Load problem details
  useEffect(() => {
    const loadProblem = async () => {
      setIsLoading(true);
      try {
        const { data } = await problemsApi.getProblemBySlug(slug);
        setProblem(data);

        // Set starter code for default language
        const starter = data.starterCode?.[language] || DEFAULT_STARTER[language];
        setCode(starter);
      } catch (err) {
        toast.error('Problem not found or error loading problem.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProblem();
  }, [slug]);

  // Update starter code when language changes
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang]) {
      setCode(problem.starterCode[newLang]);
    } else {
      setCode(DEFAULT_STARTER[newLang] || '');
    }
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to starter template?')) {
      const starter = problem?.starterCode?.[language] || DEFAULT_STARTER[language];
      setCode(starter);
      toast.info('Code reset to starter template.');
    }
  };

  // Load Hints
  const handleUnlockHint = async (order) => {
    try {
      const { data } = await problemsApi.getProblemHints(slug, order);
      setUnlockedHints((prev) => ({ ...prev, [order]: data.content }));
    } catch (err) {
      toast.error('Failed to unlock hint.');
    }
  };

  // Load Editorial
  const handleLoadEditorial = async () => {
    try {
      const { data } = await problemsApi.getProblemEditorial(slug);
      setEditorialData(data);
    } catch (err) {
      toast.error('Failed to load editorial.');
    }
  };

  // Load Submissions History
  const handleLoadSubmissions = async () => {
    if (!isAuthenticated || !problem) return;
    setIsLoadingSubmissions(true);
    try {
      const { data } = await submissionsApi.getHistory({ problemId: problem._id, limit: 10 });
      setSubmissionsList(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  // Load Discussions
  const handleLoadDiscussions = async () => {
    if (!problem) return;
    try {
      const { data } = await discussionsApi.getDiscussions({ problemId: problem._id });
      setComments(data || []);
    } catch (err) {
      console.error('Error loading discussions:', err);
    }
  };

  // Tab switch listener
  useEffect(() => {
    if (activeTab === 'editorial' && !editorialData) {
      handleLoadEditorial();
    } else if (activeTab === 'submissions') {
      handleLoadSubmissions();
    } else if (activeTab === 'discussions') {
      handleLoadDiscussions();
    }
  }, [activeTab, problem]);

  // Execute / Submit Code
  const handleSubmitCode = async (isRunOnly = false) => {
    if (!isAuthenticated) {
      toast.error('Please log in to run or submit solutions.');
      navigate('/login');
      return;
    }

    if (isRunOnly) {
      setIsRunning(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      const { data } = await submissionsApi.submitCode({
        problemId: problem._id,
        language,
        code
      });

      const submission = data.submission;
      const gamification = data.gamification;

      setExecutionResult(submission);

      if (submission.status === 'ACCEPTED') {
        toast.success('Accepted! All test cases passed.');
        if (!isRunOnly && gamification?.isFirstSolve) {
          setGamificationData(gamification);
          setShowGamificationModal(true);
        }
      } else if (submission.status === 'WRONG_ANSWER') {
        toast.error('Wrong Answer on test cases.');
      } else if (submission.status === 'COMPILATION_ERROR') {
        toast.error('Compilation Error.');
      } else {
        toast.error(`Execution verdict: ${submission.status}`);
      }

      // Refresh submissions if on submissions tab
      if (activeTab === 'submissions') {
        handleLoadSubmissions();
      }
    } catch (err) {
      toast.error(err.message || 'Submission evaluation error.');
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  };

  // Discussion Actions
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await discussionsApi.createComment({
        problemId: problem._id,
        content: newComment,
        isSpoiler: isSpoilerComment
      });
      setComments([data, ...comments]);
      setNewComment('');
      setIsSpoilerComment(false);
      toast.success('Discussion posted!');
    } catch (err) {
      toast.error('Failed to post discussion.');
    }
  };

  const handleVoteComment = async (commentId) => {
    if (!isAuthenticated) return toast.error('Please log in to upvote.');
    try {
      const { data } = await discussionsApi.voteComment(commentId);
      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, upvotes: data.upvotes } : c
        )
      );
    } catch (err) {
      toast.error('Vote failed.');
    }
  };

  // Feedback Actions
  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please log in to submit feedback.');
    try {
      await feedbackApi.submitFeedback({
        problemId: problem._id,
        difficultyPerception: feedbackDiff,
        qualityRating: feedbackRating,
        comment: feedbackComment
      });
      setFeedbackSubmitted(true);
      toast.success('Feedback submitted! Thank you for improving the NYC Arena.');
    } catch (err) {
      toast.error('Failed to submit feedback.');
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="problem-loading">
          <div className="spinner"></div>
          <p>Loading Arena Challenge...</p>
        </div>
      </PageLayout>
    );
  }

  if (!problem) {
    return (
      <PageLayout>
        <div className="problem-not-found">
          <h2>Problem Not Found</h2>
          <p>The problem you are looking for does not exist in the Arena.</p>
          <Link to="/problems">
            <Button>Back to Problems</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="problem-detail-layout">
        {/* Left Side: Problem Metadata, Tabs, Markdown, Hints, Editorial */}
        <div className="problem-panel-left">
          {/* Header Info */}
          <div className="problem-detail-header">
            <div className="problem-detail-title-row">
              <span className="problem-detail-number">#{problem.problemNumber}</span>
              <h1 className="problem-detail-title">{problem.title}</h1>
              <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
            </div>

            <div className="problem-detail-meta-row">
              <div className="problem-detail-topics">
                {problem.topics?.map((t) => (
                  <span key={t.slug || t._id} className="topic-tag">
                    {t.name}
                  </span>
                ))}
              </div>

              <div className="problem-detail-rewards">
                <span className="reward-pill xp">
                  <Zap size={14} /> +{problem.rewards?.xp || 15} XP
                </span>
                <span className="reward-pill rating">
                  <Trophy size={14} /> +{problem.rewards?.rating || 10} Rating
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="problem-detail-tabs">
            <button
              className={`detail-tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`detail-tab ${activeTab === 'hints' ? 'active' : ''}`}
              onClick={() => setActiveTab('hints')}
            >
              <Lightbulb size={14} /> Hints ({problem.hints?.length || 0})
            </button>
            <button
              className={`detail-tab ${activeTab === 'editorial' ? 'active' : ''}`}
              onClick={() => setActiveTab('editorial')}
            >
              <BookOpen size={14} /> Editorial
            </button>
            <button
              className={`detail-tab ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              <History size={14} /> Submissions
            </button>
            <button
              className={`detail-tab ${activeTab === 'discussions' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussions')}
            >
              <MessageSquare size={14} /> Discussion
            </button>
            <button
              className={`detail-tab ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <Star size={14} /> Feedback
            </button>
          </div>

          {/* Tab Contents */}
          <div className="problem-tab-body">
            {/* 1. Description Tab */}
            {activeTab === 'description' && (
              <div className="tab-description">
                <div className="markdown-content">
                  <ReactMarkdown>{problem.description}</ReactMarkdown>
                </div>

                {/* Examples */}
                <div className="examples-section">
                  <h3 className="section-title">Examples</h3>
                  {problem.examples?.map((ex, idx) => (
                    <div key={idx} className="example-box">
                      <div className="example-header">Example {idx + 1}:</div>
                      <div className="example-content">
                        <p><strong>Input:</strong> <code>{ex.input}</code></p>
                        <p><strong>Output:</strong> <code>{ex.output}</code></p>
                        {ex.explanation && (
                          <p><strong>Explanation:</strong> {ex.explanation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem.constraints?.length > 0 && (
                  <div className="constraints-section">
                    <h3 className="section-title">Constraints</h3>
                    <ul className="constraints-list">
                      {problem.constraints.map((c, i) => (
                        <li key={i}><code>{c}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 2. Hints Tab */}
            {activeTab === 'hints' && (
              <div className="tab-hints">
                <h3 className="section-title">Progressive Hints</h3>
                <p className="tab-desc">
                  Hints unlock progressively. Use them if you are stuck!
                </p>

                <div className="hints-accordion">
                  {problem.hints?.map((hint) => {
                    const isUnlocked = unlockedHints[hint.order];
                    return (
                      <div key={hint.order} className="hint-card">
                        <div className="hint-card-header">
                          <span className="hint-number">Hint {hint.order}</span>
                          {!isUnlocked && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnlockHint(hint.order)}
                            >
                              <Lightbulb size={14} /> Reveal Hint {hint.order}
                            </Button>
                          )}
                        </div>
                        {isUnlocked ? (
                          <div className="hint-card-content">
                            {unlockedHints[hint.order]}
                          </div>
                        ) : (
                          <div className="hint-locked-placeholder">
                            Click above to reveal this hint.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Editorial Tab */}
            {activeTab === 'editorial' && (
              <div className="tab-editorial">
                {editorialData?.isLocked ? (
                  <div className="editorial-locked">
                    <AlertTriangle size={36} className="lock-icon" />
                    <h3>Editorial Locked</h3>
                    <p>{editorialData.message}</p>
                  </div>
                ) : editorialData?.editorial ? (
                  <div className="editorial-content">
                    <h3 className="section-title">
                      Approach: {editorialData.editorial.approach || 'Official Solution'}
                    </h3>
                    
                    {editorialData.editorial.intuition && (
                      <div className="editorial-block">
                        <h4>Intuition</h4>
                        <p>{editorialData.editorial.intuition}</p>
                      </div>
                    )}

                    {editorialData.editorial.algorithm && (
                      <div className="editorial-block">
                        <h4>Algorithm</h4>
                        <p>{editorialData.editorial.algorithm}</p>
                      </div>
                    )}

                    {editorialData.editorial.complexity && (
                      <div className="editorial-block complexity-box">
                        <h4>Complexity Analysis</h4>
                        <p><strong>Time Complexity:</strong> <code>{editorialData.editorial.complexity.time}</code></p>
                        <p><strong>Space Complexity:</strong> <code>{editorialData.editorial.complexity.space}</code></p>
                      </div>
                    )}

                    {editorialData.editorial.approaches?.map((app, idx) => (
                      <div key={idx} className="approach-block">
                        <h4>Approach {idx + 1}: {app.name}</h4>
                        <p>{app.intuition}</p>
                        {app.code?.map((c, ci) => (
                          <div key={ci} className="code-solution-box">
                            <span className="code-lang-label">{c.language}</span>
                            <pre><code>{c.solution}</code></pre>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="editorial-loading">Loading editorial...</div>
                )}
              </div>
            )}

            {/* 4. Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="tab-submissions">
                <h3 className="section-title">Your Submissions</h3>
                {isLoadingSubmissions ? (
                  <p>Loading history...</p>
                ) : submissionsList.length === 0 ? (
                  <p className="empty-tab-text">No submissions yet for this problem.</p>
                ) : (
                  <div className="submissions-table">
                    {submissionsList.map((sub) => (
                      <div key={sub._id} className="submission-row">
                        <span className={`sub-status ${sub.status.toLowerCase()}`}>
                          {sub.status === 'ACCEPTED' ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {sub.status}
                        </span>
                        <span className="sub-lang">{sub.language}</span>
                        <span className="sub-runtime">{sub.runtime}ms</span>
                        <span className="sub-memory">{Math.round((sub.memory || 0) / 1024)}MB</span>
                        <span className="sub-time">
                          {new Date(sub.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Discussions Tab */}
            {activeTab === 'discussions' && (
              <div className="tab-discussions">
                <h3 className="section-title">Community Discussions</h3>

                {isAuthenticated && (
                  <form onSubmit={handlePostComment} className="comment-form">
                    <textarea
                      placeholder="Ask a question, share an approach, or discuss complexity..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="comment-textarea"
                    />
                    <div className="comment-form-footer">
                      <label className="spoiler-checkbox-label">
                        <input
                          type="checkbox"
                          checked={isSpoilerComment}
                          onChange={(e) => setIsSpoilerComment(e.target.checked)}
                        />
                        <span>Mark as spoiler</span>
                      </label>
                      <Button size="sm" type="submit">
                        Post Comment
                      </Button>
                    </div>
                  </form>
                )}

                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="empty-tab-text">No comments yet. Start the conversation!</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="comment-card">
                        <div className="comment-header">
                          <div className="comment-user">
                            <span className="comment-avatar">
                              {comment.userId?.displayName?.[0] || 'U'}
                            </span>
                            <span className="comment-username">
                              {comment.userId?.displayName || comment.userId?.username || 'NYC Member'}
                            </span>
                            <span className="comment-rank-tier">
                              {comment.userId?.stats?.rank || 'Bronze'}
                            </span>
                          </div>
                          <button
                            className="upvote-btn"
                            onClick={() => handleVoteComment(comment._id)}
                          >
                            <ThumbsUp size={14} /> {comment.upvotes || 0}
                          </button>
                        </div>

                        {comment.isSpoiler && !revealedSpoilers[comment._id] ? (
                          <div
                            className="spoiler-overlay"
                            onClick={() =>
                              setRevealedSpoilers({ ...revealedSpoilers, [comment._id]: true })
                            }
                          >
                            <EyeOff size={16} /> Spoiler content. Click to reveal.
                          </div>
                        ) : (
                          <div className="comment-text">{comment.content}</div>
                        )}

                        {/* Nested Replies */}
                        {comment.replies?.length > 0 && (
                          <div className="comment-replies">
                            {comment.replies.map((reply) => (
                              <div key={reply._id} className="reply-card">
                                <div className="comment-user">
                                  <span className="comment-username">
                                    {reply.userId?.displayName || reply.userId?.username}
                                  </span>
                                </div>
                                <div className="comment-text">{reply.content}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 6. Feedback Tab */}
            {activeTab === 'feedback' && (
              <div className="tab-feedback">
                <h3 className="section-title">Problem Quality Feedback</h3>
                <p className="tab-desc">
                  Help the NYC DSA community calibrate problem quality and difficulty accurately.
                </p>

                {feedbackSubmitted ? (
                  <div className="feedback-thank-you">
                    <CheckCircle2 size={36} color="var(--success)" />
                    <h4>Thank You!</h4>
                    <p>Your feedback has been recorded.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendFeedback} className="feedback-form">
                    <div className="form-group">
                      <label>How difficult did you find this problem?</label>
                      <div className="difficulty-options">
                        {['TOO_EASY', 'EASY', 'APPROPRIATE', 'HARD', 'TOO_HARD'].map((diff) => (
                          <button
                            key={diff}
                            type="button"
                            className={`diff-btn ${feedbackDiff === diff ? 'active' : ''}`}
                            onClick={() => setFeedbackDiff(diff)}
                          >
                            {diff.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Problem Quality Rating (1 to 5 stars)</label>
                      <div className="star-rating-row">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${feedbackRating >= star ? 'active' : ''}`}
                            onClick={() => setFeedbackRating(star)}
                          >
                            <Star size={24} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Optional written feedback:</label>
                      <textarea
                        rows={3}
                        placeholder="Any comments regarding test cases, statement clarity, or constraints..."
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        className="comment-textarea"
                      />
                    </div>

                    <Button type="submit" size="md">
                      Submit Feedback
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Language Selector, Monaco Editor, Test Output Console */}
        <div className="problem-panel-right">
          <div className="editor-toolbar">
            <div className="editor-lang-picker">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="lang-select"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ (GCC)</option>
                <option value="java">Java (OpenJDK)</option>
              </select>
            </div>

            <div className="editor-actions">
              <button
                className="toolbar-btn"
                title="Reset to starter code"
                onClick={handleResetCode}
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="monaco-wrapper">
            <Editor
              height="100%"
              language={language === 'c++' ? 'cpp' : language}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'var(--font-mono)',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2
              }}
            />
          </div>

          {/* Console / Test Cases & Output Panel */}
          <div className="console-panel">
            <div className="console-header">
              <span className="console-title">Test Cases & Output</span>
              {executionResult && (
                <span className={`status-badge-inline ${executionResult.status.toLowerCase()}`}>
                  {executionResult.status} ({executionResult.runtime}ms)
                </span>
              )}
            </div>

            {/* Test Case Selection Pills */}
            <div className="testcase-tabs-row">
              {problem.sampleTestCases?.map((tc, index) => (
                <button
                  key={index}
                  className={`testcase-tab ${selectedTestCaseTab === index ? 'active' : ''}`}
                  onClick={() => setSelectedTestCaseTab(index)}
                >
                  Case {index + 1}
                </button>
              ))}
            </div>

            {/* Testcase Input / Expected / Output view */}
            <div className="testcase-body">
              {executionResult?.testResults?.[selectedTestCaseTab] ? (
                <div className="result-details">
                  <div className="result-field">
                    <span className="result-label">Input:</span>
                    <pre className="result-box">
                      {executionResult.testResults[selectedTestCaseTab].input}
                    </pre>
                  </div>
                  <div className="result-field">
                    <span className="result-label">Expected Output:</span>
                    <pre className="result-box">
                      {executionResult.testResults[selectedTestCaseTab].expectedOutput}
                    </pre>
                  </div>
                  <div className="result-field">
                    <span className="result-label">Your Output:</span>
                    <pre className={`result-box ${executionResult.testResults[selectedTestCaseTab].passed ? 'pass' : 'fail'}`}>
                      {executionResult.testResults[selectedTestCaseTab].actualOutput || 'None'}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="sample-case-preview">
                  <div className="result-field">
                    <span className="result-label">Input:</span>
                    <pre className="result-box">
                      {problem.sampleTestCases?.[selectedTestCaseTab]?.input || 'No sample case'}
                    </pre>
                  </div>
                  <div className="result-field">
                    <span className="result-label">Expected Output:</span>
                    <pre className="result-box">
                      {problem.sampleTestCases?.[selectedTestCaseTab]?.expected || 'No expected output'}
                    </pre>
                  </div>
                </div>
              )}

              {executionResult?.errorMessage && (
                <div className="error-output-box">
                  <span className="error-label">Compiler / Runtime Error:</span>
                  <pre>{executionResult.errorMessage}</pre>
                </div>
              )}
            </div>

            {/* Action Bar (Run & Submit) */}
            <div className="console-action-bar">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSubmitCode(true)}
                disabled={isRunning || isSubmitting}
              >
                <Play size={16} /> {isRunning ? 'Running...' : 'Run Test'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSubmitCode(false)}
                disabled={isRunning || isSubmitting}
                className="submit-arena-btn"
              >
                <Send size={16} /> {isSubmitting ? 'Evaluating...' : 'Submit to Arena'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Acceptance Modal (Key UX Moment) */}
      <Modal
        isOpen={showGamificationModal}
        onClose={() => setShowGamificationModal(false)}
        title="✓ ACCEPTED"
        size="md"
      >
        <div className="gamification-modal-content">
          <div className="acceptance-header">
            <div className="accepted-check-icon">
              <CheckCircle2 size={48} />
            </div>
            <h2>{problem.title} Solved!</h2>
            <p className="acceptance-sub">Your solution passed all Arena test cases.</p>
          </div>

          <div className="reward-cards-grid">
            <div className="reward-card xp-reward">
              <Zap size={24} />
              <span className="reward-value">+{gamificationData?.xpAwarded || 25} XP</span>
              <span className="reward-sub">Total: {gamificationData?.newXP || 0} XP</span>
            </div>

            <div className="reward-card rating-reward">
              <Trophy size={24} />
              <span className="reward-value">+{gamificationData?.ratingAwarded || 15} Rating</span>
              <span className="reward-sub">Rank: {gamificationData?.newRank || 'Bronze'}</span>
            </div>
          </div>

          {gamificationData?.streak && (
            <div className="streak-banner">
              <Flame size={20} className="streak-flame" />
              <span>
                <strong>{gamificationData.streak.currentStreak} Day Streak!</strong> Keep solving daily.
              </span>
            </div>
          )}

          {gamificationData?.newlyUnlockedAchievements?.length > 0 && (
            <div className="modal-achievements-unlocked">
              <h4>🏆 Achievement Unlocked!</h4>
              {gamificationData.newlyUnlockedAchievements.map((ach) => (
                <div key={ach._id || ach.key} className="achievement-unlocked-pill">
                  <span>{ach.icon || '🏅'}</span>
                  <div>
                    <strong>{ach.name}</strong>
                    <p>{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions-row">
            <Button
              variant="outline"
              onClick={() => setShowGamificationModal(false)}
            >
              Review Solution
            </Button>

            <Link to="/problems">
              <Button variant="primary">
                Next Problem <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default ProblemDetail;
