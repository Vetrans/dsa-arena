import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';
import './ComingSoon.css';

const ComingSoon = ({ title, description, icon: Icon = Code2 }) => {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="coming-soon-icon-wrapper">
          <Icon className="coming-soon-icon" size={64} />
        </div>
        <h1 className="coming-soon-title">{title}</h1>
        <p className="coming-soon-description">{description}</p>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="coming-soon-back-btn"
        >
          <ArrowLeft size={16} />
          Go back
        </Button>
      </div>
    </div>
  );
};

export default ComingSoon;
