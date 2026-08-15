import React from 'react';
import './Badge.css';

export const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...rest
}) => {
  const classes = [
    'ui-badge',
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};
