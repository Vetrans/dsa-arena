import React from 'react';
import './Button.css';

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) => {
  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    fullWidth ? 'ui-btn--full' : '',
    loading ? 'ui-btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg className="ui-btn-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="ui-btn-icon ui-btn-icon--left" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      <span className="ui-btn-content">{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="ui-btn-icon ui-btn-icon--right" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
    </button>
  );
};
