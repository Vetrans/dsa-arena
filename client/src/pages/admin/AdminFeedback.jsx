import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Star,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "../../api/arenaApi.js";
import { Card, Button, Badge } from "../../components/ui/index.js";
import PageLayout from "../../components/layout/PageLayout.jsx";
import "./AdminDashboard.css";

const AdminFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.getFeedback({ limit: 50 });
      setFeedbackList(data || []);
    } catch (err) {
      console.error("Failed to load feedback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminApi.updateFeedbackStatus(id, { status });
      toast.success(`Feedback status updated to ${status}.`);
      fetchFeedback();
    } catch (err) {
      toast.error("Failed to update status.");
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
            <h1 className="admin-title">Problem Quality Feedback Queue</h1>
            <p className="admin-subtitle">
              Review student ratings, difficulty perception, and reported
              problem issues.
            </p>
          </div>
        </div>

        <div className="admin-feedback-list">
          {feedbackList.length === 0 ? (
            <p className="empty-feedback-text">
              No pending feedback in the moderation queue.
            </p>
          ) : (
            feedbackList.map((fb) => (
              <Card key={fb._id} className="admin-feedback-item">
                <div className="fb-item-top">
                  <div>
                    <h4 className="fb-problem-title">
                      Problem: {fb.problemId?.title || "Unknown Problem"}
                    </h4>
                    <span className="fb-author">
                      Submitted by @{fb.userId?.username || "member"}
                    </span>
                  </div>

                  <div className="fb-badges">
                    <Badge variant="warning">{fb.difficultyPerception}</Badge>
                    <span className="fb-stars">⭐ {fb.qualityRating} / 5</span>
                  </div>
                </div>

                {fb.comment && (
                  <p className="fb-comment-text">"{fb.comment}"</p>
                )}

                <div className="fb-item-bottom">
                  <span
                    className={`fb-status-pill ${fb.status?.toLowerCase() || "pending"}`}
                  >
                    Status: {fb.status || "PENDING"}
                  </span>

                  <div className="fb-actions">
                    {fb.status !== "RESOLVED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(fb._id, "RESOLVED")}
                      >
                        <CheckCircle2 size={14} /> Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminFeedback;
