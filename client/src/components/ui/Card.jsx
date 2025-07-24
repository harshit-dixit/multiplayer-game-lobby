import React from 'react';

const Card = ({ children, style, ...props }) => {
  const cardStyle = {
    backgroundColor: 'var(--color-glass-bg)',
    borderRadius: 'var(--border-radius)',
    padding: 'var(--card-padding)',
    border: '1px solid var(--color-border)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    ...style,
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
};

export default Card; 