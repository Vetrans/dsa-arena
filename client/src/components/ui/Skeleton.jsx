import React from 'react';
import './Skeleton.css';

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  ...rest
}) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const classes = [
    'ui-skeleton',
    `ui-skeleton--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes} style={style} {...rest} />;
};
