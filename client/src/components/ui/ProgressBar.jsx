import React from 'react';
import './ProgressBar.css';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = false,
  color = 'var(--accent-primary)',
  size = 'md',
  animated = true,
  className = '',
  ...rest
}) => {
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((clampedValue / max) * 100);

  const containerClasses = [
    'ui-progress',
    `ui-progress--${size}`,
    className,
  ].filter(Boolean).join(' ');

  const fillStyle = {
    width: `${percentage}%`,
    backgroundColor: color,
  };

  return (
    <div className={containerClasses} {...rest}>
      {(label || showPercentage) && (
        <div className="ui-progress-header">
          {label && <span className="ui-progress-label">{label}</span>}
          {showPercentage && <span className="ui-progress-percentage">{percentage}%</span>}
        </div>
      )}
      <div className="ui-progress-track">
        <div
          className={`ui-progress-fill ${animated ? 'ui-progress-fill--animated' : ''}`}
          style={fillStyle}
        />
      </div>
    </div>
  );
};
