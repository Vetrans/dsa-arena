import React from 'react';
import './Card.css';

export const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
  onClick,
  ...rest
}) => {
  const classes = [
    'ui-card',
    `ui-card--p-${padding}`,
    hover ? 'ui-card--hover' : '',
    glow ? 'ui-card--glow' : '',
    onClick ? 'ui-card--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...rest}>
      {children}
    </div>
  );
};
