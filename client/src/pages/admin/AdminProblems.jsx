import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, CheckCircle, Search, ArrowLeft, Code2 } from 'lucide-react';
import { toast } from 'sonner';
import { problemsApi } from '../../api/problems.js';
import { adminApi } from '../../api/arenaApi.js';
import { Card, Button, Badge, Input, Modal } from '../../components/ui/index.js';
import PageLayout from '../../components/layout/PageLayout.jsx';
import './AdminDashboard.css';

const AdminProblems = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form fields for problem creation
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(25);
  const [ratingReward, setRatingReward] = useState(15);
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const { data } = await problemsApi.getProblems({ limit: 50 });
      setProblems(data || []);
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return toast.error('Title and description are required.');
    }

    try {
      await adminApi.createProblem({
        title,
        difficulty,
        description,
        rewards: { xp: Number(xpReward), rating: Number(ratingReward) },
        examples: [{ input: sampleInput || '[1, 2]', output: sampleOutput || '[2, 1]', explanation: 'Sample' }],
        testCases: [{ input: sampleInput || '[1, 2]', expected: sampleOutput || '[2, 1]', isHidden: false }],
        starterCode: {
          javascript: 'function solution() {\n  // Code here\n}',
          python: 'def solution():\n    pass'
        }
      });
      toast.success('Problem created successfully!');
      setShowCreateModal(false);
      fetchProblems();
    } catch (err) {
      toast.error('Failed to create problem.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem from the catalog?')) {
      try {
        await adminApi.deleteProblem(id);
        toast.success('Problem deleted.');
        fetchProblems();
      } catch (err) {
        toast.error('Failed to delete problem.');
      }
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
            <h1 className="admin-title">Problem Catalog Management</h1>
            <p className="admin-subtitle">Create, edit, and publish algorithmic challenges.</p>
          </div>

          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Create New Problem
          </Button>
        </div>

        <div className="admin-problems-list">
          {problems.map((p) => (
            <Card key={p._id} className="admin-prob-item">
              <div className="prob-item-left">
                <span className="prob-num">#{p.problemNumber}</span>
                <div>
                  <h4 className="prob-item-title">{p.title}</h4>
                  <div className="prob-item-tags">
                    <Badge variant={p.difficulty.toLowerCase()}>{p.difficulty}</Badge>
                    <span className="tag-meta">+{p.rewards?.xp || 15} XP</span>
                    <span className="tag-meta">+{p.rewards?.rating || 10} Rating</span>
                  </div>
                </div>
              </div>

              <div className="prob-item-actions">
                <Link to={`/problems/${p.slug}`}>
                  <Button size="sm" variant="outline">Preview</Button>
                </Link>
                <Button size="sm" variant="danger" onClick={() => handleDelete(p._id)}>
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Problem Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New DSA Problem"
          size="lg"
        >
          <form onSubmit={handleCreate} className="admin-modal-form">
            <div className="form-group">
              <label>Problem Title</label>
              <Input
                placeholder="e.g. Merge K Sorted Lists"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="admin-select"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>XP Reward</label>
                <Input
                  type="number"
                  value={xpReward}
                  onChange={(e) => setXpReward(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Rating Reward</label>
                <Input
                  type="number"
                  value={ratingReward}
                  onChange={(e) => setRatingReward(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Problem Description (Markdown)</label>
              <textarea
                rows={5}
                placeholder="Describe the problem statement, constraints, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="admin-textarea"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Sample Test Case Input</label>
                <Input
                  placeholder="[2, 7, 11, 15], 9"
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Sample Test Case Expected Output</label>
                <Input
                  placeholder="[0, 1]"
                  value={sampleOutput}
                  onChange={(e) => setSampleOutput(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions-right">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Publish Problem
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default AdminProblems;
