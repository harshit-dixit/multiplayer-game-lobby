import React from 'react';
import '../../App.css';

const Input = ({ ...props }) => {
  const style = {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  return <input style={style} {...props} />;
};

export default Input; 