import React from 'react';
import '../../App.css';

const Card = ({ children, style, ...props }) => {
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    ...style
  };

  return (
    <div className="card" style={cardStyle} {...props}>
      {children}
    </div>
  );
};

export default Card; 