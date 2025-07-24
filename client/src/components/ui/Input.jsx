import React from 'react';

const Input = ({ style, ...props }) => {
  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'var(--color-glass-bg)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-family-main)',
    letterSpacing: '1px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    ...style,
  };
  
  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--color-primary)';
    e.target.style.boxShadow = `0 0 10px var(--color-primary)`;
  };
  
  const handleBlur = (e) => {
    e.target.style.borderColor = 'var(--color-border)';
    e.target.style.boxShadow = 'none';
  };

  return <input {...props} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />;
};

export default Input; 