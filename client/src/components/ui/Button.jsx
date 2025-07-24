import React from 'react';

const Button = ({ children, onClick, style, variant = 'primary', ...props }) => {
  const styles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      boxShadow: '0 4px 0 #1a74d3',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--color-text)',
      border: '2px solid var(--color-border)',
      boxShadow: 'none',
    },
  };

  const baseStyle = {
    padding: 'var(--button-padding)',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family-main)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontWeight: 'bold',
    transition: 'all 0.1s ease-in-out',
    position: 'relative',
    top: '0',
  };

  const hoverStyle = {
    primary: {
      transform: 'translateY(2px)',
      boxShadow: '0 2px 0 #1a74d3',
    },
    secondary: {
      backgroundColor: 'var(--color-glass-bg)',
    },
  };

  const activeStyle = {
    primary: {
      transform: 'translateY(4px)',
      boxShadow: '0 0px 0 #1a74d3',
    },
    secondary: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...baseStyle,
        ...styles[variant],
        ...(isHovered ? hoverStyle[variant] : {}),
        ...(isActive ? activeStyle[variant] : {}),
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 