import React, { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  className = '',
  ...rest
}, ref) => {
  const inputContainerClasses = [
    'ui-input-container',
    error ? 'ui-input-container--error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="ui-input-wrapper">
      {label && <label className="ui-input-label">{label}</label>}
      <div className={inputContainerClasses}>
        {Icon && (
          <div className="ui-input-icon-wrapper">
            <Icon size={18} className="ui-input-icon" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`ui-input ${Icon ? 'ui-input--with-icon' : ''}`}
          {...rest}
        />
      </div>
      {error && <span className="ui-input-error-msg">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
